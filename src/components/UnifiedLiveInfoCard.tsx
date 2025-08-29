'use client'

import { useState, useEffect } from 'react'
import { MapPin, RefreshCw, Clock, Cloud, Wifi, Calendar, X, Globe } from 'lucide-react'
import { getCurrentLocation, getWorldTime, getWeather, getTimezoneFromCoordinates } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'
import WifiSpeedTest from './WifiSpeedTest'
import FixedLink from './FixedLink'

interface LocationData {
  city: string
  country: string
  timezone: string
  lat: number
  lon: number
}

interface WeatherData {
  temperature: number
  condition: string
  icon: string
}

interface TimeData {
  time: string
  date: string
}

interface UnifiedLiveInfoCardProps {
  variant?: 'hero' | 'standalone'
  showVisaInfo?: boolean
  showActions?: boolean
  className?: string
}

export default function UnifiedLiveInfoCard({ 
  variant = 'standalone', 
  showVisaInfo = true, 
  showActions = true,
  className = ''
}: UnifiedLiveInfoCardProps) {
  const { t } = useTranslation()
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [time, setTime] = useState<TimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [showWifiTest, setShowWifiTest] = useState(false)

  // Get current location and initialize data
  useEffect(() => {
    initializeData()
  }, [])

  // Update time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (location?.timezone) {
        updateTime()
      }
    }, 60000) // Update every minute

    return () => clearInterval(timeInterval)
  }, [location])

  const initializeData = async () => {
    setLoading(true)
    try {
      // Get current location
      const locationData = await getCurrentLocation()
      if (locationData) {
        const timezone = getTimezoneFromCoordinates(locationData.lat, locationData.lon)
        setLocation({
          city: locationData.city,
          country: locationData.country,
          timezone: timezone,
          lat: locationData.lat,
          lon: locationData.lon
        })

        // Get weather data
        const weatherData = await getWeather(locationData.lat, locationData.lon)
        if (weatherData) {
          setWeather({
            temperature: Math.round(weatherData.temperature),
            condition: weatherData.condition,
            icon: weatherData.icon
          })
        }

        // Get current time
        await updateTime()
      }
    } catch (error) {
      console.error('Error initializing data:', error)
      // Fallback to default location
      setLocation({
        city: 'Osaka',
        country: 'Japan',
        timezone: 'Asia/Tokyo',
        lat: 34.6937,
        lon: 135.5023
      })
    } finally {
      setLoading(false)
    }
  }

  const updateTime = async () => {
    if (!location?.timezone) return

    try {
      const timeData = await getWorldTime(location.timezone)
      if (timeData) {
        setTime({
          time: timeData.time,
          date: timeData.date
        })
      }
    } catch (error) {
      console.error('Error updating time:', error)
      // Fallback to local time
      const now = new Date()
      setTime({
        time: now.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        date: now.toLocaleDateString()
      })
    }
  }

  const handleRefresh = async () => {
    setLastUpdated(new Date())
    await initializeData()
  }

  const getVisaStatus = () => {
    // This should be fetched from user's visa data
    // For now, show a placeholder or hide if user hasn't set up visa info
    return null
  }

  if (loading) {
    return (
      <div className={`card card-lg ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading location data...</span>
        </div>
      </div>
    )
  }

  // Hero variant - simplified version for hero section
  if (variant === 'hero') {
    return (
      <div className={`card card-lg bg-white/90 backdrop-blur-sm border-0 shadow-2xl ${className}`}>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">{t('home.hero.liveInfo.title')}</h3>
            <p className="text-sm text-gray-600">{t('home.hero.liveInfo.subtitle')}</p>
          </div>

          {/* Current Time */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-mono font-bold text-gray-900">
              {time?.time || '--:--'}
            </div>
            <div className="text-sm text-gray-600 mt-1">{t('home.hero.liveInfo.currentTime')}</div>
          </div>

          {/* Current Location */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">
              {location ? `${location.city}, ${location.country}` : t('home.hero.liveInfo.locationUnavailable')}
            </div>
            <div className="text-sm text-gray-600 mt-1">{t('home.hero.liveInfo.currentLocation')}</div>
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowWifiTest(true)}
                className="btn btn-sm btn-primary"
              >
                <Wifi className="h-4 w-4 mr-2" />
                {t('home.hero.liveInfo.speedTest')}
              </button>
              <FixedLink 
                href="/cities"
                className="btn btn-sm btn-secondary"
              >
                <Globe className="h-4 w-4 mr-2" />
                {t('home.hero.liveInfo.explore')}
              </FixedLink>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Standalone variant - full version for main content
  return (
    <div className={`card card-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-500" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              📍 {t('home.currentLocation')}: {location?.city}, {location?.country}
            </h2>
            <p className="text-sm text-gray-500">
              {t('home.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title={t('home.refreshData')}
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Current Status Grid - Like time.is style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Local Time */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            🕒 {time?.time || '--:--'}
          </div>
          <div className="text-xs text-gray-600">
            {t('home.localTime')}
          </div>
        </div>
        
        {/* Weather */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">
            🌤 {weather?.temperature ? `${weather.temperature}°C` : '--°C'}
          </div>
          <div className="text-xs text-gray-600">
            {t('home.weather')}
          </div>
        </div>
        
        {/* WiFi Speed Test */}
        <button 
          onClick={() => setShowWifiTest(true)}
          className="text-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-purple-600 mb-1">
            ☕ WiFi
          </div>
          <div className="text-xs text-gray-600">
            {t('home.wifiSpeed')}
          </div>
        </button>
        
        {/* Visa Status - Only show if user has visa data */}
        {showVisaInfo && (
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              🛂 {getVisaStatus() ? '38' : '--'}
            </div>
            <div className="text-xs text-gray-600">
              {t('home.visaRemaining')}
            </div>
            {!getVisaStatus() && (
              <div className="text-xs text-gray-500 mt-1">
                {t('home.setupVisa')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Setup Visa Reminder */}
      {showVisaInfo && !getVisaStatus() && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  {t('home.setupVisaTitle')}
                </h3>
                <p className="text-sm text-yellow-700">
                  {t('home.setupVisaDescription')}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
              {t('home.setupVisaButton')}
            </button>
          </div>
        </div>
      )}

      {/* WiFi Speed Test Modal */}
      {showWifiTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">WiFi速度测试</h3>
              <button
                onClick={() => setShowWifiTest(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <WifiSpeedTest />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
