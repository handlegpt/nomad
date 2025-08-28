'use client'

import { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from './LanguageSwitcher'

export default function MobileMenu() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      name: t('navigation.home'),
      href: '/',
      description: '查看当前位置和基本信息'
    },
    {
      name: t('navigation.cities'),
      href: '/cities',
      description: '探索全球城市'
    },
    {
      name: '签证指南',
      href: '/visa-guide',
      description: '各国签证申请指南'
    },
    {
      name: t('navigation.community'),
      href: '/community',
      description: '与其他游民交流'
    },
    {
      name: '数据统计',
      href: '/dashboard',
      description: '查看平台数据'
    }
  ]

  return (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">菜单</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block p-4 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      </Link>
                    )
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">语言设置</h3>
                    <LanguageSwitcher />
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href="/setup"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      快速设置
                    </Link>
                    <Link
                      href="/about"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      关于我们
                    </Link>
                    <Link
                      href="/contact"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      联系我们
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
