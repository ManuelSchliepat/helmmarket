'use client'

import { useState, useEffect } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { 
  placeholderReviews, reviewStats, Skill
} from '@/lib/placeholder-data'
import { Info, BarChart3, MessageSquare, Zap, Terminal, Copy, CheckCircle2, ChevronDown, ChevronUp, Play, Loader2, ShieldCheck, BadgeCheck, Monitor, Cpu, Code, FileJson } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function SkillDetailClient({ skill }: { skill: Skill }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isPeerExpanded, setIsPeerExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const [analytics, setAnalytics] = useState<any>(null)

  const [demoPrompt, setDemoPrompt] = useState('')
  const [demoResult, setDemoResult] = useState<any>(null)
  const [isDemoing, setIsDemoing] = useState(false)
  const [demoError, setDemoError] = useState<string | null>(null)

  // Demo purchase state
  const [hasPurchased, setHasPurchased] = useState(false)

  useEffect(() => {
    // Fire view event
    if (skill?.id) {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: skill.id, eventType: 'view' })
      }).catch(console.error)

      // Fetch analytics data
      fetch(`/api/skills/${skill.id}/analytics`)
        .then(res => res.json())
        .then(data => setAnalytics(data))
        .catch(console.error)
    }
  }, [skill?.id])

  const runDemo = async () => {
    if (!demoPrompt.trim()) return;
    setIsDemoing(true);
    setDemoError(null);
    setDemoResult(null);

    try {
      const res = await fetch('/api/skills/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: skill.slug, prompt: demoPrompt })
      });
      const data = await res.json();
      if (!res.ok) {
        setDemoError(data.message || data.error || 'Execution failed');
      } else {
        setDemoResult(data);
      }
    } catch (e: any) {
      setDemoError(e.message);
    } finally {
      setIsDemoing(false);
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'quick-start', label: 'Quick Start', icon: Zap },
    { id: 'operations', label: 'Operations', icon: Terminal },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'usage', label: 'Usage', icon: BarChart3 }
  ]

  const installCommand = `helm install ${skill.registry_endpoint || skill.slug}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const complianceInfo: Record<string, { label: string, desc: string }> = {
    'EU_AI_ACT': { label: 'EU AI Act', desc: 'Tested against the requirements of the European AI Act for high-risk systems.' },
    'GDPR': { label: 'GDPR', desc: 'Personal data processing is minimal, transparent, and compliant with EU General Data Protection Regulation.' },
    'SOC2': { label: 'SOC2', desc: 'System and Organization Controls 2 compliant. Covers security, availability, and processing integrity.' },
    'ISO27001': { label: 'ISO27001', desc: 'International standard for information security management systems.' },
  };

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
            <tab.icon className="w-4 h-4" />
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
                <h3 className="text-xl font-medium text-white mb-6 tracking-tight font-semibold">Capabilities</h3>
                <p className="text-zinc-400 text-lg leading-[1.8] max-w-3xl font-normal">
                  {skill.description}
                </p>
              </div>

              {/* What you get */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Code, text: "Skill source code + documentation" },
                  { icon: FileJson, text: "MCP manifest file (plug-and-play ready)" },
                  { icon: Cpu, text: "Example agent configuration" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-zinc-300">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Requirements & Installation Preview */}
              <div className="space-y-8 pt-8 border-t border-zinc-900">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Requirements</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    Any MCP-compatible agent — Claude Desktop, Cursor, or a custom agent built with LangChain, AutoGen, or similar.
                  </p>
                  <Link href="/docs/what-is-mcp" className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                    What is MCP? →
                  </Link>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    Installation
                  </h3>
                  
                  <div className="relative group">
                    {!hasPurchased && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl border border-zinc-800/50">
                        <div className="text-center px-6">
                          <p className="text-sm font-bold text-white mb-2">Purchase to unlock install command</p>
                          <p className="text-xs text-zinc-500 font-medium">Get permanent access to this skill across all your agents.</p>
                        </div>
                      </div>
                    )}
                    <div className={!hasPurchased ? 'opacity-20 select-none grayscale pointer-events-none' : ''}>
                      <div className="flex items-center justify-between px-1 mb-2">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">CLI Command</h4>
                        {hasPurchased && (
                          <button 
                            onClick={() => copyToClipboard(installCommand)}
                            className="text-indigo-400 hover:text-white transition-colors text-[10px] font-bold uppercase"
                          >
                            {copied ? 'Copied ✓' : 'Copy'}
                          </button>
                        )}
                      </div>
                      <CodeBlock code={installCommand} lang="bash" />
                    </div>
                  </div>
                </div>
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

          {activeTab === 'compliance' && (
            <motion.div 
              key="compliance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="prose prose-zinc prose-invert max-w-none">
                <h3 className="text-xl font-medium text-white mb-6 tracking-tight font-semibold">Compliance & Security</h3>
                <p className="text-zinc-400 text-lg leading-[1.8] max-w-3xl font-normal">
                  All skills on Helm Market undergo manual review. Verified skills also receive a comprehensive legal and technical audit.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skill.compliance_labels?.map(label => (
                  <div key={label} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white tracking-tight">{complianceInfo[label]?.label || label}</h4>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      {complianceInfo[label]?.desc || 'Verified compliance label.'}
                    </p>
                  </div>
                ))}
                {(!skill.compliance_labels || skill.compliance_labels.length === 0) && (
                  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col items-center text-center">
                    <ShieldCheck className="w-12 h-12 text-zinc-700 mb-4" />
                    <h4 className="text-lg font-bold text-white mb-2 tracking-tight">No specific labels</h4>
                    <p className="text-sm text-zinc-500 font-medium">This skill is standard and has not yet applied for specific compliance badges.</p>
                  </div>
                )}
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

                {/* Try it live sandbox */}
                <div className="mt-12 border border-zinc-800 rounded-2xl bg-[#0c0c0e] overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        Try it live
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 font-medium">Test execution without installing</p>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded-lg border border-zinc-800">
                      3 free tries / hour
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="relative">
                      <div className="absolute top-4 left-4 text-zinc-600 font-mono text-sm">&gt;</div>
                      <input
                        type="text"
                        value={demoPrompt}
                        onChange={e => setDemoPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && runDemo()}
                        placeholder={`Type a prompt for ${skill.name}...`}
                        className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-10 pr-32 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-shadow placeholder:text-zinc-700"
                      />
                      <button
                        onClick={runDemo}
                        disabled={isDemoing || !demoPrompt.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        {isDemoing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Play className="w-3.5 h-3.5 fill-current" /> Run</>}
                      </button>
                    </div>

                    {demoError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-sm font-medium text-red-500">{demoError}</p>
                        {demoError.includes('unlimited') && (
                          <Link href="/onboarding" className="text-xs text-red-400 underline mt-2 block font-bold">Sign up for unlimited →</Link>
                        )}
                      </div>
                    )}

                    {demoResult && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Executed in {demoResult._meta?.executionMs}ms
                        </div>
                        <CodeBlock code={JSON.stringify(demoResult, null, 2)} lang="json" />
                      </div>
                    )}
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
                  <div className="text-7xl font-semibold text-white mb-2 tracking-tighter font-semibold">{reviewStats.average}</div>
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
              {analytics ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Total Installs</p>
                      <h3 className="text-3xl font-bold text-white">{analytics.totalInstalls}</h3>
                    </div>
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Views this week</p>
                      <h3 className="text-3xl font-bold text-white">{analytics.totalViews}</h3>
                    </div>
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Executions</p>
                      <h3 className="text-3xl font-bold text-white">{analytics.totalExecutions}</h3>
                    </div>
                  </div>

                  <div className="h-[400px] w-full p-10 bg-[#0c0c0e] border border-zinc-800 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                        <XAxis dataKey="date" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <Area type="monotone" dataKey="installs" stroke="#6366f1" strokeWidth={4} fill="#6366f1" fillOpacity={0.05} />
                        <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={4} fill="#10b981" fillOpacity={0.05} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="text-center text-zinc-500 py-12">Loading analytics...</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
