'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { TOTPCard } from '@/components/totp/TOTPCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, LogOut, Shield, Sparkles, Zap } from 'lucide-react'
import { AddSecretDialog } from '@/components/dashboard/AddSecretDialog'

interface TOTPSecret {
  id: string
  label: string
  issuer?: string | null
  secret: string
  algorithm: string
  digits: number
  period: number
  created_at: string
  updated_at: string
}

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [secrets, setSecrets] = useState<TOTPSecret[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    if (user) {
      fetchSecrets()
    }
  }, [user])

  const fetchSecrets = async () => {
    try {
      const { data, error } = await supabase
        .from('totp_secrets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch secrets:', error)
      } else {
        setSecrets(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch secrets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSecret = async (id: string) => {
    if (!confirm('Are you sure you want to delete this TOTP secret?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('totp_secrets')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete failed:', error)
        alert('Delete failed, please try again later')
      } else {
        setSecrets(secrets.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Delete failed, please try again later')
    }
  }

  const handleShareSecret = async (id: string) => {
    try {
      const shareToken = Math.random().toString(36).substring(7)
      const { error } = await supabase
        .from('shared_secrets')
        .insert([
          {
            secret_id: id,
            share_token: shareToken,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Expires in 24 hours
          }
        ])

      if (error) {
        console.error('Failed to create share link:', error)
        alert('Failed to create share link, please try again later')
      } else {
        const shareUrl = `${window.location.origin}/share/${shareToken}`
        await navigator.clipboard.writeText(shareUrl)
        alert('Share link has been copied to clipboard! The link will expire in 24 hours.')
      }
    } catch (error) {
      console.error('Failed to create share link:', error)
      alert('Failed to create share link, please try again later')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dashboard-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 spinner mx-auto"></div>
          <p className="text-white/70 text-lg">Loading your secrets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dashboard-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                🔐 Fuck 2FA
              </h1>
            </div>
            <p className="text-white/70 text-lg ml-15">
              Welcome back, <span className="text-white/90 font-medium">{user?.email}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(true)}
              className="bg-white/5 hover:bg-white/10 border-white/20 text-white btn-glow h-11 px-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Secret
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
              className="bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300 hover:text-red-200 h-11 px-6"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Secrets</p>
                  <p className="text-2xl font-bold text-white">{secrets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Active Codes</p>
                  <p className="text-2xl font-bold text-white">{secrets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Security Level</p>
                  <p className="text-2xl font-bold text-white">High</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TOTP Cards */}
        {secrets.length === 0 ? (
          <Card className="text-center py-20 glass border-white/10">
            <CardHeader className="space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Shield className="w-12 h-12 text-white/50" />
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl text-white/90">
                  No TOTP secrets yet
                </CardTitle>
                <CardDescription className="text-xl text-white/60 max-w-md mx-auto">
                  Click the "Add Secret" button to start managing your two-factor authentication codes
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowAddDialog(true)} 
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 btn-glow h-14 px-8"
              >
                <Plus className="h-6 w-6 mr-3" />
                Add your first Secret
                <Sparkles className="h-5 w-5 ml-3" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {secrets.map((secret) => (
              <TOTPCard
                key={secret.id}
                secret={secret}
                onDelete={handleDeleteSecret}
                onShare={handleShareSecret}
              />
            ))}
          </div>
        )}

        {/* Add Secret Dialog */}
        <AddSecretDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={() => {
            setShowAddDialog(false)
            fetchSecrets()
          }}
        />
      </div>
    </div>
  )
} 