'use client'

import { useState, useEffect } from 'react'
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, MapPinIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import VoteModal from './VoteModal'
import { City } from '@/lib/supabase'

interface EnhancedCityRankingProps {
  limit?: number
  showQuickVote?: boolean
  showCurrentCityVote?: boolean
}

export default function EnhancedCityRanking({ 
  limit = 10, 
  showQuickVote = true,
  showCurrentCityVote = true 
}: EnhancedCityRankingProps) {
  const { t } = useTranslation()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [currentCity, setCurrentCity] = useState<string>('Osaka')

  // 模拟数据
  useEffect(() => {
    const mockCities: City[] = [
      {
        id: '1',
        name: 'Lisbon',
        country: 'Portugal',
        country_code: 'PT',
        timezone: 'Europe/Lisbon',
        latitude: 38.7223,
        longitude: -9.1393,
        visa_days: 365,
        visa_type: 'Digital Nomad Visa',
        cost_of_living: 2000,
        wifi_speed: 100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        avg_overall_rating: 4.8,
        vote_count: 230
      },
      {
        id: '2',
        name: 'Chiang Mai',
        country: 'Thailand',
        country_code: 'TH',
        timezone: 'Asia/Bangkok',
        latitude: 18.7883,
        longitude: 98.9853,
        visa_days: 60,
        visa_type: 'Tourist Visa',
        cost_of_living: 1200,
        wifi_speed: 50,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        avg_overall_rating: 4.6,
        vote_count: 190
      },
      {
        id: '3',
        name: 'Tbilisi',
        country: 'Georgia',
        country_code: 'GE',
        timezone: 'Asia/Tbilisi',
        latitude: 41.7151,
        longitude: 44.8271,
        visa_days: 365,
        visa_type: 'Visa Free',
        cost_of_living: 1200,
        wifi_speed: 30,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        avg_overall_rating: 4.4,
        vote_count: 160
      },
      {
        id: '4',
        name: 'Bali',
        country: 'Indonesia',
        country_code: 'ID',
        timezone: 'Asia/Jakarta',
        latitude: -8.3405,
        longitude: 115.0920,
        visa_days: 30,
        visa_type: 'Visa on Arrival',
        cost_of_living: 1500,
        wifi_speed: 25,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        avg_overall_rating: 4.3,
        vote_count: 150
      },
      {
        id: '5',
        name: 'Medellin',
        country: 'Colombia',
        country_code: 'CO',
        timezone: 'America/Bogota',
        latitude: 6.2442,
        longitude: -75.5812,
        visa_days: 180,
        visa_type: 'Tourist Visa',
        cost_of_living: 1400,
        wifi_speed: 40,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        avg_overall_rating: 4.2,
        vote_count: 140
      }
    ]
    setCities(mockCities)
    setLoading(false)
  }, [])

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const handleQuickVote = (cityId: string, voteType: 'up' | 'down') => {
    // 这里可以添加快速投票逻辑
    console.log(`Quick vote: ${voteType} for city ${cityId}`)
  }

  const handleDetailedVote = (city: City) => {
    setSelectedCity(city)
    setShowVoteModal(true)
  }

  const handleVoteSubmitted = () => {
    console.log('Vote submitted')
    setShowVoteModal(false)
    setSelectedCity(null)
  }

  const handleCurrentCityVote = (voteType: 'up' | 'down') => {
    console.log(`Current city vote: ${voteType} for ${currentCity}`)
  }

  const handleQuickRating = (rating: number) => {
    console.log(`Quick rating: ${rating} for ${currentCity}`)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">{t('cities.loading')}</p>
      </div>
    )
  }

  return (
    <>
      {/* Current City Vote Section */}
      {showCurrentCityVote && (
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('home.quickVote.currentCity')}: {currentCity}
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleCurrentCityVote('up')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ThumbsUpIcon className="h-4 w-4" />
              <span>{t('home.quickVote.like')}</span>
            </button>
            <button
              onClick={() => handleCurrentCityVote('down')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ThumbsDownIcon className="h-4 w-4" />
              <span>{t('home.quickVote.dislike')}</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{t('home.quickVote.rateExperience')}:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleQuickRating(star)}
                  className="text-yellow-400 hover:text-yellow-500 transition-colors"
                >
                  <StarIcon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{t('home.quickVote.ratingHint')}</p>
        </div>
      )}

      {/* Cities Ranking */}
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
                <div className="text-xs text-gray-500">({city.vote_count} {t('cities.votes')})</div>
              </div>

              {/* Quick Vote Buttons */}
              {showQuickVote && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuickVote(city.id, 'up')}
                    className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded"
                    title={t('cities.quickUpvote')}
                  >
                    <ThumbsUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleQuickVote(city.id, 'down')}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded"
                    title={t('cities.quickDownvote')}
                  >
                    <ThumbsDownIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Detailed Vote Button */}
              <button
                onClick={() => handleDetailedVote(city)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('cities.voteDetails')}
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
          onVoteSubmitted={handleVoteSubmitted}
          city={selectedCity}
        />
      )}
    </>
  )
}
