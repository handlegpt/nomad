'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPinIcon, WifiIcon, DollarSignIcon, CalendarIcon, StarIcon, UsersIcon, 
  TrendingUpIcon, HeartIcon, CoffeeIcon, GlobeIcon, ThumbsUpIcon, ThumbsDownIcon,
  PlaneIcon, HomeIcon, UtensilsIcon, BusIcon, WifiIcon as WifiIconSolid,
  ShieldIcon, SunIcon, CloudIcon, ClockIcon, BookOpenIcon
} from 'lucide-react'
import { getCityById, submitVote } from '@/lib/api'
import { City } from '@/lib/supabase'
import { useTranslation } from '@/hooks/useTranslation'
import VoteModal from '@/components/VoteModal'
import CityReviews from '@/components/CityReviews'
import { realtimeService, realtimeData } from '@/lib/realtimeService'

export default function CityDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const cityId = params.id as string
  
  const [city, setCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(true)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [realTimeData, setRealTimeData] = useState<any>(null)

  useEffect(() => {
    fetchCityData()
    setupRealtimeSubscription()
    
    return () => {
      // 清理实时订阅
      realtimeService.unsubscribe(`city_reviews_${cityId}`)
      realtimeService.unsubscribe(`city_votes_${cityId}`)
    }
  }, [cityId])

  const setupRealtimeSubscription = () => {
    // 只在客户端设置实时订阅
    if (typeof window !== 'undefined') {
      // 订阅城市评论实时更新
      realtimeService.subscribeToCityReviews(cityId, (payload) => {
        console.log('Real-time review update:', payload)
        // 这里可以更新评论数据
        if (payload.eventType === 'INSERT') {
          // 新评论添加时刷新数据
          fetchCityData()
        }
      })

      // 订阅城市投票实时更新
      realtimeService.subscribeToCityVotes(cityId, (payload) => {
        console.log('Real-time vote update:', payload)
        // 这里可以更新投票数据
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          // 投票更新时刷新数据
          fetchCityData()
        }
      })
    }
  }

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

  // 获取优缺点数据
  const getProsAndCons = () => {
    return {
      pros: [
        "生活成本相对较低",
        "WiFi速度快且稳定",
        "数字游民社区活跃",
        "英语普及度高",
        "交通便利",
        "美食文化丰富",
        "气候宜人",
        "安全指数高"
      ],
      cons: [
        "雨季可能影响出行",
        "某些地区WiFi不稳定",
        "语言障碍（非英语区）",
        "交通拥堵（高峰时段）",
        "签证限制",
        "医疗费用较高",
        "文化差异",
        "网络审查"
      ]
    }
  }

  // 获取生活成本细分
  const getCostBreakdown = () => {
    const totalCost = city?.cost_of_living || 2000
    return {
      accommodation: Math.round(totalCost * 0.4),
      food: Math.round(totalCost * 0.25),
      transportation: Math.round(totalCost * 0.15),
      entertainment: Math.round(totalCost * 0.1),
      utilities: Math.round(totalCost * 0.05),
      other: Math.round(totalCost * 0.05)
    }
  }

  // 获取用户评价
  const getUserReviews = () => {
    return [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        date: "2024-01-15",
        comment: "里斯本是我去过的最适合数字游民的城市之一。WiFi速度快，生活成本合理，社区氛围很好。强烈推荐！",
        avatar: "👩‍💻"
      },
      {
        id: 2,
        user: "Mike R.",
        rating: 4,
        date: "2024-01-10",
        comment: "整体体验不错，但住宿价格在旺季会比较高。建议提前预订。",
        avatar: "👨‍💻"
      },
      {
        id: 3,
        user: "Emma L.",
        rating: 5,
        date: "2024-01-05",
        comment: "这里的联合办公空间很棒，认识了很多志同道合的朋友。",
        avatar: "👩‍💼"
      }
    ]
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

  const prosAndCons = getProsAndCons()
  const costBreakdown = getCostBreakdown()
  const userReviews = getUserReviews()

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
        {/* Core Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1 flex items-center justify-center">
                <StarIcon className="h-6 w-6 mr-1" />
                {getCityScore()}
              </div>
              <div className="text-sm text-gray-600">{t('cityDetail.overallScore')}</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 mr-1" />
                {getCommunityActivity()}%
              </div>
              <div className="text-sm text-gray-600">{t('cityDetail.communityActivity')}</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1 flex items-center justify-center">
                <CoffeeIcon className="h-6 w-6 mr-1" />
                {getConvenienceScore()}
              </div>
              <div className="text-sm text-gray-600">{t('cityDetail.convenienceScore')}</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center">
                <TrendingUpIcon className="h-6 w-6 mr-1" />
                {city.visa_days}
              </div>
              <div className="text-sm text-gray-600">{t('cityDetail.stayDays')}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
            {[
                          { id: 'overview', label: t('cityDetail.overview'), icon: StarIcon },
            { id: 'pros-cons', label: t('cityDetail.prosCons'), icon: ThumbsUpIcon },
            { id: 'cost', label: t('cityDetail.costOfLiving'), icon: DollarSignIcon },
            { id: 'reviews', label: t('cityDetail.reviews'), icon: UsersIcon },
            { id: 'visa', label: t('cityDetail.visaInfo'), icon: CalendarIcon },
            { id: 'transport', label: t('cityDetail.transportAccommodation'), icon: PlaneIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Nomad Place Recommendations */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                    {t('cities.nomadPlaces.title')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">☕</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Café Fabrica</h4>
                          <p className="text-sm text-gray-600">{t('cities.nomadPlaces.quietAtmosphere')}, WiFi {t('cities.nomadPlaces.stable')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm font-medium">4.8 ⭐</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💻</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Outsite Lisbon</h4>
                          <p className="text-sm text-gray-600">{t('cities.nomadPlaces.coworkingColiving')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm font-medium">4.6 ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* City Statistics */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUpIcon className="h-5 w-5 mr-2 text-blue-600" />
                    {t('cities.statistics')}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">4.8</div>
                      <div className="text-sm text-gray-600">{t('cities.rating')}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">${city.cost_of_living}</div>
                      <div className="text-sm text-gray-600">{t('cities.costOfLiving')}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{city.wifi_speed} Mbps</div>
                      <div className="text-sm text-gray-600">{t('cities.wifiSpeed')}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{city.visa_days}</div>
                      <div className="text-sm text-gray-600">{t('cities.stayDays')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pros-cons' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center">
                    <ThumbsUpIcon className="h-5 w-5 mr-2" />
                    优点
                  </h3>
                  <div className="space-y-3">
                    {prosAndCons.pros.map((pro, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
                    <ThumbsDownIcon className="h-5 w-5 mr-2" />
                    缺点
                  </h3>
                  <div className="space-y-3">
                    {prosAndCons.cons.map((con, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <span className="text-red-500">✗</span>
                        <span className="text-gray-700">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cost' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">月生活成本细分</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <HomeIcon className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">住宿</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">${costBreakdown.accommodation}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <UtensilsIcon className="h-5 w-5 text-green-600" />
                        <span className="font-medium">餐饮</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">${costBreakdown.food}</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <BusIcon className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">交通</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">${costBreakdown.transportation}</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <HeartIcon className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">娱乐</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">${costBreakdown.entertainment}</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <WifiIconSolid className="h-5 w-5 text-red-600" />
                        <span className="font-medium">水电网络</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600">${costBreakdown.utilities}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <GlobeIcon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">其他</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-600">${costBreakdown.other}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <CityReviews cityId={cityId} onReviewAdded={fetchCityData} />
            )}

            {activeTab === 'visa' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      签证信息
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">签证类型</span>
                        <span className="font-medium">{city.visa_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">停留天数</span>
                        <span className="font-medium">{city.visa_days} 天</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">申请难度</span>
                        <span className="font-medium text-green-600">简单</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">申请费用</span>
                        <span className="font-medium">$25-100</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                      <BookOpenIcon className="h-5 w-5 mr-2" />
                      申请要求
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">有效护照（6个月以上）</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">往返机票</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">住宿证明</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">资金证明</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transport' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                      <PlaneIcon className="h-5 w-5 mr-2" />
                      交通信息
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">机场</h4>
                        <p className="text-sm text-gray-600">里斯本波尔特拉机场 (LIS)</p>
                        <p className="text-sm text-gray-600">距离市中心约7公里</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">公共交通</h4>
                        <p className="text-sm text-gray-600">地铁、公交、电车网络完善</p>
                        <p className="text-sm text-gray-600">月票约€40</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">打车</h4>
                        <p className="text-sm text-gray-600">Uber、Bolt等网约车服务</p>
                        <p className="text-sm text-gray-600">起步价约€3</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-orange-50 rounded-lg">
                    <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                      <HomeIcon className="h-5 w-5 mr-2" />
                      住宿信息
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">联合办公空间</h4>
                        <p className="text-sm text-gray-600">WeWork、Outsite等</p>
                        <p className="text-sm text-gray-600">月费€200-400</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">公寓租赁</h4>
                        <p className="text-sm text-gray-600">市中心1室公寓</p>
                        <p className="text-sm text-gray-600">月租€800-1200</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">酒店</h4>
                        <p className="text-sm text-gray-600">经济型酒店</p>
                        <p className="text-sm text-gray-600">每晚€50-100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <GlobeIcon className="h-5 w-5 mr-2 text-green-600" />
            {t('cities.recommendedServices')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🛡️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('cities.services.insurance')}</p>
                  <p className="text-sm text-gray-600">SafetyWing</p>
                  <p className="text-sm font-medium text-green-600">$42/{t('cities.services.month')}</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">📋</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('cities.services.visaServices')}</p>
                  <p className="text-sm text-gray-600">iVisa</p>
                  <p className="text-sm font-medium text-green-600">{t('cities.services.from')}$25</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">💻</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('cities.services.coworkingSpaces')}</p>
                  <p className="text-sm text-gray-600">WeWork</p>
                  <p className="text-sm font-medium text-green-600">{t('cities.services.from')}$200/{t('cities.services.month')}</p>
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
