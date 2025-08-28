import { supabase, City, Vote, User, Place, PlaceVote, PlaceReview } from './supabase'

// Time related APIs
export async function getWorldTime(timezone: string) {
  try {
    const response = await fetch(`/api/time?timezone=${encodeURIComponent(timezone)}`)
    if (!response.ok) throw new Error('Failed to fetch time')
    return await response.json()
  } catch (error) {
    console.error('Error fetching world time:', error)
    return null
  }
}

// Weather related APIs
export async function getWeather(lat: number, lon: number) {
  try {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
    if (!response.ok) throw new Error('Failed to fetch weather')
    return await response.json()
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
      .from('city_ratings')
      .select('*')
      .order('avg_overall_rating', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
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
      .upsert(voteData, { onConflict: 'city_id,user_id' })
    
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
      .from('place_ratings')
      .select('*')
      .eq('city_id', cityId)
      .order('upvotes', { ascending: false })
    
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
      .from('place_ratings')
      .select('*')
      .eq('category', category)
      .order('upvotes', { ascending: false })
    
    if (cityId) {
      query = query.eq('city_id', cityId)
    }
    
    const { data, error } = await query
    
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
      .upsert(voteData, { onConflict: 'place_id,user_id' })
    
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
      .textSearch('name', query)
      .order('created_at', { ascending: false })
    
    if (cityId) {
      supabaseQuery = supabaseQuery.eq('city_id', cityId)
    }
    
    const { data, error } = await supabaseQuery
    
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
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // 使用反向地理编码获取城市信息
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await response.json()
          
          resolve({
            lat: latitude,
            lon: longitude,
            city: data.city || 'Unknown',
            country: data.countryName || 'Unknown'
          })
        } catch (error) {
          resolve({
            lat: latitude,
            lon: longitude,
            city: 'Unknown',
            country: 'Unknown'
          })
        }
      },
      () => {
        resolve(null)
      }
    )
  })
}

export function calculateVisaDays(visaExpiry: string): number {
  const today = new Date()
  const expiryDate = new Date(visaExpiry)
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// New: Place recommendation related utility functions
export function getCategoryIcon(category: string): string {
  const icons = {
    cafe: '☕',
    coworking: '💻',
    coliving: '🏠',
    restaurant: '🍽',
    outdoor: '🌳',
    other: '📍'
  }
  return icons[category as keyof typeof icons] || '📍'
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
      .from('place_ratings')
      .select('*')
      .order('upvotes', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
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
      .from('place_ratings')
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
