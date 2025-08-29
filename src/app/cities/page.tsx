'use client'

import { useState, useEffect } from 'react'
import { SearchIcon, StarIcon, WifiIcon, DollarSignIcon, CloudIcon, UsersIcon, PlusIcon } from 'lucide-react'
import { getCities } from '@/lib/api'
import { City } from '@/lib/supabase'
import { useTranslation } from '@/hooks/useTranslation'
import Header from '@/components/Header'
import FixedLink from '@/components/FixedLink'
import AddCityForm from '@/components/AddCityForm'
import { useUser } from '@/contexts/GlobalStateContext'
import { useNotifications } from '@/contexts/GlobalStateContext'

export default function CitiesPage() {
  const { t } = useTranslation()
  const { user } = useUser()
  const { addNotification } = useNotifications()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    setLoading(true)
    try {
      const data = await getCities()
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
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

  const handleVote = (cityId: string) => {
    // TODO: Implement voting functionality
    console.log('Voting for city:', cityId)
    // In production, this would call an API to record the vote
    const city = cities.find(c => c.id === cityId)
    if (city) {
      alert(`感谢您对 ${city.name} 的关注！\n\n投票功能正在开发中，即将推出。\n\n您可以先查看城市详情了解更多信息。`)
    } else {
      alert(t('cities.votingComingSoon'))
    }
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
      
      addNotification({
        type: 'success',
        message: `成功推荐城市：${cityData.name}`,
        duration: 5000
      })
      
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding city:', error)
      addNotification({
        type: 'error',
        message: '添加城市失败，请重试',
        duration: 5000
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">🌍 {t('cities.title')}</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>推荐城市</span>
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('cities.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t('cities.filters.all')}</option>
            <option value="visa-free">{t('cities.filters.visaFree')}</option>
            <option value="digital-nomad">{t('cities.filters.digitalNomad')}</option>
            <option value="low-cost">{t('cities.filters.lowCost')}</option>
          </select>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div key={city.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {city.name} {getCountryFlag(city.country_code)}
                    </h3>
                    <p className="text-gray-600">{city.country}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSignIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{t('cities.costOfLiving')}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${city.cost_of_living || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <WifiIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{t('cities.wifiSpeed')}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {city.wifi_speed || 'N/A'} Mbps
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600">{t('cities.visaType')}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {city.visa_type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CloudIcon className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{t('cities.stayDays')}</span>
                    </div>
                    <span className={`font-semibold ${getVisaColor(city.visa_days)}`}>
                      {city.visa_days} 天
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <FixedLink 
                    href={`/cities/${city.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                  >
                    {t('cities.viewDetails')}
                  </FixedLink>
                  <button 
                    onClick={() => handleVote(city.id)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    {t('cities.vote')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('cities.noResults.title')}</h3>
            <p className="text-gray-600 mb-4">{t('cities.noResults.description')}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>推荐第一个城市</span>
            </button>
          </div>
        )}
      </div>

      {/* Add City Form */}
      <AddCityForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddCity}
      />
    </div>
  )
} 