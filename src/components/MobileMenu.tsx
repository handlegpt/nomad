'use client'

import { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from './LanguageSwitcher'
import FixedLink from './FixedLink'

export default function MobileMenu() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      name: t('navigation.home'),
      href: '/',
      description: t('mobileMenu.homeDescription')
    },
    {
      name: t('navigation.cities'),
      href: '/cities',
      description: t('mobileMenu.citiesDescription')
    },
    {
      name: t('navigation.visaGuide'),
      href: '/visa-guide',
      description: t('mobileMenu.visaDescription')
    },

    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      description: t('mobileMenu.dashboardDescription')
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('mobileMenu.title')}</h2>
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
                      <FixedLink
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block p-4 rounded-xl transition-colors min-h-[60px] flex flex-col justify-center ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      </FixedLink>
                    )
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">{t('mobileMenu.languageSettings')}</h3>
                    <LanguageSwitcher />
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href="/setup"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('mobileMenu.quickSetup')}
                    </Link>
                    <Link
                      href="/about"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('mobileMenu.aboutUs')}
                    </Link>
                    <Link
                      href="/contact"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('mobileMenu.contactUs')}
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
