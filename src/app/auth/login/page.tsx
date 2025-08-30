'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { logInfo, logError } from '@/lib/logger'
import { setSessionToken } from '@/lib/auth'
import { validateInput, verificationCodeSchema } from '@/lib/validation'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Mail, ArrowLeft, RefreshCw, Globe, Shield, Clock } from 'lucide-react'
import FixedLink from '@/components/FixedLink'

export default function LoginPage() {
  const { t, locale, loading: translationLoading } = useTranslation()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showResendButton, setShowResendButton] = useState(false)
  
  const codeInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  // 调试翻译
  useEffect(() => {
    console.log('🔍 Translation debug:', {
      translationLoading,
      locale,
      loginText: t('auth.login'),
      enterEmailText: t('auth.enterEmail'),
      sendCodeText: t('auth.sendCode')
    })
  }, [t, translationLoading, locale])

  // 从localStorage恢复邮箱
  useEffect(() => {
    const savedEmail = localStorage.getItem('login_email')
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  // 重发倒计时
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (step === 'code') {
      setShowResendButton(true)
    }
  }, [resendCountdown, step])

  // 自动聚焦输入框
  useEffect(() => {
    if (step === 'email' && emailInputRef.current) {
      emailInputRef.current.focus()
    } else if (step === 'code' && codeInputRef.current) {
      codeInputRef.current.focus()
    }
  }, [step])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // 验证邮箱格式
      const emailValidation = validateInput(verificationCodeSchema.pick({ email: true }), { email })
      if (!emailValidation.success) {
        setError(emailValidation.errors[0])
        return
      }

      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          locale
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // 保存邮箱到localStorage
        localStorage.setItem('login_email', email)
        
        setSuccess(t('auth.codeSent'))
        setStep('code')
        setResendCountdown(60) // 60秒倒计时
        setShowResendButton(false)
        setAttempts(0)
        
        logInfo('Verification code sent successfully', { email }, 'LoginPage')
      } else {
        setError(data.message || t('auth.sendCodeFailed'))
        logError('Failed to send verification code', { email, error: data.message }, 'LoginPage')
      }
    } catch (error) {
      setError(t('auth.networkError'))
      logError('Network error sending verification code', error, 'LoginPage')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCountdown > 0) return
    
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          locale
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(t('auth.codeSent'))
        setResendCountdown(60)
        setShowResendButton(false)
        setAttempts(0)
        
        logInfo('Verification code resent successfully', { email }, 'LoginPage')
      } else {
        setError(data.message || t('auth.sendCodeFailed'))
        logError('Failed to resend verification code', { email, error: data.message }, 'LoginPage')
      }
    } catch (error) {
      setError(t('auth.networkError'))
      logError('Network error resending verification code', error, 'LoginPage')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 检查尝试次数
    if (attempts >= 5) {
      setError('Too many attempts. Please request a new code.')
      setLoading(false)
      return
    }

    try {
      // 验证输入
      const validation = validateInput(verificationCodeSchema, { email, code, locale })
      if (!validation.success) {
        setError(validation.errors[0])
        return
      }

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          code,
          locale
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // 设置JWT令牌
        setSessionToken(data.data.sessionToken)
        setSuccess(t('auth.loginSuccess'))
        
        logInfo('User logged in successfully', { userId: data.data.user.id }, 'LoginPage')
        
        // 延迟跳转到仪表板
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setAttempts(attempts + 1)
        setError(data.message || t('auth.verificationFailed'))
        logError('Verification failed', { email, error: data.message }, 'LoginPage')
      }
    } catch (error) {
      setError(t('auth.networkError'))
      logError('Network error during verification', error, 'LoginPage')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setCode('')
    setError('')
    setSuccess('')
    setResendCountdown(0)
    setShowResendButton(false)
    setAttempts(0)
  }

  const formatCode = (value: string) => {
    // 只允许数字，最多6位
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    return numericValue
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCode = formatCode(e.target.value)
    setCode(formattedCode)
    
    // 自动提交当输入6位数字时
    if (formattedCode.length === 6) {
      setTimeout(() => {
        handleVerifyCode(e as any)
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('auth.login')}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 'email' ? t('auth.enterEmail') : t('auth.enterCode')}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
            <p className="text-red-600 text-sm flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
            <p className="text-green-600 text-sm flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {success}
            </p>
          </div>
        )}

        {/* Email Step */}
        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 font-medium"
            >
              {loading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  {t('auth.sendCode')}
                </>
              )}
            </button>
          </form>
        ) : (
          /* Code Step */
          <div className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.verificationCode')}
              </label>
              <div className="relative">
                <input
                  ref={codeInputRef}
                  type="text"
                  id="code"
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-widest transition-all duration-200"
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {t('auth.codePlaceholder')}
              </p>
            </div>

            {/* Resend Code Section */}
            <div className="text-center">
              {showResendButton ? (
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center mx-auto transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {t('auth.loginForm.resendCode')}
                </button>
              ) : (
                <div className="text-sm text-gray-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {t('auth.loginForm.resendCountdown', { countdown: resendCountdown.toString() })}
                </div>
              )}
            </div>

            {/* Attempts Warning */}
            {attempts > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-700 text-sm text-center">
                  {t('auth.loginForm.errors.codeError')} ({5 - attempts} {t('common.attempts')} {t('common.remaining')})
                </p>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center transition-all duration-200 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('auth.back')}
              </button>
              
              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 font-medium"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    {t('auth.verify')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-500">
            {t('auth.loginForm.footer')}
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <FixedLink href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              {t('auth.loginForm.backToHome')}
            </FixedLink>
            <span className="text-gray-300">|</span>
            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              {locale.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
