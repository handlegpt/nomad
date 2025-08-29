import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  console.log('🔍 API Route: /api/auth/verify-code called')
  
  try {
    const body = await request.json()
    console.log('📧 Request body:', body)
    
    const { email, code } = body

    if (!email || !code) {
      console.log('❌ Missing email or code')
      return NextResponse.json(
        { message: '邮箱和验证码不能为空' },
        { status: 400 }
      )
    }

    console.log('✅ Valid request received:', { email, code })

    // 验证验证码
    console.log('🔍 Verifying verification code...')
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
          { message: '验证码无效或已过期' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { message: '验证码验证失败' },
        { status: 500 }
      )
    }

    if (!verificationCode) {
      console.log('❌ No valid verification code found')
      return NextResponse.json(
        { message: '验证码无效或已过期' },
        { status: 400 }
      )
    }

    console.log('✅ Verification code is valid')

    // 检查用户是否存在
    console.log('🔍 Checking if user exists...')
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError && userError.code === 'PGRST116') {
      // 用户不存在，创建新用户
      console.log('🆕 User does not exist, creating new user...')
      
      const userName = email.split('@')[0] // 使用邮箱前缀作为默认名称
      const newUserData = {
        email,
        name: userName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
          { message: `创建用户失败: ${createError.message}` },
          { status: 500 }
        )
      }

      console.log('✅ New user created successfully:', newUser)
      user = newUser
    } else if (userError) {
      console.error('❌ User query error:', userError)
      return NextResponse.json(
        { message: `用户验证失败: ${userError.message}` },
        { status: 500 }
      )
    } else {
      console.log('✅ Existing user found:', user)
    }

    // 删除已使用的验证码
    console.log('🗑️ Deleting used verification code...')
    const { error: deleteError } = await supabase
      .from('verification_codes')
      .delete()
      .eq('id', verificationCode.id)

    if (deleteError) {
      console.error('⚠️ Failed to delete verification code:', deleteError)
      // 不返回错误，因为用户已经验证成功
    } else {
      console.log('✅ Verification code deleted successfully')
    }

    // 创建会话令牌
    console.log('🔐 Creating session token...')
    const sessionToken = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天过期
    }))

    console.log('✅ Session token created successfully')

    // 返回成功响应
    const response = {
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      sessionToken,
      success: true
    }

    console.log('✅ Returning success response:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Verification code verification error:', error)
    return NextResponse.json(
      { message: '服务器错误，请重试' },
      { status: 500 }
    )
  }
}
