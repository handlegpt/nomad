'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  DocumentTextIcon,
  CalculatorIcon,
  HouseIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const t = useTranslations('navigation');
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('home'), icon: HomeIcon },
    { href: '/tools', label: t('tools'), icon: WrenchScrewdriverIcon },
    { href: '/cities', label: t('cities'), icon: MapPinIcon },
    { href: '/tax', label: t('tax'), icon: CalculatorIcon },
    { href: '/guides', label: t('guides'), icon: BookOpenIcon },
    { href: '/community', label: t('community'), icon: UserGroupIcon }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                数字游民资讯
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
            {/* Language switcher can be added here */}
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
        </div>
      </div>
    </nav>
  );
} 