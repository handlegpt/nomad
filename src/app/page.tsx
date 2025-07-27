'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  WrenchScrewdriverIcon,
  MapPinIcon,
  CalculatorIcon,
  BookOpenIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const t = useTranslations();

  const features = [
    {
      title: t('navigation.tools'),
      description: '银行、保险、远程工作平台和语言学习工具',
      icon: WrenchScrewdriverIcon,
      href: '/tools',
      color: 'blue'
    },
    {
      title: t('navigation.cities'),
      description: '8个热门数字游民城市的详细信息',
      icon: MapPinIcon,
      href: '/cities',
      color: 'green'
    },
    {
      title: t('navigation.tax'),
      description: '税务提醒和183天规则指南',
      icon: CalculatorIcon,
      href: '/tax',
      color: 'red'
    },
    {
      title: t('navigation.guides'),
      description: '签证申请、搬家清单和共同居住指南',
      icon: BookOpenIcon,
      href: '/guides',
      color: 'purple'
    },
    {
      title: t('navigation.community'),
      description: 'Telegram、Discord和Facebook群组',
      icon: UserGroupIcon,
      href: '/community',
      color: 'indigo'
    }
  ];

  const cities = [
    { name: '巴塞罗那', country: '西班牙', description: '地中海生活方式' },
    { name: '墨西哥城', country: '墨西哥', description: '充满活力的文化' },
    { name: '巴厘岛', country: '印度尼西亚', description: '热带天堂' },
    { name: '东京', country: '日本', description: '高科技城市' },
    { name: '里斯本', country: '葡萄牙', description: '历史与现代融合' },
    { name: '清迈', country: '泰国', description: '宁静古城' },
    { name: '布达佩斯', country: '匈牙利', description: '中欧明珠' },
    { name: '波尔图', country: '葡萄牙', description: '葡萄酒之都' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      purple: 'bg-purple-600',
      indigo: 'bg-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">{t('subtitle')}</p>
            <p className="text-blue-100 text-lg mb-12">{t('description')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                开始探索
              </Link>
              <Link
                href="/cities"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                查看城市
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-xl text-gray-600">为数字游民提供全面的资源和工具</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
                >
                  <div className={`w-12 h-12 ${getColorClasses(feature.color)} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    了解更多
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cities Preview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热门城市</h2>
            <p className="text-xl text-gray-600">探索数字游民最爱的目的地</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <div key={index} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GlobeAltIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-600">{city.country}</p>
                <p className="text-xs text-gray-500 mt-1">{city.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/cities"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              查看所有城市
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">8</div>
              <div className="text-gray-300">热门城市</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">20+</div>
              <div className="text-gray-300">推荐工具</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5</div>
              <div className="text-gray-300">支持语言</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-gray-300">社区支持</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">准备开始你的数字游民之旅？</h2>
          <p className="text-xl mb-8 text-green-100">
            获取签证信息、税务提醒、城市指南和社区支持
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/guides"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              查看指南
            </Link>
            <Link
              href="/community"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              加入社区
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 