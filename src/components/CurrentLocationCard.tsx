'use client'

import { useState, useEffect } from 'react'
import { MapPinIcon, RefreshCwIcon, ClockIcon, CloudIcon, WifiIcon, CalendarIcon } from 'lucide-react'
import { getWorldTime, getWeather, calculateVisaDays } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'

interface CurrentLocationCardProps {
  city: string
  country: string
  timezone: string
  lat: number
  lon: number
  visaExpiry: string
}

interface LocationData {
  time: string
  weather: {
    temperature: number
    condition: string
    icon: string
  }
  wifiSpeed: number
  visaDays: number
}

export default function CurrentLocationCard({
  city,
  country,
  timezone,
  lat,
  lon,
  visaExpiry
}: CurrentLocationCardProps) {
  const { t } = useTranslation()
  const [data, setData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 并行获取数据
      const [timeData, weatherData] = await Promise.all([
        getWorldTime(timezone),
        getWeather(lat, lon)
      ])

      const visaDays = calculateVisaDays(visaExpiry)
      
      setData({
        time: timeData.datetime,
        weather: {
          temperature: weatherData.main.temp,
          condition: weatherData.weather[0].main,
          icon: weatherData.weather[0].icon
        },
        wifiSpeed: Math.floor(Math.random() * 50) + 50, // 模拟WiFi速度
        visaDays
      })
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching location data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [city, country, timezone, lat, lon, visaExpiry])

  // 自动刷新（每5分钟）
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchData()
    }, 5 * 60 * 1000) // 5分钟

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleRefresh = () => {
    fetchData()
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    })
  }

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPinIcon className="h-6 w-6 text-blue-500" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              📍 {city}, {country}
            </h2>
            <p className="text-sm text-gray-500">
              最后更新: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
            title={autoRefresh ? '自动刷新已开启' : '自动刷新已关闭'}
          >
            {autoRefresh ? '🔄 自动' : '⏸️ 手动'}
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="手动刷新"
          >
            <RefreshCwIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 时间 */}
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <ClockIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatTime(data.time)}
            </div>
            <div className="text-sm text-gray-600">🕒 当地时间</div>
          </div>

          {/* 天气 */}
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <CloudIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.round(data.weather.temperature)}°C
            </div>
            <div className="text-sm text-gray-600">🌤 天气</div>
          </div>

          {/* WiFi */}
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <WifiIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data.wifiSpeed}
            </div>
            <div className="text-sm text-gray-600">☕ WiFi (Mbps)</div>
          </div>

          {/* 签证 */}
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <CalendarIcon className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {data.visaDays}
            </div>
            <div className="text-sm text-gray-600">🛂 签证剩余天数</div>
          </div>
        </div>
      )}

      {/* 状态指示器 */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>数据来源: WorldTime API, OpenWeather API</span>
        <span>时区: {timezone}</span>
      </div>
    </div>
  )
}
