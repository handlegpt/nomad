'use client';

import { useTranslations } from 'next-intl';
import { 
  GlobeAltIcon, 
  CurrencyDollarIcon, 
  WifiIcon, 
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function CitiesPage() {
  const t = useTranslations('cities');

  const cities = [
    'barcelona',
    'mexico_city', 
    'bali',
    'tokyo',
    'lisbon',
    'chiang_mai',
    'budapest',
    'porto'
  ];

  const renderCityCard = (cityKey: string) => {
    const city = t.raw(cityKey);
    
    return (
      <div key={cityKey} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* City Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{city.name}</h2>
              <p className="text-blue-100">{city.country}</p>
            </div>
            <MapPinIcon className="h-8 w-8 text-blue-200" />
          </div>
          <p className="mt-3 text-blue-100">{city.description}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Visa Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
              签证信息
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">数字游民签证</p>
                  <p className="font-medium">{city.visa.digital_nomad}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">旅游签证</p>
                  <p className="font-medium">{city.visa.tourist}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">要求:</p>
                <ul className="space-y-1">
                  {city.visa.requirements.map((req: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Cost of Living */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
              生活成本
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">月预算</p>
                <p className="font-semibold text-green-700">{city.cost_of_living.monthly_budget}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">住宿</p>
                <p className="font-semibold text-blue-700">{city.cost_of_living.accommodation}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">餐饮</p>
                <p className="font-semibold text-orange-700">{city.cost_of_living.food}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">交通</p>
                <p className="font-semibold text-purple-700">{city.cost_of_living.transport}</p>
              </div>
            </div>
          </div>

          {/* Internet & Infrastructure */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <WifiIcon className="h-5 w-5 mr-2 text-purple-600" />
              网络环境
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">平均网速</p>
                <p className="font-semibold text-purple-700">{city.internet.average_speed}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">联合办公空间</p>
                <p className="font-semibold text-indigo-700">{city.internet.coworking_spaces}</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">免费WiFi</p>
                <p className="font-semibold text-cyan-700">{city.internet.free_wifi}</p>
              </div>
            </div>
          </div>

          {/* Safety & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
                安全状况
              </h3>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-medium text-green-800">{city.safety}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
                语言环境
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-medium text-blue-800">{city.language}</p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">城市亮点</h3>
            <div className="flex flex-wrap gap-2">
              {city.highlights.map((highlight: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cities.map(renderCityCard)}
        </div>
      </div>
    </div>
  );
} 