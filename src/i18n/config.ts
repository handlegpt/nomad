export const locales = ['zh', 'es', 'ja'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'zh'

export const localeNames = {
  zh: '中文',
  es: 'Español',
  ja: '日本語'
} as const

export const localeFlags = {
  zh: '🇨🇳',
  es: '🇪🇸',
  ja: '🇯🇵'
} as const
