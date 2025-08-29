import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateVerificationEmailTemplate, getEmailTranslation } from '@/lib/emailTemplates'
import { logInfo, logError } from '@/lib/logger'

// 生成6位数字验证码
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 使用Resend发送邮件
async function sendEmail(email: string, code: string, locale: string = 'en'): Promise<boolean> {
  try {
    // 检查环境变量
    logInfo('Checking RESEND_API_KEY...', null, 'SendCodeAPI')
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      logInfo('RESEND_API_KEY not found, using mock email sending', { email, code }, 'SendCodeAPI')
      return true
    }

    logInfo('RESEND_API_KEY found, attempting to send email...', { email }, 'SendCodeAPI')

    // 生成多语言邮件模板
    const emailTemplate = generateVerificationEmailTemplate({
      code,
      minutes: 10,
      locale
    })

    // 动态导入Resend，避免构建时错误
    const { Resend } = await import('resend')
    const resend = new Resend(resendApiKey)
    
    const { data, error } = await resend.emails.send({
      from: 'NOMAD.NOW <noreply@nomadnow.app>',
      to: [email],
      subject: emailTemplate.subject,
      html: emailTemplate.html
    })

    if (error) {
      logError('Resend邮件发送失败', error, 'SendCodeAPI')
      return false
    }

    logInfo('邮件发送成功', data, 'SendCodeAPI')
    return true
  } catch (error) {
    logError('邮件发送错误', error, 'SendCodeAPI')
    return false
  }
}

export async function POST(request: NextRequest) {
  logInfo('API Route: /api/auth/send-code called', null, 'SendCodeAPI')
  
  try {
    const body = await request.json()
    logInfo('Request body', body, 'SendCodeAPI')
    
    const { email, locale = 'en' } = body

    if (!email || !email.includes('@')) {
      logError('Invalid email', { email }, 'SendCodeAPI')
      return NextResponse.json(
        { message: getEmailTranslation(locale, 'invalidEmail') },
        { status: 400 }
      )
    }
    
    logInfo('Valid email received', { email }, 'SendCodeAPI')

    // 生成验证码
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10分钟后过期
    
    logInfo('Generated verification code', { code: verificationCode, expiresAt: expiresAt.toISOString() }, 'SendCodeAPI')

    // 检查Supabase连接和表是否存在
    logInfo('Checking Supabase connection and table...', null, 'SendCodeAPI')
    try {
      const { data: testConnection, error: testError } = await supabase
        .from('verification_codes')
        .select('count')
        .limit(1)
      
      if (testError) {
        logError('Supabase table check failed', testError, 'SendCodeAPI')
        // 如果表不存在，尝试创建（简化版本）
        logInfo('Attempting to create verification_codes table...', null, 'SendCodeAPI')
        const { error: createError } = await supabase.rpc('create_verification_codes_table')
        if (createError) {
          logError('Failed to create table', createError, 'SendCodeAPI')
          return NextResponse.json(
            { message: getEmailTranslation(locale, 'databaseError') },
            { status: 500 }
          )
        }
      }
      
      logInfo('Supabase connection and table check successful', null, 'SendCodeAPI')
    } catch (connectionError) {
      logError('Supabase connection error', connectionError, 'SendCodeAPI')
      return NextResponse.json(
        { message: getEmailTranslation(locale, 'connectionError') },
        { status: 500 }
      )
    }

    // 检查是否已有未过期的验证码
    logInfo('Checking for existing verification codes...', null, 'SendCodeAPI')
    const { data: existingCode, error: selectError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .gt('expires_at', new Date().toISOString())
      .single()
      
    if (selectError && selectError.code !== 'PGRST116') {
      logError('Error checking existing codes', selectError, 'SendCodeAPI')
      return NextResponse.json(
        { message: getEmailTranslation(locale, 'sendCodeFailed') },
        { status: 500 }
      )
    }

    if (existingCode) {
      logInfo('Updating existing verification code...', null, 'SendCodeAPI')
      // 如果存在未过期的验证码，更新它
      const { error: updateError } = await supabase
        .from('verification_codes')
        .update({
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        })
        .eq('id', existingCode.id)

      if (updateError) {
        logError('更新验证码失败', updateError, 'SendCodeAPI')
        return NextResponse.json(
          { message: getEmailTranslation(locale, 'sendCodeFailed') },
          { status: 500 }
        )
      }
      logInfo('Verification code updated successfully', null, 'SendCodeAPI')
    } else {
      logInfo('Creating new verification code...', null, 'SendCodeAPI')
      // 创建新的验证码记录
      const { error: insertError } = await supabase
        .from('verification_codes')
        .insert({
          email,
          code: verificationCode,
          expires_at: expiresAt.toISOString()
        })

      if (insertError) {
        logError('创建验证码失败', insertError, 'SendCodeAPI')
        return NextResponse.json(
          { message: getEmailTranslation(locale, 'sendCodeFailed') },
          { status: 500 }
        )
      }
      logInfo('Verification code created successfully', null, 'SendCodeAPI')
    }

    // 发送邮件
    logInfo('Sending email...', null, 'SendCodeAPI')
    const emailSent = await sendEmail(email, verificationCode, locale)
    
    if (!emailSent) {
      logError('邮件发送失败', null, 'SendCodeAPI')
      return NextResponse.json(
        { message: getEmailTranslation(locale, 'sendCodeFailed') },
        { status: 500 }
      )
    }

    logInfo('Verification code sent successfully', { email }, 'SendCodeAPI')
    return NextResponse.json(
      { 
        message: locale === 'zh' ? '验证码已发送到您的邮箱' : 
                 locale === 'ja' ? '認証コードをメールで送信しました' :
                 locale === 'es' ? 'Código de verificación enviado a tu email' :
                 'Verification code sent to your email',
        success: true 
      },
      { status: 200 }
    )
  } catch (error) {
    logError('Unexpected error in send-code API', error, 'SendCodeAPI')
    return NextResponse.json(
      { message: getEmailTranslation('en', 'sendCodeFailed') },
      { status: 500 }
    )
  }
}
