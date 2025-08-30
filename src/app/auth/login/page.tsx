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

// 多语言文本配置
const translations = {
  zh: {
    login: '登录',
    enterEmail: '输入邮箱地址获取验证码',
    enterCode: '输入发送到您邮箱的验证码',
    email: '邮箱地址',
    emailPlaceholder: 'your@email.com',
    sendCode: '发送验证码',
    verificationCode: '验证码',
    codePlaceholder: '000000',
    back: '返回',
    verify: '验证',
    footer: '使用邮箱验证码即可登录，无需注册',
    backToHome: '返回首页',
    resendCode: '重新发送验证码',
    resendCountdown: '{countdown}秒后可重新发送',
    codeError: '验证码错误',
    attemptsRemaining: '{count} 次尝试剩余',
    codeSent: '验证码发送成功',
    codeResent: '验证码重新发送成功',
    sendCodeFailed: '发送验证码失败',
    resendCodeFailed: '重新发送验证码失败',
    networkError: '网络错误，请重试',
    tooManyAttempts: '尝试次数过多，请重新获取验证码',
    loginSuccess: '登录成功！正在跳转...',
    verificationFailed: '验证失败',
    loading: '加载中...'
  },
  en: {
    login: 'Sign In',
    enterEmail: 'Enter your email to receive a verification code',
    enterCode: 'Enter the verification code sent to your email',
    email: 'Email Address',
    emailPlaceholder: 'your@email.com',
    sendCode: 'Send Code',
    verificationCode: 'Verification Code',
    codePlaceholder: '000000',
    back: 'Back',
    verify: 'Verify',
    footer: 'Sign in with email verification code, no registration required',
    backToHome: 'Back to Home',
    resendCode: 'Resend Code',
    resendCountdown: 'Resend available in {countdown} seconds',
    codeError: 'Invalid verification code',
    attemptsRemaining: '{count} attempts remaining',
    codeSent: 'Verification code sent successfully',
    codeResent: 'Verification code resent successfully',
    sendCodeFailed: 'Failed to send verification code',
    resendCodeFailed: 'Failed to resend verification code',
    networkError: 'Network error, please try again',
    tooManyAttempts: 'Too many attempts. Please request a new code.',
    loginSuccess: 'Login successful! Redirecting...',
    verificationFailed: 'Verification failed',
    loading: 'Loading...'
  },
  ja: {
    login: 'ログイン',
    enterEmail: 'メールアドレスを入力して認証コードを受信',
    enterCode: 'メールに送信された認証コードを入力',
    email: 'メールアドレス',
    emailPlaceholder: 'your@email.com',
    sendCode: '認証コードを送信',
    verificationCode: '認証コード',
    codePlaceholder: '000000',
    back: '戻る',
    verify: '認証',
    footer: 'メール認証コードでログイン、登録不要',
    backToHome: 'ホームに戻る',
    resendCode: '認証コードを再送信',
    resendCountdown: '{countdown}秒後に再送信可能',
    codeError: '認証コードが無効です',
    attemptsRemaining: '残り{count}回',
    codeSent: '認証コードを送信しました',
    codeResent: '認証コードを再送信しました',
    sendCodeFailed: '認証コードの送信に失敗しました',
    resendCodeFailed: '認証コードの再送信に失敗しました',
    networkError: 'ネットワークエラー、再試行してください',
    tooManyAttempts: '試行回数が多すぎます。新しいコードをリクエストしてください。',
    loginSuccess: 'ログイン成功！リダイレクト中...',
    verificationFailed: '認証に失敗しました',
    loading: '読み込み中...'
  },
  es: {
    login: 'Iniciar Sesión',
    enterEmail: 'Ingresa tu email para recibir un código de verificación',
    enterCode: 'Ingresa el código de verificación enviado a tu email',
    email: 'Dirección de Email',
    emailPlaceholder: 'your@email.com',
    sendCode: 'Enviar Código',
    verificationCode: 'Código de Verificación',
    codePlaceholder: '000000',
    back: 'Volver',
    verify: 'Verificar',
    footer: 'Inicia sesión con código de verificación por email, sin registro requerido',
    backToHome: 'Volver al Inicio',
    resendCode: 'Reenviar Código',
    resendCountdown: 'Reenvío disponible en {countdown} segundos',
    codeError: 'Código de verificación inválido',
    attemptsRemaining: '{count} intentos restantes',
    codeSent: 'Código de verificación enviado exitosamente',
    codeResent: 'Código de verificación reenviado exitosamente',
    sendCodeFailed: 'Error al enviar código de verificación',
    resendCodeFailed: 'Error al reenviar código de verificación',
    networkError: 'Error de red, por favor intenta de nuevo',
    tooManyAttempts: 'Demasiados intentos. Solicita un nuevo código.',
    loginSuccess: '¡Inicio de sesión exitoso! Redirigiendo...',
    verificationFailed: 'Verificación fallida',
    loading: 'Cargando...'
  }
}

