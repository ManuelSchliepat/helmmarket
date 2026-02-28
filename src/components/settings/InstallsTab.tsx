'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Copy, CheckCircle2, Download } from 'lucide-react'
import Link from 'next/link'

export function InstallsTab({ initialInstalls }: { initialInstalls: any[] }) {
  const { t } = useI18n()
  const [revealedId, setRevealedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (initialInstalls.length === 0) {
    return (
      <div className="space-y-12">
        <h2 className="text-3xl font-semibold text-white tracking-tight">{t('installs')}</h2>
        <div className="py-24 text-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl">
          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Download className="w-6 h-6 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{t('noInstalls')}</h3>
          <Button asChild variant="outline" className="rounded-full border-zinc-800 hover:border-zinc-600">
            <Link href="/skills">{t('browseMarketplace')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-semibold text-white tracking-tight">{t('installs')}</h2>
      
      <div className="grid gap-6">
        {initialInstalls.map((install) => {
          const isRevealed = revealedId === install.id
          const maskedToken = `helm_tok_••••••${install.token.slice(-6)}`
          const installCmd = `npm install ${install.skills.registry_endpoint}`

          return (
            <div key={install.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{install.skills.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">
                    {t('installDate')}: {new Date(install.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1">v1.0.4</Badge>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">{t('token')}</label>
                  <div className="flex items-center justify-between p-3 bg-black/20 border border-zinc-800 rounded-xl">
                    <code className="text-xs text-white font-mono">
                      {isRevealed ? install.token : maskedToken}
                    </code>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setRevealedId(isRevealed ? null : install.id)}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                      >
                        {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => copyToClipboard(install.token, install.id)}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                      >
                        {copiedId === install.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Install Command</label>
                    <button 
                      onClick={() => copyToClipboard(installCmd, install.id + '-cmd')}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {copiedId === install.id + '-cmd' ? t('saved') : t('copy')}
                    </button>
                  </div>
                  <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <code className="text-xs text-zinc-300 font-mono">{installCmd}</code>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { Badge } from '@/components/ui/badge'
