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
      console.log('🔍 Loading translations for locale:', newLocale)
      // Add cache busting parameter to force reload
      const trans = await import(`@/locales/${newLocale}.json?v=${Date.now()}`)
      console.log('✅ Translations loaded:', trans.default)
      setTranslations(trans.default)
    } catch (error) {
      console.error('❌ Failed to load translations:', error)
      // Fallback to English
      const fallback = await import('@/locales/en.json')
      console.log('🔄 Using fallback translations:', fallback.default)
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
    if (loading) {
      console.log('⏳ Translation loading, returning key:', key)
      return key
    }
    
    const keys = key.split('.')
    let value: any = keys.reduce((obj, k) => obj?.[k], translations)
    
    if (value === undefined || value === key) {
      console.warn('⚠️ Translation key not found:', key, 'in locale:', locale)
      return key
    }
    
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
