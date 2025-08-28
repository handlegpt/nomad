import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  current_city?: string
  created_at: string
}

export interface SessionToken {
  userId: string
  email: string
  exp: number
}

// 客户端获取会话令牌（从localStorage）
export function getSessionToken(): SessionToken | null {
  try {
    if (typeof window === 'undefined') {
      return null
    }
    
    const sessionToken = localStorage.getItem('session_token')
    
    if (!sessionToken) {
      return null
    }

    const decoded = JSON.parse(atob(sessionToken))
    
    // 检查令牌是否过期
    if (decoded.exp < Date.now()) {
      localStorage.removeItem('session_token')
      return null
    }

    return decoded
  } catch (error) {
    console.error('解析会话令牌失败:', error)
    return null
  }
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<User | null> {
  try {
    const sessionToken = getSessionToken()
    
    if (!sessionToken) {
      return null
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionToken.userId)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

// 检查用户是否已登录
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// 清除会话
export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('session_token')
  }
}
