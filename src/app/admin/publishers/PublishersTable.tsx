'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle, XCircle } from 'lucide-react'

export function PublishersTable({ initialPublishers }: { initialPublishers: any[] }) {
  const [publishers, setPublishers] = useState(initialPublishers)

  const handleAction = async (id: string, is_verified: boolean) => {
    try {
      const res = await fetch('/api/admin/publishers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_verified })
      })
      if (!res.ok) throw new Error('Failed to update verification')
      
      setPublishers(publishers.map(p => p.id === id ? { ...p, is_verified } : p))
    } catch (e) {
      console.error(e)
      alert("Failed to update verification")
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name / Email</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Skills</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Revenue</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Verified</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {publishers.map(pub => (
              <tr key={pub.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="p-4">
                  <p className="text-sm font-medium text-white">{pub.users?.full_name || 'No Name'}</p>
                  <p className="text-xs text-zinc-500">{pub.users?.email || 'No Email'}</p>
                </td>
                <td className="p-4 text-sm text-zinc-400">{pub.skillsCount}</td>
                <td className="p-4 text-sm text-zinc-400">${pub.revenue?.toFixed(2) || '0.00'}</td>
                <td className="p-4">
                  {pub.is_verified ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-400">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-end gap-2">
                  {!pub.is_verified ? (
                    <button 
                      onClick={() => handleAction(pub.id, true)}
                      className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium" 
                    >
                      <CheckCircle className="w-4 h-4" /> Verify
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleAction(pub.id, false)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium" 
                    >
                      <XCircle className="w-4 h-4" /> Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {publishers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500 text-sm">No publishers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
