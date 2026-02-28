'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'

interface HistoryEvent {
  id: string
  event_type: string
  skill_name: string
  version: string
  helm_command: string
  created_at: string
}

interface InstallHistoryLogProps {
  events: HistoryEvent[]
}

export default function InstallHistoryLog({ events }: InstallHistoryLogProps) {
  return (
    <div className="w-full h-full flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest px-1">Installation History</h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last 20 Events</span>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="text-zinc-500 border-b border-zinc-800 pb-2">
              <th className="py-2 font-black uppercase tracking-tight">Hash</th>
              <th className="py-2 font-black uppercase tracking-tight">Action</th>
              <th className="py-2 font-black uppercase tracking-tight">Skill</th>
              <th className="py-2 font-black uppercase tracking-tight">Version</th>
              <th className="py-2 font-black uppercase tracking-tight">Helm Command</th>
              <th className="py-2 font-black uppercase tracking-tight text-right">Time Ago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 text-zinc-600">{event.id.substring(0, 7)}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                    event.event_type === 'install' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                      : event.event_type === 'upgrade'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}>
                    {event.event_type}
                  </span>
                </td>
                <td className="py-3 text-zinc-300 font-bold">{event.skill_name}</td>
                <td className="py-3 text-zinc-500">v{event.version}</td>
                <td className="py-3">
                  <code className="bg-black/40 px-2 py-1 rounded border border-zinc-800 text-indigo-400">
                    {event.helm_command}
                  </code>
                </td>
                <td className="py-3 text-zinc-600 text-right">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-600 italic">
                  No installation events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
