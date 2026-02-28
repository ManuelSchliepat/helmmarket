'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, ArrowUpRight, CheckCircle2, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export function PublisherTab({ user }: { user: any }) {
  const { t } = useI18n()
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [onboardingLoading, setOnboardingLoading] = useState(false)

  useEffect(() => {
    async function fetchPublisherData() {
      // In a real app, we'd fetch this from a dedicated publisher API
      // For now, let's simulate with some placeholder data and user info
      setLoading(true)
      try {
        // Fetch skills where developer_id = user.id
        // (This would normally be a real fetch)
        setSkills([
          { name: 'Vuln Scanner', status: 'published', revenue: 1420, slug: 'vuln-scanner' },
          { name: 'PII Scanner', status: 'pending_review', revenue: 0, slug: 'pii-scanner' }
        ])
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

  const isConnected = !!user.stripe_account_id

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-semibold text-white tracking-tight">{t('publisher')}</h2>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 rounded-full h-10 px-6 font-medium">
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
          className="rounded-full border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white"
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
    </div>
  )
}

import { CreditCard, Package } from 'lucide-react'
