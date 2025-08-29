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

      // 首先尝试从本地存储获取缓存的位置
      const cachedLocation = localStorage.getItem('nomad_cached_location')
      if (cachedLocation) {
        const parsed = JSON.parse(cachedLocation)
        const cacheAge = Date.now() - parsed.timestamp
        if (cacheAge < 300000) { // 5分钟缓存
          setLocation(parsed.data)
          logInfo('Location loaded from cache', parsed.data, 'useLocation')
          return
        }
      }

      // 尝试从API获取位置信息
      try {
        const response = await fetch('/api/location')
        if (response.ok) {
          const data = await response.json()
          if (data.city && data.country) {
            const locationData = {
              city: data.city,
              country: data.country,
              countryCode: data.country_code || 'US',
              timezone: data.timezone || 'UTC',
              latitude: data.lat || 0,
              longitude: data.lon || 0
            }
            setLocation(locationData)
            // 缓存位置数据
            localStorage.setItem('nomad_cached_location', JSON.stringify({
              data: locationData,
              timestamp: Date.now()
            }))
            logInfo('Location fetched from API', { city: data.city, country: data.country }, 'useLocation')
            return
          }
        }
      } catch (apiError) {
        logError('API location fetch failed', apiError, 'useLocation')
      }

      // 如果API失败，尝试使用浏览器地理位置API
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false, // 降低精度要求，提高成功率
            timeout: 15000, // 增加超时时间
            maximumAge: 600000 // 10分钟缓存
          })
        })

        const { latitude, longitude } = position.coords

        // 尝试多个反向地理编码服务
        const geocodingServices = [
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&no_annotations=1`
        ]

        for (const serviceUrl of geocodingServices) {
          try {
            const response = await fetch(serviceUrl, {
              headers: {
                'Accept': 'application/json'
              }
            })
            
            if (response.ok) {
              const geoData = await response.json()
              let city, country, countryCode, timezone
              
              // 解析不同服务的响应格式
              if (serviceUrl.includes('bigdatacloud')) {
                city = geoData.city || geoData.locality
                country = geoData.countryName
                countryCode = geoData.countryCode
                timezone = geoData.timezone
              } else if (serviceUrl.includes('nominatim')) {
                const address = geoData.address
                city = address.city || address.town || address.village
                country = address.country
                countryCode = address.country_code?.toUpperCase()
                timezone = 'UTC' // Nominatim不提供时区
              } else if (serviceUrl.includes('opencagedata')) {
                const result = geoData.results[0]
                const components = result.components
                city = components.city || components.town || components.village
                country = components.country
                countryCode = components.country_code?.toUpperCase()
                timezone = result.annotations.timezone?.name
              }
              
              if (city && country) {
                const locationData = {
                  city: city,
                  country: country,
                  countryCode: countryCode || 'US',
                  timezone: timezone || 'UTC',
                  latitude,
                  longitude
                }
                setLocation(locationData)
                // 缓存位置数据
                localStorage.setItem('nomad_cached_location', JSON.stringify({
                  data: locationData,
                  timestamp: Date.now()
                }))
                logInfo('Location fetched from geocoding service', { 
                  city, 
                  country,
                  service: serviceUrl.split('/')[2]
                }, 'useLocation')
                return
              }
            }
          } catch (geoError) {
            logError(`Geocoding service failed: ${serviceUrl}`, geoError, 'useLocation')
            continue
          }
        }

        // 如果所有地理编码服务都失败，至少保存坐标
        const fallbackLocation = {
          city: 'Unknown City',
          country: 'Unknown Country',
          countryCode: 'US',
          timezone: 'UTC',
          latitude,
          longitude
        }
        setLocation(fallbackLocation)
        localStorage.setItem('nomad_cached_location', JSON.stringify({
          data: fallbackLocation,
          timestamp: Date.now()
        }))
        logInfo('Location saved with coordinates only', { latitude, longitude }, 'useLocation')
      } else {
        throw new Error('Geolocation not supported')
      }
    } catch (err) {
      logError('Failed to get location', err, 'useLocation')
      setError('Failed to get location')
      
      // 设置默认位置
      const defaultLocation = {
        city: 'Osaka',
        country: 'Japan',
        countryCode: 'JP',
        timezone: 'Asia/Tokyo',
        latitude: 34.6937,
        longitude: 135.5023
      }
      setLocation(defaultLocation)
      localStorage.setItem('nomad_cached_location', JSON.stringify({
        data: defaultLocation,
        timestamp: Date.now()
      }))
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
