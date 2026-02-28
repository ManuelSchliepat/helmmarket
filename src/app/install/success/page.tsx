'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Copy, Eye, EyeOff, Loader2 } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { useI18n } from '@/lib/i18n-context'

function SuccessContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [revealed, setRevealed] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)
  const [copiedInstall, setCopiedInstall] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setError('Missing session ID')
      setLoading(false)
      return
    }

    async function fetchDetails() {
      try {
        const response = await fetch(`/api/checkout/success?session_id=${sessionId}`)
        if (!response.ok) throw new Error('Failed to retrieve installation details')
        const json = await response.json()
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [sessionId])

  const copyToClipboard = (text: string, setCopied: any) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-zinc-400 font-medium tracking-tight uppercase text-[10px] font-black">Provisioning...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6">
          <X className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Error</h1>
        <p className="text-zinc-500 max-w-sm mb-8">{error || 'Could not load success data.'}</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard">{t('viewDashboard')}</Link>
        </Button>
      </div>
    )
  }

  const installCmd = `npm install ${data.registry_endpoint}`
  const maskedToken = `helm_tok_••••••${data.token.slice(-6)}`

  return (
    <div className="max-w-2xl mx-auto py-32 px-6">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 mb-8 shadow-2xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-semibold text-white mb-4 tracking-tight">{t('paymentSuccess')}</h1>
        <p className="text-zinc-400 text-lg font-medium leading-relaxed">{t('readyInstall')} "{data.skill_name}"</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">1. {t('copy')}</label>
          <div className="relative group">
            <CodeBlock code={installCmd} lang="bash" />
            <button 
              onClick={() => copyToClipboard(installCmd, setCopiedInstall)}
              className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              {copiedInstall ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">2. {t('token')}</label>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <code className="text-white font-mono text-sm">
              {revealed ? data.token : maskedToken}
            </code>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setRevealed(!revealed)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
              >
                {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => copyToClipboard(data.token, setCopiedToken)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
              >
                {copiedToken ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all">
            <Link href="/dashboard">{t('viewDashboard')}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 h-12 bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 rounded-full font-medium transition-all">
            <Link href="/docs/quickstart">{t('readQuickstart')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default function InstallSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
