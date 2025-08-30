'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, WifiIcon, DollarSignIcon, CalendarIcon, StarIcon, UsersIcon, CloudIcon, TrendingUpIcon, HeartIcon, CoffeeIcon, GlobeIcon } from 'lucide-react'
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

  useEffect(() => {
    fetchCityData()
  }, [cityId])

  const fetchCityData = async () => {
    try {
      setLoading(true)
      const cityData = await getCityById(cityId)
      setCity(cityData)
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

  // 计算城市评分（模拟数据）
  const getCityScore = () => {
    const baseScore = 4.2
    const wifiBonus = (city?.wifi_speed || 0) > 50 ? 0.3 : 0
    const costBonus = (city?.cost_of_living || 0) < 2000 ? 0.2 : 0
    const visaBonus = (city?.visa_days || 0) > 90 ? 0.3 : 0
    return Math.min(5, baseScore + wifiBonus + costBonus + visaBonus).toFixed(1)
  }

  // 获取社区活跃度（模拟数据）
  const getCommunityActivity = () => {
    const baseActivity = 75
    const randomVariation = Math.floor(Math.random() * 20) - 10
    return Math.max(0, Math.min(100, baseActivity + randomVariation))
  }

  // 获取生活便利性评分（模拟数据）
  const getConvenienceScore = () => {
    const baseScore = 4.0
    const wifiBonus = (city?.wifi_speed || 0) > 50 ? 0.4 : 0
    const costBonus = (city?.cost_of_living || 0) < 2000 ? 0.3 : 0
    return Math.min(5, baseScore + wifiBonus + costBonus).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('common.error')}</h1>
          <p className="text-gray-600">城市信息未找到</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getCountryFlag(city.country_code)}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{city.name} {getCountryFlag(city.country_code)}</h1>
                <p className="text-lg text-gray-600">{city.country}</p>
              </div>
            </div>
            <button
              onClick={() => setShowVoteModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('cities.vote')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Core Info Card - 替换时间和天气为更有价值的信息 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1 flex items-center justify-center">
                <StarIcon className="h-6 w-6 mr-1" />
                {getCityScore()}
              </div>
              <div className="text-sm text-gray-600">综合评分</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 mr-1" />
                {getCommunityActivity()}%
              </div>
              <div className="text-sm text-gray-600">社区活跃度</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1 flex items-center justify-center">
                <CoffeeIcon className="h-6 w-6 mr-1" />
                {getConvenienceScore()}
              </div>
              <div className="text-sm text-gray-600">生活便利性</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center">
                <TrendingUpIcon className="h-6 w-6 mr-1" />
                {city.visa_days}
              </div>
              <div className="text-sm text-gray-600">{t('cities.stayDays')}</div>
            </div>
          </div>
        </div>

        {/* Nomad Place Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
              {t('cities.nomadPlaces.title')}
            </h2>
            <div className="flex space-x-3">
              <Link 
                href={`/places?cityId=${city.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {t('cities.nomadPlaces.more')} →
              </Link>
              <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm">
                {t('cities.nomadPlaces.addRecommendation')}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Mock place recommendations */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">☕</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Café Fabrica</h3>
                  <p className="text-sm text-gray-600">{t('cities.nomadPlaces.quietAtmosphere')}, WiFi {t('cities.nomadPlaces.stable')}, {t('cities.nomadPlaces.latte')} €2.5</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                  <span>👍</span>
                  <span className="text-sm font-medium">32</span>
                </button>
                <button className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                  <span>👎</span>
                  <span className="text-sm font-medium">1</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💻</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Outsite Lisbon</h3>
                  <p className="text-sm text-gray-600">{t('cities.nomadPlaces.coworkingColiving')}, {t('cities.nomadPlaces.goodCommunity')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                  <span>👍</span>
                  <span className="text-sm font-medium">28</span>
                </button>
                <button className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                  <span>👎</span>
                  <span className="text-sm font-medium">3</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌳</span>
                <div>
                  <h3 className="font-semibold text-gray-900">LX Factory</h3>
                  <p className="text-sm text-gray-600">{t('cities.nomadPlaces.artisticAtmosphere')}, {t('cities.nomadPlaces.goodForShortWork')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                  <span>👍</span>
                  <span className="text-sm font-medium">20</span>
                </button>
                <button className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                  <span>👎</span>
                  <span className="text-sm font-medium">5</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* City Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* City Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2 text-blue-600" />
                {t('cities.statistics')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">4.8</div>
                  <div className="text-sm text-gray-600">{t('cities.rating')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">${city.cost_of_living}</div>
                  <div className="text-sm text-gray-600">{t('cities.costOfLiving')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{city.wifi_speed} Mbps</div>
                  <div className="text-sm text-gray-600">{t('cities.wifiSpeed')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{city.visa_days}</div>
                  <div className="text-sm text-gray-600">{t('cities.stayDays')}</div>
                </div>
              </div>
            </div>

            {/* Recommended Services */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <GlobeIcon className="h-5 w-5 mr-2 text-green-600" />
                {t('cities.recommendedServices')}
              </h3>
              <div className="space-y-4">
                {/* Insurance */}
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-lg">🛡️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t('cities.services.insurance')}</p>
                        <p className="text-sm text-gray-600">SafetyWing - {t('cities.services.digitalNomadInsurance')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">$42/{t('cities.services.month')}</p>
                      <p className="text-xs text-gray-500">{t('cities.services.globalCoverage')}</p>
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
                        <p className="font-medium text-gray-900">{t('cities.services.visaServices')}</p>
                        <p className="text-sm text-gray-600">iVisa - {t('cities.services.professionalVisa')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{t('cities.services.from')}$25</p>
                      <p className="text-xs text-gray-500">{t('cities.services.fastProcessing')}</p>
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
                        <p className="font-medium text-gray-900">{t('cities.services.coworkingSpaces')}</p>
                        <p className="text-sm text-gray-600">WeWork - {t('cities.services.globalNetwork')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{t('cities.services.from')}$200/{t('cities.services.month')}</p>
                      <p className="text-xs text-gray-500">{t('cities.services.flexibleMembership')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Cities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                {t('cities.relatedCities')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="text-2xl">🇹🇭</div>
                  <div>
                    <p className="font-medium">{t('cities.chiangMai')}</p>
                    <p className="text-sm text-gray-600">{t('cities.thailand')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="text-2xl">🇵🇹</div>
                  <div>
                    <p className="font-medium">{t('cities.lisbon')}</p>
                    <p className="text-sm text-gray-600">{t('cities.portugal')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* City Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                城市亮点
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">数字游民友好</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">英语普及度高</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">交通便利</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">安全宜居</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">美食文化丰富</span>
                </div>
              </div>
            </div>
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
