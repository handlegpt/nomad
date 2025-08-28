'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Download, Plus, X } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getCities } from '@/lib/api'
import { City } from '@/lib/supabase'

export default function CityComparison() {
  const { t } = useTranslation()
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [showCitySelector, setShowCitySelector] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const data = await getCities()
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
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

  const getClimateScore = (latitude: number) => {
    const absLat = Math.abs(latitude)
    if (absLat < 23.5) return 90 // Tropical
    if (absLat < 35) return 80 // Subtropical
    if (absLat < 50) return 70 // Temperate
    return 40 // Cold
  }

  const getSocialScore = (city: City) => {
    let score = 50 // Base score
    if (city.visa_type?.includes('Digital Nomad')) score += 30
    if (city.visa_type?.includes('Visa Free')) score += 20
    if (city.cost_of_living && city.cost_of_living < 1500) score += 20
    return Math.min(100, score)
  }

  const addCity = (cityId: string) => {
    if (selectedCities.length < 4 && !selectedCities.includes(cityId)) {
      setSelectedCities([...selectedCities, cityId])
    }
    setShowCitySelector(false)
  }

  const removeCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter(id => id !== cityId))
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
          {t('cityComparison.title')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCitySelector(true)}
            disabled={selectedCities.length >= 4}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{t('cityComparison.addCity')}</span>
          </button>
          {selectedCities.length > 0 && (
            <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
              <Download className="h-4 w-4" />
              <span>{t('cityComparison.exportPDF')}</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载城市数据中...</p>
        </div>
      ) : selectedCities.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{t('cityComparison.select2To4Cities')}</p>
          <button
            onClick={() => setShowCitySelector(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('cityComparison.addCityButton')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* City Headers */}
          <div className="grid grid-cols-5 gap-4">
            <div className="font-semibold text-gray-900">指标</div>
            {selectedCities.map(cityId => {
              const city = cities.find(c => c.id === cityId)
              if (!city) return null
              return (
                <div key={cityId} className="relative">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">{getCountryFlag(city.country_code)} {city.country}</div>
                  </div>
                  <button
                    onClick={() => removeCity(cityId)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Comparison Rows */}
          {[
            { key: 'wifi', label: 'WiFi速度 (Mbps)', getValue: (city: City) => city.wifi_speed || 0 },
            { key: 'cost', label: '生活成本 ($/月)', getValue: (city: City) => city.cost_of_living || 0 },
            { key: 'visa', label: '签证天数', getValue: (city: City) => city.visa_days || 0 },
            { key: 'climate', label: '气候评分', getValue: (city: City) => getClimateScore(city.latitude || 0) },
            { key: 'social', label: '社交氛围', getValue: (city: City) => getSocialScore(city) }
          ].map(metric => (
            <div key={metric.key} className="grid grid-cols-5 gap-4 items-center">
              <div className="font-medium text-gray-700">{metric.label}</div>
              {selectedCities.map(cityId => {
                const city = cities.find(c => c.id === cityId)
                if (!city) return <div key={cityId}></div>
                const value = metric.getValue(city)
                const score = metric.key === 'cost' ? Math.max(0, Math.min(100, (3000 - value) / 30)) : 
                             metric.key === 'visa' ? Math.min(100, value / 3.65) : value
                return (
                  <div key={cityId} className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(score)} ${getScoreColor(score)}`}>
                      {metric.key === 'wifi' ? `${value} Mbps` :
                       metric.key === 'cost' ? `$${value}` :
                       metric.key === 'visa' ? `${value} 天` :
                       `${Math.round(score)}`}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* City Selector Modal */}
      {showCitySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">选择城市</h3>
              <button
                onClick={() => setShowCitySelector(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cities.map(city => (
                <button
                  key={city.id}
                  onClick={() => addCity(city.id)}
                  disabled={selectedCities.includes(city.id)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">{city.name}</div>
                  <div className="text-sm text-gray-500">{getCountryFlag(city.country_code)} {city.country}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
