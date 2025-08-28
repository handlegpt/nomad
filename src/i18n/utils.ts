import { Locale } from './config'

// 加载翻译文件
const loadTranslations = async (locale: Locale) => {
  try {
    const translations = await import(`./translations/${locale}.json`)
    return translations.default
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error)
    // 回退到默认语言
    const fallback = await import('./translations/zh.json')
    return fallback.default
  }
}

// 翻译函数
export const t = (key: string, locale: Locale, params?: Record<string, string>) => {
  return new Promise<string>(async (resolve) => {
    try {
      const translations = await loadTranslations(locale)
      let value = key.split('.').reduce((obj, k) => obj?.[k], translations) || key
      
      // 替换参数
      if (params) {
        Object.entries(params).forEach(([param, replacement]) => {
          value = value.replace(new RegExp(`{${param}}`, 'g'), replacement)
        })
      }
      
      resolve(value)
    } catch (error) {
      console.error('Translation error:', error)
      resolve(key)
    }
  })
}

// 获取当前语言
export const getCurrentLocale = (): Locale => {
  if (typeof window === 'undefined') return 'zh'
  
  const saved = localStorage.getItem('nomad-locale') as Locale
  if (saved && ['zh', 'es', 'ja'].includes(saved)) {
    return saved
  }
  
  // 从浏览器语言检测
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('ja')) return 'ja'
  
  return 'zh'
}

// 设置语言
export const setLocale = (locale: Locale) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nomad-locale', locale)
  }
}

// 格式化日期
export const formatDate = (date: string | Date, locale: Locale) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  const localeMap = {
    zh: 'zh-CN',
    es: 'es-ES',
    ja: 'ja-JP'
  }
  
  return dateObj.toLocaleDateString(localeMap[locale], options)
}

// 格式化数字
export const formatNumber = (num: number, locale: Locale) => {
  const localeMap = {
    zh: 'zh-CN',
    es: 'es-ES',
    ja: 'ja-JP'
  }
  
  return num.toLocaleString(localeMap[locale])
}
