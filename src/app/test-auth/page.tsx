'use client'

import { useState } from 'react'
import { useNotifications } from '@/contexts/GlobalStateContext'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [checkingDb, setCheckingDb] = useState(false)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const { addNotification } = useNotifications()

  const checkDatabaseStatus = async () => {
    setCheckingDb(true)
    
    try {
      console.log('🔍 Checking database status...')
      
      const response = await fetch('/api/debug/db-status')
      const data = await response.json()
      
      console.log('📊 Database status:', data)
      setDbStatus(data)
      
      if (response.ok) {
        addNotification({
          type: 'success',
          message: '数据库状态检查完成',
          duration: 5000
        })
      } else {
        addNotification({
          type: 'error',
          message: '数据库状态检查失败',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('❌ Error checking database status:', error)
      addNotification({
        type: 'error',
        message: '数据库状态检查失败',
        duration: 5000
      })
    } finally {
      setCheckingDb(false)
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      addNotification({
        type: 'error',
        message: '请输入有效的邮箱地址',
        duration: 3000
      })
      return
    }

    setLoading(true)
    
    try {
      console.log('🔍 Sending verification code to:', email)
      
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      
      console.log('📧 API Response:', data)
      console.log('📊 Response status:', response.status)

      if (response.ok) {
        addNotification({
          type: 'success',
          message: data.message || '验证码发送成功',
          duration: 5000
        })
      } else {
        addNotification({
          type: 'error',
          message: data.message || '发送失败',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('❌ Error sending verification code:', error)
      addNotification({
        type: 'error',
        message: '网络错误，请重试',
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !verificationCode) {
      addNotification({
        type: 'error',
        message: '请输入邮箱和验证码',
        duration: 3000
      })
      return
    }

    setVerifying(true)
    
    try {
      console.log('🔍 Verifying code:', { email, code: verificationCode })
      
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode })
      })

      const data = await response.json()
      
      console.log('🔐 Verification API Response:', data)
      console.log('📊 Response status:', response.status)

      if (response.ok) {
        addNotification({
          type: 'success',
          message: data.message || '验证成功',
          duration: 5000
        })
        
        // 保存会话令牌到localStorage
        if (data.sessionToken) {
          localStorage.setItem('session_token', data.sessionToken)
          console.log('💾 Session token saved to localStorage')
        }
        
        // 清空表单
        setVerificationCode('')
      } else {
        addNotification({
          type: 'error',
          message: data.message || '验证失败',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('❌ Error verifying code:', error)
      addNotification({
        type: 'error',
        message: '网络错误，请重试',
        duration: 5000
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card card-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            验证码发送测试
          </h1>
          
          {/* 发送验证码表单 */}
          <form onSubmit={handleSendCode} className="space-y-4 mb-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-lg btn-primary"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">发送中...</span>
                </div>
              ) : (
                '发送验证码'
              )}
            </button>
          </form>

          {/* 验证验证码表单 */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              验证验证码
            </h2>
            
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  验证码
                </label>
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="请输入6位验证码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={verifying}
                className="w-full btn btn-lg btn-secondary"
              >
                {verifying ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">验证中...</span>
                  </div>
                ) : (
                  '验证并登录'
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">测试说明：</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 如果没有配置RESEND_API_KEY，会使用模拟发送</li>
              <li>• 验证码会显示在服务器控制台</li>
              <li>• 验证码有效期为10分钟</li>
              <li>• 验证成功后会保存会话令牌</li>
              <li>• 请查看浏览器控制台获取详细日志</li>
            </ul>
          </div>

          {/* 数据库状态检查 */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              数据库状态检查
            </h3>
            
            <button
              onClick={checkDatabaseStatus}
              disabled={checkingDb}
              className="w-full btn btn-md btn-secondary mb-4"
            >
              {checkingDb ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">检查中...</span>
                </div>
              ) : (
                '检查数据库状态'
              )}
            </button>

            {dbStatus && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">检查结果：</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div>
                      <strong>验证码表：</strong> 
                      {dbStatus.checks?.verification_codes?.exists ? '✅ 正常' : '❌ 错误'}
                      {dbStatus.checks?.verification_codes?.error && (
                        <span className="text-red-600 ml-2">({dbStatus.checks.verification_codes.error})</span>
                      )}
                    </div>
                    <div>
                      <strong>用户表：</strong> 
                      {dbStatus.checks?.users?.exists ? '✅ 正常' : '❌ 错误'}
                      {dbStatus.checks?.users?.error && (
                        <span className="text-red-600 ml-2">({dbStatus.checks.users.error})</span>
                      )}
                    </div>
                    <div>
                      <strong>用户插入：</strong> 
                      {dbStatus.checks?.user_insertion?.success ? '✅ 正常' : '❌ 错误'}
                      {dbStatus.checks?.user_insertion?.error && (
                        <span className="text-red-600 ml-2">({dbStatus.checks.user_insertion.error})</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">环境变量：</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>RESEND_API_KEY：</strong> 
                      {dbStatus.environment?.has_resend_key ? '✅ 已配置' : '❌ 未配置'}
                    </div>
                    <div>
                      <strong>SUPABASE_URL：</strong> 
                      {dbStatus.environment?.has_supabase_url ? '✅ 已配置' : '❌ 未配置'}
                    </div>
                    <div>
                      <strong>SUPABASE_KEY：</strong> 
                      {dbStatus.environment?.has_supabase_key ? '✅ 已配置' : '❌ 未配置'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
