import { supabase, City, Vote, User, Place, PlaceVote, PlaceReview } from './supabase'

// Helper function to log warnings only in development
const devWarn = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(message)
  }
}

// Time related APIs
export async function getWorldTime(timezone: string) {
  try {
    const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
    if (!response.ok) {
      throw new Error('Failed to fetch time data')
    }
    const data = await response.json()
    
    // Format time for display
    const dateTime = new Date(data.datetime)
    const time = dateTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    const date = dateTime.toLocaleDateString()
    
    return {
      time,
      date,
      timezone: data.timezone,
      utc_offset: data.utc_offset
    }
  } catch (error) {
    console.error('Error fetching world time:', error)
    return null
  }
}

// Weather related APIs
export async function getWeather(lat: number, lon: number) {
  try {
    // In a real app, you'd use a server-side API route to fetch this
    // For now, return mock data
    const mockWeather = {
      temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      icon: '01d'
    }
    
    return mockWeather
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

// City related APIs
export async function getCities(): Promise<City[]> {
  if (!supabase) {
    devWarn('Supabase client not available - returning mock data')
    // Return comprehensive mock data when Supabase is not available
    return [
      {
        id: '1',
        name: 'Lisbon',
        country: 'Portugal',
        country_code: 'PT',
        timezone: 'Europe/Lisbon',
        latitude: 38.7223,
        longitude: -9.1393,
        visa_days: 365,
        visa_type: 'Digital Nomad Visa',
        cost_of_living: 2000,
        wifi_speed: 100,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '2',
        name: 'Chiang Mai',
        country: 'Thailand',
        country_code: 'TH',
        timezone: 'Asia/Bangkok',
        latitude: 18.7883,
        longitude: 98.9853,
        visa_days: 60,
        visa_type: 'Tourist Visa',
        cost_of_living: 1200,
        wifi_speed: 50,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '3',
        name: 'Bali',
        country: 'Indonesia',
        country_code: 'ID',
        timezone: 'Asia/Jakarta',
        latitude: -8.3405,
        longitude: 115.0920,
        visa_days: 30,
        visa_type: 'Tourist Visa',
        cost_of_living: 1500,
        wifi_speed: 40,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '4',
        name: 'Tbilisi',
        country: 'Georgia',
        country_code: 'GE',
        timezone: 'Asia/Tbilisi',
        latitude: 41.7151,
        longitude: 44.8271,
        visa_days: 365,
        visa_type: 'Visa Free',
        cost_of_living: 1000,
        wifi_speed: 80,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '5',
        name: 'Mexico City',
        country: 'Mexico',
        country_code: 'MX',
        timezone: 'America/Mexico_City',
        latitude: 19.4326,
        longitude: -99.1332,
        visa_days: 180,
        visa_type: 'Tourist Visa',
        cost_of_living: 1800,
        wifi_speed: 60,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '6',
        name: 'Barcelona',
        country: 'Spain',
        country_code: 'ES',
        timezone: 'Europe/Madrid',
        latitude: 41.3851,
        longitude: 2.1734,
        visa_days: 90,
        visa_type: 'Schengen Visa',
        cost_of_living: 2500,
        wifi_speed: 120,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '7',
        name: 'Medellin',
        country: 'Colombia',
        country_code: 'CO',
        timezone: 'America/Bogota',
        latitude: 6.2442,
        longitude: -75.5812,
        visa_days: 90,
        visa_type: 'Tourist Visa',
        cost_of_living: 1400,
        wifi_speed: 70,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '8',
        name: 'Porto',
        country: 'Portugal',
        country_code: 'PT',
        timezone: 'Europe/Lisbon',
        latitude: 41.1579,
        longitude: -8.6291,
        visa_days: 365,
        visa_type: 'Digital Nomad Visa',
        cost_of_living: 1800,
        wifi_speed: 100,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '9',
        name: 'Bangkok',
        country: 'Thailand',
        country_code: 'TH',
        timezone: 'Asia/Bangkok',
        latitude: 13.7563,
        longitude: 100.5018,
        visa_days: 30,
        visa_type: 'Tourist Visa',
        cost_of_living: 1600,
        wifi_speed: 60,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '10',
        name: 'Buenos Aires',
        country: 'Argentina',
        country_code: 'AR',
        timezone: 'America/Argentina/Buenos_Aires',
        latitude: -34.6118,
        longitude: -58.3960,
        visa_days: 90,
        visa_type: 'Tourist Visa',
        cost_of_living: 1200,
        wifi_speed: 50,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]
  }
  
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

export async function getTopCities(limit: number = 10): Promise<City[]> {
  if (!supabase) {
    devWarn('Supabase client not available - returning mock data')
    // Return comprehensive mock data when Supabase is not available
    return [
      {
        id: '1',
        name: 'Lisbon',
        country: 'Portugal',
        country_code: 'PT',
        timezone: 'Europe/Lisbon',
        latitude: 38.7223,
        longitude: -9.1393,
        visa_days: 365,
        visa_type: 'Digital Nomad Visa',
        cost_of_living: 2000,
        wifi_speed: 100,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '2',
        name: 'Chiang Mai',
        country: 'Thailand',
        country_code: 'TH',
        timezone: 'Asia/Bangkok',
        latitude: 18.7883,
        longitude: 98.9853,
        visa_days: 60,
        visa_type: 'Tourist Visa',
        cost_of_living: 1200,
        wifi_speed: 50,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '3',
        name: 'Bali',
        country: 'Indonesia',
        country_code: 'ID',
        timezone: 'Asia/Jakarta',
        latitude: -8.3405,
        longitude: 115.0920,
        visa_days: 30,
        visa_type: 'Tourist Visa',
        cost_of_living: 1500,
        wifi_speed: 40,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '4',
        name: 'Tbilisi',
        country: 'Georgia',
        country_code: 'GE',
        timezone: 'Asia/Tbilisi',
        latitude: 41.7151,
        longitude: 44.8271,
        visa_days: 365,
        visa_type: 'Visa Free',
        cost_of_living: 1000,
        wifi_speed: 80,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '5',
        name: 'Mexico City',
        country: 'Mexico',
        country_code: 'MX',
        timezone: 'America/Mexico_City',
        latitude: 19.4326,
        longitude: -99.1332,
        visa_days: 180,
        visa_type: 'Tourist Visa',
        cost_of_living: 1800,
        wifi_speed: 60,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '6',
        name: 'Barcelona',
        country: 'Spain',
        country_code: 'ES',
        timezone: 'Europe/Madrid',
        latitude: 41.3851,
        longitude: 2.1734,
        visa_days: 90,
        visa_type: 'Schengen Visa',
        cost_of_living: 2500,
        wifi_speed: 120,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '7',
        name: 'Medellin',
        country: 'Colombia',
        country_code: 'CO',
        timezone: 'America/Bogota',
        latitude: 6.2442,
        longitude: -75.5812,
        visa_days: 90,
        visa_type: 'Tourist Visa',
        cost_of_living: 1400,
        wifi_speed: 70,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '8',
        name: 'Porto',
        country: 'Portugal',
        country_code: 'PT',
        timezone: 'Europe/Lisbon',
        latitude: 41.1579,
        longitude: -8.6291,
        visa_days: 365,
        visa_type: 'Digital Nomad Visa',
        cost_of_living: 1800,
        wifi_speed: 100,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '9',
        name: 'Bangkok',
        country: 'Thailand',
        country_code: 'TH',
        timezone: 'Asia/Bangkok',
        latitude: 13.7563,
        longitude: 100.5018,
        visa_days: 30,
        visa_type: 'Tourist Visa',
        cost_of_living: 1600,
        wifi_speed: 60,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '10',
        name: 'Buenos Aires',
        country: 'Argentina',
        country_code: 'AR',
        timezone: 'America/Argentina/Buenos_Aires',
        latitude: -34.6118,
        longitude: -58.3960,
        visa_days: 90,
        visa_type: 'Tourist Visa',
        cost_of_living: 1200,
        wifi_speed: 50,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ].slice(0, limit)
  }
  
  try {
    const { data, error } = await supabase
      .from('city_ratings') // This is a view that calculates average ratings
      .select('*, cities(*)')
      .order('average_rating', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data?.map((item: any) => item.cities) || []
  } catch (error) {
    console.error('Error fetching top cities:', error)
    return []
  }
}

export async function getCityById(id: string): Promise<City | null> {
  if (!supabase) {
    console.warn('Supabase client not available - returning mock data')
    // Return mock data when Supabase is not available
    const mockCities = [
      {
        id: '1',
        name: 'Lisbon',
        country: 'Portugal',
        country_code: 'PT',
        timezone: 'Europe/Lisbon',
        latitude: 38.7223,
        longitude: -9.1393,
        visa_days: 365,
        visa_type: 'Digital Nomad Visa',
        cost_of_living: 2000,
        wifi_speed: 100,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '2',
        name: 'Chiang Mai',
        country: 'Thailand',
        country_code: 'TH',
        timezone: 'Asia/Bangkok',
        latitude: 18.7883,
        longitude: 98.9853,
        visa_days: 60,
        visa_type: 'Tourist Visa',
        cost_of_living: 1200,
        wifi_speed: 50,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]
    
    // Find city by ID in mock data
    const city = mockCities.find(c => c.id === id)
    return city || null
  }
  
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching city:', error)
    return null
  }
}

// Vote related APIs
export async function submitVote(voteData: Omit<Vote, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return false
  }
  
  try {
    const { error } = await supabase
      .from('votes')
      .insert(voteData)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error submitting vote:', error)
    return false
  }
}

// Place recommendation related APIs
export async function getPlacesByCity(cityId: string): Promise<Place[]> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('city_id', cityId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data to include computed fields
    const placesWithStats = (data || []).map((place: any) => ({
      ...place,
      upvotes: 0, // These would be calculated from place_votes table
      downvotes: 0,
      rating: 0, // This would be calculated from place_reviews table
      review_count: 0
    }))
    
    return placesWithStats
  } catch (error) {
    console.error('Error fetching places:', error)
    return []
  }
}

export async function getPlacesByCategory(category: string, cityId?: string): Promise<Place[]> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return []
  }
  
  try {
    let query = supabase
      .from('places')
      .select('*')
      .eq('category', category)
    
    if (cityId) {
      query = query.eq('city_id', cityId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data to include computed fields
    const placesWithStats = (data || []).map((place: any) => ({
      ...place,
      upvotes: 0,
      downvotes: 0,
      rating: 0,
      review_count: 0
    }))
    
    return placesWithStats
  } catch (error) {
    console.error('Error fetching places by category:', error)
    return []
  }
}

export async function addPlace(placeData: Omit<Place, 'id' | 'created_at' | 'updated_at'>): Promise<Place | null> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return null
  }
  
  try {
    const { data, error } = await supabase
      .from('places')
      .insert(placeData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding place:', error)
    return null
  }
}

export async function submitPlaceVote(voteData: Omit<PlaceVote, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return false
  }
  
  try {
    const { error } = await supabase
      .from('place_votes')
      .insert(voteData)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error submitting place vote:', error)
    return false
  }
}

export async function addPlaceReview(reviewData: Omit<PlaceReview, 'id' | 'created_at'>): Promise<PlaceReview | null> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return null
  }
  
  try {
    const { data, error } = await supabase
      .from('place_reviews')
      .insert(reviewData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding place review:', error)
    return null
  }
}

export async function searchPlaces(query: string, cityId?: string): Promise<Place[]> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return []
  }
  
  try {
    let supabaseQuery = supabase
      .from('places')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    
    if (cityId) {
      supabaseQuery = supabaseQuery.eq('city_id', cityId)
    }
    
    const { data, error } = await supabaseQuery.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching places:', error)
    return []
  }
}

