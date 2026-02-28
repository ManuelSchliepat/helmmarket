'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react'

export default function SupportPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    try {
      const res = await fetch('/api/user/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message })
      })
      
      if (res.ok) {
        setStatus('success')
        setSubject('')
        setMessage('')
      } else {
        alert('Failed to send message.')
        setStatus('idle')
      }
    } catch (e) {
      console.error(e)
      setStatus('idle')
    }
  }

  return (
    <div className="container mx-auto py-32 px-6 max-w-2xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-500" />
            Developer Support
          </h1>
          <p className="text-zinc-400 mt-2">Need help with your skills or payouts? Our management agent will review your request within 24 hours.</p>
        </div>

        {status === 'success' ? (
          <Card className="p-12 bg-emerald-500/10 border-emerald-500/20 rounded-[2rem] text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">Message Sent!</h3>
            <p className="text-zinc-400">Thank you for reaching out. We'll get back to you soon.</p>
            <Button variant="outline" onClick={() => setStatus('idle')} className="mt-4">Send another message</Button>
          </Card>
        ) : (
          <Card className="p-8 bg-zinc-900 border-zinc-800 rounded-[2rem]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Subject</label>
                <Input 
                  placeholder="e.g. Question about payout split" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus-visible:ring-indigo-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Message</label>
                <textarea 
                  placeholder="Describe your issue in detail..." 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-700"
                />
              </div>

              <Button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20"
              >
                {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
