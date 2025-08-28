'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  MapPinIcon, 
  WifiIcon, 
  DollarSignIcon, 
  UsersIcon, 
  Volume2Icon,
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CalendarIcon,
  MessageSquareIcon,
  ShareIcon,
  BookmarkIcon,
  CoffeeIcon,
  MonitorIcon,
  HomeIcon,
  UtensilsIcon,
  TreePine,
  ArrowLeftIcon
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getPlacesByCity, getCategoryIcon, getCategoryName, getPriceLevelText, getNoiseLevelText, getSocialAtmosphereText } from '@/lib/api'
import { Place } from '@/lib/supabase'

interface Review {
  id: string
  user_name: string
  rating: number
  review: string
  pros: string[]
  cons: string[]
  visit_date: string
  created_at: string
}

export default function PlaceDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const placeId = params.id as string
  
  const [place, setPlace] = useState<Place | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'map'>('overview')

  // 模拟数据
  useEffect(() => {
    const mockPlace: Place = {
      id: placeId,
      name: 'Blue Bottle Coffee',
      category: 'cafe',
      city_id: 'osaka',
      address: '大阪市中央区心斋桥1-1-1',
      latitude: 34.6937,
      longitude: 135.5023,
      description: '环境安静，WiFi稳定，咖啡品质很好，适合长时间工作。这里有很多数字游民在工作，氛围很好。咖啡师很专业，咖啡豆都是精选的。座位舒适，有足够的插座。',
      tags: ['安静', 'WiFi快', '咖啡好', '插座多', '氛围好'],
      wifi_speed: 85,
      price_level: 3,
      noise_level: 'quiet',
      social_atmosphere: 'low',
      submitted_by: '张三',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      upvotes: 45,
      downvotes: 2,
      rating: 4.8,
      review_count: 23
    }

    const mockReviews: Review[] = [
      {
        id: '1',
        user_name: '李四',
        rating: 5,
        review: '非常棒的咖啡馆！WiFi速度很快，咖啡品质一流。环境安静，非常适合工作。价格虽然不便宜，但物有所值。',
        pros: ['WiFi快', '咖啡好', '安静'],
        cons: ['价格稍贵'],
        visit_date: '2024-01-20',
        created_at: '2024-01-20'
      },
      {
        id: '2',
        user_name: '王五',
        rating: 4,
        review: '整体不错，座位舒适，有足够的插座。咖啡味道很好，但有时候会比较拥挤。',
        pros: ['座位舒适', '插座多', '咖啡好'],
        cons: ['有时拥挤'],
        visit_date: '2024-01-18',
        created_at: '2024-01-18'
      }
    ]

    setPlace(mockPlace)
    setReviews(mockReviews)
    setLoading(false)
  }, [placeId])

  const handleVote = (voteType: 'upvote' | 'downvote') => {
    if (!place) return
    
    setPlace(prev => {
      if (!prev) return prev
      return {
        ...prev,
        upvotes: voteType === 'upvote' ? (prev.upvotes || 0) + 1 : (prev.upvotes || 0),
        downvotes: voteType === 'downvote' ? (prev.downvotes || 0) + 1 : (prev.downvotes || 0)
      }
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cafe': return <CoffeeIcon className="h-6 w-6" />
      case 'coworking': return <MonitorIcon className="h-6 w-6" />
      case 'coliving': return <HomeIcon className="h-6 w-6" />
      case 'restaurant': return <UtensilsIcon className="h-6 w-6" />
      case 'outdoor': return <TreePine className="h-6 w-6" />
      default: return <MapPinIcon className="h-6 w-6" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">地点未找到</h2>
          <p className="text-gray-600">该地点可能已被删除或不存在</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{place.name}</h1>
              <p className="text-gray-600 flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{place.address}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <ShareIcon className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <BookmarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Place Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                    {getCategoryIcon(place.category)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{place.name}</h2>
                    <p className="text-gray-600">{getCategoryName(place.category)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{place.rating}</span>
                        <span className="text-gray-500">({place.review_count})</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{getPriceLevelText(place.price_level)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote('upvote')}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  >
                    <ThumbsUpIcon className="h-5 w-5" />
                    <span className="font-medium">{place.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote('downvote')}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <ThumbsDownIcon className="h-5 w-5" />
                    <span className="font-medium">{place.downvotes}</span>
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{place.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {place.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {place.wifi_speed && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <WifiIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{place.wifi_speed} Mbps</div>
                    <div className="text-sm text-gray-600">WiFi速度</div>
                  </div>
                )}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSignIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{getPriceLevelText(place.price_level)}</div>
                  <div className="text-sm text-gray-600">价格水平</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Volume2Icon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{getNoiseLevelText(place.noise_level)}</div>
                  <div className="text-sm text-gray-600">噪音水平</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">社交{getSocialAtmosphereText(place.social_atmosphere)}</div>
                  <div className="text-sm text-gray-600">社交氛围</div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquareIcon className="h-5 w-5 mr-2" />
                  评价 ({reviews.length})
                </h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  写评价
                </button>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.user_name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{review.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{review.visit_date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.review}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {review.pros.map((pro, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          👍 {pro}
                        </span>
                      ))}
                      {review.cons.map((con, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          👎 {con}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  导航到这里
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  分享给朋友
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  添加到收藏
                </button>
              </div>
            </div>

            {/* Place Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">地点信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">推荐时间：{place.created_at}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">推荐者：{place.submitted_by}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ThumbsUpIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">推荐度：{place.upvotes - place.downvotes}</span>
                </div>
              </div>
            </div>

            {/* Similar Places */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">相似地点</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-gray-900">Starbucks 心斋桥店</div>
                  <div className="text-sm text-gray-600">☕ 咖啡馆 • 4.2分</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-gray-900">Tully's Coffee</div>
                  <div className="text-sm text-gray-600">☕ 咖啡馆 • 4.0分</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
