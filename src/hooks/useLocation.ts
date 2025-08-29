import { useState, useEffect } from 'react'
import { logInfo, logError } from '@/lib/logger'

interface LocationData {
  city: string
  country: string
  countryCode: string
  timezone: string
  latitude: number
  longitude: number
}

interface UseLocationReturn {
  location: LocationData | null
  loading: boolean
  error: string | null
  refreshLocation: () => Promise<void>
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocation = async () => {
    try {
      setLoading(true)
      setError(null)

      // 首先尝试从API获取位置信息
      const response = await fetch('/api/location')
      if (response.ok) {
        const data = await response.json()
        if (data.city && data.country) {
          setLocation({
            city: data.city,
            country: data.country,
            countryCode: data.country_code || 'US',
            timezone: data.timezone || 'UTC',
            latitude: data.lat || 0,
            longitude: data.lon || 0
          })
          logInfo('Location fetched from API', { city: data.city, country: data.country }, 'useLocation')
          return
        }
      }

      // 如果API失败，尝试使用浏览器地理位置API
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5分钟缓存
          })
        })

        const { latitude, longitude } = position.coords

        // 使用反向地理编码获取城市信息
        try {
          const reverseGeocodeResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (reverseGeocodeResponse.ok) {
            const geoData = await reverseGeocodeResponse.json()
            setLocation({
              city: geoData.city || geoData.locality || 'Unknown City',
              country: geoData.countryName || 'Unknown Country',
              countryCode: geoData.countryCode || 'US',
              timezone: geoData.timezone || 'UTC',
              latitude,
              longitude
            })
            logInfo('Location fetched from geolocation API', { 
              city: geoData.city, 
              country: geoData.countryName 
            }, 'useLocation')
            return
          }
        } catch (geoError) {
          logError('Reverse geocoding failed', geoError, 'useLocation')
        }

        // 如果反向地理编码失败，至少保存坐标
        setLocation({
          city: 'Unknown City',
          country: 'Unknown Country',
          countryCode: 'US',
          timezone: 'UTC',
          latitude,
          longitude
        })
      } else {
        throw new Error('Geolocation not supported')
      }
    } catch (err) {
      logError('Failed to get location', err, 'useLocation')
      setError('Failed to get location')
      
      // 设置默认位置
      setLocation({
        city: 'Osaka',
        country: 'Japan',
        countryCode: 'JP',
        timezone: 'Asia/Tokyo',
        latitude: 34.6937,
        longitude: 135.5023
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshLocation = async () => {
    await fetchLocation()
  }

  useEffect(() => {
    fetchLocation()
  }, [])

  return {
    location,
    loading,
    error,
    refreshLocation
  }
}
