'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Globe, Users, TrendingUp, Star, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import TestNavigation from '@/components/TestNavigation'
import SimpleTest from '@/components/SimpleTest'
import LinkTest from '@/components/LinkTest'
import DirectLinkTest from '@/components/DirectLinkTest'
import SimpleNavigationTest from '@/components/SimpleNavigationTest'
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
      <TestNavigation />
      <SimpleTest />
      <LinkTest />
      <DirectLinkTest />
      <SimpleNavigationTest />
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Core Information Card */}
          <section className="animate-fade-in">
            <CurrentLocationCard />
          </section>

          {/* Nomad Hot Cities Ranking */}
          <section className="animate-fade-in">
            <div className="card card-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  🌍 {t('home.features.nomadCities.title')}
                </h2>
                <Link href="/cities" className="btn btn-md btn-primary">
                  {t('common.viewDetails')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
              <CityRanking limit={5} />
            </div>
          </section>

          {/* Quick Vote Section */}
          <section className="animate-fade-in">
            <div className="card card-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">✍️ {t('home.quickVote.title')}</h3>
              <p className="text-gray-600 mb-6">{t('home.quickVote.description')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current City Vote */}
                <div className="card card-sm bg-gradient-to-br from-green-50 to-blue-50">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('home.quickVote.currentCity')}</h4>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleQuickVote('current', 'like')}
                      className="btn btn-md bg-green-500 hover:bg-green-600 text-white flex-1"
                    >
                      <span className="text-lg mr-2">🔼</span>
                      <span>{t('home.quickVote.like')}</span>
                    </button>
                    <button 
                      onClick={() => handleQuickVote('current', 'dislike')}
                      className="btn btn-md bg-red-500 hover:bg-red-600 text-white flex-1"
                    >
                      <span className="text-lg mr-2">🔽</span>
                      <span>{t('home.quickVote.dislike')}</span>
                    </button>
                  </div>
                </div>
                
                {/* Quick Rating */}
                <div className="card card-sm bg-gradient-to-br from-yellow-50 to-orange-50">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('home.quickVote.rateExperience')}</h4>
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
          </section>

          {/* Nomad Tip */}
          <section className="animate-fade-in">
            <NomadTip />
          </section>

          {/* Place Recommendations */}
          <section className="animate-fade-in">
            <HomePlaceRecommendations />
          </section>

          {/* Personalized Recommendations */}
          <section className="animate-fade-in">
            <PersonalizedRecommendations />
          </section>

          {/* City Comparison Tool */}
          <section className="animate-fade-in">
            <CityComparison />
          </section>

          {/* Nomad Meetup */}
          <section className="animate-fade-in">
            <NomadMeetup />
          </section>

          {/* Community Section */}
          <section className="animate-fade-in">
            <CommunitySection />
          </section>

          {/* Premium Features */}
          <section className="animate-fade-in">
            <PremiumFeatures />
          </section>
        </div>
      </main>
    </div>
  )
} 