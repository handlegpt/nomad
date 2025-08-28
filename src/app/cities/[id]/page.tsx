'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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

            {/* Recommended Places */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">推荐地点</h2>
                <Link href={`/places?cityId=${city.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  查看全部 →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Places */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">☕ 热门咖啡馆</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Blue Bottle Coffee</p>
                        <p className="text-xs text-gray-600">WiFi: 100Mbps • 安静</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">4.8</span>
                        </div>
                        <p className="text-xs text-gray-500">$$</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Starbucks Reserve</p>
                        <p className="text-xs text-gray-600">WiFi: 80Mbps • 适中</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">4.5</span>
                        </div>
                        <p className="text-xs text-gray-500">$$</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">💻 Co-working空间</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">WeWork Osaka</p>
                        <p className="text-xs text-gray-600">WiFi: 500Mbps • 专业</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">4.7</span>
                        </div>
                        <p className="text-xs text-gray-500">$$$</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Regus Business Center</p>
                        <p className="text-xs text-gray-600">WiFi: 300Mbps • 安静</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">4.3</span>
                        </div>
                        <p className="text-xs text-gray-500">$$$</p>
                      </div>
                    </div>
                  </div>
                </div>
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

            {/* Recommended Services */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">推荐服务</h3>
              <div className="space-y-4">
                {/* Insurance */}
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-lg">🛡️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">旅行保险</p>
                        <p className="text-sm text-gray-600">SafetyWing - 数字游民专用</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">$42/月</p>
                      <p className="text-xs text-gray-500">全球覆盖</p>
                    </div>
                  </div>
                </div>

                {/* Visa Services */}
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-lg">📋</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">签证服务</p>
                        <p className="text-sm text-gray-600">iVisa - 专业签证申请</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">从$25</p>
                      <p className="text-xs text-gray-500">快速处理</p>
                    </div>
                  </div>
                </div>

                {/* Co-working Spaces */}
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-lg">💻</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Co-working空间</p>
                        <p className="text-sm text-gray-600">WeWork - 全球网络</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">从$200/月</p>
                      <p className="text-xs text-gray-500">灵活会员</p>
                    </div>
                  </div>
                </div>
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
