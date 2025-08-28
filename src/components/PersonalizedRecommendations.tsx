'use client'

import { useState, useEffect } from 'react'
import { SparklesIcon, MapPinIcon, StarIcon, FilterIcon } from 'lucide-react'
import { getCities } from '@/lib/api'
import { City } from '@/lib/supabase'

interface Preference {
  id: string
  label: string
  weight: number
}

const preferences: Preference[] = [
  { id: 'wifi', label: 'WiFi质量', weight: 0 },
  { id: 'cost', label: '生活成本', weight: 0 },
  { id: 'climate', label: '气候舒适度', weight: 0 },
  { id: 'social', label: '社交氛围', weight: 0 },
  { id: 'visa', label: '签证便利性', weight: 0 }
]

export default function PersonalizedRecommendations() {
  const [cities, setCities] = useState<City[]>([])
  const [userPreferences, setUserPreferences] = useState(preferences)
  const [recommendations, setRecommendations] = useState<City[]>([])
  const [loading, setLoading] = useState(false)

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

  const handlePreferenceChange = (id: string, weight: number) => {
    setUserPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, weight } : pref
      )
    )
  }

  const generateRecommendations = () => {
    setLoading(true)
    
    // 模拟推荐算法
    setTimeout(() => {
      const scoredCities = cities.map(city => {
        let score = 0
        
        // WiFi评分
        if (userPreferences.find(p => p.id === 'wifi')?.weight || 0 > 0) {
          score += (city.wifi_speed || 50) * (userPreferences.find(p => p.id === 'wifi')?.weight || 0) / 100
        }
        
        // 成本评分（成本越低分数越高）
        if (userPreferences.find(p => p.id === 'cost')?.weight || 0 > 0) {
          const costWeight = userPreferences.find(p => p.id === 'cost')?.weight || 0
          const costScore = Math.max(0, 2000 - (city.cost_of_living || 1000)) / 2000 * 100
          score += costScore * costWeight / 100
        }
        
        // 签证评分
        if (userPreferences.find(p => p.id === 'visa')?.weight || 0 > 0) {
          const visaWeight = userPreferences.find(p => p.id === 'visa')?.weight || 0
          const visaScore = Math.min(100, (city.visa_days || 30) / 365 * 100)
          score += visaScore * visaWeight / 100
        }
        
        return { ...city, score }
      })
      
      const sortedCities = scoredCities
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
      
      setRecommendations(sortedCities)
      setLoading(false)
    }, 1000)
  }

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <SparklesIcon className="h-5 w-5 text-purple-500 mr-2" />
          AI 个性化推荐
        </h2>
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {loading ? '生成中...' : '生成推荐'}
        </button>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <FilterIcon className="h-4 w-4 mr-2" />
          你的偏好设置
        </h3>
        <div className="space-y-4">
          {userPreferences.map((preference) => (
            <div key={preference.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{preference.label}</span>
                <span className="text-sm text-gray-500">{preference.weight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={preference.weight}
                onChange={(e) => handlePreferenceChange(preference.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">为你推荐的城市</h3>
          <div className="space-y-4">
            {recommendations.map((city, index) => (
              <div key={city.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {city.name} {getCountryFlag(city.country_code)}
                      </div>
                      <div className="text-sm text-gray-500">{city.country}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">{Math.round(city.score)}</span>
                    </div>
                    <div className="text-xs text-gray-500">匹配度</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">WiFi速度：</span>
                    <span className="font-medium">{city.wifi_speed || 'N/A'} Mbps</span>
                  </div>
                  <div>
                    <span className="text-gray-600">生活成本：</span>
                    <span className="font-medium">${city.cost_of_living || 'N/A'}/月</span>
                  </div>
                  <div>
                    <span className="text-gray-600">签证类型：</span>
                    <span className="font-medium">{city.visa_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">停留天数：</span>
                    <span className="font-medium">{city.visa_days} 天</span>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    查看详情
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    添加到收藏
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && !loading && (
        <div className="text-center py-8">
          <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">设置你的偏好，获取个性化城市推荐</p>
        </div>
      )}
    </div>
  )
}
