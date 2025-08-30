'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { logInfo, logError } from '@/lib/logger'
import { setSessionToken } from '@/lib/auth'
import { validateInput, verificationCodeSchema } from '@/lib/validation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function LoginPage() {
  const { t, locale } = useTranslation()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
        setSuccess(t('auth.codeSent'))
        setStep('code')
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('auth.login')}
          </h1>
          <p className="text-gray-600">
            {step === 'email' ? t('auth.enterEmail') : t('auth.enterCode')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.emailPlaceholder')}
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                t('auth.sendCode')
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.verificationCode')}
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.codePlaceholder')}
                maxLength={6}
                required
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                {t('auth.back')}
              </button>
              
              <button
                type="submit"
                disabled={loading || !code}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  t('auth.verify')
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t('auth.noAccount')}{' '}
            <span className="text-blue-600 cursor-pointer hover:underline">
              {t('auth.signUp')}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
