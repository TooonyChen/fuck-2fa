'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Shield } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen dashboard-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <Shield className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white">🔐 Fuck 2FA</h1>
            <p className="text-white/70 text-lg">Initializing your secure vault...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginForm />
}
