'use client'

import { useState, useEffect } from 'react'
import { SparklesIcon, MapPinIcon, StarIcon, FilterIcon } from 'lucide-react'
import { getCities } from '@/lib/api'
import { City } from '@/lib/supabase'
import { useTranslation } from '@/hooks/useTranslation'

interface Preference {
  id: string
  label: string
  weight: number
}

interface ScoredCity extends City {
  score: number
}

export default function PersonalizedRecommendations() {
  const { t } = useTranslation()
  
  const preferences: Preference[] = [
    { id: 'wifi', label: t('preferences.wifiQuality'), weight: 20 },
    { id: 'cost', label: t('preferences.costOfLiving'), weight: 25 },
    { id: 'climate', label: t('preferences.climateComfort'), weight: 20 },
    { id: 'social', label: t('preferences.socialAtmosphere'), weight: 15 },
    { id: 'visa', label: t('preferences.visaConvenience'), weight: 20 }
  ]
  const [cities, setCities] = useState<City[]>([])
  const [userPreferences, setUserPreferences] = useState(preferences)
  const [recommendations, setRecommendations] = useState<ScoredCity[]>([])
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

  const applyPreset = (preset: string) => {
    const presets = {
      'budget': [
        { id: 'wifi', weight: 15 },
        { id: 'cost', weight: 40 },
        { id: 'climate', weight: 20 },
        { id: 'social', weight: 15 },
        { id: 'visa', weight: 10 }
      ],
      'digital': [
        { id: 'wifi', weight: 35 },
        { id: 'cost', weight: 20 },
        { id: 'climate', weight: 15 },
        { id: 'social', weight: 20 },
        { id: 'visa', weight: 10 }
      ],
      'social': [
        { id: 'wifi', weight: 15 },
        { id: 'cost', weight: 20 },
        { id: 'climate', weight: 20 },
        { id: 'social', weight: 35 },
        { id: 'visa', weight: 10 }
      ],
      'balanced': [
        { id: 'wifi', weight: 20 },
        { id: 'cost', weight: 25 },
        { id: 'climate', weight: 20 },
        { id: 'social', weight: 15 },
        { id: 'visa', weight: 20 }
      ]
    }
    
    const selectedPreset = presets[preset as keyof typeof presets]
    if (selectedPreset) {
      setUserPreferences(prev => 
        prev.map(pref => {
          const presetItem = selectedPreset.find(p => p.id === pref.id)
          return presetItem ? { ...pref, weight: presetItem.weight } : pref
        })
      )
    }
  }

  const generateRecommendations = () => {
    setLoading(true)
    
    // Enhanced AI recommendation algorithm
    setTimeout(() => {
      const scoredCities: ScoredCity[] = cities.map(city => {
        let score = 0
        let totalWeight = 0
        
        // WiFi rating (0-100 scale)
        const wifiWeight = userPreferences.find(p => p.id === 'wifi')?.weight || 0
        if (wifiWeight > 0) {
          const wifiScore = Math.min(100, (city.wifi_speed || 50) * 2) // Scale up WiFi speed
          score += wifiScore * wifiWeight
          totalWeight += wifiWeight
        }
        
        // Cost rating (lower cost = higher score, 0-100 scale)
        const costWeight = userPreferences.find(p => p.id === 'cost')?.weight || 0
        if (costWeight > 0) {
          const maxCost = 3000 // Maximum expected cost
          const costScore = Math.max(0, Math.min(100, (maxCost - (city.cost_of_living || 1500)) / maxCost * 100))
          score += costScore * costWeight
          totalWeight += costWeight
        }
        
        // Climate rating (based on latitude and timezone)
        const climateWeight = userPreferences.find(p => p.id === 'climate')?.weight || 0
        if (climateWeight > 0) {
          const absLat = Math.abs(city.latitude || 0)
          let climateScore = 0
          if (absLat < 23.5) climateScore = 90 // Tropical
          else if (absLat < 35) climateScore = 80 // Subtropical
          else if (absLat < 50) climateScore = 70 // Temperate
          else climateScore = 40 // Cold
          score += climateScore * climateWeight
          totalWeight += climateWeight
        }
        
        // Social atmosphere (based on visa type and cost)
        const socialWeight = userPreferences.find(p => p.id === 'social')?.weight || 0
        if (socialWeight > 0) {
          let socialScore = 50 // Base score
          if (city.visa_type?.includes('Digital Nomad')) socialScore += 30
          if (city.visa_type?.includes('Visa Free')) socialScore += 20
          if (city.cost_of_living && city.cost_of_living < 1500) socialScore += 20
          socialScore = Math.min(100, socialScore)
          score += socialScore * socialWeight
          totalWeight += socialWeight
        }
        
        // Visa convenience (0-100 scale)
        const visaWeight = userPreferences.find(p => p.id === 'visa')?.weight || 0
        if (visaWeight > 0) {
          let visaScore = 0
          if (city.visa_type?.includes('Visa Free')) visaScore = 100
          else if (city.visa_type?.includes('Digital Nomad')) visaScore = 90
          else if (city.visa_days && city.visa_days >= 180) visaScore = 80
          else if (city.visa_days && city.visa_days >= 90) visaScore = 60
          else if (city.visa_days && city.visa_days >= 30) visaScore = 40
          else visaScore = 20
          score += visaScore * visaWeight
          totalWeight += visaWeight
        }
        
        // Calculate final weighted score
        const finalScore = totalWeight > 0 ? score / totalWeight : 0
        
        return { ...city, score: Math.round(finalScore) }
      })
      
      const sortedCities = scoredCities
        .filter(city => city.score > 0) // Only show cities with positive scores
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
          {t('recommendations.title')}
        </h2>
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {loading ? t('recommendations.generating') : t('recommendations.generate')}
        </button>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <FilterIcon className="h-4 w-4 mr-2" />
          {t('recommendations.preferences')}
        </h3>
        
        {/* Preset Options */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">快速选择偏好配置：</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('budget')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              预算优先
            </button>
            <button
              onClick={() => applyPreset('digital')}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              数字游民
            </button>
            <button
              onClick={() => applyPreset('social')}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
            >
              社交优先
            </button>
            <button
              onClick={() => applyPreset('balanced')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              平衡配置
            </button>
          </div>
        </div>
        
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
          <h3 className="font-semibold text-gray-900 mb-4">{t('recommendations.recommendedCities')}</h3>
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
                    <div className="text-xs text-gray-500">{t('recommendations.matchScore')}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t('recommendations.wifiSpeed')}：</span>
                    <span className="font-medium">{city.wifi_speed || 'N/A'} Mbps</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('recommendations.costOfLiving')}：</span>
                    <span className="font-medium">${city.cost_of_living || 'N/A'}/月</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('recommendations.visaType')}：</span>
                    <span className="font-medium">{city.visa_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('recommendations.stayDays')}：</span>
                    <span className="font-medium">{city.visa_days} {t('recommendations.days')}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    {t('recommendations.viewDetails')}
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    {t('recommendations.addToFavorites')}
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
          <p className="text-gray-500">{t('recommendations.setPreferences')}</p>
        </div>
      )}
    </div>
  )
}
