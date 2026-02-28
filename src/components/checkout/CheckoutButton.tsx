'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'

export function CheckoutButton({ skillId }: { skillId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isProcessing = useRef(false)

  const handleCheckout = async () => {
    // 1. Double-click / Race condition prevention
    if (isProcessing.current) return
    
    isProcessing.current = true
    setStatus('loading')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId })
      })
      
      const data = await response.json()
      
      if (response.ok && data.url) {
        // Stripe redirect will happen shortly
        window.location.href = data.url
      } else {
        throw new Error(data.message || data.error || 'Checkout failed')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setStatus('error')
      setErrorMessage("Payment failed. Please try again.")
      isProcessing.current = false // Allow retry
    }
  }

  return (
    <div className="w-full space-y-3">
      <Button 
        onClick={handleCheckout} 
        disabled={status === 'loading'}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg shadow-indigo-600/20 text-base uppercase tracking-widest relative overflow-hidden"
      >
        {status === 'loading' ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Connecting to Stripe...</span>
          </div>
        ) : (
          <span>Buy skill</span>
        )}
      </Button>

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-tight">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Retry Payment
          </button>
        </div>
      )}
    </div>
  )
}
