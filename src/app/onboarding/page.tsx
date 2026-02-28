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
        
        // Versuche die Fehlermeldung aus dem JSON zu extrahieren, falls vorhanden
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
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Start Selling AI Agent Skills</h1>
      <p className="text-xl text-gray-500 mb-8 max-w-2xl">
        Join our developer community, publish your skills, and keep 70% of every sale.
        We handle the payments and distribution.
      </p>
      {isSignedIn ? (
        <Button size="lg" onClick={handleConnectStripe} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect with Stripe'}
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-red-500 font-medium">Please sign in to your developer account first.</p>
          <SignInButton mode="modal">
            <Button size="lg">Sign In to Continue</Button>
          </SignInButton>
        </div>
      )}
    </div>
  )
}
