'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Globe } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useUser } from '@/contexts/GlobalStateContext'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const { t, locale } = useTranslation()
  const { setUserProfile } = useUser()
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError(t('auth.login.errors.invalidEmail'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsCodeSent(true)
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(data.message || t('auth.login.errors.sendCodeFailed'))
      }
    } catch (error) {
      setError(t('auth.login.errors.networkError'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError(t('auth.login.errors.invalidCode'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode, locale }),
      })

      const data = await response.json()

      if (response.ok) {
        // 存储会话令牌
        if (data.sessionToken) {
          localStorage.setItem('session_token', data.sessionToken)
        }
        
        // 立即设置用户状态
        if (data.user) {
          setUserProfile(data.user)
        }
        
        // 登录成功，重定向到用户后台
        window.location.href = '/dashboard'
      } else {
        setError(data.message || t('auth.login.errors.codeError'))
      }
    } catch (error) {
      setError(t('auth.login.errors.networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('auth.login.backToHome')}
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Logo size="lg" linkToHome={false} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.login.title')}</h2>
            <p className="text-gray-600">{t('auth.login.subtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.login.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.login.emailPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={isCodeSent}
                />
              </div>
            </div>

            {/* Send Code Button */}
            {!isCodeSent && (
              <button
                onClick={handleSendCode}
                disabled={loading || !email}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? t('auth.login.sending') : t('auth.login.sendCode')}
              </button>
            )}

            {/* Verification Code Input */}
            {isCodeSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.login.verificationCode')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder={t('auth.login.codePlaceholder')}
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg tracking-widest"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {t('auth.login.codeSentTo', { email })}
                </p>
              </div>
            )}

            {/* Login Button */}
            {isCodeSent && (
              <button
                onClick={handleLogin}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? t('auth.login.loggingIn') : t('auth.login.login')}
              </button>
            )}

            {/* Resend Code */}
            {isCodeSent && countdown === 0 && (
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {t('auth.login.resendCode')}
              </button>
            )}

            {isCodeSent && countdown > 0 && (
              <p className="text-center text-sm text-gray-500">
                {t('auth.login.resendCountdown', { countdown: countdown.toString() })}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.login.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
