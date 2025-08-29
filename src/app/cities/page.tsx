'use client'

import { useState, useEffect, Suspense } from 'react'
import { SearchIcon, StarIcon, WifiIcon, DollarSignIcon, CloudIcon, UsersIcon, PlusIcon } from 'lucide-react'
import { getCities } from '@/lib/api'
import { City } from '@/lib/supabase'
import { useTranslation } from '@/hooks/useTranslation'
import PageLayout from '@/components/PageLayout'
import FixedLink from '@/components/FixedLink'
import { useUser } from '@/contexts/GlobalStateContext'
import { useNotifications } from '@/contexts/GlobalStateContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { useSearchParams } from 'next/navigation'
import UnifiedVoteSystem, { VoteItem } from '@/components/UnifiedVoteSystem'
import UniversalRecommendationForm, { RecommendationType } from '@/components/UniversalRecommendationForm'

function CitiesPageContent() {
  const { t } = useTranslation()
  const { user } = useUser()
  const { addNotification } = useNotifications()
  const searchParams = useSearchParams()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    // 检查URL参数，如果包含add=true且用户已登录，则显示添加表单
    const shouldShowAddForm = searchParams.get('add') === 'true' && user.isAuthenticated
    if (shouldShowAddForm) {
      setShowAddForm(true)
    }
  }, [searchParams, user.isAuthenticated])

  const fetchCities = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCities()
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
      setError('Failed to load cities. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.country.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'visa-free') return matchesSearch && city.visa_days >= 90
    if (filter === 'digital-nomad') return matchesSearch && city.visa_type.includes('Digital Nomad')
    if (filter === 'low-cost') return matchesSearch && (city.cost_of_living || 0) < 1000
    
    return matchesSearch
  })

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const getVisaColor = (days: number) => {
    if (days >= 365) return 'text-green-600'
    if (days >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleVoteSubmitted = (voteData: any) => {
    console.log('Vote submitted:', voteData)
    addNotification({
      type: 'success',
      message: t('voteSystem.voteSubmitted')
    })
    // 这里可以更新城市数据或触发重新加载
  }

  const handleAddCity = async (cityData: any) => {
    try {
      // TODO: 实现添加城市的API调用
      console.log('Adding new city:', cityData)
      
      // 模拟API调用
      const newCity: City = {
        id: `temp-${Date.now()}`,
        name: cityData.name,
        country: cityData.country,
        country_code: cityData.country_code,
        timezone: cityData.timezone,
        latitude: cityData.latitude || 0,
        longitude: cityData.longitude || 0,
        visa_days: cityData.visa_days,
        visa_type: cityData.visa_type,
        cost_of_living: cityData.cost_of_living,
        wifi_speed: cityData.wifi_speed,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // 添加到本地状态
      setCities(prev => [newCity, ...prev])
      setShowAddForm(false)
      
      addNotification({
        type: 'success',
        message: t('cities.addCitySuccess', { cityName: cityData.name })
      })
    } catch (error) {
      console.error('Error adding city:', error)
      addNotification({
        type: 'error',
        message: t('cities.addCityError')
      })
    }
  }

  if (loading) {
    return (
      <PageLayout pageTitle={t('cities.title')} showPageTitle={true}>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading cities..." />
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout pageTitle={t('cities.title')} showPageTitle={true}>
        <ErrorMessage 
          title="Failed to load cities"
          message={error}
          onRetry={fetchCities}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout pageTitle={t('cities.title')} showPageTitle={true}>
      {/* Header with Add City Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('cities.title')}</h1>
          <p className="text-gray-600 mt-2">Discover digital nomad cities around the world</p>
        </div>
        {user.isAuthenticated && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            {t('cities.addCity')}
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
                placeholder={t('cities.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('cities.filters.all')}
            </button>
            <button
              onClick={() => setFilter('visa-free')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'visa-free' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('cities.filters.visaFree')}
            </button>
            <button
              onClick={() => setFilter('digital-nomad')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'digital-nomad' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('cities.filters.digitalNomad')}
            </button>
            <button
              onClick={() => setFilter('low-cost')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'low-cost' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('cities.filters.lowCost')}
            </button>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      {filteredCities.length === 0 ? (
        <div className="card card-lg text-center py-12">
          <div className="text-gray-500">
            <h3 className="text-lg font-medium mb-2">{t('cities.noResults.title')}</h3>
            <p className="text-sm">{t('cities.noResults.description')}</p>
            {user.isAuthenticated && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary mt-4"
              >
                {t('cities.addCity')}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => {
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
              <div key={city.id} className="card card-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCountryFlag(city.country_code)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{city.name}</h3>
                      <p className="text-sm text-gray-600">{city.country}</p>
                    </div>
                  </div>
                  <UnifiedVoteSystem
                    item={voteItem}
                    variant="quick"
                    onVoteSubmitted={handleVoteSubmitted}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('cities.costOfLiving')}</span>
                    <span className="font-medium">${city.cost_of_living}/month</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('cities.wifiSpeed')}</span>
                    <span className="font-medium">{city.wifi_speed} Mbps</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('cities.visaType')}</span>
                    <span className={`font-medium ${getVisaColor(city.visa_days)}`}>
                      {city.visa_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('cities.stayDays')}</span>
                    <span className="font-medium">{city.visa_days} days</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <FixedLink
                    href={`/cities/${city.id}`}
                    className="btn btn-sm btn-outline w-full"
                  >
                    {t('cities.viewDetails')}
                  </FixedLink>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Universal Recommendation Form */}
      <UniversalRecommendationForm
        type="city"
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddCity}
      />
    </PageLayout>
  )
}

export default function CitiesPage() {
  return (
    <Suspense fallback={
      <PageLayout pageTitle="Cities" showPageTitle={true}>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </PageLayout>
    }>
      <CitiesPageContent />
    </Suspense>
  )
} 