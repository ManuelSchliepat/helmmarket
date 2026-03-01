'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Bot, User, Send, Package, Activity, Info, ChevronRight, CheckCircle2, AlertCircle, Loader2, Sparkles, Globe, Shield, Lock, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AgentConsolePage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'identity' | 'chronos'>('chat')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/agent/${agentId}/chat`,
    id: agentId,
    initialMessages: [
      { id: 'welcome', role: 'assistant', content: `Hello! I'm your configured agent, ${agent?.name || 'Sovereign Assistant'}. How can I assist you today using my attached skills?` }
    ],
  })

  useEffect(() => {
    async function fetchAgent() {
        try {
            const res = await fetch(`/api/agents`)
            const data = await res.json()
            let found = data.agents?.find((a: any) => a.id === agentId)
            
            if (!found) {
                // Try hardcoded demo if DB fails or table missing
                if (agentId === 'demo-agent') {
                  found = {
                    id: 'demo-agent',
                    name: 'Sovereign Assistant',
                    description: 'A high-performance agent for marketplace management and security audits.',
                    model_id: 'gemini-2.0-flash',
                    is_public: true,
                    agent_skills: [
                      { skill_id: 'sec-1', skills: { name: 'vuln-scanner', slug: 'vuln-scanner', category: 'security' } },
                      { skill_id: 'gen-1', skills: { name: 'weather', slug: 'weather', category: 'general' } }
                    ]
                  }
                }
            }
            
            if (found) {
                setAgent(found)
            }
        } catch (err) {
            console.error('Failed to fetch agent info:', err)
        } finally {
            setLoading(false)
        }
    }
    fetchAgent()
  }, [agentId])

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, activeTab])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] gap-6">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-zinc-500 font-medium animate-pulse">Initializing neural bridge...</p>
    </div>
  )

  if (!agent && !loading) return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] gap-6">
          <AlertCircle className="w-16 h-16 text-red-500/50" />
          <h2 className="text-2xl font-bold text-white">Agent Not Found</h2>
          <Button onClick={() => router.push('/dashboard/agents')} variant="outline" className="rounded-full border-zinc-800 text-zinc-300">
              Back to Dashboard
          </Button>
      </div>
  )

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a0a]">
      {/* Tab Bar (Vertical, Left) */}
      <aside className="w-16 border-r border-zinc-800/50 bg-[#0c0c0c] flex flex-col items-center py-6 gap-6 shrink-0">
         <Button 
            variant="ghost" 
            size="icon" 
            className={`w-10 h-10 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-indigo-500/10 text-indigo-500' : 'text-zinc-600 hover:text-white'}`}
            onClick={() => setActiveTab('chat')}
            title="Chat Console"
         >
            <Bot className="w-5 h-5" />
         </Button>
         <Button 
            variant="ghost" 
            size="icon" 
            className={`w-10 h-10 rounded-xl transition-all ${activeTab === 'identity' ? 'bg-indigo-500/10 text-indigo-500' : 'text-zinc-600 hover:text-white'}`}
            onClick={() => setActiveTab('identity')}
            title="Identity Screen"
         >
            <User className="w-5 h-5" />
         </Button>
         <Button 
            variant="ghost" 
            size="icon" 
            className={`w-10 h-10 rounded-xl transition-all ${activeTab === 'chronos' ? 'bg-indigo-500/10 text-indigo-500' : 'text-zinc-600 hover:text-white'}`}
            onClick={() => setActiveTab('chronos')}
            title="Chronos Tab (Timeline)"
         >
            <Activity className="w-5 h-5" />
         </Button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/50 px-8 flex items-center justify-between bg-black/20 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-500">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">{agent.name}</h1>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{agent.model_id}</span>
                 <span className="text-zinc-700 text-[8px]">•</span>
                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Connected</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Activity className="w-4 h-4" />
             </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth custom-scrollbar">
                {messages.map((m) => (
                  <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {m.role !== 'user' && (
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0">
                          <Bot className="w-5 h-5" />
                      </div>
                    )}
                    <div className={`max-w-2xl space-y-4 ${m.role === 'user' ? 'order-first' : ''}`}>
                      <div className={`p-6 rounded-3xl text-sm leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10 rounded-tr-none' 
                          : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none'
                      }`}>
                        {m.content}
                      </div>

                      {/* Tool Call Indicators */}
                      {m.toolInvocations?.map((ti: any) => (
                          <div key={ti.toolCallId} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ti.state === 'result' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'}`}>
                                  {ti.state === 'result' ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                </div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                  {ti.toolName.replace('__', ': ')}
                                </div>
                            </div>
                            {ti.state === 'result' && (
                              <div className="text-[9px] font-bold text-zinc-600 uppercase">Success</div>
                            )}
                          </div>
                      ))}
                    </div>
                    {m.role === 'user' && (
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                          <User className="w-5 h-5" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && messages[messages.length-1]?.role !== 'assistant' && (
                    <div className="flex gap-6">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 animate-pulse">
                          <Bot className="w-5 h-5" />
                      </div>
                      <div className="h-10 w-24 bg-zinc-900/50 border border-zinc-800 rounded-full flex items-center justify-center gap-1">
                        <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-8 border-t border-zinc-800/50 bg-black/20 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
                  <input 
                    placeholder="Message your agent..."
                    className="w-full h-16 bg-zinc-900 border border-zinc-800 rounded-2xl pl-6 pr-20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <button 
                    type="submit"
                    disabled={!input || isLoading}
                    className="absolute right-3 top-3 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-4">
                  AI can make mistakes. Always review critical tool results.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'identity' && (
            <motion.div 
              key="identity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto p-12 space-y-16"
            >
              <section className="max-w-4xl mx-auto">
                 <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-16">
                    <div className="w-32 h-32 bg-indigo-600/10 border border-indigo-600/20 rounded-[3rem] flex items-center justify-center text-indigo-600 shadow-2xl shadow-indigo-600/10">
                       <Bot className="w-16 h-16" />
                    </div>
                    <div className="flex-1">
                       <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{agent.name}</h2>
                       <p className="text-zinc-500 text-lg leading-relaxed max-w-xl">{agent.description || 'No description provided.'}</p>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="bg-zinc-900/50 border-zinc-800 p-8 rounded-3xl">
                       <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Agent Identity
                       </h3>
                       <div className="space-y-6">
                          <div>
                             <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Unique ID</div>
                             <code className="text-sm text-white font-mono bg-black p-2 rounded-lg border border-zinc-800 block">{agent.id}</code>
                          </div>
                          <div>
                             <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Base Model</div>
                             <div className="text-sm text-white font-bold">{agent.model_id}</div>
                          </div>
                          <div>
                             <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Visibility</div>
                             <div className="text-sm text-emerald-500 font-bold uppercase tracking-widest">{agent.is_public ? 'Public' : 'Private'}</div>
                          </div>
                       </div>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800 p-8 rounded-3xl">
                       <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Security Context
                       </h3>
                       <div className="space-y-6">
                          <div className="flex items-center justify-between">
                             <span className="text-sm text-zinc-400">Sandbox Mode</span>
                             <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-sm text-zinc-400">PII Filtering</span>
                             <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-sm text-zinc-400">Human-in-the-Loop</span>
                             <span className="text-[10px] font-black text-amber-500 uppercase bg-amber-500/10 px-2 py-1 rounded">Ask Mode</span>
                          </div>
                       </div>
                    </Card>
                 </div>

                 <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-8">Service Cards (Attached Skills)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {agent.agent_skills?.map((as: any) => (
                      <Link key={as.skill_id} href={`/skills/${as.skills?.slug}`} className="group">
                        <Card className="bg-zinc-900/50 border-zinc-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all group-hover:shadow-2xl group-hover:shadow-indigo-500/5">
                           <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 mb-4 group-hover:text-indigo-400 transition-colors">
                              <Package className="w-5 h-5" />
                           </div>
                           <h4 className="text-sm font-bold text-white mb-1">{as.skills?.name}</h4>
                           <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{as.skills?.category}</div>
                        </Card>
                      </Link>
                    ))}
                 </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'chronos' && (
            <motion.div 
              key="chronos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto p-12 space-y-8"
            >
               <div className="max-w-4xl mx-auto">
                 <h2 className="text-2xl font-black text-white tracking-tighter mb-12">Chronos Timeline</h2>
                 
                 <div className="relative border-l-2 border-zinc-900 ml-4 pl-10 space-y-16 pb-20">
                    {messages.filter(m => m.toolInvocations).map((m, mi) => (
                      <div key={mi} className="relative">
                         <div className="absolute -left-[51px] top-0 w-10 h-10 bg-black border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-600/20">
                            <Activity className="w-4 h-4" />
                         </div>
                         <div className="space-y-6">
                            <div className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">{new Date().toLocaleTimeString()}</div>
                            <div className="text-white font-bold text-lg">Batch Tool Execution Phase</div>
                            
                            <div className="grid gap-4">
                               {m.toolInvocations?.map((ti: any, tii) => (
                                 <Card key={tii} className="bg-zinc-900/50 border-zinc-800 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{ti.toolName}</span>
                                       <span className="text-[10px] font-bold text-zinc-600">COMPLETED</span>
                                    </div>
                                    <div className="font-mono text-[10px] text-zinc-500 p-4 bg-black rounded-xl border border-zinc-900">
                                       <div className="text-emerald-500/80 mb-2">▶ Input: {JSON.stringify(ti.args)}</div>
                                       <div className="text-zinc-500">◀ Result: {JSON.stringify(ti.result)}</div>
                                    </div>
                                 </Card>
                               ))}
                            </div>
                         </div>
                      </div>
                    ))}
                    {(!messages.some(m => m.toolInvocations)) && (
                      <div className="py-24 text-center">
                         <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Waiting for first execution event...</p>
                      </div>
                    )}
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sidebar: Quick Actions */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-zinc-800/50 bg-[#0c0c0c] flex flex-col overflow-hidden shrink-0"
          >
            <div className="h-16 px-6 border-b border-zinc-800/50 flex items-center justify-between shrink-0">
               <h2 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-4 h-4 text-indigo-500" />
                 Quick Inject
               </h2>
               <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white rounded-lg" onClick={() => setSidebarOpen(false)}>
                  <X className="w-4 h-4" />
               </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
               <div>
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Active Assets</h3>
                  <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl">
                     <p className="text-[10px] font-bold text-zinc-500 leading-loose uppercase tracking-widest">
                        Drag & Drop assets here to inject into the agent's context.
                     </p>
                  </div>
               </div>

               <div>
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Recent Tool Metrics</h3>
                  <div className="space-y-4">
                     {['Latency', 'Success Rate', 'Token Cost'].map(metric => (
                        <div key={metric} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                           <span className="text-xs font-medium text-zinc-400">{metric}</span>
                           <span className="text-xs font-bold text-white">{metric === 'Latency' ? '124ms' : metric === 'Success Rate' ? '100%' : '€0.04'}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-zinc-800/50 bg-black/20">
               <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20">
                  Inject Global Asset
               </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
