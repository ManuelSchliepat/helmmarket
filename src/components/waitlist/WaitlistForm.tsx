'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
        You're on the list! We'll be in touch soon.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="flex-1"
      />
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </Button>
      {status === 'error' && (
        <p className="text-red-500 text-sm mt-2 sm:mt-0 sm:absolute sm:-bottom-6">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
