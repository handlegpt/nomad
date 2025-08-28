'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  MapPinIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  GridIcon,
  ListIcon,
  StarIcon,
  WifiIcon,
  DollarSignIcon,
  UsersIcon,
  MonitorIcon,
  HomeIcon,
  UtensilsIcon,
  TreePine,
  CoffeeIcon,
  BookOpen,
  GraduationCap,
  ShoppingBag
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getPlacesByCity, getCities, getCategoryIcon, getCategoryName, getPriceLevelText, getNoiseLevelText, getSocialAtmosphereText } from '@/lib/api'
import { Place, City } from '@/lib/supabase'
import Link from 'next/link'
import AddPlaceForm from '@/components/AddPlaceForm'

export default function PlacesPage() {
  const { t } = useTranslation()
  const params = useParams()
  const cityId = params.cityId as string
  
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'recent' | 'popular'>('rating')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadPlaces()
  }, [cityId])

  const loadPlaces = async () => {
    setLoading(true)
    try {
      let allPlaces = []
      
      // 如果cityId是UUID格式，直接使用；否则通过城市名称查找ID
      let targetCityId = cityId
      if (cityId && !cityId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // 不是UUID格式，通过城市名称查找
        const cities = await getCities()
        const targetCity = cities.find((city: City) => city.name.toLowerCase() === cityId.toLowerCase())
        if (targetCity) {
          targetCityId = targetCity.id
        } else {
          // 如果找不到指定城市，使用大阪
          const osakaCity = cities.find((city: City) => city.name.toLowerCase() === 'osaka')
          targetCityId = osakaCity?.id || cities[0]?.id
        }
      }
      
      // 加载本地数据
      const localPlaces = await getPlacesByCity(targetCityId || '')
      allPlaces.push(...localPlaces)
      
      // 如果本地数据不足，加载 Google 数据
      if (localPlaces.length < 5) {
        try {
          const googlePlaces = await fetchGooglePlaces(cityId || 'osaka')
          allPlaces.push(...googlePlaces)
        } catch (error) {
          console.error('Error loading Google Places:', error)
        }
      }
      
      // 去重和排序
      const uniquePlaces = removeDuplicates(allPlaces)
      const sortedPlaces = sortPlaces(uniquePlaces)
      
      setPlaces(sortedPlaces)
    } catch (error) {
      console.error('Error loading places:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchGooglePlaces = async (city: string) => {
    const response = await fetch(`/api/places/google?city=${city}`)
    const data = await response.json()
    return data.places || []
  }
  
  const removeDuplicates = (places: Place[]) => {
    const seen = new Set()
    return places.filter(place => {
      const key = place.name + place.address
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
  
  const sortPlaces = (places: Place[]) => {
    return places.sort((a, b) => {
      // 优先显示本地推荐
      if (a.isFromGoogle && !b.isFromGoogle) return 1
      if (!a.isFromGoogle && b.isFromGoogle) return -1
      
      // 然后按评分排序
      return (b.rating || 0) - (a.rating || 0)
    })
  }

  const handleAddPlace = async (placeData: any) => {
    try {
      // TODO: 实现添加地点的API调用
      console.log('Adding new place:', placeData)
      // 重新加载地点列表
      await loadPlaces()
    } catch (error) {
      console.error('Error adding place:', error)
    }
  }

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'popular':
        return ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0))
      default:
        return 0
    }
  })

  const categories = [
    { id: 'all', name: t('places.categories.all'), icon: <MapPinIcon className="h-4 w-4" /> },
    { id: 'cafe', name: t('places.categories.cafe'), icon: <CoffeeIcon className="h-4 w-4" /> },
    { id: 'coworking', name: t('places.categories.coworking'), icon: <MonitorIcon className="h-4 w-4" /> },
    { id: 'coliving', name: t('places.categories.coliving'), icon: <HomeIcon className="h-4 w-4" /> },
    { id: 'hostel', name: t('places.categories.hostel'), icon: <HomeIcon className="h-4 w-4" /> },
    { id: 'hotel', name: t('places.categories.hotel'), icon: <HomeIcon className="h-4 w-4" /> },
    { id: 'restaurant', name: t('places.categories.restaurant'), icon: <UtensilsIcon className="h-4 w-4" /> },
    { id: 'library', name: t('places.categories.library'), icon: <BookOpen className="h-4 w-4" /> },
    { id: 'park', name: t('places.categories.park'), icon: <TreePine className="h-4 w-4" /> },
    { id: 'university', name: t('places.categories.university'), icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'shopping', name: t('places.categories.shopping'), icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 'other', name: t('places.categories.other'), icon: <MapPinIcon className="h-4 w-4" /> }
  ]

  const sortOptions = [
    { value: 'rating', label: t('places.sortBy.rating') },
    { value: 'recent', label: t('places.sortBy.recent') },
    { value: 'popular', label: t('places.sortBy.popular') }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">{t('common.loading')}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('places.title')}</h1>
              <p className="text-sm sm:text-base text-gray-600">{t('places.description')}</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{t('places.addPlace')}</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('places.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors text-sm ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Sort and View Mode */}
            <div className="flex items-center justify-between">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <GridIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {t('places.foundResults', { count: sortedPlaces.length.toString() })}
          </p>
        </div>

        {/* Places Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedPlaces.map((place) => (
              <Link key={place.id} href={`/places/${place.id}`}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl sm:text-2xl">{getCategoryIcon(place.category)}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{place.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{getCategoryName(place.category)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">{place.rating || 0}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{place.description}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        {place.wifi_speed && (
                          <div className="flex items-center space-x-1">
                            <WifiIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{place.wifi_speed} Mbps</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <DollarSignIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{getPriceLevelText(place.price_level)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{place.review_count || 0} {t('places.reviews')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sortedPlaces.map((place) => (
              <Link key={place.id} href={`/places/${place.id}`}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{getCategoryIcon(place.category)}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{place.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{getCategoryName(place.category)}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{place.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                          <span className="text-xs sm:text-sm font-medium">{place.rating || 0}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">{place.review_count || 0} {t('places.reviews')}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                          {place.wifi_speed && (
                            <div className="flex items-center space-x-1">
                              <WifiIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{place.wifi_speed} Mbps</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <DollarSignIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{getPriceLevelText(place.price_level)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedPlaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPinIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('places.noResults.title')}</h3>
            <p className="text-gray-600">{t('places.noResults.description')}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{t('places.addPlace')}</span>
            </button>
          </div>
        )}

        {/* Add Place Form Modal */}
        <AddPlaceForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddPlace}
        />
      </div>
    </div>
  )
}
