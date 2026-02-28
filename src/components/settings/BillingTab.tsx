'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'
import { Loader2, ExternalLink } from 'lucide-react'

export function BillingTab() {
  const { t } = useI18n()
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function fetchSubs() {
      try {
        const res = await fetch('/api/billing/subscriptions')
        const data = await res.json()
        setSubscriptions(data.subscriptions || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSubs()
  }, [])

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      console.error(e)
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-semibold text-white tracking-tight">{t('billing')}</h2>
        <Button 
          onClick={handlePortal}
          disabled={portalLoading}
          variant="outline" 
          className="rounded-full border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white"
        >
          {portalLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
          {t('managePayment')}
        </Button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">{t('activeSubscriptions')}</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/30 border border-zinc-800 rounded-[2rem]">
            <p className="text-zinc-500 font-medium">No active subscriptions found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{sub.skillName}</h4>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">
                    {t('nextBilling')}: {new Date(sub.nextBilling).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${sub.price.toFixed(2)}</div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">{sub.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
