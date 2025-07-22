'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw, Share, Trash2, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface TOTPSecret {
  id: string
  label: string
  issuer?: string | null
  secret: string
  algorithm: string
  digits: number
  period: number
}

interface TOTPCardProps {
  secret: TOTPSecret
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
}

export function TOTPCard({ secret, onDelete, onShare }: TOTPCardProps) {
  const [code, setCode] = useState('------')
  const [timeLeft, setTimeLeft] = useState(30)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Get TOTP code using Supabase Edge Function
  const fetchTOTP = useCallback(async () => {
    setLoading(true)
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('❌ No active session')
        setCode('NO-AUTH')
        setTimeLeft(30)
        return
      }

      console.log('🔐 Calling Edge Function with session:', {
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-totp`,
        secretId: secret.id,
        hasToken: !!session.access_token
      })

      // Call Supabase Edge Function
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-totp?secret_id=${secret.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      
      console.log('📡 Edge Function response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ TOTP data received:', data)
        setCode(data.code)
        setTimeLeft(data.expires_in || 30)
      } else {
        const errorText = await response.text()
        console.error('❌ Edge Function failed:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        
        // Show error in code field for debugging
        if (response.status === 404) {
          setCode('NOT-FOUND')
        } else if (response.status === 401) {
          setCode('AUTH-ERR')
        } else if (response.status === 500) {
          setCode('SERVER-ERR')
        } else {
          setCode('EDGE-ERR')
        }
        setTimeLeft(30)
      }
    } catch (error) {
      console.error('❌ Network/Connection error:', error)
      setCode('NET-ERR')
      setTimeLeft(30)
    } finally {
      setLoading(false)
    }
  }, [secret.id])

  useEffect(() => {
    fetchTOTP()
    const interval = setInterval(fetchTOTP, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [fetchTOTP])

  // Countdown
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          fetchTOTP()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [fetchTOTP])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const progressPercentage = (timeLeft / secret.period) * 100

  return (
    <Card className="relative overflow-hidden glass border-white/10 card-hover">
      {/* Animated progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 progress-bar transition-all duration-1000"
        style={{ width: `${progressPercentage}%` }}
      />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg text-white font-semibold leading-tight">
              {secret.issuer && secret.label 
                ? `${secret.issuer}`
                : secret.label}
            </CardTitle>
            {secret.issuer && secret.label && (
              <p className="text-white/60 text-sm font-medium">{secret.label}</p>
            )}
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Clock className="w-3 h-3" />
              <span>Refreshes in {timeLeft}s</span>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchTOTP}
              disabled={loading}
              className="h-8 w-8 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {onShare && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onShare(secret.id)}
                className="h-8 w-8 hover:bg-white/10 text-white/70 hover:text-blue-400"
              >
                <Share className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(secret.id)}
                className="h-8 w-8 hover:bg-red-500/20 text-white/70 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* TOTP Code Display */}
        <div className="space-y-4">
          <div 
            className="font-mono text-3xl font-bold tracking-widest cursor-pointer select-all text-center p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
            onClick={copyToClipboard}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
            ) : (
              <span className="text-white">{code}</span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className={cn(
              "w-full h-10 transition-all duration-300 font-medium",
              copied 
                ? "bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30" 
                : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white btn-glow"
            )}
          >
            {copied ? (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 