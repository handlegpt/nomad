import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔍 Verify-code API called - Simplified version')
  
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
        { 
          success: false,
          error: 'Invalid JSON in request body',
          message: 'Invalid JSON in request body'
        },
        { status: 400 }
      )
    }
    
    // 2. 基本验证
    console.log('🔍 Step 2: Basic validation')
    const { email, code, locale } = body
    
    if (!email || !code) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          message: 'Email and code are required'
        },
        { status: 400 }
      )
    }
    
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      console.error('❌ Invalid code format')
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid code format',
          message: 'Code must be 6 digits'
        },
        { status: 400 }
      )
    }
    
    console.log('📧 Processing verification for:', { email, code, locale })

    // 3. 模拟验证码验证（临时）
    console.log('🔍 Step 3: Mock verification')
    
    // 临时：接受任何6位数字验证码
    console.log('✅ Mock verification successful')
    
    // 4. 返回成功响应
    console.log('🎉 Mock verification successful, returning response')
    return NextResponse.json({
      success: true,
      message: 'Verification successful (mock)',
      data: {
        sessionToken: 'mock_token_' + Date.now(),
        user: {
          id: 'mock_user_' + Date.now(),
          email: email,
          name: email.split('@')[0]
        }
      }
    })

  } catch (error) {
    console.error('💥 Unexpected error in verify-code API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
