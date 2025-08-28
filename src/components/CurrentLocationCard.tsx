'use client'

import { useState, useEffect } from 'react'
import { MapPinIcon, ClockIcon, CloudIcon, WifiIcon, CalendarIcon } from 'lucide-react'
import { getWorldTime, getWeather, calculateVisaDays } from '@/lib/api'

interface CurrentLocationCardProps {
  city: string
  country: string
  timezone: string
  lat: number
  lon: number
  visaExpiry?: string
}

export default function CurrentLocationCard({
  city,
  country,
  timezone,
  lat,
  lon,
  visaExpiry
}: CurrentLocationCardProps) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null)
  const [wifiSpeed, setWifiSpeed] = useState<number>(120) // 模拟数据
  const [visaDays, setVisaDays] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      // 获取时间
      const timeData = await getWorldTime(timezone)
      if (timeData) {
        const localTime = new Date(timeData.datetime).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: timezone
        })
        setCurrentTime(localTime)
      }

      // 获取天气
      const weatherData = await getWeather(lat, lon)
      setWeather(weatherData)

      // 计算签证天数
      if (visaExpiry) {
        setVisaDays(calculateVisaDays(visaExpiry))
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // 每分钟更新一次

    return () => clearInterval(interval)
  }, [timezone, lat, lon, visaExpiry])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️'
      case 'clouds':
        return '☁️'
      case 'rain':
        return '🌧️'
      case 'snow':
        return '❄️'
      default:
        return '🌤️'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-5 w-5 text-red-500" />
          <span className="font-semibold text-gray-900">
            📍 {city}, {country}
          </span>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          刷新
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <ClockIcon className="h-5 w-5 text-blue-500" />
          <div>
            <div className="text-2xl font-bold text-gray-900">{currentTime}</div>
            <div className="text-sm text-gray-500">当地时间</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <CloudIcon className="h-5 w-5 text-blue-500" />
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {weather ? `${Math.round(weather.temp)}°C` : '--'}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              {weather && getWeatherIcon(weather.condition)}
              <span className="ml-1">天气</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <WifiIcon className="h-5 w-5 text-green-500" />
          <div>
            <div className="text-2xl font-bold text-gray-900">{wifiSpeed} Mbps</div>
            <div className="text-sm text-gray-500">WiFi 速度</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-5 w-5 text-orange-500" />
          <div>
            <div className="text-2xl font-bold text-gray-900">{visaDays} 天</div>
            <div className="text-sm text-gray-500">签证剩余</div>
          </div>
        </div>
      </div>
    </div>
  )
}