// Utility functions
export async function getCurrentLocation(): Promise<{ lat: number; lon: number; city: string; country: string } | null> {
  try {
    // Use IP-based geolocation instead of browser geolocation
    const response = await fetch('https://api.ipapi.com/api/check?access_key=free')
    
    if (response.ok) {
      const data = await response.json()
      return {
        lat: data.latitude || 34.6937,
        lon: data.longitude || 135.5023,
        city: data.city || 'Osaka',
        country: data.country_name || 'Japan'
      }
    } else {
      // Fallback to a free IP geolocation service
      const fallbackResponse = await fetch('https://ipapi.co/json/')
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json()
        return {
          lat: fallbackData.latitude || 34.6937,
          lon: fallbackData.longitude || 135.5023,
          city: fallbackData.city || 'Osaka',
          country: fallbackData.country_name || 'Japan'
        }
      }
    }
  } catch (error) {
    console.error('Error getting location from IP:', error)
  }
  
  // Final fallback to default location
  return {
    lat: 34.6937,
    lon: 135.5023,
    city: 'Osaka',
    country: 'Japan'
  }
}

// New: Place recommendation related utility functions
export function getCategoryIcon(category: string): string {
  const icons = {
    cafe: '☕', coworking: '💻', coliving: '🏠', restaurant: '🍽', outdoor: '🌳', other: '📍'
  }
  return icons[category as keyof typeof icons] || icons.other
}

