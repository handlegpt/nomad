import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getEmailTranslation } from '@/lib/emailTemplates'
import { logInfo, logError } from '@/lib/logger'
import { generateToken } from '@/lib/jwt'
import { safeValidate, verificationCodeSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  logInfo('API Route: /api/auth/verify-code called', null, 'VerifyCodeAPI')
  
  try {
    const body = await request.json()
    
    // 输入验证
    const validatedData = safeValidate(verificationCodeSchema, body)
    const { email, code, locale } = validatedData
    // 确保locale是字符串类型
    const safeLocale = locale || 'en'
    
    logInfo('Valid request received', { email, code }, 'VerifyCodeAPI')

    // 验证验证码
    logInfo('Verifying verification code...', null, 'VerifyCodeAPI')
    const { data: verificationCode, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (codeError) {
      logError('Verification code error', codeError, 'VerifyCodeAPI')
      if (codeError.code === 'PGRST116') {
        return NextResponse.json(
          { message: getEmailTranslation(safeLocale, 'invalidOrExpired') },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { message: getEmailTranslation(safeLocale, 'verificationFailed') },
        { status: 500 }
      )
    }

    if (!verificationCode) {
      logError('No valid verification code found', null, 'VerifyCodeAPI')
      return NextResponse.json(
        { message: getEmailTranslation(safeLocale, 'invalidOrExpired') },
        { status: 400 }
      )
    }

    logInfo('Verification code is valid', null, 'VerifyCodeAPI')

    // 检查用户是否存在
    logInfo('Checking if user exists...', null, 'VerifyCodeAPI')
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError && userError.code === 'PGRST116') {
      // 用户不存在，创建新用户
      logInfo('User does not exist, creating new user...', null, 'VerifyCodeAPI')
      
      const userName = email.split('@')[0] // 使用邮箱前缀作为默认名称
      const newUserData = {
        email,
        name: userName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      logInfo('Creating user with data', newUserData, 'VerifyCodeAPI')
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert(newUserData)
        .select()
        .single()

      if (createError) {
        logError('Create user error', createError, 'VerifyCodeAPI')
        return NextResponse.json(
          { message: getEmailTranslation(safeLocale, 'userCreationFailed') },
          { status: 500 }
        )
      }

      logInfo('New user created successfully', newUser, 'VerifyCodeAPI')
      user = newUser
    } else if (userError) {
      logError('User query error', userError, 'VerifyCodeAPI')
      return NextResponse.json(
        { message: getEmailTranslation(safeLocale, 'userVerificationFailed') },
        { status: 500 }
      )
    }

    if (!user) {
      logError('User not found after creation/query', null, 'VerifyCodeAPI')
      return NextResponse.json(
        { message: getEmailTranslation(safeLocale, 'userVerificationFailed') },
        { status: 500 }
      )
    }

    // 删除已使用的验证码
    logInfo('Deleting used verification code...', null, 'VerifyCodeAPI')
    const { error: deleteError } = await supabase
      .from('verification_codes')
      .delete()
      .eq('id', verificationCode.id)

    if (deleteError) {
      logError('Failed to delete verification code', deleteError, 'VerifyCodeAPI')
      // 不返回错误，因为用户已经验证成功
    }

    // 生成JWT令牌
    logInfo('Creating JWT token...', null, 'VerifyCodeAPI')
    const sessionToken = generateToken({
      userId: user.id,
      email: user.email
    })

    logInfo('JWT token created successfully', null, 'VerifyCodeAPI')

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: getEmailTranslation(safeLocale, 'verificationSuccess'),
      sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    logError('Unexpected error in verify-code API', error, 'VerifyCodeAPI')
    
    // 通用错误响应，不泄露具体错误信息
    return NextResponse.json(
      { 
        success: false,
        message: 'Verification failed. Please try again.' 
      },
      { status: 500 }
    )
  }
}
