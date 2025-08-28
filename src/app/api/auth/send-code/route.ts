import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 生成6位数字验证码
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 使用Resend发送邮件
async function sendEmail(email: string, code: string): Promise<boolean> {
  try {
    // 如果没有配置Resend API密钥，使用模拟发送
    if (!process.env.RESEND_API_KEY) {
      console.log(`📧 验证码邮件发送到: ${email}`)
      console.log(`🔐 验证码: ${code}`)
      console.log(`⏰ 过期时间: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleString()}`)
      return true
    }

    // 动态导入Resend，避免构建时错误
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: 'NOMAD.NOW <noreply@yourdomain.com>',
      to: [email],
      subject: 'NOMAD.NOW 验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">NOMAD.NOW</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">您的验证码</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin: 0 0 20px 0; text-align: center;">验证码</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${code}</span>
            </div>
            
            <p style="color: #666; margin: 20px 0; text-align: center;">
              此验证码将在 <strong>10分钟</strong> 后过期
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                如果您没有请求此验证码，请忽略此邮件。
              </p>
            </div>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Resend邮件发送失败:', error)
      return false
    }

    console.log('邮件发送成功:', data)
    return true
  } catch (error) {
    console.error('邮件发送错误:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  console.log('🔍 API Route: /api/auth/send-code called')
  
  try {
    const body = await request.json()
    console.log('📧 Request body:', body)
    
    const { email } = body

    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email:', email)
      return NextResponse.json(
        { message: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }
    
    console.log('✅ Valid email received:', email)

    // 生成验证码
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10分钟后过期
    
    console.log('🔐 Generated verification code:', verificationCode)
    console.log('⏰ Expires at:', expiresAt.toISOString())

    // 检查Supabase连接
    console.log('🔍 Checking Supabase connection...')
    const { data: testConnection } = await supabase
      .from('verification_codes')
      .select('count')
      .limit(1)
    
    if (testConnection === null) {
      console.error('❌ Supabase connection failed')
      return NextResponse.json(
        { message: '数据库连接失败，请重试' },
        { status: 500 }
      )
    }
    
    console.log('✅ Supabase connection successful')

    // 检查是否已有未过期的验证码
    console.log('🔍 Checking for existing verification codes...')
    const { data: existingCode, error: selectError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .gt('expires_at', new Date().toISOString())
      .single()
      
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Error checking existing codes:', selectError)
      return NextResponse.json(
        { message: '数据库查询失败，请重试' },
        { status: 500 }
      )
    }

    if (existingCode) {
      console.log('🔄 Updating existing verification code...')
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
        console.error('❌ 更新验证码失败:', updateError)
        return NextResponse.json(
          { message: '发送验证码失败，请重试' },
          { status: 500 }
        )
      }
      console.log('✅ Verification code updated successfully')
    } else {
      console.log('🆕 Creating new verification code...')
      // 创建新的验证码记录
      const { error: insertError } = await supabase
        .from('verification_codes')
        .insert({
          email,
          code: verificationCode,
          expires_at: expiresAt.toISOString()
        })

      if (insertError) {
        console.error('❌ 创建验证码失败:', insertError)
        return NextResponse.json(
          { message: '发送验证码失败，请重试' },
          { status: 500 }
        )
      }
      console.log('✅ Verification code created successfully')
    }

    // 发送邮件
    console.log('📧 Sending email...')
    const emailSent = await sendEmail(email, verificationCode)

    if (!emailSent) {
      console.error('❌ Email sending failed')
      return NextResponse.json(
        { message: '邮件发送失败，请重试' },
        { status: 500 }
      )
    }

    console.log('✅ Email sent successfully')
    return NextResponse.json({
      message: '验证码已发送到您的邮箱',
      success: true
    })

  } catch (error) {
    console.error('发送验证码错误:', error)
    return NextResponse.json(
      { message: '服务器错误，请重试' },
      { status: 500 }
    )
  }
}
