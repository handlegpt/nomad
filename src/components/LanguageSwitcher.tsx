'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const languages = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'yue', label: '粵語', flag: '🇭🇰' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (locale: string) => {
    // 简单的语言切换逻辑
    const newPath = `/${locale}${pathname}`
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <span>🌐</span>
        <span>Language</span>
        <span>▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 