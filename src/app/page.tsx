'use client'

import { useState, useEffect } from 'react'
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

export default function HomePage() {
  const { t, locale } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
        <div className="space-y-8">
          {/* Core Information Card - Like time.is */}
          <CurrentLocationCard />

          {/* Nomad Hot Cities Ranking */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                🌍 {t('home.features.nomadCities.title')}
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                {t('common.viewDetails')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <CityRanking limit={5} />
          </div>

          {/* Personalized Recommendations */}
          <PersonalizedRecommendations />

          {/* Community Section */}
          <CommunitySection />

          {/* Premium Features */}
          <PremiumFeatures />

          {/* City Comparison Tool */}
          <CityComparison />
        </div>
      </main>
    </div>
  )
} 