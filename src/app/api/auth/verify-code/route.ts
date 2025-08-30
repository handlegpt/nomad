import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getEmailTranslation } from '@/lib/emailTemplates'
import { logInfo, logError } from '@/lib/logger'
import { generateToken } from '@/lib/jwt'
import { safeValidate, verificationCodeSchema } from '@/lib/validation'
import { handleError, createSuccessResponse, generateRequestId, ErrorType } from '@/lib/errorHandler'

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  logInfo('API Route: /api/auth/verify-code called', { requestId }, 'VerifyCodeAPI')
  
  try {
    const body = await request.json()
    logInfo('Request body received', { body }, 'VerifyCodeAPI')
    
    // 输入验证
    const validatedData = safeValidate(verificationCodeSchema, body)
    const { email, code, locale } = validatedData
    // 确保locale是字符串类型
    const safeLocale = locale || 'en'
    
    logInfo('Valid request received', { email, code }, 'VerifyCodeAPI')

    // 检查数据库连接
    logInfo('Checking database connection...', null, 'VerifyCodeAPI')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('verification_codes')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      logError('Database connection failed', connectionError, 'VerifyCodeAPI')
      return handleError(
        new Error(getEmailTranslation(safeLocale, 'databaseError')),
        'VerifyCodeAPI',
        requestId
      )
    }

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
        return handleError(
          new Error(getEmailTranslation(safeLocale, 'invalidOrExpired')),
          'VerifyCodeAPI',
          requestId
        )
      }
      return handleError(
        new Error(getEmailTranslation(safeLocale, 'verificationFailed')),
        'VerifyCodeAPI',
        requestId
      )
    }

    if (!verificationCode) {
      logError('No valid verification code found', null, 'VerifyCodeAPI')
      return handleError(
        new Error(getEmailTranslation(safeLocale, 'invalidOrExpired')),
        'VerifyCodeAPI',
        requestId
      )
    }

    logInfo('Verification code is valid', { verificationCodeId: verificationCode.id }, 'VerifyCodeAPI')

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
        name: userName
        // 不手动设置created_at和updated_at，让数据库自动处理
      }
      
      logInfo('Creating user with data', newUserData, 'VerifyCodeAPI')
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert(newUserData)
        .select()
        .single()

      if (createError) {
        logError('Create user error', createError, 'VerifyCodeAPI')
        return handleError(
          new Error(getEmailTranslation(safeLocale, 'userCreationFailed')),
          'VerifyCodeAPI',
          requestId
        )
      }

      logInfo('New user created successfully', { userId: newUser.id }, 'VerifyCodeAPI')
      user = newUser
    } else if (userError) {
      logError('User query error', userError, 'VerifyCodeAPI')
      return handleError(
        new Error(getEmailTranslation(safeLocale, 'userVerificationFailed')),
        'VerifyCodeAPI',
        requestId
      )
    }

    if (!user) {
      logError('User not found after creation/query', null, 'VerifyCodeAPI')
      return handleError(
        new Error(getEmailTranslation(safeLocale, 'userVerificationFailed')),
        'VerifyCodeAPI',
        requestId
      )
    }

    logInfo('User verified successfully', { userId: user.id }, 'VerifyCodeAPI')

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
    return NextResponse.json(createSuccessResponse({
      message: getEmailTranslation(safeLocale, 'verificationSuccess'),
      sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }, requestId))

  } catch (error) {
    logError('Unexpected error in verify-code API', error, 'VerifyCodeAPI')
    return handleError(error, 'VerifyCodeAPI', requestId)
  }
}
