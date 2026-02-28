'use client'

import { useState } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { 
  placeholderReviews, reviewStats, chartData, Skill
} from '@/lib/placeholder-data'
import { Info, BarChart3, MessageSquare, Zap, Terminal, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { motion, AnimatePresence } from 'framer-motion'

export function SkillDetailClient({ skill }: { skill: Skill }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isPeerExpanded, setIsPeerExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'quick-start', label: 'Quick Start', icon: Zap },
    { id: 'operations', label: 'Operations', icon: Terminal },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'usage', label: 'Usage', icon: BarChart3 }
  ]

  const installCommand = `npm install ${skill.registry_endpoint}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-12">
      <div className="flex border-b border-zinc-800 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id 
                ? 'border-white text-white' 
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
              className="space-y-16"
            >
              <div className="prose prose-zinc prose-invert max-w-none">
                <h3 className="text-xl font-medium text-white mb-6 tracking-tight">Capabilities</h3>
                <p className="text-zinc-400 text-lg leading-[1.8] max-w-3xl font-medium">
                  {skill.description}
                </p>
              </div>

              {/* Peer Dependencies Section */}
              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50">
                <button 
                  onClick={() => setIsPeerExpanded(!isPeerExpanded)}
                  className="w-full flex items-center justify-between p-6 hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm font-semibold text-white uppercase tracking-widest text-[10px]">Peer Dependencies</span>
                  </div>
                  {isPeerExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </button>
                <AnimatePresence>
                  {isPeerExpanded && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 space-y-4">
                        <div className="flex items-center justify-between text-sm py-2 border-b border-zinc-800">
                          <code className="text-indigo-400">@bgub/helm</code>
                          <span className="text-zinc-500 font-bold text-[10px] uppercase">Required</span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-2 border-b border-zinc-800 last:border-0">
                          <code className="text-zinc-300">typescript</code>
                          <span className="text-zinc-600 font-bold text-[10px] uppercase">Dev</span>
                        </div>
                        <p className="text-xs text-zinc-600 font-medium">No other external dependencies required.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'quick-start' && (
            <motion.div 
              key="quick-start"
              id="quick-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">1. Install via npm</h4>
                    <button 
                      onClick={() => copyToClipboard(installCommand)}
                      className="text-indigo-400 hover:text-white transition-colors text-[10px] font-bold uppercase"
                    >
                      {copied ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <CodeBlock code={installCommand} lang="bash" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">2. Implementation Example</h4>
                    <button 
                      onClick={() => copyToClipboard(skill.code_example)}
                      className="text-indigo-400 hover:text-white transition-colors text-[10px] font-bold uppercase"
                    >
                      {copied ? 'Copied ✓' : 'Copy Full Example'}
                    </button>
                  </div>
                  <CodeBlock code={skill.code_example} lang="typescript" />
                </div>

                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-500 shadow-lg shadow-emerald-500/5">
                  <Zap className="w-6 h-6 fill-current" />
                  <p className="text-sm font-bold uppercase tracking-widest leading-none">⚡ Time to first result: under 5 minutes</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'operations' && (
            <motion.div 
              key="operations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 font-medium">
                  <tr>
                    <th className="p-8 font-black uppercase text-[10px] tracking-widest">Operation</th>
                    <th className="p-8 font-black uppercase text-[10px] tracking-widest">Permission</th>
                    <th className="p-8 font-black uppercase text-[10px] tracking-widest">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {[
                    { name: 'execute', perm: 'allow', desc: 'Main logic execution. Fully isolated within the Helm kernel.' },
                    { name: 'notify', perm: 'ask', desc: 'System notifications and alerts. Requires explicit user approval.' }
                  ].map((op) => (
                    <tr key={op.name} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-8 font-mono text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">{op.name}</td>
                      <td className="p-8">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-widest ${
                          op.perm === 'allow' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {op.perm}
                        </span>
                      </td>
                      <td className="p-8 text-zinc-500 font-medium leading-relaxed">{op.desc}</td>
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
              className="space-y-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-zinc-900 pb-16">
                <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-inner">
                  <div className="text-7xl font-semibold text-white mb-2 tracking-tighter">{reviewStats.average}</div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">{reviewStats.total} verified installs</p>
                  <div className="space-y-4">
                    {reviewStats.breakdown.map(b => (
                      <div key={b.stars} className="flex items-center gap-4 text-[10px] font-bold">
                        <span className="w-4 text-zinc-500">{b.stars}★</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${b.percentage}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="h-full bg-zinc-400 shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
                          />
                        </div>
                        <span className="w-8 text-left text-zinc-600 font-mono">{b.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-12">
                  {placeholderReviews.slice(0, 3).map(r => (
                    <div key={r.id} className="pb-12 border-b border-zinc-900 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={r.avatar} alt={r.user} className="w-10 h-10 rounded-full grayscale border border-zinc-800 shadow-xl" />
                        <div>
                          <p className="text-base font-medium text-white">{r.user}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{r.date}</p>
                        </div>
                      </div>
                      <p className="text-zinc-400 leading-[1.8] text-lg italic">"{r.text}"</p>
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
              className="space-y-12"
            >
              <div className="h-[400px] w-full p-10 bg-[#0c0c0e] border border-zinc-800 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.installs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <Area type="monotone" dataKey="installs" stroke="#6366f1" strokeWidth={4} fill="#6366f1" fillOpacity={0.05} />
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
