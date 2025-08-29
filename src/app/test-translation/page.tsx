'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useEffect, useState } from 'react'

export default function TestTranslationPage() {
  const { t, locale, loading } = useTranslation()
  const [translationsDebug, setTranslationsDebug] = useState<any>(null)

  useEffect(() => {
    // 延迟获取翻译数据，确保加载完成
    const timer = setTimeout(() => {
      // 这里我们无法直接访问translations对象，但可以通过测试键来检查
      const testResult = {
        'home.features.nomadCities.title': t('home.features.nomadCities.title'),
        'navigation.home': t('navigation.home'),
        'home.hero.badge': t('home.hero.badge')
      }
      setTranslationsDebug(testResult)
    }, 1000)

    return () => clearTimeout(timer)
  }, [t, loading])

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
        
        <div className="mb-6 bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <p><strong>Current Locale:</strong> {locale}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Debug Results:</strong></p>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(translationsDebug, null, 2)}
          </pre>
        </div>

        <div className="space-y-4">
          {testKeys.map((key) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <p><strong>Key:</strong> {key}</p>
              <p><strong>Translation:</strong> {t(key)}</p>
              <p><strong>Is Key:</strong> {t(key) === key ? 'Yes (not found)' : 'No (found)'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
