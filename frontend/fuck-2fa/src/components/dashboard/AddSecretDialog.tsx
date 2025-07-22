'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Shield, Settings, Clock, Hash } from 'lucide-react'

interface AddSecretDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddSecretDialog({ open, onOpenChange, onSuccess }: AddSecretDialogProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    label: '',
    issuer: '',
    secret: '',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.label || !formData.secret) {
      setError('Label and secret cannot be empty')
      return
    }

    if (!user) {
      setError('User not logged in')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('totp_secrets')
        .insert([
          {
            user_id: user.id,
            label: formData.label,
            issuer: formData.issuer || null,
            secret: formData.secret,
            algorithm: formData.algorithm,
            digits: formData.digits,
            period: formData.period,
          }
        ])

      if (insertError) {
        setError(`Add failed: ${insertError.message}`)
      } else {
        onSuccess()
        setFormData({
          label: '',
          issuer: '',
          secret: '',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
        })
      }
    } catch (error) {
      setError('Add failed, please try again later')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 glass border-white/10 shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Add TOTP Secret</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-white/60">
            Enter your TOTP secret information to start generating codes
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-white/90 font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="label" className="text-sm font-medium text-white/80">
                    Service Name *
                  </label>
                  <Input
                    id="label"
                    placeholder="e.g. Gmail, GitHub, Discord"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="issuer" className="text-sm font-medium text-white/80">
                    Issuer <span className="text-white/50">(Optional)</span>
                  </label>
                  <Input
                    id="issuer"
                    placeholder="e.g. Google, Microsoft"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="secret" className="text-sm font-medium text-white/80">
                    Secret Key *
                  </label>
                  <Input
                    id="secret"
                    placeholder="Enter your TOTP secret key"
                    value={formData.secret}
                    onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                    disabled={loading}
                    className="font-mono bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-11"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="text-white/90 font-medium flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Advanced Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="digits" className="text-sm font-medium text-white/80 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Digits
                  </label>
                  <Input
                    id="digits"
                    type="number"
                    min="6"
                    max="8"
                    value={formData.digits}
                    onChange={(e) => setFormData({ ...formData, digits: parseInt(e.target.value) })}
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white focus:border-white/30 focus:ring-white/20 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="period" className="text-sm font-medium text-white/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Period (sec)
                  </label>
                  <Input
                    id="period"
                    type="number"
                    min="15"
                    max="120"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: parseInt(e.target.value) })}
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white focus:border-white/30 focus:ring-white/20 h-11"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.label || !formData.secret}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 btn-glow h-11"
                variant="outline"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Adding...' : 'Add Secret'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 