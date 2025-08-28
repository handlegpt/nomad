import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // 清除会话cookie
    const cookieStore = cookies()
    cookieStore.delete('session_token')

    return NextResponse.json({
      message: '退出登录成功',
      success: true
    })
  } catch (error) {
    console.error('退出登录错误:', error)
    return NextResponse.json(
      { message: '退出登录失败' },
      { status: 500 }
    )
  }
}
