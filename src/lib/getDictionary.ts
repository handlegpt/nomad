export const getDictionary = async (locale: string) => {
  try {
    // Import translations based on locale
    let trans: any
    switch (locale) {
      case 'zh':
        trans = await import('../locales/zh.json')
        break
      case 'es':
        trans = await import('../locales/es.json')
        break
      case 'ja':
        trans = await import('../locales/ja.json')
        break
      case 'en':
      default:
        trans = await import('../locales/en.json')
        break
    }
    return trans.default
  } catch (error) {
    console.error('❌ Failed to load translations for locale:', locale, error)
    // 如果找不到对应语言包，返回英文
    try {
      const fallback = await import('../locales/en.json')
      return fallback.default
    } catch (fallbackError) {
      console.error('❌ Failed to load fallback translations:', fallbackError)
      return {}
    }
  }
} 