'use client'

import { useState, useEffect } from 'react'
import { Locale } from '@/i18n/config'
import { getCurrentLocale, setLocale } from '@/i18n/utils'

export function useTranslation() {
  const [locale, setCurrentLocale] = useState<Locale>('en')
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentLocale = getCurrentLocale()
    setCurrentLocale(currentLocale)
    loadTranslations(currentLocale)
  }, [])

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const newLocale = getCurrentLocale()
      if (newLocale !== locale) {
        setCurrentLocale(newLocale)
        loadTranslations(newLocale)
      }
    }

    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', handleUrlChange)
    
    // Listen for URL changes
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      handleUrlChange()
    }
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args)
      handleUrlChange()
    }

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [locale])

  const loadTranslations = async (newLocale: Locale) => {
    setLoading(true)
    try {
      const trans = await import(`@/locales/${newLocale}.json`)
      setTranslations(trans.default)
    } catch (error) {
      console.error('Failed to load translations:', error)
      // Fallback to English
      const fallback = await import('@/locales/en.json')
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
