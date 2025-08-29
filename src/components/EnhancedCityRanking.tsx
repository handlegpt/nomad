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
    // TODO: Implement actual vote submission
    alert(t('home.quickVote.voteSubmitted', { vote: voteType === 'up' ? t('home.quickVote.like') : t('home.quickVote.dislike'), type: 'city' }))
  }

  const handleCurrentCityVote = (voteType: 'like' | 'dislike') => {
    console.log(`Current city vote: ${voteType}`)
    // TODO: Implement current city vote submission
    alert(t('home.quickVote.voteSubmitted', { vote: voteType === 'like' ? t('home.quickVote.like') : t('home.quickVote.dislike'), type: 'current' }))
  }

  const handleQuickRating = (rating: number) => {
    console.log(`Quick rating: ${rating}`)
    // TODO: Implement quick rating submission
    alert(t('home.quickVote.ratingSubmitted', { rating: rating.toString() }))
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
      {/* Quick Vote Section */}
      {showCurrentCityVote && (
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">✍️ {t('home.quickVote.title')}</h3>
          <p className="text-gray-600 mb-4">{t('home.quickVote.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current City Vote */}
            <div className="card card-sm bg-gradient-to-br from-green-50 to-blue-50">
              <h4 className="font-semibold text-gray-900 mb-3">{t('home.quickVote.currentCity')}</h4>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleCurrentCityVote('like')}
                  className="btn btn-md bg-green-500 hover:bg-green-600 text-white flex-1"
                >
                  <span className="text-lg mr-2">🔼</span>
                  <span>{t('home.quickVote.like')}</span>
                </button>
                <button 
                  onClick={() => handleCurrentCityVote('dislike')}
                  className="btn btn-md bg-red-500 hover:bg-red-600 text-white flex-1"
                >
                  <span className="text-lg mr-2">🔽</span>
                  <span>{t('home.quickVote.dislike')}</span>
                </button>
              </div>
            </div>
            
            {/* Quick Rating */}
            <div className="card card-sm bg-gradient-to-br from-yellow-50 to-orange-50">
              <h4 className="font-semibold text-gray-900 mb-3">{t('home.quickVote.rateExperience')}</h4>
              <div className="flex space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleQuickRating(rating)}
                    className="btn btn-sm bg-white hover:bg-yellow-100 border border-yellow-300 text-yellow-600"
                  >
                    <span className="text-lg">⭐</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">{t('home.quickVote.ratingHint')}</p>
            </div>
          </div>
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
