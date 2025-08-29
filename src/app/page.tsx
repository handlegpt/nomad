'use client'

import { useState, useEffect } from 'react'
import FixedLink from '@/components/FixedLink'
import { Globe, Users, TrendingUp, Star, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import PageLayout from '@/components/PageLayout'
import HeroSection from '@/components/HeroSection'

import UnifiedLiveInfoCard from '@/components/UnifiedLiveInfoCard'
import EnhancedCityRanking from '@/components/EnhancedCityRanking'
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

  return (
    <PageLayout padding="none" className="bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="space-y-12">
        {/* Nomad Hot Cities Ranking */}
        <section className="animate-fade-in">
          <div className="card card-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                🌍 {t('home.features.nomadCities.title')}
              </h2>
              <FixedLink href="/cities" className="btn btn-md btn-primary">
                {t('common.viewDetails')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </FixedLink>
            </div>
            <EnhancedCityRanking limit={5} showQuickVote={true} showCurrentCityVote={true} />
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
    </PageLayout>
  )
} 