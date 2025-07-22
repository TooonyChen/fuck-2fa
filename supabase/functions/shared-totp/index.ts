import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as OTPAuth from 'https://esm.sh/otpauth@9.2.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client (service role for public access)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get share_token from URL parameters
    const url = new URL(req.url)
    const shareToken = url.searchParams.get('share_token')

    if (!shareToken) {
      return new Response(
        JSON.stringify({ error: 'share_token is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return await generateSharedTOTP(supabaseClient, shareToken)
      
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
    console.error('Shared TOTP Edge Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function generateSharedTOTP(supabaseClient: any, shareToken: string) {
  try {
    // Fetch the shared secret from database
    const { data: sharedSecret, error: shareError } = await supabaseClient
      .from('shared_secrets')
      .select(`
        *,
        totp_secrets (*)
      `)
      .eq('share_token', shareToken)
      .single()

    if (shareError || !sharedSecret) {
      return new Response(
        JSON.stringify({ error: 'Share link not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if share link has expired
    if (sharedSecret.expires_at && new Date(sharedSecret.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Share link has expired' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const secret = sharedSecret.totp_secrets

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

    return new Response(
      JSON.stringify({
        code: token,
        label: secret.label,
        issuer: secret.issuer,
        expires_in: expiresIn,
        readonly: true,
        share_expires_at: sharedSecret.expires_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Shared TOTP generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate shared TOTP' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
} 