'use client'

import { useState, useEffect } from 'react'
import { BarChart3Icon, PlusIcon, XIcon, DownloadIcon } from 'lucide-react'
import { getCities } from '@/lib/api'
import { City } from '@/lib/supabase'

export default function CityComparison() {
  const [cities, setCities] = useState<City[]>([])
  const [selectedCities, setSelectedCities] = useState<City[]>([])
  const [showCitySelector, setShowCitySelector] = useState(false)

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const data = await getCities()
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const addCity = (city: City) => {
    if (selectedCities.length < 4 && !selectedCities.find(c => c.id === city.id)) {
      setSelectedCities(prev => [...prev, city])
    }
    setShowCitySelector(false)
  }

  const removeCity = (cityId: string) => {
    setSelectedCities(prev => prev.filter(c => c.id !== cityId))
  }

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const getScoreColor = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const exportComparison = () => {
    // 模拟导出PDF功能
    alert('导出功能需要高级订阅')
  }

  const comparisonMetrics = [
    {
      key: 'wifi_speed',
      label: 'WiFi速度 (Mbps)',
      format: (value: number) => `${value || 'N/A'} Mbps`,
      maxValue: 200
    },
    {
      key: 'cost_of_living',
      label: '生活成本 ($/月)',
      format: (value: number) => `$${value || 'N/A'}`,
      maxValue: 3000,
      reverse: true // 成本越低越好
    },
    {
      key: 'visa_days',
      label: '签证天数',
      format: (value: number) => `${value || 'N/A'} 天`,
      maxValue: 365
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3Icon className="h-5 w-5 text-blue-500 mr-2" />
          城市对比
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportComparison}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <DownloadIcon className="h-4 w-4" />
            <span>导出PDF</span>
          </button>
          <button
            onClick={() => setShowCitySelector(true)}
            disabled={selectedCities.length >= 4}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected Cities */}
      {selectedCities.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedCities.map((city) => (
              <div key={city.id} className="p-4 border border-gray-200 rounded-xl relative">
                <button
                  onClick={() => removeCity(city.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <div className="text-2xl mb-2">{getCountryFlag(city.country_code)}</div>
                  <div className="font-semibold text-gray-900">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      {selectedCities.length >= 2 && (
        <div className="space-y-6">
          {comparisonMetrics.map((metric) => (
            <div key={metric.key} className="space-y-3">
              <h3 className="font-semibold text-gray-900">{metric.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedCities.map((city) => {
                  const value = city[metric.key as keyof City] as number
                  const displayValue = metric.reverse ? (metric.maxValue - (value || 0)) : (value || 0)
                  const percentage = (displayValue / metric.maxValue) * 100
                  
                  return (
                    <div key={city.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{city.name}</span>
                        <span className="text-gray-600">{metric.format(value)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getScoreColor(displayValue, metric.maxValue)}`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCities.length === 0 && (
        <div className="text-center py-8">
          <BarChart3Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">选择2-4个城市进行对比</p>
          <button
            onClick={() => setShowCitySelector(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加城市
          </button>
        </div>
      )}

      {/* City Selector Modal */}
      {showCitySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">选择城市</h3>
                <button
                  onClick={() => setShowCitySelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-2">
                {cities
                  .filter(city => !selectedCities.find(c => c.id === city.id))
                  .map((city) => (
                    <button
                      key={city.id}
                      onClick={() => addCity(city)}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getCountryFlag(city.country_code)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{city.name}</div>
                          <div className="text-sm text-gray-500">{city.country}</div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
