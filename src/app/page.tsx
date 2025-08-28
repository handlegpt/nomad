'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Globe, Users, TrendingUp, Star, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import Navigation from '@/components/Navigation'
import NotificationSystem from '@/components/NotificationSystem'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MobileMenu from '@/components/MobileMenu'
import CurrentLocationCard from '@/components/CurrentLocationCard'
import CityRanking from '@/components/CityRanking'
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations'
import CommunitySection from '@/components/CommunitySection'
import PremiumFeatures from '@/components/PremiumFeatures'
import CityComparison from '@/components/CityComparison'
import NomadMeetup from '@/components/NomadMeetup'
import HomePlaceRecommendations from '@/components/HomePlaceRecommendations'
import NomadTip from '@/components/NomadTip'
import WifiSpeedTest from '@/components/WifiSpeedTest'

export default function HomePage() {
  const { t, locale } = useTranslation()

  const handleQuickVote = (type: string, vote: string) => {
    console.log('Quick vote:', type, vote)
    // TODO: Implement quick voting functionality
    alert(t('home.quickVote.voteSubmitted', { vote, type }))
  }

  const handleQuickRating = (rating: number) => {
    console.log('Quick rating:', rating)
    // TODO: Implement quick rating functionality
    alert(t('home.quickVote.ratingSubmitted', { rating: rating.toString() }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NOMAD.NOW</h1>
                <p className="text-xs text-gray-500">digital nomad tools</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden lg:block">
                <NotificationSystem />
              </div>
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Minimal Design */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Core Information Card - Like time.is */}
          <CurrentLocationCard />

          {/* Nomad Hot Cities Ranking - Simplified */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                🌍 {t('home.features.nomadCities.title')}
              </h2>
              <Link href="/cities" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                {t('common.viewDetails')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <CityRanking limit={5} />
          </div>

          {/* Quick Vote Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">✍️ {t('home.quickVote.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('home.quickVote.description')}</p>
            <div className="space-y-4">
              {/* Current City Vote */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{t('home.quickVote.currentCity')}</h4>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleQuickVote('current', 'like')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <span>🔼</span>
                    <span>{t('home.quickVote.like')}</span>
                  </button>
                  <button 
                    onClick={() => handleQuickVote('current', 'dislike')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <span>🔽</span>
                    <span>{t('home.quickVote.dislike')}</span>
                  </button>
                </div>
              </div>
              
              {/* Quick Rating */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{t('home.quickVote.rateExperience')}</h4>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleQuickRating(rating)}
                      className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                    >
                      <span className="text-lg">⭐</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{t('home.quickVote.ratingHint')}</p>
              </div>
            </div>
          </div>

          {/* Nomad Tip - Prominent */}
          <NomadTip />

          {/* Place Recommendations */}
          <HomePlaceRecommendations />

          {/* Personalized Recommendations */}
          <PersonalizedRecommendations />

          {/* City Comparison Tool */}
          <CityComparison />

          {/* Nomad Meetup */}
          <NomadMeetup />

          {/* Community Section */}
          <CommunitySection />

          {/* Premium Features - Bottom */}
          <PremiumFeatures />
        </div>
      </main>
    </div>
  )
} 