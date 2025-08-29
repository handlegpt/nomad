import jwt from 'jsonwebtoken'
import { logInfo, logError } from './logger'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '24h'

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface SessionToken {
  userId: string
  email: string
  exp: number
}

// 生成JWT令牌
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'nomad-now',
      audience: 'nomad-now-users'
    })
    
    logInfo('JWT token generated successfully', { userId: payload.userId }, 'JWT')
    return token
  } catch (error) {
    logError('Failed to generate JWT token', error, 'JWT')
    throw new Error('Token generation failed')
  }
}

// 验证JWT令牌
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'nomad-now',
      audience: 'nomad-now-users'
    }) as JWTPayload
    
    logInfo('JWT token verified successfully', { userId: decoded.userId }, 'JWT')
    return decoded
  } catch (error) {
    logError('Failed to verify JWT token', error, 'JWT')
    throw new Error('Invalid token')
  }
}

// 解码令牌（不验证）
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    return decoded
  } catch (error) {
    logError('Failed to decode JWT token', error, 'JWT')
    return null
  }
}

// 检查令牌是否过期
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true
    
    return Date.now() >= decoded.exp * 1000
  } catch (error) {
    return true
  }
}

// 刷新令牌
export function refreshToken(token: string): string {
  try {
    const decoded = verifyToken(token)
    const { iat, exp, ...payload } = decoded
    
    return generateToken(payload)
  } catch (error) {
    logError('Failed to refresh JWT token', error, 'JWT')
    throw new Error('Token refresh failed')
  }
}
