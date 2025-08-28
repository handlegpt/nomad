import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { message: '邮箱和验证码不能为空' },
        { status: 400 }
      )
    }

    // 验证验证码
    const { data: verificationCode, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (codeError || !verificationCode) {
      return NextResponse.json(
        { message: '验证码无效或已过期' },
        { status: 400 }
      )
    }

    // 检查用户是否存在，如果不存在则创建
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError && userError.code === 'PGRST116') {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          name: email.split('@')[0], // 使用邮箱前缀作为默认名称
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('创建用户失败:', createError)
        return NextResponse.json(
          { message: '创建用户失败' },
          { status: 500 }
        )
      }

      user = newUser
    } else if (userError) {
      console.error('查询用户失败:', userError)
      return NextResponse.json(
        { message: '用户验证失败' },
        { status: 500 }
      )
    }

    // 删除已使用的验证码
    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', verificationCode.id)

    // 创建会话令牌（这里使用简单的JWT模拟）
    const sessionToken = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天过期
    }))

    // 设置cookie
    const cookieStore = cookies()
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7天
    })

    return NextResponse.json({
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      success: true
    })

  } catch (error) {
    console.error('验证码验证错误:', error)
    return NextResponse.json(
      { message: '服务器错误，请重试' },
      { status: 500 }
    )
  }
}
