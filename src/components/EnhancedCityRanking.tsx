'use client'

import { useState, useEffect } from 'react'
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, MapPinIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { City } from '@/lib/supabase'
import UnifiedVoteSystem, { VoteItem } from './UnifiedVoteSystem'

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
        visa_days: 90,
        visa_type: 'Tourist Visa',
        cost_of_living: 1200,
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

  const handleVoteSubmitted = (voteData: any) => {
    console.log('Vote submitted:', voteData)
    // 这里可以更新城市数据或触发重新加载
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Current City Vote Section */}
      {showCurrentCityVote && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            {t('home.quickVote.currentCity')}: {currentCity}
          </h3>
          <div className="flex items-center space-x-4">
            <UnifiedVoteSystem
              item={{
                id: 'current-city',
                name: currentCity,
                type: 'city'
              }}
              variant="quick"
              showRating={true}
              onVoteSubmitted={handleVoteSubmitted}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{t('home.quickVote.ratingHint')}</p>
        </div>
      )}

      {/* Cities Ranking */}
      <div className="space-y-3">
        {cities.slice(0, limit).map((city, index) => {
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

                {/* Unified Vote System */}
                {showQuickVote && (
                  <UnifiedVoteSystem
                    item={voteItem}
                    variant="detailed"
                    showRating={true}
                    onVoteSubmitted={handleVoteSubmitted}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
