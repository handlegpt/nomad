export const getDictionary = async (locale: string) => {
  try {
    return (await import(`../locales/${locale}.json`)).default
  } catch {
    // 如果找不到对应语言包，返回英文
    return (await import(`../locales/en.json`)).default
  }
} 