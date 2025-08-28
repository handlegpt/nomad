'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPinIcon, 
  WifiIcon, 
  DollarSignIcon, 
  UsersIcon, 
  Volume2Icon,
  PlusIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  StarIcon,
  CoffeeIcon,
  MonitorIcon,
  HomeIcon,
  UtensilsIcon,
  TreeIcon,
  SearchIcon,
  FilterIcon,
  SortAscIcon
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import AddPlaceForm from './AddPlaceForm'

interface Place {
  id: string
  name: string
  category: 'cafe' | 'coworking' | 'coliving' | 'restaurant' | 'outdoor' | 'other'
  address: string
  description: string
  tags: string[]
  wifi_speed?: number
  price_level: 1 | 2 | 3 | 4 | 5
  noise_level: 'quiet' | 'moderate' | 'loud'
  social_atmosphere: 'low' | 'medium' | 'high'
  upvotes: number
  downvotes: number
  rating: number
  review_count: number
  submitted_by: string
  created_at: string
}

export default function PlaceRecommendations({ cityId }: { cityId: string }) {
  const { t } = useTranslation()
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'upvotes' | 'recent'>('upvotes')

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
        created_at: '2024-01-15'
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
        created_at: '2024-01-10'
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
        created_at: '2024-01-05'
      },
      {
        id: '4',
        name: 'Starbucks 心斋桥店',
        category: 'cafe',
        address: '大阪市中央区心斋桥4-4-4',
        description: '连锁咖啡店，WiFi稳定，座位充足，适合工作。',
        tags: ['连锁', 'WiFi稳定', '座位多'],
        wifi_speed: 75,
        price_level: 3,
        noise_level: 'moderate',
        social_atmosphere: 'medium',
        upvotes: 32,
        downvotes: 5,
        rating: 4.2,
        review_count: 15,
        submitted_by: '赵六',
        created_at: '2024-01-12'
      },
      {
        id: '5',
        name: '大阪城公园',
        category: 'outdoor',
        address: '大阪市中央区大阪城1-1',
        description: '美丽的公园，环境优美，适合户外工作和放松。',
        tags: ['环境美', '户外', '免费'],
        price_level: 1,
        noise_level: 'quiet',
        social_atmosphere: 'low',
        upvotes: 28,
        downvotes: 2,
        rating: 4.5,
        review_count: 12,
        submitted_by: '钱七',
        created_at: '2024-01-08'
      }
    ]
    setPlaces(mockPlaces)
    setLoading(false)
  }, [cityId])

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

  const getNoiseLevelText = (level: string) => {
    switch (level) {
      case 'quiet': return '安静'
      case 'moderate': return '适中'
      case 'loud': return '嘈杂'
      default: return '未知'
    }
  }

  const getSocialAtmosphereText = (level: string) => {
    switch (level) {
      case 'low': return '低'
      case 'medium': return '中'
      case 'high': return '高'
      default: return '未知'
    }
  }

  const handleVote = (placeId: string, voteType: 'upvote' | 'downvote') => {
    setPlaces(prev => prev.map(place => {
      if (place.id === placeId) {
        return {
          ...place,
          upvotes: voteType === 'upvote' ? place.upvotes + 1 : place.upvotes,
          downvotes: voteType === 'downvote' ? place.downvotes + 1 : place.downvotes
        }
      }
      return place
    }))
  }

  const handleAddPlace = (placeData: any) => {
    const newPlace: Place = {
      id: Date.now().toString(),
      name: placeData.name,
      category: placeData.category,
      address: placeData.address,
      description: placeData.description,
      tags: placeData.tags,
      wifi_speed: placeData.wifi_speed,
      price_level: placeData.price_level,
      noise_level: placeData.noise_level,
      social_atmosphere: placeData.social_atmosphere,
      upvotes: 0,
      downvotes: 0,
      rating: 0,
      review_count: 0,
      submitted_by: '我',
      created_at: new Date().toISOString().split('T')[0]
    }
    setPlaces(prev => [newPlace, ...prev])
  }

  // 过滤和排序
  let filteredPlaces = places

  // 按分类过滤
  if (selectedCategory !== 'all') {
    filteredPlaces = filteredPlaces.filter(place => place.category === selectedCategory)
  }

  // 按搜索查询过滤
  if (searchQuery) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  // 排序
  filteredPlaces.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'upvotes':
        return b.upvotes - a.upvotes
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  const categories = [
    { id: 'all', name: '全部', icon: <MapPinIcon className="h-4 w-4" /> },
    { id: 'cafe', name: '☕ 咖啡馆', icon: <CoffeeIcon className="h-4 w-4" /> },
    { id: 'coworking', name: '💻 Co-working', icon: <MonitorIcon className="h-4 w-4" /> },
    { id: 'coliving', name: '🏠 Coliving', icon: <HomeIcon className="h-4 w-4" /> },
    { id: 'restaurant', name: '🍽 餐馆', icon: <UtensilsIcon className="h-4 w-4" /> },
    { id: 'outdoor', name: '🌳 户外', icon: <TreeIcon className="h-4 w-4" /> }
  ]

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <MapPinIcon className="h-5 w-5 text-green-500 mr-2" />
            Nomad 地方推荐
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>添加推荐</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索地点、标签或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAscIcon className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="upvotes">按推荐度</option>
                <option value="rating">按评分</option>
                <option value="recent">按时间</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          找到 {filteredPlaces.length} 个地点
        </div>

        {/* Places List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">加载中...</p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-8">
              <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无推荐地点</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                成为第一个推荐者
              </button>
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      {getCategoryIcon(place.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{place.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center space-x-1">
                        <MapPinIcon className="h-3 w-3" />
                        <span>{place.address}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{place.rating}</span>
                      <span className="text-sm text-gray-500">({place.review_count})</span>
                    </div>
                    <span className="text-sm text-gray-600">{getPriceLevelText(place.price_level)}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{place.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {place.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {place.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{place.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  {place.wifi_speed && (
                    <div className="flex items-center space-x-1">
                      <WifiIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{place.wifi_speed} Mbps</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <DollarSignIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{getPriceLevelText(place.price_level)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Volume2Icon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{getNoiseLevelText(place.noise_level)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">社交{getSocialAtmosphereText(place.social_atmosphere)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleVote(place.id, 'upvote')
                      }}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                    >
                      <ThumbsUpIcon className="h-4 w-4" />
                      <span className="text-sm">{place.upvotes}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleVote(place.id, 'downvote')
                      }}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                    >
                      <ThumbsDownIcon className="h-4 w-4" />
                      <span className="text-sm">{place.downvotes}</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    由 {place.submitted_by} 推荐
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Add Place Form */}
      <AddPlaceForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddPlace}
      />
    </>
  )
}
