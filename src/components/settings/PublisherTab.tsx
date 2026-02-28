'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, ArrowUpRight, CheckCircle2, XCircle, Clock, Link as LinkIcon, Trash2, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { CreditCard, Package } from 'lucide-react'

export function PublisherTab({ user }: { user: any }) {
  const { t } = useI18n()
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [onboardingLoading, setOnboardingLoading] = useState(false)

  // Webhooks state
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['skill.purchased'])
  const [isSavingWebhook, setIsSavingWebhook] = useState(false)
  const [newSecret, setNewSecret] = useState<string | null>(null)

  const availableEvents = ['skill.purchased', 'skill.installed', 'review.approved', 'review.rejected']

  useEffect(() => {
    async function fetchPublisherData() {
      setLoading(true)
      try {
        setSkills([
          { name: 'Vuln Scanner', status: 'published', revenue: 1420, slug: 'vuln-scanner' },
          { name: 'PII Scanner', status: 'pending_review', revenue: 0, slug: 'pii-scanner' }
        ])
        
        const whRes = await fetch('/api/settings/webhooks')
        if (whRes.ok) {
          setWebhooks(await whRes.json())
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchPublisherData()
  }, [])

  const handleStripeOnboarding = async () => {
    setOnboardingLoading(true)
    try {
      const res = await fetch('/api/onboarding', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      console.error(e)
    } finally {
      setOnboardingLoading(false)
    }
  }

  const handleToggleEvent = (evt: string) => {
    setWebhookEvents(prev => 
      prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]
    )
  }

  const saveWebhook = async () => {
    if (!newWebhookUrl) return
    setIsSavingWebhook(true)
    setNewSecret(null)
    try {
      const res = await fetch('/api/settings/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newWebhookUrl, events: webhookEvents })
      })
      const data = await res.json()
      if (res.ok) {
        setWebhooks([...webhooks, data])
        setNewSecret(data.plaintextSecret)
        setNewWebhookUrl('')
      } else {
        alert(data.error || 'Failed to save webhook')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSavingWebhook(false)
    }
  }

  const deleteWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/settings/webhooks?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setWebhooks(webhooks.filter(w => w.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const isConnected = !!user.stripe_account_id

  return (
    <div className="space-y-12 pb-24">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-semibold text-white tracking-tight">{t('publisher')}</h2>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 rounded-full h-10 px-6 font-medium text-white">
          <Link href="/publish"><Plus className="w-4 h-4 mr-2" /> {t('submitNew')}</Link>
        </Button>
      </div>

      {/* Stripe Connect Status */}
      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-white text-lg">Payout Account</h3>
              <Badge className={isConnected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
                {isConnected ? t('connected') : t('notConnected')}
              </Badge>
            </div>
            <p className="text-sm text-zinc-500 font-medium">Stripe Connect via Helm Market</p>
          </div>
        </div>
        <Button 
          onClick={handleStripeOnboarding}
          disabled={onboardingLoading}
          variant="outline" 
          className="rounded-full border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white bg-transparent"
        >
          {onboardingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4 mr-2" />}
          {isConnected ? t('openDashboard') : t('connectStripe')}
        </Button>
      </div>

      {/* My Skills */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">{t('mySkills')}</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill) => (
              <div key={skill.name} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{skill.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {skill.status === 'published' && <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] uppercase font-black"><CheckCircle2 className="w-3 h-3 mr-1" /> Live</Badge>}
                      {skill.status === 'pending_review' && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] uppercase font-black"><Clock className="w-3 h-3 mr-1" /> In Review</Badge>}
                      {skill.status === 'rejected' && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] uppercase font-black"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('revenue')}</p>
                  <div className="text-white font-bold">€{(skill.revenue / 100).toFixed(2)}</div>
                  <Link href={`/skills/${skill.slug}`} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 mt-2 block uppercase tracking-tighter">{t('edit')} →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Webhooks Section */}
      <div className="space-y-6 pt-8 border-t border-zinc-900">
        <div className="flex items-center gap-3 px-1">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Webhooks</h3>
        </div>
        <p className="text-sm text-zinc-500 px-1">Receive real-time event notifications when your skills are purchased or updated.</p>
        
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Webhook URL</label>
            <Input 
              placeholder="https://your-api.com/webhooks/helm" 
              value={newWebhookUrl}
              onChange={e => setNewWebhookUrl(e.target.value)}
              className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus-visible:ring-indigo-500 font-mono text-sm"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Events to receive</label>
            <div className="flex flex-wrap gap-2">
              {availableEvents.map(evt => (
                <button
                  key={evt}
                  type="button"
                  onClick={() => handleToggleEvent(evt)}
                  className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                    webhookEvents.includes(evt) 
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {evt}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={saveWebhook} 
            disabled={isSavingWebhook || !newWebhookUrl}
            className="w-full sm:w-auto h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold px-8"
          >
            {isSavingWebhook ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Webhook'}
          </Button>

          {newSecret && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mt-6">
              <div className="flex items-center gap-2 text-emerald-500 font-bold mb-2">
                <ShieldCheck className="w-5 h-5" /> Secret Key Generated
              </div>
              <p className="text-sm text-zinc-300 mb-4">Save this secret — it won't be shown again. Use it to verify HMAC-SHA256 signatures.</p>
              <code className="block p-4 bg-black rounded-xl border border-zinc-800 text-emerald-400 font-mono text-sm break-all">
                {newSecret}
              </code>
            </div>
          )}
        </div>

        {webhooks.length > 0 && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Active Webhooks</label>
            <div className="grid gap-3">
              {webhooks.map(wh => (
                <div key={wh.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${wh.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="font-mono text-sm text-zinc-300 truncate max-w-[200px] sm:max-w-xs">{wh.url}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {wh.events.map((e: string) => (
                        <span key={e} className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md">
                          {e.replace('skill.', '').replace('review.', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-8 text-xs bg-zinc-950 border-zinc-800 hover:text-white" onClick={() => {
                      fetch(wh.url, { method: 'POST', body: JSON.stringify({ event: 'ping', test: true }) }).catch(console.error)
                    }}>
                      Test
                    </Button>
                    <button onClick={() => deleteWebhook(wh.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors bg-zinc-950 rounded-lg border border-zinc-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
