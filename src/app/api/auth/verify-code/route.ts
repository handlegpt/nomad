import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getEmailTranslation } from '@/lib/emailTemplates'
import { logInfo, logError } from '@/lib/logger'
import { generateToken } from '@/lib/jwt'
import { safeValidate, verificationCodeSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  console.log('🔍 Verify-code API called')
  
  try {
    // 1. 解析请求体
    console.log('📝 Step 1: Parsing request body')
    let body
    try {
      body = await request.json()
      console.log('✅ Request body parsed:', body)
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // 2. 验证输入
    console.log('🔍 Step 2: Validating input')
    let validatedData
    try {
      validatedData = safeValidate(verificationCodeSchema, body)
      console.log('✅ Input validated:', validatedData)
    } catch (validationError) {
      console.error('❌ Validation error:', validationError)
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
    const { email, code, locale } = validatedData
    const safeLocale = locale || 'en'
    
    console.log('📧 Processing verification for:', { email, code, locale: safeLocale })

    // 3. 检查数据库连接
    console.log('🔍 Step 3: Checking database connection')
    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from('verification_codes')
        .select('count')
        .limit(1)
      
      if (connectionError) {
        console.error('❌ Database connection failed:', connectionError)
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 500 }
        )
      }
      console.log('✅ Database connection successful')
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    // 4. 验证验证码
    console.log('🔍 Step 4: Verifying verification code')
    try {
      const { data: verificationCode, error: codeError } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (codeError) {
        console.error('❌ Verification code error:', codeError)
        if (codeError.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Invalid or expired verification code' },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: 'Verification failed' },
          { status: 400 }
        )
      }

      if (!verificationCode) {
        console.error('❌ No valid verification code found')
        return NextResponse.json(
          { error: 'Invalid or expired verification code' },
          { status: 400 }
        )
      }

      console.log('✅ Verification code is valid:', verificationCode.id)
    } catch (verifyError) {
      console.error('❌ Verification error:', verifyError)
      return NextResponse.json(
        { error: 'Verification error' },
        { status: 500 }
      )
    }

    // 5. 检查用户是否存在
    console.log('🔍 Step 5: Checking if user exists')
    let user
    try {
      let { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (userError && userError.code === 'PGRST116') {
        // 用户不存在，创建新用户
        console.log('👤 User does not exist, creating new user')
        
        const userName = email.split('@')[0]
        const newUserData = {
          email,
          name: userName
        }
        
        console.log('📝 Creating user with data:', newUserData)
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single()

        if (createError) {
          console.error('❌ Create user error:', createError)
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          )
        }

        console.log('✅ New user created successfully:', newUser.id)
        user = newUser
      } else if (userError) {
        console.error('❌ User query error:', userError)
        return NextResponse.json(
          { error: 'User verification failed' },
          { status: 500 }
        )
      } else {
        console.log('✅ Existing user found:', existingUser.id)
        user = existingUser
      }
    } catch (userError) {
      console.error('❌ User processing error:', userError)
      return NextResponse.json(
        { error: 'User processing error' },
        { status: 500 }
      )
    }

    if (!user) {
      console.error('❌ User not found after creation/query')
      return NextResponse.json(
        { error: 'User verification failed' },
        { status: 500 }
      )
    }

    console.log('✅ User verified successfully:', user.id)

    // 6. 删除已使用的验证码
    console.log('🔍 Step 6: Deleting used verification code')
    try {
      const { error: deleteError } = await supabase
        .from('verification_codes')
        .delete()
        .eq('email', email)
        .eq('code', code)

      if (deleteError) {
        console.error('⚠️ Failed to delete verification code:', deleteError)
        // 不返回错误，因为用户已经验证成功
      } else {
        console.log('✅ Verification code deleted successfully')
      }
    } catch (deleteError) {
      console.error('⚠️ Delete verification code error:', deleteError)
      // 不返回错误，因为用户已经验证成功
    }

    // 7. 生成JWT令牌
    console.log('🔍 Step 7: Creating JWT token')
    try {
      const sessionToken = generateToken({
        userId: user.id,
        email: user.email
      })

      console.log('✅ JWT token created successfully')
    } catch (tokenError) {
      console.error('❌ JWT token creation error:', tokenError)
      return NextResponse.json(
        { error: 'Token creation failed' },
        { status: 500 }
      )
    }

    // 8. 返回成功响应
    console.log('🎉 Verification successful, returning response')
    return NextResponse.json({
      success: true,
      message: 'Verification successful',
      data: {
        sessionToken: generateToken({
          userId: user.id,
          email: user.email
        }),
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })

  } catch (error) {
    console.error('💥 Unexpected error in verify-code API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
