'use client'

import { useState, useEffect } from 'react'
import { MapPin, RefreshCw, Clock, Cloud, Wifi, Calendar } from 'lucide-react'
import { getCurrentLocation, getWorldTime, getWeather, getTimezoneFromCoordinates } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'

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

export default function CurrentLocationCard() {
  const { t } = useTranslation()
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [time, setTime] = useState<TimeData | null>(null)
  const [wifiSpeed, setWifiSpeed] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

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

        // Simulate WiFi speed (in real app, this would be from a speed test API)
        setWifiSpeed(Math.floor(Math.random() * 100) + 50) // 50-150 Mbps
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading location data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="h-6 w-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
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

      {/* Current Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Local Time */}
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {time?.time || '--:--'}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <Clock className="h-4 w-4 mr-1" />
            {t('home.localTime')}
          </div>
        </div>
        
        {/* Weather */}
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {weather?.temperature ? `${weather.temperature}°C` : '--°C'}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <Cloud className="h-4 w-4 mr-1" />
            {t('home.weather')}
          </div>
        </div>
        
        {/* WiFi Speed */}
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {wifiSpeed ? `${wifiSpeed}` : '--'}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <Wifi className="h-4 w-4 mr-1" />
            {t('home.wifiSpeed')} (Mbps)
          </div>
        </div>
        
        {/* Visa Status - Only show if user has visa data */}
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {getVisaStatus() ? '38' : '--'}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-1" />
            {t('home.visaRemaining')}
          </div>
          {!getVisaStatus() && (
            <div className="text-xs text-gray-500 mt-1">
              {t('home.setupVisa')}
            </div>
          )}
        </div>
      </div>

      {/* Setup Visa Reminder */}
      {!getVisaStatus() && (
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
    </div>
  )
}
