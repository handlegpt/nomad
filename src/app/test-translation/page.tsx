'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function TestTranslationPage() {
  const { t, locale, loading } = useTranslation()

  const testKeys = [
    'home.features.nomadCities.title',
    'navigation.home',
    'navigation.cities',
    'home.hero.badge',
    'home.hero.title',
    'home.hero.titleHighlight',
    'home.hero.description',
    'home.hero.exploreCities',
    'home.hero.getStarted',
    'home.hero.stats.cities',
    'home.hero.stats.recommendations',
    'home.hero.stats.updates',
    'home.quickVote.currentCity',
    'home.quickVote.like',
    'home.quickVote.dislike',
    'home.quickVote.rateExperience',
    'home.quickVote.ratingHint',
    'home.hero.liveInfo.title',
    'home.hero.liveInfo.subtitle',
    'home.hero.liveInfo.currentTime',
    'home.hero.liveInfo.currentLocation',
    'home.hero.liveInfo.speedTest',
    'home.hero.liveInfo.explore'
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Translation Test Page</h1>
        
        <div className="mb-6">
          <p><strong>Current Locale:</strong> {locale}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="space-y-4">
          {testKeys.map((key) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <p><strong>Key:</strong> {key}</p>
              <p><strong>Translation:</strong> {t(key)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
