'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Loader2, Shield } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Please enter your email address')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Login link has been sent to your email. Please check your email and click the link to login!')
      }
    } catch (error) {
      setMessage('Login failed, please try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen login-bg p-4">
      {/* Background particles */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md glass border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-white">
                🔐 Fuck 2FA
              </CardTitle>
              <CardDescription className="text-white/70 text-base">
                Login to your TOTP management tool
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-white/30 focus:ring-white/20 h-12"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/20 btn-glow transition-all duration-300" 
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>

            {message && (
              <div className={`text-sm p-4 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                message.includes('Error') || message.includes('failed') 
                  ? 'text-red-300 bg-red-500/10 border border-red-500/20' 
                  : 'text-green-300 bg-green-500/10 border border-green-500/20'
              }`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 