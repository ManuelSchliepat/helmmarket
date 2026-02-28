'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import { 
  placeholderReviews, reviewStats, changelog, chartData 
} from '@/lib/placeholder-data'
import { Star, CheckCircle2, Copy, Shield, ShieldAlert, ShieldX, TerminalSquare, Info, History, BarChart3, MessageSquare, Zap } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { motion, AnimatePresence } from 'framer-motion'

export function SkillDetailClient({ skill }: { skill: any }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`helm install ${skill.registry_endpoint || `@helm-market/${skill.slug}`}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'operations', label: 'Operations', icon: Zap },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'changelog', label: 'Changelog', icon: History },
    { id: 'usage', label: 'Usage Stats', icon: BarChart3 }
  ]

  const installCommand = `helm install ${skill.registry_endpoint || `@helm-market/${skill.slug}`}`;
  const configJson = `{
  "skills": ["${skill.registry_endpoint || `@helm-market/${skill.slug}`}"],
  "permissions": {
    "internet-access": true
  }
}`;

  return (
    <div className="space-y-10">
      <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-8 py-4 font-bold text-sm transition-all duration-300 border-b-2 relative ${
              activeTab === tab.id 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : 'text-gray-600'}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-indigo-500/5 -z-10" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-black mb-6">Documentation</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  This skill allows your AI agent to seamlessly integrate with external services, providing robust functionality out of the box. 
                  Built with security and performance in mind, it follows the latest Helm 1.0 protocols.
                </p>
                
                <h3 className="text-xl font-bold mt-10 mb-4">Quick Start</h3>
                <div className="relative group not-prose">
                  <CodeBlock code={installCommand} lang="bash" />
                  <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all opacity-0 group-hover:opacity-100 shadow-2xl">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>

                <h3 className="text-xl font-bold mt-10 mb-4 text-white">Advanced Configuration</h3>
                <p className="text-gray-400 mb-6">Add the following to your agent's <code className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">helm.config.json</code>:</p>
                <div className="not-prose">
                  <CodeBlock code={configJson} lang="json" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="bg-gray-900/30 border border-gray-800 p-8 rounded-3xl">
                  <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">Works with</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Claude', 'Cursor', 'Gemini', 'ChatGPT', 'VSCode'].map(tool => (
                      <div key={tool} className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 px-4 py-2 rounded-xl text-sm font-bold text-gray-300">
                        <TerminalSquare className="w-4 h-4 text-indigo-400" /> {tool}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-900/10 border border-indigo-500/20 p-8 rounded-3xl">
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> System Requirements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-500">Environment</span>
                      <span className="text-indigo-300">Node.js 18+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-500">Framework</span>
                      <span className="text-indigo-300">Helm 0.2.0+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-500">Sandbox</span>
                      <span className="text-indigo-300">Level 2 (Isolated)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'operations' && (
            <motion.div 
              key="operations"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="bg-[#0c0c0e] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900/50 border-b border-gray-800 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="p-6 font-black">Operation</th>
                      <th className="p-6 font-black">Type</th>
                      <th className="p-6 font-black">Permission</th>
                      <th className="p-6 font-black">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-gray-300">
                    {[
                      { name: 'getData', type: 'read', perm: 'allow', color: 'emerald', desc: 'Fetches real-time data from the primary endpoint.' },
                      { name: 'updateRecord', type: 'write', perm: 'ask', color: 'amber', desc: 'Updates existing metadata. Requires manual user approval.' },
                      { name: 'batchExecute', type: 'admin', perm: 'deny', color: 'red', desc: 'Restricted administrative action. Blocked in basic plan.' }
                    ].map((op) => (
                      <tr key={op.name} className="hover:bg-gray-800/20 transition-colors group">
                        <td className="p-6 font-mono font-bold text-indigo-400">{op.name}</td>
                        <td className="p-6"><Badge variant="outline" className="bg-gray-900 border-gray-800 text-[10px] uppercase font-black">{op.type}</Badge></td>
                        <td className="p-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                            op.perm === 'allow' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            op.perm === 'ask' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {op.perm === 'allow' && <Shield className="w-3 h-3" />}
                            {op.perm === 'ask' && <ShieldAlert className="w-3 h-3" />}
                            {op.perm === 'deny' && <ShieldX className="w-3 h-3" />}
                            {op.perm}
                          </span>
                        </td>
                        <td className="p-6 text-gray-500 leading-relaxed font-medium">{op.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="w-full lg:w-80 shrink-0 bg-gray-900/30 p-10 rounded-3xl border border-gray-800 text-center shadow-inner">
                  <div className="text-7xl font-black text-white mb-4 tracking-tighter">{reviewStats.average}</div>
                  <div className="flex justify-center gap-1.5 text-amber-500 mb-4">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
                  </div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">{reviewStats.total} verified reviews</p>
                  <div className="space-y-4">
                    {reviewStats.breakdown.map(b => (
                      <div key={b.stars} className="flex items-center gap-4 text-[11px] font-black tracking-widest">
                        <span className="w-10 text-right text-gray-400">{b.stars}★</span>
                        <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${b.percentage}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                          />
                        </div>
                        <span className="w-10 text-left text-gray-600">{b.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 space-y-10">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-800">
                    <h3 className="text-xl font-bold">Recent Feedback</h3>
                    <select className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm font-bold text-gray-400 outline-none hover:text-white transition-colors cursor-pointer">
                      <option>Sort: Most Helpful</option>
                      <option>Sort: Newest</option>
                      <option>Sort: Highest Rated</option>
                    </select>
                  </div>
                  
                  <div className="divide-y divide-gray-800/50">
                    {placeholderReviews.map(r => (
                      <div key={r.id} className="py-10 first:pt-0">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <img src={r.avatar} alt={r.user} className="w-12 h-12 rounded-2xl border-2 border-gray-800" />
                            <div>
                              <p className="font-black text-white">{r.user}</p>
                              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mt-1">{r.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-800'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-400 text-lg italic leading-relaxed">"{r.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'changelog' && (
            <motion.div 
              key="changelog"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-3xl mx-auto py-10"
            >
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-gray-800 to-transparent" />
                <div className="space-y-16">
                  {changelog.map((log, i) => (
                    <div key={log.version} className="relative pl-12">
                      <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-white tracking-tighter">{log.version}</span>
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">{log.date}</span>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 shadow-inner">
                          <ul className="space-y-4">
                            {log.changes.map((c, j) => (
                              <li key={j} className="flex items-start gap-3 text-gray-400 font-medium">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/40 shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'usage' && (
            <motion.div 
              key="usage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Active Installs', val: '1,247', trend: '+12%', sub: 'vs last month' },
                  { label: 'Total Invocations', val: '842K', trend: '+24%', sub: 'vs last month' },
                  { label: 'Success Rate', val: '99.98%', trend: 'Stable', sub: 'Last 7 days' }
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-900/30 border border-gray-800 p-8 rounded-3xl shadow-inner">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                    <div className="flex items-end gap-3">
                      <p className="text-4xl font-black text-white tracking-tighter">{stat.val}</p>
                      <div className="mb-1.5 flex flex-col">
                        <span className="text-emerald-400 text-xs font-black">{stat.trend}</span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase">{stat.sub}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0c0c0e] border border-gray-800 p-10 rounded-3xl shadow-2xl">
                <h3 className="text-xl font-bold mb-10 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Installation Growth <span className="text-gray-600 font-medium text-sm ml-2">— Last 30 Days</span>
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.installs}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', fontWeight: 'bold', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Area type="monotone" dataKey="installs" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorUsage)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 16 8.5 7 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
