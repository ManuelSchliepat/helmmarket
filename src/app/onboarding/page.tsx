'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth, SignInButton } from '@clerk/nextjs'

export default function OnboardingPage() {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleConnectStripe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/onboarding', { method: 'POST' })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Onboarding API failed:', errorText)
        
        let message = 'Onboarding failed.'
        try {
          const errorJson = JSON.parse(errorText)
          message = errorJson.error || message
        } catch (e) {
          message = errorText || message
        }
        
        alert(message)
        setLoading(false)
        return
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Onboarding error:', err)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 text-center">
      <div className="bg-indigo-500/10 text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-500/20">
        Developer Platform
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">Simple pricing. Developers keep 70%.</h1>
      <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
        Join 2,400+ developers publishing to the standard App Store for AI Agent Skills. 
        We handle distribution, sandboxing, and payments so you can focus on writing great code.
      </p>
      {isSignedIn ? (
        <Button size="lg" onClick={handleConnectStripe} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-base">
          {loading ? 'Connecting...' : 'Connect Stripe & Start Earning'}
        </Button>
      ) : (
        <div className="space-y-6">
          <SignInButton mode="modal">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-base">
              Start earning. Publish your first skill free.
            </Button>
          </SignInButton>
        </div>
      )}
    </div>
  )
}
