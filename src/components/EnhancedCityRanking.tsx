'use client'

import { useState, useEffect } from 'react'
import { 
  StarIcon, 
  ThumbsUpIcon, 
  ThumbsDownIcon, 
  MapPinIcon,
  FilterIcon,
  TrendingUpIcon,
  DollarSignIcon,
  WifiIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  Share2Icon,
  RefreshCwIcon,
  ArrowRight
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useNotifications } from '@/contexts/GlobalStateContext'
import { useUser } from '@/contexts/GlobalStateContext'
import { logInfo, logError } from '@/lib/logger'
import { City } from '@/lib/supabase'
import { getCities } from '@/lib/api'
import UnifiedVoteSystem, { VoteItem } from './UnifiedVoteSystem'
import FixedLink from './FixedLink'
import RecentCityVote from './RecentCityVote'

interface EnhancedCityRankingProps {
  limit?: number
  showQuickVote?: boolean
  showCurrentCityVote?: boolean
  showFilters?: boolean
  showPersonalized?: boolean
}

type SortOption = 'rating' | 'votes' | 'cost' | 'wifi' | 'visa'
type FilterOption = 'all' | 'digital-nomad' | 'visa-free' | 'low-cost' | 'high-wifi'

export default function EnhancedCityRanking({ 
  limit = 10, 
  showQuickVote = true,
  showCurrentCityVote = true,
  showFilters = true,
  showPersonalized = true
}: EnhancedCityRankingProps) {
  const { t } = useTranslation()
  const { user } = useUser()
  const [cities, setCities] = useState<City[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentCity, setCurrentCity] = useState<string>('Osaka')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [personalizedCities, setPersonalizedCities] = useState<City[]>([])
  const { addNotification } = useNotifications()

  // 获取真实城市数据
  useEffect(() => {
    fetchCities()
  }, [])

  // 当城市数据或筛选条件变化时，重新筛选和排序
  useEffect(() => {
    filterAndSortCities()
  }, [cities, sortBy, filterBy])

  // 生成个性化推荐
  useEffect(() => {
    if (user.isAuthenticated && cities.length > 0) {
      generatePersonalizedRecommendations()
    }
  }, [cities, user.isAuthenticated])

  const fetchCities = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCities()
      setCities(data)
    } catch (error) {
      logError('Error fetching cities', error, 'EnhancedCityRanking')
      setError('Failed to load cities')
      addNotification({
        type: 'error',
        message: 'Failed to load cities'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCities = () => {
    let filtered = [...cities]

    // 应用筛选
    switch (filterBy) {
      case 'digital-nomad':
        filtered = filtered.filter(city => 
          city.visa_type?.toLowerCase().includes('digital nomad')
        )
        break
      case 'visa-free':
        filtered = filtered.filter(city => 
          city.visa_days >= 90 || city.visa_type?.toLowerCase().includes('visa free')
        )
        break
      case 'low-cost':
        filtered = filtered.filter(city => 
          (city.cost_of_living || 0) < 1500
        )
        break
      case 'high-wifi':
        filtered = filtered.filter(city => 
          (city.wifi_speed || 0) > 50
        )
        break
    }

    // 应用排序
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.avg_overall_rating || 0) - (a.avg_overall_rating || 0))
        break
      case 'votes':
        filtered.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
        break
      case 'cost':
        filtered.sort((a, b) => (a.cost_of_living || 0) - (b.cost_of_living || 0))
        break
      case 'wifi':
        filtered.sort((a, b) => (b.wifi_speed || 0) - (a.wifi_speed || 0))
        break
      case 'visa':
        filtered.sort((a, b) => (b.visa_days || 0) - (a.visa_days || 0))
        break
    }

    setFilteredCities(filtered)
  }

  const generatePersonalizedRecommendations = () => {
    // 基于用户偏好生成推荐
    const userPreferences = user.profile?.preferences || {}
    let scoredCities = cities.map(city => {
      let score = 0
      
      // WiFi偏好
      if (userPreferences.wifi && city.wifi_speed) {
        score += (city.wifi_speed / 100) * userPreferences.wifi
      }
      
      // 成本偏好
      if (userPreferences.cost && city.cost_of_living) {
        const costScore = Math.max(0, 1 - (city.cost_of_living - 1000) / 2000)
        score += costScore * userPreferences.cost
      }
      
      // 签证偏好
      if (userPreferences.visa && city.visa_days) {
        const visaScore = Math.min(1, city.visa_days / 365)
        score += visaScore * userPreferences.visa
      }
      
      return { ...city, personalizedScore: score }
    })

    scoredCities.sort((a, b) => b.personalizedScore - a.personalizedScore)
    setPersonalizedCities(scoredCities.slice(0, 3))
  }

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const getVisaColor = (days: number) => {
    if (days >= 365) return 'text-green-600'
    if (days >= 90) return 'text-blue-600'
    if (days >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCostColor = (cost: number) => {
    if (cost < 1000) return 'text-green-600'
    if (cost < 2000) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getWifiColor = (speed: number) => {
    if (speed >= 100) return 'text-green-600'
    if (speed >= 50) return 'text-blue-600'
    if (speed >= 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleVoteSubmitted = (voteData: any) => {
    logInfo('Vote submitted', voteData, 'EnhancedCityRanking')
    addNotification({
      type: 'success',
      message: t('voteSystem.voteSubmitted')
    })
    // 重新获取数据以更新投票
    fetchCities()
  }

  const handleRefresh = () => {
    fetchCities()
    addNotification({
      type: 'success',
      message: 'Cities data refreshed'
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
        >
          <RefreshCwIcon className="h-4 w-4" />
          <span>Retry</span>
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Header with Filters */}
      {showFilters && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FilterIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Refresh data"
              >
                <RefreshCwIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {filteredCities.length} cities found
            </div>
          </div>

          {/* Filters Panel */}
          {showFiltersPanel && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* Sort Options */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1"
                  >
                    <option value="rating">Rating</option>
                    <option value="votes">Votes</option>
                    <option value="cost">Cost</option>
                    <option value="wifi">WiFi</option>
                    <option value="visa">Visa Days</option>
                  </select>
                </div>

                {/* Filter Options */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Filter by</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1"
                  >
                    <option value="all">All Cities</option>
                    <option value="digital-nomad">Digital Nomad Visa</option>
                    <option value="visa-free">Visa Free</option>
                    <option value="low-cost">Low Cost</option>
                    <option value="high-wifi">High WiFi</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personalized Recommendations */}
      {showPersonalized && user.isAuthenticated && personalizedCities.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUpIcon className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Personalized for You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {personalizedCities.map((city, index) => (
              <div key={city.id} className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getCountryFlag(city.country_code)}</span>
                  <div>
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-xs text-gray-600">{city.country}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <DollarSignIcon className="h-3 w-3" />
                    <span>${city.cost_of_living}/month</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <WifiIcon className="h-3 w-3" />
                    <span>{city.wifi_speed} Mbps</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent City Vote Section */}
      {showCurrentCityVote && (
        <RecentCityVote onVoteSubmitted={() => handleVoteSubmitted({})} />
      )}

      {/* Cities Ranking */}
      <div className="space-y-3">
        {filteredCities.slice(0, limit).map((city, index) => {
          const voteItem: VoteItem = {
            id: city.id,
            name: city.name,
            type: 'city',
            currentVotes: {
              upvotes: Math.floor((city.vote_count || 0) * 0.7),
              downvotes: Math.floor((city.vote_count || 0) * 0.3),
              rating: city.avg_overall_rating
            }
          }

          return (
            <div
              key={city.id}
              className="group bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between p-4">
                {/* Rank and City Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getCountryFlag(city.country_code)}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-600">{city.country}</div>
                    </div>
                  </div>
                </div>

                {/* City Stats */}
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <DollarSignIcon className="h-4 w-4 text-gray-400" />
                    <span className={getCostColor(city.cost_of_living || 0)}>
                      ${city.cost_of_living}/mo
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <WifiIcon className="h-4 w-4 text-gray-400" />
                    <span className={getWifiColor(city.wifi_speed || 0)}>
                      {city.wifi_speed} Mbps
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className={getVisaColor(city.visa_days || 0)}>
                      {city.visa_days} days
                    </span>
                  </div>
                </div>

                {/* Rating and Actions */}
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-gray-900">{city.avg_overall_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="text-xs text-gray-500">({city.vote_count || 0} {t('cities.votes')})</div>
                  </div>

                                     {/* Action Buttons */}
                   <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <FixedLink
                       href={`/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                       className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                     >
                       <EyeIcon className="h-4 w-4" />
                     </FixedLink>
                     <button
                       className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                       title="Add to favorites"
                     >
                       <HeartIcon className="h-4 w-4" />
                     </button>
                     <button
                       className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                       title="Share"
                     >
                       <Share2Icon className="h-4 w-4" />
                     </button>
                   </div>

                  {/* Unified Vote System */}
                  {showQuickVote && (
                    <UnifiedVoteSystem
                      item={voteItem}
                      variant="detailed"
                      showRating={true}
                      onVoteSubmitted={handleVoteSubmitted}
                    />
                  )}
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="md:hidden px-4 pb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <DollarSignIcon className="h-3 w-3" />
                    <span className={getCostColor(city.cost_of_living || 0)}>
                      ${city.cost_of_living}/mo
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <WifiIcon className="h-3 w-3" />
                    <span className={getWifiColor(city.wifi_speed || 0)}>
                      {city.wifi_speed} Mbps
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span className={getVisaColor(city.visa_days || 0)}>
                      {city.visa_days} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More Button */}
      {filteredCities.length > limit && (
        <div className="text-center mt-6">
          <FixedLink
            href="/cities"
            className="btn btn-md btn-outline"
          >
            View All Cities
            <ArrowRight className="h-4 w-4 ml-2" />
          </FixedLink>
        </div>
      )}
    </>
  )
}
