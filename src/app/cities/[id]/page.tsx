'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MapPinIcon, WifiIcon, DollarSignIcon, CalendarIcon, StarIcon, UsersIcon, CloudIcon } from 'lucide-react'
import { getCityById, submitVote } from '@/lib/api'
import { City } from '@/lib/supabase'
import { useTranslation } from '@/hooks/useTranslation'
import VoteModal from '@/components/VoteModal'

export default function CityDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const cityId = params.id as string
  
  const [city, setCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(true)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [localTime, setLocalTime] = useState<string>('')

  useEffect(() => {
    fetchCityData()
  }, [cityId])

  const fetchCityData = async () => {
    try {
      setLoading(true)
      const cityData = await getCityById(cityId)
      setCity(cityData)
      
      // 获取天气信息
      if (cityData) {
        const weatherData = await fetch(`/api/weather?lat=${cityData.latitude}&lon=${cityData.longitude}`)
        const weatherJson = await weatherData.json()
        setWeather(weatherJson)
        
        // 获取当地时间
        const timeData = await fetch(`/api/time?timezone=${cityData.timezone}`)
        const timeJson = await timeData.json()
        setLocalTime(timeJson.datetime)
      }
    } catch (error) {
      console.error('Error fetching city data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const handleVoteSubmitted = () => {
    setShowVoteModal(false)
    fetchCityData() // 刷新数据
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('common.error')}</h1>
          <p className="text-gray-600">城市信息未找到</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getCountryFlag(city.country_code)}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{city.name}</h1>
                <p className="text-lg text-gray-600">{city.country}</p>
              </div>
            </div>
            <button
              onClick={() => setShowVoteModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('cityRanking.vote')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - City Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">当前状态</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {weather && (
                  <div className="flex items-center space-x-3">
                    <CloudIcon className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">天气</p>
                      <p className="font-semibold">{weather.main?.temp}°C</p>
                    </div>
                  </div>
                )}
                {localTime && (
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">当地时间</p>
                      <p className="font-semibold">{new Date(localTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* City Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">城市数据</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <WifiIcon className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('cities.wifiSpeed')}</p>
                    <p className="font-semibold">{city.wifi_speed || 'N/A'} Mbps</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSignIcon className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('cities.costOfLiving')}</p>
                    <p className="font-semibold">${city.cost_of_living || 'N/A'}/月</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('cities.stayDays')}</p>
                    <p className="font-semibold">{city.visa_days} 天</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">签证类型</p>
                    <p className="font-semibold">{city.visa_type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">社区评价</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.5</span>
                  <span className="text-gray-600">(128 条评价)</span>
                </div>
                <p className="text-gray-600">
                  这个城市是数字游民的热门选择，拥有良好的WiFi基础设施和丰富的文化体验。
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  查看住宿选项
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  签证申请指南
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  寻找Co-working空间
                </button>
              </div>
            </div>

            {/* Related Cities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">相关城市</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="text-2xl">🇹🇭</div>
                  <div>
                    <p className="font-medium">清迈</p>
                    <p className="text-sm text-gray-600">泰国</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="text-2xl">🇵🇹</div>
                  <div>
                    <p className="font-medium">里斯本</p>
                    <p className="text-sm text-gray-600">葡萄牙</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            {weather && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">天气预报</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">今天</span>
                    <span className="font-medium">{weather.main?.temp}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">明天</span>
                    <span className="font-medium">25°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">后天</span>
                    <span className="font-medium">27°C</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && city && (
        <VoteModal
          city={city}
          isOpen={showVoteModal}
          onClose={() => setShowVoteModal(false)}
          onVoteSubmitted={handleVoteSubmitted}
        />
      )}
    </div>
  )
}
