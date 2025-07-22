import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as OTPAuth from 'https://esm.sh/otpauth@9.2.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    })
  }

  try {
    // Check environment variables first
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      url: supabaseUrl
    })
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing environment variables',
          debug: {
            SUPABASE_URL: !!supabaseUrl,
            SUPABASE_ANON_KEY: !!supabaseAnonKey
          }
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    // Get user from JWT token
    const {
      data: { user },
      error: authError
    } = await supabaseClient.auth.getUser()

    console.log('Auth check:', {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message
    })

    if (authError) {
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed',
          details: authError.message 
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no user found' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get secret_id from URL parameters
    const url = new URL(req.url)
    const secretId = url.searchParams.get('secret_id')

    if (!secretId) {
      return new Response(
        JSON.stringify({ error: 'secret_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return await generateTOTP(supabaseClient, user.id, secretId)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }
  } catch (error) {
    console.error('Edge Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function generateTOTP(supabaseClient: any, userId: string, secretId: string) {
  try {
    console.log('Fetching secret:', { userId, secretId })
    
    // Fetch the secret from database
    const { data: secret, error } = await supabaseClient
      .from('totp_secrets')
      .select('*')
      .eq('id', secretId)
      .eq('user_id', userId)
      .single()

    console.log('Database query result:', {
      found: !!secret,
      error: error?.message
    })

    if (error || !secret) {
      return new Response(
        JSON.stringify({ 
          error: 'Secret not found',
          debug: {
            secretId,
            userId,
            dbError: error?.message
          }
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create TOTP instance using OTPAuth
    const totp = new OTPAuth.TOTP({
      issuer: secret.issuer || 'Fuck 2FA',
      label: secret.label,
      algorithm: secret.algorithm || 'SHA1',
      digits: secret.digits || 6,
      period: secret.period || 30,
      secret: secret.secret,
    })

    // Generate TOTP token
    const token = totp.generate()
    
    // Calculate expiration time
    const now = Math.floor(Date.now() / 1000)
    const step = secret.period || 30
    const expiresIn = step - (now % step)

    console.log('TOTP generated successfully:', {
      hasToken: !!token,
      expiresIn
    })

    return new Response(
      JSON.stringify({
        code: token,
        label: secret.label,
        issuer: secret.issuer,
        expires_in: expiresIn,
        algorithm: secret.algorithm,
        digits: secret.digits,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('TOTP generation error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate TOTP',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
} 