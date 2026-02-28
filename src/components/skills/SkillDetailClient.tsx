'use client'

import { useState } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { 
  placeholderReviews, reviewStats, changelog, chartData, Skill
} from '@/lib/placeholder-data'
import { CheckCircle2, Shield, Info, History, BarChart3, MessageSquare, Zap } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { motion, AnimatePresence } from 'framer-motion'

export function SkillDetailClient({ skill }: { skill: Skill }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'operations', label: 'Operations', icon: Zap },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'usage', label: 'Usage', icon: BarChart3 }
  ]

  const installCommand = `helm install ${skill.registry_endpoint || `@helm-market/${skill.slug}`}`;

  return (
    <div className="space-y-12">
      <div className="flex border-b border-zinc-800 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="prose prose-zinc prose-invert max-w-none">
                <h3 className="text-xl font-medium text-white mb-6">Documentation</h3>
                <p className="text-zinc-400 leading-[1.7]">
                  High-performance agent skill optimized for industrial and enterprise environments. Fully typed and sandboxed.
                </p>
                
                <h4 className="text-base font-medium text-white mt-10 mb-4">Quick Start</h4>
                <div className="not-prose">
                  <CodeBlock code={installCommand} lang="bash" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Infrastructure</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.providers.map(p => (
                      <span key={p} className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 font-medium border border-zinc-700 capitalize">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Requirements</h4>
                  <div className="space-y-3 text-sm text-zinc-400">
                    <div className="flex justify-between">
                      <span>Node.js</span>
                      <span className="text-white">18+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Helm SDK</span>
                      <span className="text-white">0.2.0+</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'operations' && (
            <motion.div 
              key="operations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 font-medium">
                  <tr>
                    <th className="p-6">Operation</th>
                    <th className="p-6">Permission</th>
                    <th className="p-6">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {[
                    { name: 'execute', perm: 'allow', desc: 'Main logic execution.' },
                    { name: 'notify', perm: 'ask', desc: 'System notifications.' }
                  ].map((op) => (
                    <tr key={op.name} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-6 font-mono text-indigo-400">{op.name}</td>
                      <td className="p-6">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          op.perm === 'allow' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {op.perm}
                        </span>
                      </td>
                      <td className="p-6 text-zinc-500">{op.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
                  <div className="text-5xl font-semibold text-white mb-2">{reviewStats.average}</div>
                  <p className="text-zinc-500 text-sm mb-8">{reviewStats.total} reviews</p>
                  <div className="space-y-3">
                    {reviewStats.breakdown.map(b => (
                      <div key={b.stars} className="flex items-center gap-4 text-xs font-medium">
                        <span className="w-4 text-zinc-500">{b.stars}</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-400" style={{ width: `${b.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-8">
                  {placeholderReviews.slice(0, 3).map(r => (
                    <div key={r.id} className="pb-8 border-b border-zinc-800 last:border-0">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={r.avatar} alt={r.user} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-medium text-white">{r.user}</p>
                          <p className="text-xs text-zinc-500">{r.date}</p>
                        </div>
                      </div>
                      <p className="text-zinc-400 leading-relaxed italic text-base">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'usage' && (
            <motion.div 
              key="usage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="h-80 w-full p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.installs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="installs" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
