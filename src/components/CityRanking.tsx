'use client'

import { useState, useEffect } from 'react'
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, MapPinIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import VoteModal from './VoteModal'

interface City {
  id: string
  name: string
  country: string
  country_code: string
  avg_overall_rating: number
  vote_count: number
  avg_wifi_rating: number
  avg_social_rating: number
  avg_value_rating: number
  avg_climate_rating: number
}

export default function CityRanking({ limit = 10 }: { limit?: number }) {
  const { t } = useTranslation()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  // 模拟数据
  useEffect(() => {
    const mockCities: City[] = [
      {
        id: '1',
        name: 'Lisbon',
        country: 'Portugal',
        country_code: 'PT',
        avg_overall_rating: 4.8,
        vote_count: 230,
        avg_wifi_rating: 4.5,
        avg_social_rating: 4.9,
        avg_value_rating: 4.7,
        avg_climate_rating: 4.6
      },
      {
        id: '2',
        name: 'Chiang Mai',
        country: 'Thailand',
        country_code: 'TH',
        avg_overall_rating: 4.6,
        vote_count: 190,
        avg_wifi_rating: 4.2,
        avg_social_rating: 4.8,
        avg_value_rating: 4.9,
        avg_climate_rating: 4.5
      },
      {
        id: '3',
        name: 'Tbilisi',
        country: 'Georgia',
        country_code: 'GE',
        avg_overall_rating: 4.4,
        vote_count: 160,
        avg_wifi_rating: 4.0,
        avg_social_rating: 4.3,
        avg_value_rating: 4.8,
        avg_climate_rating: 4.2
      },
      {
        id: '4',
        name: 'Bali',
        country: 'Indonesia',
        country_code: 'ID',
        avg_overall_rating: 4.3,
        vote_count: 150,
        avg_wifi_rating: 3.8,
        avg_social_rating: 4.7,
        avg_value_rating: 4.5,
        avg_climate_rating: 4.9
      },
      {
        id: '5',
        name: 'Medellin',
        country: 'Colombia',
        country_code: 'CO',
        avg_overall_rating: 4.2,
        vote_count: 140,
        avg_wifi_rating: 4.1,
        avg_social_rating: 4.6,
        avg_value_rating: 4.4,
        avg_climate_rating: 4.3
      }
    ]
    setCities(mockCities)
    setLoading(false)
  }, [])

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      'PT': '🇵🇹',
      'TH': '🇹🇭',
      'GE': '🇬🇪',
      'ID': '🇮🇩',
      'CO': '🇨🇴',
      'ES': '🇪🇸',
      'MX': '🇲🇽',
      'AR': '🇦🇷',
      'CZ': '🇨🇿',
      'JP': '🇯🇵'
    }
    return flags[countryCode] || '🌍'
  }

  const handleQuickVote = (cityId: string, voteType: 'up' | 'down') => {
    // 这里可以添加快速投票逻辑
    console.log(`Quick vote: ${voteType} for city ${cityId}`)
  }

  const handleDetailedVote = (city: City) => {
    setSelectedCity(city)
    setShowVoteModal(true)
  }

  const handleVoteSubmitted = (voteData: any) => {
    console.log('Vote submitted:', voteData)
    setShowVoteModal(false)
    setSelectedCity(null)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">加载城市榜单...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {cities.slice(0, limit).map((city, index) => (
          <div
            key={city.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {/* Rank and City Info */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCountryFlag(city.country_code)}</span>
                <div>
                  <div className="font-semibold text-gray-900">{city.name}</div>
                  <div className="text-sm text-gray-600">{city.country}</div>
                </div>
              </div>
            </div>

            {/* Rating and Votes */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">{city.avg_overall_rating}</span>
                </div>
                <div className="text-xs text-gray-500">({city.vote_count}票)</div>
              </div>

              {/* Quick Vote Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuickVote(city.id, 'up')}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded"
                  title="快速点赞"
                >
                  <ThumbsUpIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleQuickVote(city.id, 'down')}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded"
                  title="快速点踩"
                >
                  <ThumbsDownIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Detailed Vote Button */}
              <button
                onClick={() => handleDetailedVote(city)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                投票/详情
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vote Modal */}
      {showVoteModal && selectedCity && (
        <VoteModal
          isOpen={showVoteModal}
          onClose={() => setShowVoteModal(false)}
          onSubmit={handleVoteSubmitted}
          city={selectedCity}
        />
      )}
    </>
  )
}
