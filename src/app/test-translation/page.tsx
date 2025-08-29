'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useEffect, useState } from 'react'

export default function TestTranslationPage() {
  const { t, locale, loading } = useTranslation()
  const [translationsDebug, setTranslationsDebug] = useState<any>(null)
  const [renderCount, setRenderCount] = useState(0)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [missingKeys, setMissingKeys] = useState<string[]>([])

  // Track render count
  useEffect(() => {
    setRenderCount(prev => prev + 1)
  })

  useEffect(() => {
    // 延迟获取翻译数据，确保加载完成
    const timer = setTimeout(() => {
      // 这里我们无法直接访问translations对象，但可以通过测试键来检查
      const testResult = {
        'home.features.nomadCities.title': t('home.features.nomadCities.title'),
        'navigation.home': t('navigation.home'),
        'home.hero.badge': t('home.hero.badge'),
        'home.hero.title': t('home.hero.title'),
        'home.hero.titleHighlight': t('home.hero.titleHighlight'),
        'home.hero.description': t('home.hero.description'),
        'home.hero.exploreCities': t('home.hero.exploreCities'),
        'home.hero.getStarted': t('home.hero.getStarted'),
        'home.hero.stats.cities': t('home.hero.stats.cities'),
        'home.hero.stats.recommendations': t('home.hero.stats.recommendations'),
        'home.hero.stats.updates': t('home.hero.stats.updates'),
        'home.quickVote.currentCity': t('home.quickVote.currentCity'),
        'home.quickVote.like': t('home.quickVote.like'),
        'home.quickVote.dislike': t('home.quickVote.dislike'),
        'home.quickVote.rateExperience': t('home.quickVote.rateExperience'),
        'home.quickVote.ratingHint': t('home.quickVote.ratingHint'),
        'home.hero.liveInfo.title': t('home.hero.liveInfo.title'),
        'home.hero.liveInfo.subtitle': t('home.hero.liveInfo.subtitle'),
        'home.hero.liveInfo.currentTime': t('home.hero.liveInfo.currentTime'),
        'home.hero.liveInfo.currentLocation': t('home.hero.liveInfo.currentLocation'),
        'home.hero.liveInfo.speedTest': t('home.hero.liveInfo.speedTest'),
        'home.hero.liveInfo.explore': t('home.hero.liveInfo.explore'),
        'common.viewDetails': t('common.viewDetails')
      }
      setTranslationsDebug(testResult)

      // 检查缺失的键
      const missing: string[] = []
      Object.entries(testResult).forEach(([key, value]) => {
        if (value === key) {
          missing.push(key)
        }
      })
      setMissingKeys(missing)
    }, 1000)

    return () => clearTimeout(timer)
  }, [t, loading, forceUpdate])

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
    'home.hero.liveInfo.explore',
    'common.viewDetails'
  ]

  const handleForceUpdate = () => {
    setForceUpdate(prev => prev + 1)
  }

  // 简单的测试显示
  const simpleTest = (
    <div className="mb-6 bg-green-100 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">Simple Test Results</h3>
      <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>Locale:</strong> {locale}</p>
      <p><strong>Test Key:</strong> home.hero.badge</p>
      <p><strong>Translation:</strong> {t('home.hero.badge')}</p>
      <p><strong>Is Found:</strong> {t('home.hero.badge') !== 'home.hero.badge' ? 'Yes' : 'No'}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Translation Test Page</h1>

        {simpleTest}

        <div className="mb-6 bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <p><strong>Current Locale:</strong> {locale}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Render Count:</strong> {renderCount}</p>
          <p><strong>Force Update Count:</strong> {forceUpdate}</p>
          <button 
            onClick={handleForceUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Force Update
          </button>
          <p><strong>Missing Keys:</strong> {missingKeys.length > 0 ? missingKeys.join(', ') : 'None'}</p>
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
              <p><strong>Loading State:</strong> {loading ? 'Loading' : 'Loaded'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
