import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking database status...')
    
    const results: any = {
      timestamp: new Date().toISOString(),
      checks: {}
    }

    // Check if verification_codes table exists and is accessible
    try {
      const { data: codesData, error: codesError } = await supabase
        .from('verification_codes')
        .select('count')
        .limit(1)
      
      results.checks.verification_codes = {
        exists: !codesError,
        error: codesError?.message || null
      }
    } catch (error) {
      results.checks.verification_codes = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Check if users table exists and is accessible
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      results.checks.users = {
        exists: !usersError,
        error: usersError?.message || null
      }
    } catch (error) {
      results.checks.users = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test user insertion (this will fail due to RLS if policies are wrong)
    try {
      const testEmail = `test-${Date.now()}@example.com`
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({
          email: testEmail,
          name: 'Test User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        results.checks.user_insertion = {
          success: false,
          error: insertError.message,
          code: insertError.code
        }
      } else {
        results.checks.user_insertion = {
          success: true,
          user_id: insertData.id
        }
        
        // Clean up test user
        await supabase
          .from('users')
          .delete()
          .eq('id', insertData.id)
      }
    } catch (error) {
      results.checks.user_insertion = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Check environment variables
    results.environment = {
      has_resend_key: !!process.env.RESEND_API_KEY,
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_supabase_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }

    console.log('✅ Database status check completed:', results)
    
    return NextResponse.json(results)

  } catch (error) {
    console.error('❌ Database status check failed:', error)
    return NextResponse.json(
      { 
        error: 'Database status check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
