import { NextRequest, NextResponse } from 'next/server'
import { logInfo, logError } from '@/lib/logger'

// 安全头配置
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

// 内容安全策略
const cspHeader = {
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.openweathermap.org https://worldtimeapi.org https://ip-api.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
}

// 允许的域名（CORS）
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3011',
  'https://nomadnow.app',
  'https://www.nomadnow.app'
]

// 速率限制存储（简单内存存储，生产环境应使用Redis）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// 速率限制配置
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分钟
  maxRequests: 100, // 最大请求数
  authMaxRequests: 5 // 认证相关API的最大请求数
}

// 清理过期的速率限制记录
function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// 检查速率限制
function checkRateLimit(identifier: string, maxRequests: number): boolean {
  cleanupRateLimit()
  
  const now = Date.now()
  const windowMs = rateLimitConfig.windowMs
  const resetTime = now + windowMs
  
  const current = rateLimitStore.get(identifier)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// 获取客户端标识符
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}-${userAgent}`
}

// 检查CORS
function checkCORS(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // 同源请求
  
  return allowedOrigins.includes(origin)
}

// 主中间件函数
export function middleware(request: NextRequest) {
  const startTime = Date.now()
  const pathname = request.nextUrl.pathname
  
  try {
    // 记录请求
    logInfo('Middleware processing request', {
      pathname,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for')
    }, 'Middleware')

    // 1. CORS检查
    if (!checkCORS(request)) {
      logError('CORS violation detected', {
        origin: request.headers.get('origin'),
        pathname
      }, 'Middleware')
      
      return new NextResponse(
        JSON.stringify({ error: 'CORS policy violation' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'null'
          }
        }
      )
    }

    // 2. 速率限制检查
    const clientId = getClientIdentifier(request)
    const isAuthEndpoint = pathname.startsWith('/api/auth/')
    const maxRequests = isAuthEndpoint ? rateLimitConfig.authMaxRequests : rateLimitConfig.maxRequests
    
    if (!checkRateLimit(clientId, maxRequests)) {
      logError('Rate limit exceeded', {
        clientId,
        pathname,
        maxRequests
      }, 'Middleware')
      
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900' // 15分钟
          }
        }
      )
    }

    // 3. 获取响应
    const response = NextResponse.next()

    // 4. 添加安全头
    securityHeaders.forEach(header => {
      response.headers.set(header.key, header.value)
    })

    // 5. 添加CSP头
    response.headers.set(cspHeader.key, cspHeader.value)

    // 6. 添加CORS头
    const origin = request.headers.get('origin')
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')

    // 7. 处理预检请求
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers
      })
    }

    // 8. 记录响应时间
    const responseTime = Date.now() - startTime
    logInfo('Middleware completed', {
      pathname,
      responseTime,
      status: response.status
    }, 'Middleware')

    return response

  } catch (error) {
    logError('Middleware error', error, 'Middleware')
    
    // 返回通用错误响应
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