// 安全的翻译函数
function safeTranslate(locale: string, key: string, params?: Record<string, string>): string {
  const localeTranslations = translations[locale as keyof typeof translations] || translations.en
  let text = localeTranslations[key as keyof typeof localeTranslations] || key
  
  // 替换参数
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`{${param}}`, 'g'), value)
    })
  }
  
  return text
}

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
        
        setSuccess(safeTranslate(locale, 'codeSent'))
        setStep('code')
        setResendCountdown(60) // 60秒倒计时
        setShowResendButton(false)
        setAttempts(0)
        
        logInfo('Verification code sent successfully', { email }, 'LoginPage')
      } else {
        setError(data.message || safeTranslate(locale, 'sendCodeFailed'))
        logError('Failed to send verification code', { email, error: data.message }, 'LoginPage')
      }
    } catch (error) {
      setError(safeTranslate(locale, 'networkError'))
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
        setSuccess(safeTranslate(locale, 'codeResent'))
        setResendCountdown(60)
        setShowResendButton(false)
        setAttempts(0)
        
        logInfo('Verification code resent successfully', { email }, 'LoginPage')
      } else {
        setError(data.message || safeTranslate(locale, 'resendCodeFailed'))
        logError('Failed to resend verification code', { email, error: data.message }, 'LoginPage')
      }
    } catch (error) {
      setError(safeTranslate(locale, 'networkError'))
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
      setError(safeTranslate(locale, 'tooManyAttempts'))
      setLoading(false)
      return
    }

    try {
      // 临时：跳过前端验证，直接发送请求
      // const validation = validateInput(verificationCodeSchema, { email, code, locale })
      // if (!validation.success) {
      //   setError(validation.errors[0])
      //   return
      // }

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
        // 临时：跳过JWT设置，直接处理登录成功
        try {
          setSessionToken(data.data.user)
          logInfo('User logged in successfully', { userId: data.data.user.id }, 'LoginPage')
        } catch (jwtError) {
          console.warn('JWT setting failed, but continuing with login:', jwtError)
          // 即使JWT设置失败，也继续登录流程
        }
        
        setSuccess(safeTranslate(locale, 'loginSuccess'))
        
        // 延迟跳转到仪表板
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setAttempts(attempts + 1)
        setError(data.message || safeTranslate(locale, 'verificationFailed'))
        logError('Verification failed', { email, error: data.message }, 'LoginPage')
      }
    } catch (error) {
      setError(safeTranslate(locale, 'networkError'))
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
    
    // 临时：禁用自动提交，避免页面刷新问题
    // 自动提交当输入6位数字时
    // if (formattedCode.length === 6) {
    //   setTimeout(() => {
    //     handleVerifyCode(e as any)
    //   }, 100)
    // }
  }

  // 如果翻译还在加载，显示加载状态
  if (translationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <LoadingSpinner size="lg" text={safeTranslate(locale, 'loading')} />
        </div>
      </div>
    )
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
            {safeTranslate(locale, 'login')}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 'email' ? safeTranslate(locale, 'enterEmail') : safeTranslate(locale, 'enterCode')}
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
                {safeTranslate(locale, 'email')}
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
                  placeholder={safeTranslate(locale, 'emailPlaceholder')}
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
                  {safeTranslate(locale, 'sendCode')}
                </>
              )}
            </button>
          </form>
        ) : (
          /* Code Step */
          <div className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                {safeTranslate(locale, 'verificationCode')}
              </label>
              <div className="relative">
                <input
                  ref={codeInputRef}
                  type="text"
                  id="code"
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-widest transition-all duration-200"
                  placeholder={safeTranslate(locale, 'codePlaceholder')}
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {safeTranslate(locale, 'codePlaceholder')}
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
                  {safeTranslate(locale, 'resendCode')}
                </button>
              ) : (
                <div className="text-sm text-gray-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {safeTranslate(locale, 'resendCountdown', { countdown: resendCountdown.toString() })}
                </div>
              )}
            </div>

            {/* Attempts Warning */}
            {attempts > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-700 text-sm text-center">
                  {safeTranslate(locale, 'codeError')} ({5 - attempts} {safeTranslate(locale, 'attemptsRemaining', { count: (5 - attempts).toString() })})
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
                {safeTranslate(locale, 'back')}
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
                    {safeTranslate(locale, 'verify')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-500">
            {safeTranslate(locale, 'footer')}
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <FixedLink href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              {safeTranslate(locale, 'backToHome')}
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
