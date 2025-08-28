'use client'

import { useState, useEffect } from 'react'
import { 
  MapPinIcon, 
  GridIcon, 
  ListIcon,
  SearchIcon,
  FilterIcon,
  MapIcon,
  CoffeeIcon,
  MonitorIcon,
  HomeIcon,
  UtensilsIcon,
  TreeIcon
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import PlaceRecommendations from '@/components/PlaceRecommendations'

interface Place {
  id: string
  name: string
  category: string
  address: string
  description: string
  tags: string[]
  wifi_speed?: number
  price_level: number
  noise_level: string
  social_atmosphere: string
  upvotes: number
  downvotes: number
  rating: number
  review_count: number
  submitted_by: string
  created_at: string
  latitude?: number
  longitude?: number
}

export default function PlacesPage() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)

  // 模拟数据
  useEffect(() => {
    const mockPlaces: Place[] = [
      {
        id: '1',
        name: 'Blue Bottle Coffee',
        category: 'cafe',
        address: '大阪市中央区心斋桥1-1-1',
        description: '环境安静，WiFi稳定，咖啡品质很好，适合长时间工作。',
        tags: ['安静', 'WiFi快', '咖啡好'],
        wifi_speed: 85,
        price_level: 3,
        noise_level: 'quiet',
        social_atmosphere: 'low',
        upvotes: 45,
        downvotes: 2,
        rating: 4.8,
        review_count: 23,
        submitted_by: '张三',
        created_at: '2024-01-15',
        latitude: 34.6937,
        longitude: 135.5023
      },
      {
        id: '2',
        name: 'WeWork 心斋桥',
        category: 'coworking',
        address: '大阪市中央区心斋桥2-2-2',
        description: '专业的联合办公空间，设施齐全，社区氛围很好。',
        tags: ['专业', '设施全', '社区好'],
        wifi_speed: 120,
        price_level: 4,
        noise_level: 'moderate',
        social_atmosphere: 'high',
        upvotes: 38,
        downvotes: 1,
        rating: 4.6,
        review_count: 18,
        submitted_by: '李四',
        created_at: '2024-01-10',
        latitude: 34.6938,
        longitude: 135.5024
      },
      {
        id: '3',
        name: 'Nomad House Osaka',
        category: 'coliving',
        address: '大阪市西区南堀江3-3-3',
        description: '数字游民专用住宿，价格合理，位置便利，社交氛围浓厚。',
        tags: ['游民专用', '价格合理', '位置好'],
        wifi_speed: 95,
        price_level: 2,
        noise_level: 'moderate',
        social_atmosphere: 'high',
        upvotes: 52,
        downvotes: 3,
        rating: 4.9,
        review_count: 31,
        submitted_by: '王五',
        created_at: '2024-01-05',
        latitude: 34.6939,
        longitude: 135.5025
      }
    ]
    setPlaces(mockPlaces)
    setLoading(false)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cafe': return <CoffeeIcon className="h-5 w-5" />
      case 'coworking': return <MonitorIcon className="h-5 w-5" />
      case 'coliving': return <HomeIcon className="h-5 w-5" />
      case 'restaurant': return <UtensilsIcon className="h-5 w-5" />
      case 'outdoor': return <TreeIcon className="h-5 w-5" />
      default: return <MapPinIcon className="h-5 w-5" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'cafe': return '☕ 咖啡馆'
      case 'coworking': return '💻 Co-working'
      case 'coliving': return '🏠 Coliving'
      case 'restaurant': return '🍽 餐馆'
      case 'outdoor': return '🌳 户外'
      default: return '📍 其他'
    }
  }

  const getPriceLevelText = (level: number) => {
    return '$'.repeat(level)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">探索地点</h1>
              <p className="text-gray-600 mt-1">发现全球数字游民推荐的最佳工作、生活和社交空间</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ListIcon className="h-4 w-4" />
                  <span>列表</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                  <span>地图</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">总地点数</p>
                    <p className="text-2xl font-bold text-gray-900">{places.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CoffeeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">咖啡馆</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {places.filter(p => p.category === 'cafe').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MonitorIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Co-working</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {places.filter(p => p.category === 'coworking').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <HomeIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Coliving</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {places.filter(p => p.category === 'coliving').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Places by City */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">大阪地区</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  查看全部城市
                </button>
              </div>
              
              <PlaceRecommendations cityId="osaka" />
            </div>

            {/* Popular Categories */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">热门分类</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { category: 'cafe', name: '咖啡馆', count: 15, icon: <CoffeeIcon className="h-6 w-6" /> },
                  { category: 'coworking', name: 'Co-working', count: 8, icon: <MonitorIcon className="h-6 w-6" /> },
                  { category: 'coliving', name: 'Coliving', count: 12, icon: <HomeIcon className="h-6 w-6" /> },
                  { category: 'restaurant', name: '餐馆', count: 20, icon: <UtensilsIcon className="h-6 w-6" /> },
                  { category: 'outdoor', name: '户外', count: 6, icon: <TreeIcon className="h-6 w-6" /> }
                ].map((item) => (
                  <div
                    key={item.category}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.count} 个地点</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Map View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">地图视图</h3>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  定位到我的位置
                </button>
              </div>
            </div>
            
            {/* Placeholder for Map */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">地图功能开发中</h4>
                <p className="text-gray-600">即将支持交互式地图查看所有推荐地点</p>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">图例</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { category: 'cafe', name: '咖啡馆', color: 'bg-green-500' },
                  { category: 'coworking', name: 'Co-working', color: 'bg-blue-500' },
                  { category: 'coliving', name: 'Coliving', color: 'bg-purple-500' },
                  { category: 'restaurant', name: '餐馆', color: 'bg-orange-500' },
                  { category: 'outdoor', name: '户外', color: 'bg-green-600' }
                ].map((item) => (
                  <div key={item.category} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
