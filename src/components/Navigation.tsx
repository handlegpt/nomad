'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  HomeIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  CalculatorIcon,
  BookOpenIcon,
  UserGroupIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  const navItems = [
    { href: '/', label: t('home'), icon: HomeIcon },
    { href: '/tools', label: t('tools'), icon: WrenchScrewdriverIcon },
    { href: '/cities', label: t('cities'), icon: MapPinIcon },
    { href: '/tax', label: t('tax'), icon: CalculatorIcon },
    { href: '/guides', label: t('guides'), icon: BookOpenIcon },
    { href: '/community', label: t('community'), icon: UserGroupIcon }
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    // For now, just show an alert since we need to implement locale switching
    alert(`Language changed to ${languageCode}. Internationalization will be fully implemented in a future update.`);
    setIsLanguageMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Digital Nomad Info
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-1" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{t('language')}</span>
                <span className="text-gray-400">▼</span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[160px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm text-gray-700">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <IconComponent className="h-5 w-5 mr-2" />
                  {item.label}
                </div>
              </Link>
            );
          })}
          
          {/* Mobile Language Switcher */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="px-3 py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t('language')}</h3>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 