export function getCategoryName(category: string): string {
  const names = {
    cafe: '咖啡馆',
    coworking: 'Co-working',
    coliving: 'Coliving',
    restaurant: '餐馆',
    outdoor: '户外',
    other: '其他'
  }
  return names[category as keyof typeof names] || '其他'
}

export function getPriceLevelText(level: number): string {
  return '$'.repeat(level)
}

export function getNoiseLevelText(level: string): string {
  const levels = {
    quiet: '安静',
    moderate: '适中',
    loud: '嘈杂'
  }
  return levels[level as keyof typeof levels] || '未知'
}

export function getSocialAtmosphereText(level: string): string {
  const levels = {
    low: '低',
    medium: '中',
    high: '高'
  }
  return levels[level as keyof typeof levels] || '未知'
}

// New: Get popular places
export async function getTopPlaces(limit: number = 10): Promise<Place[]> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('place_ratings') // This is a view that calculates average ratings for places
      .select('*, places(*)')
      .order('average_rating', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    // Transform data to include computed fields
    const placesWithStats = (data?.map((item: any) => item.places) || []).map((place: any) => ({
      ...place,
      upvotes: 0,
      downvotes: 0,
      rating: 0,
      review_count: 0
    }))
    
    return placesWithStats
  } catch (error) {
    console.error('Error fetching top places:', error)
    return []
  }
}

