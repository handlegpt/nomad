import { supabase, City, Vote, User, Place, PlaceVote, PlaceReview } from './supabase'

// Time related APIs
export async function getWorldTime(timezone: string) {
  try {
    const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`)
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
    console.warn('Supabase client not available')
    return []
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
    console.warn('Supabase client not available')
    return []
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
    console.warn('Supabase client not available')
    return null
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
    return data || []
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
    return data || []
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
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Use reverse geocoding to get city and country
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            
            if (response.ok) {
              const data = await response.json()
              resolve({
                lat: latitude,
                lon: longitude,
                city: data.city || 'Unknown City',
                country: data.countryName || 'Unknown Country'
              })
            } else {
              // Fallback to coordinates only
              resolve({
                lat: latitude,
                lon: longitude,
                city: 'Unknown City',
                country: 'Unknown Country'
              })
            }
          } catch (error) {
            console.error('Error in reverse geocoding:', error)
            resolve({
              lat: latitude,
              lon: longitude,
              city: 'Unknown City',
              country: 'Unknown Country'
            })
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to default location (Osaka, Japan)
          resolve({
            lat: 34.6937,
            lon: 135.5023,
            city: 'Osaka',
            country: 'Japan'
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    } else {
      console.error('Geolocation not supported')
      // Fallback to default location
      resolve({
        lat: 34.6937,
        lon: 135.5023,
        city: 'Osaka',
        country: 'Japan'
      })
    }
  })
}

// New: Place recommendation related utility functions
export function getCategoryIcon(category: string): string {
  const icons = {
    cafe: '☕', coworking: '💻', coliving: '🏠', restaurant: '🍽', outdoor: '🌳', other: '📍'
  }
  return icons[category as keyof typeof icons] || icons.other
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
    return data?.map((item: any) => item.places) || []
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
    return data || []
  } catch (error) {
    console.error('Error fetching user places:', error)
    return []
  }
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
