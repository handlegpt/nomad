'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, MapPinIcon, UsersIcon, BookOpenIcon, BarChart3Icon, SearchIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Navigation() {
  const { t } = useTranslation()
  const pathname = usePathname()
  
  const navigationItems = [
    { name: t('navigation.home'), href: '/', icon: HomeIcon },
    { name: t('navigation.cities'), href: '/cities', icon: MapPinIcon },
    { name: t('navigation.places'), href: '/places', icon: SearchIcon },
    { name: t('navigation.visaGuide'), href: '/visa-guide', icon: BookOpenIcon },
    { name: t('navigation.community'), href: '/community', icon: UsersIcon },
    { name: t('navigation.dashboard'), href: '/dashboard', icon: BarChart3Icon }
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
} 