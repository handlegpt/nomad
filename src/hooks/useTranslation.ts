'use client'

import { useState, useEffect } from 'react'
import { Locale } from '@/i18n/config'
import { t, getCurrentLocale, setLocale } from '@/i18n/utils'

export function useTranslation() {
  const [locale, setCurrentLocale] = useState<Locale>('zh')
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentLocale = getCurrentLocale()
    setCurrentLocale(currentLocale)
    loadTranslations(currentLocale)
  }, [])

  const loadTranslations = async (newLocale: Locale) => {
    setLoading(true)
    try {
      const trans = await import(`@/i18n/translations/${newLocale}.json`)
      setTranslations(trans.default)
    } catch (error) {
      console.error('Failed to load translations:', error)
      // 回退到中文
      const fallback = await import('@/i18n/translations/zh.json')
      setTranslations(fallback.default)
    } finally {
      setLoading(false)
    }
  }

  const changeLocale = async (newLocale: Locale) => {
    setCurrentLocale(newLocale)
    setLocale(newLocale)
    await loadTranslations(newLocale)
  }

  const translate = (key: string, params?: Record<string, string>): string => {
    if (loading) return key
    
    const keys = key.split('.')
    let value: any = keys.reduce((obj, k) => obj?.[k], translations) || key
    
    // Ensure value is a string
    let result = String(value)
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, replacement]) => {
        result = result.replace(new RegExp(`{${param}}`, 'g'), replacement)
      })
    }
    
    return result
  }

  return {
    locale,
    loading,
    t: translate,
    changeLocale
  }
}
