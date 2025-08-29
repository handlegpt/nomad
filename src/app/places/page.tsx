'use client'

import { useState, useEffect } from 'react'
import { SearchIcon, StarIcon, WifiIcon, DollarSignIcon, MapPinIcon, PlusIcon } from 'lucide-react'
import { getPlaces } from '@/lib/api'
import { Place } from '@/lib/supabase'
import { useTranslation } from '@/hooks/useTranslation'
import PageLayout from '@/components/PageLayout'
import FixedLink from '@/components/FixedLink'
import { useUser } from '@/contexts/GlobalStateContext'
import { useNotifications } from '@/contexts/GlobalStateContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import UnifiedVoteSystem, { VoteItem } from '@/components/UnifiedVoteSystem'
import UniversalRecommendationForm, { RecommendationType } from '@/components/UniversalRecommendationForm'

export default function PlacesPage() {
  const { t } = useTranslation()
  const { user } = useUser()
  const { addNotification } = useNotifications()
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPlaces()
      setPlaces(data)
    } catch (error) {
      console.error('Error fetching places:', error)
      setError('Failed to load places. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (categoryFilter === 'all') return matchesSearch
    return matchesSearch && place.category === categoryFilter
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cafe':
        return '☕'
      case 'coworking':
        return '💻'
      case 'coliving':
        return '🏠'
      case 'restaurant':
        return '🍽'
      case 'park':
        return '🌳'
      default:
        return '📍'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'cafe':
        return t('places.categories.cafe')
      case 'coworking':
        return t('places.categories.coworking')
      case 'coliving':
        return t('places.categories.coliving')
      case 'restaurant':
        return t('places.categories.restaurant')
      case 'park':
        return t('places.categories.park')
      default:
        return t('places.categories.other')
    }
  }

  const getPriceLevelText = (level: number) => {
    switch (level) {
      case 1:
        return '$'
      case 2:
        return '$$'
      case 3:
        return '$$$'
      case 4:
        return '$$$$'
      case 5:
        return '$$$$$'
      default:
        return '$$$'
    }
  }

  const handleVoteSubmitted = (voteData: any) => {
    console.log('Vote submitted:', voteData)
    addNotification({
      type: 'success',
      message: t('voteSystem.voteSubmitted')
    })
    // 这里可以更新地点数据或触发重新加载
  }

  const handleAddPlace = async (placeData: any) => {
    try {
      // TODO: 实现添加地点的API调用
      console.log('Adding new place:', placeData)
      
      // 模拟API调用
      const newPlace: Place = {
        id: `temp-${Date.now()}`,
        name: placeData.name,
        category: placeData.category,
        address: placeData.address,
        description: placeData.description,
        tags: placeData.tags || [],
        wifi_speed: placeData.wifi_speed,
        price_level: placeData.price_level,
        noise_level: placeData.noise_level,
        social_atmosphere: placeData.social_atmosphere,
        city_id: 'default-city',
        submitted_by: placeData.submitted_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // 添加到本地状态
      setPlaces(prev => [newPlace, ...prev])
      setShowAddForm(false)
      
      addNotification({
        type: 'success',
        message: t('places.addPlaceSuccess', { placeName: placeData.name })
      })
    } catch (error) {
      console.error('Error adding place:', error)
      addNotification({
        type: 'error',
        message: t('places.addPlaceError')
      })
    }
  }

  if (loading) {
    return (
      <PageLayout pageTitle={t('places.title')} showPageTitle={true}>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading places..." />
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout pageTitle={t('places.title')} showPageTitle={true}>
        <ErrorMessage 
          title="Failed to load places"
          message={error}
          onRetry={fetchPlaces}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout pageTitle={t('places.title')} showPageTitle={true}>
      {/* Header with Add Place Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('places.title')}</h1>
          <p className="text-gray-600 mt-2">Discover amazing places for digital nomads</p>
        </div>
        {user.isAuthenticated && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            {t('places.addPlace')}
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="card card-md mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('places.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('places.filters.all')}
            </button>
            <button
              onClick={() => setCategoryFilter('cafe')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'cafe' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('places.filters.cafe')}
            </button>
            <button
              onClick={() => setCategoryFilter('coworking')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'coworking' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('places.filters.coworking')}
            </button>
            <button
              onClick={() => setCategoryFilter('restaurant')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'restaurant' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('places.filters.restaurant')}
            </button>
          </div>
        </div>
      </div>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="card card-lg text-center py-12">
          <div className="text-gray-500">
            <h3 className="text-lg font-medium mb-2">{t('places.noResults.title')}</h3>
            <p className="text-sm">{t('places.noResults.description')}</p>
            {user.isAuthenticated && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary mt-4"
              >
                {t('places.addPlace')}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            const voteItem: VoteItem = {
              id: place.id,
              name: place.name,
              type: 'place',
              currentVotes: {
                upvotes: Math.floor((place.upvotes || 0) * 0.7),
                downvotes: Math.floor((place.downvotes || 0) * 0.3),
                rating: place.avg_rating
              }
            }

            return (
              <div key={place.id} className="card card-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(place.category)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{place.name}</h3>
                      <p className="text-sm text-gray-600">{getCategoryName(place.category)}</p>
                    </div>
                  </div>
                  <UnifiedVoteSystem
                    item={voteItem}
                    variant="quick"
                    onVoteSubmitted={handleVoteSubmitted}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="truncate">{place.address}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">{place.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('places.wifiSpeed')}</span>
                    <span className="font-medium">{place.wifi_speed || 'N/A'} Mbps</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('places.priceLevel')}</span>
                    <span className="font-medium">{getPriceLevelText(place.price_level)}</span>
                  </div>
                  
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {place.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {place.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{place.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <FixedLink
                    href={`/places/${place.id}`}
                    className="btn btn-sm btn-outline w-full"
                  >
                    {t('places.viewDetails')}
                  </FixedLink>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Universal Recommendation Form */}
      <UniversalRecommendationForm
        type="place"
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddPlace}
      />
    </PageLayout>
  )
}
