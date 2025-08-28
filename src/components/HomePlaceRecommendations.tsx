'use client'

import { useState, useEffect } from 'react'
import { 
  MapPinIcon,
  StarIcon,
  WifiIcon,
  DollarSignIcon,
  UsersIcon,
  ArrowRightIcon,
  PlusIcon
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getPlacesByCity } from '@/lib/api'
import { Place } from '@/lib/supabase'
import Link from 'next/link'

export default function HomePlaceRecommendations() {
  const { t } = useTranslation()
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopPlaces()
  }, [])

  const loadTopPlaces = async () => {
    setLoading(true)
    try {
      // 获取当前城市的热门地点
      const data = await getPlacesByCity('osaka') // 默认大阪
      const transformedData: Place[] = data.map((item: any) => ({
        ...item,
        upvotes: item.upvotes || 0,
        downvotes: item.downvotes || 0,
        rating: item.rating || 0,
        review_count: item.review_count || 0
      }))
      
      // 按评分排序，取前6个
      const topPlaces = transformedData
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6)
      
      setPlaces(topPlaces)
    } catch (error) {
      console.error('Error loading places:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      cafe: '☕',
      coworking: '💻',
      coliving: '🏠',
      restaurant: '🍽',
      outdoor: '🌳',
      other: '📍'
    }
    return icons[category as keyof typeof icons] || icons.other
  }

  const getCategoryName = (category: string) => {
    const names = {
      cafe: t('places.categories.cafe'),
      coworking: t('places.categories.coworking'),
      coliving: t('places.categories.coliving'),
      restaurant: t('places.categories.restaurant'),
      outdoor: t('places.categories.outdoor'),
      other: t('places.categories.other')
    }
    return names[category as keyof typeof names] || t('places.categories.other')
  }

  const getPriceLevelText = (level: number) => {
    return '$'.repeat(level)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MapPinIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('places.title')}</h2>
            <p className="text-sm text-gray-600">{t('places.description')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/places"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <span>{t('common.viewDetails')}</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/places"
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            <span>{t('places.addPlace')}</span>
          </Link>
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <Link
            key={place.id}
            href={`/places/${place.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCategoryIcon(place.category)}</span>
                <span className="text-xs text-gray-500">{getCategoryName(place.category)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{place.rating || 0}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{place.name}</h3>
            
            <div className="space-y-1 text-xs text-gray-600">
              {place.wifi_speed && (
                <div className="flex items-center space-x-1">
                  <WifiIcon className="h-3 w-3" />
                  <span>{place.wifi_speed} Mbps</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <DollarSignIcon className="h-3 w-3" />
                <span>{getPriceLevelText(place.price_level)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UsersIcon className="h-3 w-3" />
                <span>{(place.upvotes || 0) - (place.downvotes || 0)} {t('places.recommendations')}</span>
              </div>
            </div>

            {place.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {place.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {places.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">📍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('places.noResults.title')}</h3>
          <p className="text-gray-600 mb-4">{t('places.noResults.description')}</p>
          <Link
            href="/places"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>{t('places.addPlace')}</span>
          </Link>
        </div>
      )}

      {/* Categories Quick Access */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">{t('places.quickBrowse')}</h4>
        <div className="flex flex-wrap gap-2">
                      {[
              { id: 'cafe', name: t('places.categories.cafe'), color: 'bg-orange-100 text-orange-700' },
              { id: 'coworking', name: t('places.categories.coworking'), color: 'bg-blue-100 text-blue-700' },
              { id: 'coliving', name: t('places.categories.coliving'), color: 'bg-green-100 text-green-700' },
              { id: 'restaurant', name: t('places.categories.restaurant'), color: 'bg-red-100 text-red-700' },
              { id: 'outdoor', name: t('places.categories.outdoor'), color: 'bg-purple-100 text-purple-700' }
            ].map((category) => (
            <Link
              key={category.id}
              href={`/places?category=${category.id}`}
              className={`px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity ${category.color}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
