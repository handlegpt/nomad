'use client'

import { useState } from 'react'
import { BarChart3, Download, Plus, X } from 'lucide-react'

export default function CityComparison() {
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [showCitySelector, setShowCitySelector] = useState(false)

  const availableCities = [
    { id: 'tokyo', name: '东京', country: '日本' },
    { id: 'osaka', name: '大阪', country: '日本' },
    { id: 'bangkok', name: '曼谷', country: '泰国' },
    { id: 'chiang-mai', name: '清迈', country: '泰国' },
    { id: 'bali', name: '巴厘岛', country: '印尼' },
    { id: 'portugal', name: '里斯本', country: '葡萄牙' },
    { id: 'barcelona', name: '巴塞罗那', country: '西班牙' },
    { id: 'mexico-city', name: '墨西哥城', country: '墨西哥' }
  ]

  const comparisonData = {
    'tokyo': {
      name: '东京',
      country: '日本',
      wifi: 85,
      cost: 2500,
      visa: 90,
      climate: 75,
      social: 80
    },
    'osaka': {
      name: '大阪',
      country: '日本',
      wifi: 80,
      cost: 2000,
      visa: 90,
      climate: 70,
      social: 75
    },
    'bangkok': {
      name: '曼谷',
      country: '泰国',
      wifi: 70,
      cost: 1200,
      visa: 30,
      climate: 85,
      social: 90
    }
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
          城市对比
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCitySelector(true)}
            disabled={selectedCities.length >= 4}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>添加城市</span>
          </button>
          {selectedCities.length > 0 && (
            <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
              <Download className="h-4 w-4" />
              <span>导出PDF</span>
            </button>
          )}
        </div>
      </div>

      {selectedCities.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">选择2-4个城市进行对比</p>
          <button
            onClick={() => setShowCitySelector(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始对比
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* City Headers */}
          <div className="grid grid-cols-5 gap-4">
            <div className="font-semibold text-gray-900">指标</div>
            {selectedCities.map(cityId => {
              const city = comparisonData[cityId as keyof typeof comparisonData]
              return (
                <div key={cityId} className="relative">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">{city.country}</div>
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
          {['wifi', 'cost', 'visa', 'climate', 'social'].map(metric => (
            <div key={metric} className="grid grid-cols-5 gap-4 items-center">
              <div className="font-medium text-gray-700">
                {metric === 'wifi' && 'WiFi速度'}
                {metric === 'cost' && '生活成本'}
                {metric === 'visa' && '签证便利'}
                {metric === 'climate' && '气候舒适'}
                {metric === 'social' && '社交氛围'}
              </div>
              {selectedCities.map(cityId => {
                const city = comparisonData[cityId as keyof typeof comparisonData]
                const score = city[metric as keyof typeof city] as number
                return (
                  <div key={cityId} className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(score)} ${getScoreColor(score)}`}>
                      {score}
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
              {availableCities.map(city => (
                <button
                  key={city.id}
                  onClick={() => addCity(city.id)}
                  disabled={selectedCities.includes(city.id)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.country}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
