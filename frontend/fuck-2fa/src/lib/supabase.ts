import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      totp_secrets: {
        Row: {
          id: string
          user_id: string
          label: string
          secret: string
          issuer: string | null
          algorithm: string
          digits: number
          period: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          secret: string
          issuer?: string | null
          algorithm?: string
          digits?: number
          period?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          secret?: string
          issuer?: string | null
          algorithm?: string
          digits?: number
          period?: number
          created_at?: string
          updated_at?: string
        }
      }
      shared_secrets: {
        Row: {
          id: string
          secret_id: string
          share_token: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          secret_id: string
          share_token: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          secret_id?: string
          share_token?: string
          expires_at?: string | null
          created_at?: string
        }
      }
    }
  }
} 