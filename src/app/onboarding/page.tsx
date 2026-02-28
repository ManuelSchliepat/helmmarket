'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth, SignInButton } from '@clerk/nextjs'
import { AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OnboardingPage() {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnectStripe = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/onboarding', { method: 'POST' })
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Onboarding API failed:', data)
        setError("Stripe connection failed. Please try again or contact support.")
        setLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Onboarding error:', err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 text-center relative">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-4 bg-red-500/10 border-b border-red-500/20 text-red-500 flex items-center justify-center gap-3 z-50"
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-indigo-500/10 text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-500/20">
        Developer Platform
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white leading-tight">Simple pricing. <br />Developers keep 70%.</h1>
      <p className="text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed font-medium">
        Join 2,400+ developers publishing to the standard App Store for AI Agent Skills. 
        We handle distribution, sandboxing, and payments.
      </p>
      {isSignedIn ? (
        <Button size="lg" onClick={handleConnectStripe} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 h-16 px-10 text-lg rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-2xl shadow-indigo-600/20">
          {loading ? 'Initializing Secure Session...' : 'Connect Stripe & Start Earning'}
        </Button>
      ) : (
        <div className="space-y-6">
          <SignInButton mode="modal">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 h-16 px-10 text-lg rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-2xl">
              Start earning. Publish free.
            </Button>
          </SignInButton>
        </div>
      )}
    </div>
  )
}