// New: Get user recommended places
export async function getUserPlaces(userId: string): Promise<Place[]> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('submitted_by', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data to include computed fields
    const placesWithStats = (data || []).map((place: any) => ({
      ...place,
      upvotes: 0,
      downvotes: 0,
      rating: 0,
      review_count: 0
    }))
    
    return placesWithStats
  } catch (error) {
    console.error('Error fetching user places:', error)
    return []
  }
}

// Calculate visa days remaining
export function calculateVisaDays(visaExpiry: string): number {
  const expiryDate = new Date(visaExpiry)
  const today = new Date()
  
  // Reset time to start of day for accurate day calculation
  today.setHours(0, 0, 0, 0)
  expiryDate.setHours(0, 0, 0, 0)
  
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Timezone mapping function
export function getTimezoneFromCoordinates(lat: number, lon: number): string {
  // This is a simplified timezone mapping
  // In a real app, you'd use a more sophisticated timezone database
  
  // Asia
  if (lat >= 20 && lat <= 50 && lon >= 70 && lon <= 140) {
    if (lon >= 100 && lon <= 140) return 'Asia/Tokyo' // Japan
    if (lon >= 70 && lon <= 100) return 'Asia/Shanghai' // China
    return 'Asia/Tokyo'
  }
  
  // Europe
  if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 40) {
    return 'Europe/London'
  }
  
  // North America
  if (lat >= 25 && lat <= 70 && lon >= -170 && lon <= -50) {
    if (lon >= -80 && lon <= -50) return 'America/New_York'
    if (lon >= -125 && lon <= -80) return 'America/Los_Angeles'
    return 'America/New_York'
  }
  
  // Default to UTC
  return 'UTC'
}
