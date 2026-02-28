'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import { 
  placeholderReviews, reviewStats, changelog, chartData, providers, Provider, Skill
} from '@/lib/placeholder-data'
import { Star, CheckCircle2, Copy, Shield, ShieldAlert, ShieldX, TerminalSquare, Info, History, BarChart3, MessageSquare, Zap, ShieldCheck } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { motion, AnimatePresence } from 'framer-motion'

export function SkillDetailClient({ skill }: { skill: Skill }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider>(skill.providers[0] || 'openai')

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
  
  const complianceTooltips: Record<string, string> = {
    'EU_AI_ACT': 'Fully compliant with EU AI Act safety and transparency regulations.',
    'US_FEDERAL': 'Meets US Federal AI safety guidelines and reporting standards.',
    'GDPR': 'Validated for data privacy and Right to be Forgotten compliance.',
    'SOC2': 'Independent audit confirms high security and operational availability.',
    'ISO27001': 'Complies with international information security management standards.'
  };

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl font-black mb-6 tracking-tight">Enterprise Infrastructure</h2>
                    <p className="text-gray-400 text-lg leading-relaxed font-medium">
                      Built for high-scale agent deployments. This skill implements provider-agnostic logic allowing seamless transitions between backends.
                    </p>
                  </div>

                  {/* Provider Grid */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Supported Infrastructure</h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.providers.map(pId => {
                        const p = providers.find(provider => provider.id === pId);
                        return (
                          <Badge key={pId} className="px-3 py-1.5 rounded-xl border border-gray-800 bg-gray-900/50 text-xs font-bold text-gray-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p?.color }} />
                            {p?.name}
                          </Badge>
                        );
                      })}
                      {skill.provider_switchable && (
                        <Badge className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-[10px] tracking-widest border-indigo-500 shadow-lg shadow-indigo-600/20">
                          PROVIDER-AGNOSTIC ✓
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Compliance Shield Row */}
                  {skill.compliance_labels.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Compliance & Auditing</h3>
                      <div className="flex flex-wrap gap-4">
                        {skill.compliance_labels.map(label => (
                          <div key={label} className="group relative flex flex-col items-center">
                            <div className={`p-3 rounded-2xl border transition-all ${
                              label === 'EU_AI_ACT' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                              label === 'US_FEDERAL' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                              label === 'GDPR' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                              'bg-gray-500/10 border-gray-500/20 text-gray-400'
                            }`}>
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-black mt-2 tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 text-[10px] font-bold leading-relaxed text-gray-300 text-center">
                              {complianceTooltips[label]}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-10">
                  {/* Installation Block */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rapid Deployment</h3>
                      {skill.provider_switchable && (
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Selected Backend</label>
                          <select 
                            className="bg-gray-900 border border-gray-800 rounded-lg text-[10px] font-bold px-2 py-1 outline-none text-white cursor-pointer"
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value as Provider)}
                          >
                            {skill.providers.map(p => (
                              <option key={p} value={p}>{p.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="relative group not-prose">
                      <CodeBlock code={installCommand} lang="bash" />
                      <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all opacity-0 group-hover:opacity-100 shadow-2xl">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2rem] shadow-inner">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Works with</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Claude', 'Cursor', 'Gemini', 'ChatGPT', 'VSCode'].map(tool => (
                        <div key={tool} className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-white transition-colors cursor-default">
                          <TerminalSquare className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" /> {tool}
                        </div>
                      ))}
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
              <div className="bg-[#0c0c0e] border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900/50 border-b border-gray-800 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="p-8 font-black">Operation</th>
                      <th className="p-8 font-black text-center">Protocol</th>
                      <th className="p-8 font-black">Security Policy</th>
                      <th className="p-8 font-black">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-gray-300">
                    {[
                      { name: 'executeAnalysis', type: 'HTTPS/TLS', perm: 'allow', color: 'emerald', desc: 'Main processing engine. Fully isolated execution.' },
                      { name: 'writeStorage', type: 'FS/WRITE', perm: 'ask', color: 'amber', desc: 'Writes to persistent sandbox storage. Requires explicit intent.' },
                      { name: 'networkBridge', type: 'TCP/CONN', perm: 'deny', color: 'red', desc: 'Direct bridge bypass. Restricted by kernel policy.' }
                    ].map((op) => (
                      <tr key={op.name} className="hover:bg-gray-800/20 transition-colors group">
                        <td className="p-8 font-mono font-black text-indigo-400 group-hover:translate-x-1 transition-transform">{op.name}</td>
                        <td className="p-8 text-center"><span className="bg-gray-900 text-gray-500 px-2 py-1 rounded text-[10px] font-mono border border-gray-800">{op.type}</span></td>
                        <td className="p-8">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-sm ${
                            op.perm === 'allow' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            op.perm === 'ask' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            <Shield className="w-3 h-3" />
                            {op.perm}
                          </span>
                        </td>
                        <td className="p-8 text-gray-500 leading-relaxed font-bold text-xs uppercase tracking-tight">{op.desc}</td>
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
                <div className="w-full lg:w-80 shrink-0 bg-gray-900/30 p-10 rounded-[2.5rem] border border-gray-800 text-center shadow-inner">
                  <div className="text-8xl font-black text-white mb-4 tracking-tighter">{reviewStats.average}</div>
                  <div className="flex justify-center gap-1.5 text-amber-500 mb-6">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
                  </div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-12">{reviewStats.total} verified installs</p>
                  <div className="space-y-5">
                    {reviewStats.breakdown.map(b => (
                      <div key={b.stars} className="flex items-center gap-4 text-[11px] font-black tracking-widest">
                        <span className="w-10 text-right text-gray-400">{b.stars}★</span>
                        <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${b.percentage}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                          />
                        </div>
                        <span className="w-10 text-left text-gray-600">{b.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 space-y-10">
                  <div className="flex justify-between items-center pb-8 border-b border-gray-800">
                    <h3 className="text-2xl font-black tracking-tighter">Verified Feedback</h3>
                    <select className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 outline-none hover:text-white transition-all cursor-pointer">
                      <option>Sort: Most Helpful</option>
                      <option>Sort: Newest</option>
                      <option>Sort: Highest Rated</option>
                    </select>
                  </div>
                  
                  <div className="divide-y divide-gray-800/50">
                    {placeholderReviews.map(r => (
                      <div key={r.id} className="py-12 first:pt-0">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-5">
                            <img src={r.avatar} alt={r.user} className="w-14 h-14 rounded-2xl border-2 border-gray-800 shadow-xl" />
                            <div>
                              <p className="text-lg font-black text-white tracking-tight">{r.user}</p>
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">{r.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-800'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-400 text-lg italic leading-relaxed font-medium">"{r.text}"</p>
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
                <div className="space-y-20">
                  {changelog.map((log, i) => (
                    <div key={log.version} className="relative pl-16">
                      <div className="absolute left-[-6px] top-2 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] ring-4 ring-black" />
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-6">
                          <span className="text-3xl font-black text-white tracking-tighter">{log.version}</span>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-gray-900 border border-gray-800 px-4 py-1.5 rounded-full">{log.date}</span>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-800 rounded-[2rem] p-10 shadow-inner group hover:border-indigo-500/20 transition-all duration-500">
                          <ul className="space-y-6">
                            {log.changes.map((c, j) => (
                              <li key={j} className="flex items-start gap-4 text-gray-400 font-bold text-sm leading-relaxed">
                                <CheckCircle2 className="mt-1 w-4 h-4 text-emerald-500/60 shrink-0" />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Market Reach', val: '1,247', trend: '+12%', sub: 'Total Installs' },
                  { label: 'Infrastructure', val: '842K', trend: '+24%', sub: 'Avg Invocations' },
                  { label: 'Uptime SLA', val: '99.98%', trend: 'Stable', sub: 'Kernel Sandbox' }
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-900/30 border border-gray-800 p-10 rounded-[2.5rem] shadow-inner hover:border-indigo-500/20 transition-all">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">{stat.label}</p>
                    <div className="flex items-end gap-4">
                      <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                      <div className="mb-2 flex flex-col">
                        <span className="text-emerald-400 text-[10px] font-black uppercase">{stat.trend}</span>
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">{stat.sub}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0c0c0e] border border-gray-800 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                <h3 className="text-2xl font-black mb-12 flex items-center gap-3 relative z-10">
                  <BarChart3 className="w-6 h-6 text-indigo-500" />
                  Growth Metrics <span className="text-gray-600 font-bold text-xs ml-4 uppercase tracking-widest opacity-50">— 30 Day Volume</span>
                </h3>
                <div className="h-96 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.installs}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} tickMargin={15} />
                      <YAxis stroke="#52525b" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0c0c0e', borderColor: '#27272a', borderRadius: '24px', fontWeight: 'black', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                        itemStyle={{ color: '#818cf8', textTransform: 'uppercase', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="installs" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorUsage)" />
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
