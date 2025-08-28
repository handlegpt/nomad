'use client'

import { useState, useEffect } from 'react'
import { GlobeIcon, MapPinIcon, RefreshCwIcon } from 'lucide-react'
import CurrentLocationCard from '@/components/CurrentLocationCard'
import CityRanking from '@/components/CityRanking'
import NomadTip from '@/components/NomadTip'
import CommunitySection from '@/components/CommunitySection'
import PremiumFeatures from '@/components/PremiumFeatures'
import VisaCountdown from '@/components/VisaCountdown'
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations'
import CityComparison from '@/components/CityComparison'
import PlaceRecommendations from '@/components/PlaceRecommendations'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MobileMenu from '@/components/MobileMenu'
import NotificationSystem from '@/components/NotificationSystem'
import { useTranslation } from '@/hooks/useTranslation'

export default function HomePage() {
  const { t, locale } = useTranslation()
  const [currentLocation, setCurrentLocation] = useState({
    city: 'Osaka',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    lat: 34.6937,
    lon: 135.5023
  })
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    // 这里可以集成地理位置检测
    // 暂时使用默认位置
  }, [])

  const handleRefresh = () => {
    setLastUpdated(new Date())
    // 这里可以重新获取数据
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Minimal Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GlobeIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NOMAD.NOW</h1>
                <p className="text-xs text-gray-500">digital nomad tools</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden lg:block">
                <NotificationSystem />
              </div>
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Minimal Design */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Core Information Card - Like time.is */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-6 w-6 text-blue-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">📍 你的位置: {currentLocation.city}, {currentLocation.country}</h2>
                  <p className="text-sm text-gray-500">最后更新: {lastUpdated.toLocaleTimeString()}</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="刷新数据"
              >
                <RefreshCwIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Current Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">14:22</div>
                <div className="text-sm text-gray-600">🕒 当地时间</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">27°C</div>
                <div className="text-sm text-gray-600">🌤 天气</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">120</div>
                <div className="text-sm text-gray-600">☕ WiFi (Mbps)</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">38</div>
                <div className="text-sm text-gray-600">🛂 签证剩余天数</div>
              </div>
            </div>
          </div>

          {/* Nomad Hot Cities Ranking */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                🌍 Nomad 热门城市推荐榜单
              </h2>
              <span className="text-sm text-gray-500">(投票 → 得分 → 排名)</span>
            </div>
            
            <CityRanking limit={5} />
            
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                👉 查看全部城市排行
              </button>
            </div>
          </div>

          {/* Quick Vote Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              ✍️ 参与投票
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <button className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
                🔼 喜欢
              </button>
              <button className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
                🔽 不喜欢
              </button>
              <span className="text-gray-500">或者</span>
              <button className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-medium">
                ⭐ 评分: 1~5
              </button>
            </div>
          </div>

          {/* Nomad Tip */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              📨 Nomad 小贴士
            </h3>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700 italic">
                「在葡萄牙，数字游民签证允许停留1年并可续签。」
              </p>
            </div>
            <div className="text-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                订阅邮件提醒 → 获取签证到期/城市推荐
              </button>
            </div>
          </div>

          {/* Additional Features - Collapsible */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VisaCountdown
                visaExpiry="2024-03-15"
                country="Japan"
                visaType="Tourist Visa"
              />
              <PersonalizedRecommendations />
            </div>
            
            <PlaceRecommendations cityId="osaka" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunitySection />
              <PremiumFeatures />
            </div>
            
            <CityComparison />
          </div>
        </div>
      </main>

                {/* Minimal Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <a href="/about" className="hover:text-gray-900">关于 nomad.now</a>
            <a href="/contact" className="hover:text-gray-900">联系</a>
            <a href="/contact" className="hover:text-gray-900">赞助合作</a>
          </div>
        </div>
      </footer>
    </div>
  )
} 