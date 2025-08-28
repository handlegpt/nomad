import { createClient } from '@supabase/supabase-js'

// Only create Supabase client on client side
let supabase: any = null
let hasWarned = false

if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Debug: Log environment variables (always show for debugging)
  console.log('🔍 Debug - Supabase URL:', supabaseUrl ? 'Set' : 'Not set')
  console.log('🔍 Debug - Supabase Key:', supabaseAnonKey ? 'Set' : 'Not set')
  console.log('🔍 Debug - NODE_ENV:', process.env.NODE_ENV)
  
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client created successfully')
  } else {
    console.warn('🔧 Supabase environment variables are not configured - using mock data')
    hasWarned = true
  }
}

export { supabase }

export interface City {
  id: string
  name: string
  country: string
  country_code: string
  timezone: string
  latitude: number
  longitude: number
  visa_days: number
  visa_type: string
  cost_of_living: number
  wifi_speed: number
  created_at: string
  updated_at: string
}

export interface Vote {
  id: string
  city_id: string
  user_id: string
  overall_rating: number
  wifi_rating: number
  social_rating: number
  value_rating: number
  climate_rating: number
  comment: string
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url: string
  created_at: string
}

// Place recommendation related interfaces
export interface Place {
  id: string
  name: string
  category: 'cafe' | 'coworking' | 'coliving' | 'hostel' | 'hotel' | 'restaurant' | 'library' | 'park' | 'university' | 'shopping' | 'other'
  city_id: string
  address: string
  latitude: number
  longitude: number
  description: string
  tags: string[]
  wifi_speed?: number
  price_level: 1 | 2 | 3 | 4 | 5 // 1=cheap, 5=expensive
  noise_level: 'quiet' | 'moderate' | 'loud'
  social_atmosphere: 'low' | 'medium' | 'high'
  submitted_by: string
  created_at: string
  updated_at: string
  // Computed fields from views
  upvotes?: number
  downvotes?: number
  rating?: number
  review_count?: number
  // Google Places integration
  isFromGoogle?: boolean
}

export interface PlaceVote {
  id: string
  place_id: string
  user_id: string
  vote_type: 'upvote' | 'downvote'
  comment?: string
  created_at: string
}

export interface PlaceReview {
  id: string
  place_id: string
  user_id: string
  rating: number
  review: string
  pros: string[]
  cons: string[]
  visit_date: string
  created_at: string
}
