'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Eye, CheckCircle, XCircle } from 'lucide-react'

export function SkillsTable({ initialSkills }: { initialSkills: any[] }) {
  const [skills, setSkills] = useState(initialSkills)
  const [filter, setFilter] = useState<'All' | 'pending_review' | 'published' | 'rejected'>('All')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectSkillId, setRejectSkillId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const filteredSkills = skills.filter(s => filter === 'All' ? true : s.status === filter)

  const handleAction = async (id: string, action: 'published' | 'rejected', reason?: string) => {
    try {
      const res = await fetch('/api/admin/skills/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action, note: reason })
      })
      if (!res.ok) throw new Error('Failed to update status')
      
      setSkills(skills.map(s => s.id === id ? { ...s, status: action, review_note: reason } : s))
      if (action === 'rejected') {
        setRejectModalOpen(false)
        setRejectReason('')
        setRejectSkillId(null)
      }
    } catch (e) {
      console.error(e)
      alert("Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        {['All', 'pending_review', 'published', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f 
                ? 'bg-indigo-600 text-white' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {f === 'pending_review' ? 'Pending' : f === 'published' ? 'Live' : f === 'rejected' ? 'Rejected' : 'All'}
          </button>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Skill Name</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Version</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Publisher</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredSkills.map(skill => (
                <tr key={skill.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-white">{skill.name}</td>
                  <td className="p-4 text-sm text-zinc-400">v{skill.current_version || '1.0.0'}</td>
                  <td className="p-4 text-sm text-zinc-400">{skill.developers?.users?.full_name || skill.developers?.users?.email || 'Unknown'}</td>
                  <td className="p-4 text-sm text-zinc-400">{skill.categories?.name}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      skill.status === 'published' ? 'bg-green-500/10 text-green-400' :
                      skill.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {skill.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <Link href={`/skills/${skill.slug}`} target="_blank" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </Link>
                    {skill.status === 'pending_review' && (
                      <>
                        <button 
                          onClick={() => handleAction(skill.id, 'published')}
                          className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors" 
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setRejectSkillId(skill.id)
                            setRejectModalOpen(true)
                          }}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSkills.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 text-sm">No skills found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Reject Skill</h3>
            <textarea
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white min-h-[100px] mb-4 focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="Reason for rejection (sent to publisher)..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => rejectSkillId && handleAction(rejectSkillId, 'rejected', rejectReason)}
                disabled={!rejectReason.trim()}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Reject Skill
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
