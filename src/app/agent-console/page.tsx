'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { 
  Bot, Plus, Send, Activity, Info, X, Check, 
  Settings, Trash2, Globe, Lock, Loader2, Sparkles, User,
  Shield, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@/hooks/use-supabase-client'
import { useAuth } from '@clerk/nextjs'

// Agent Console - Unified High-Performance Interface
export default function AgentConsolePage() {
  const { userId } = useAuth()
  const supabase = useSupabaseClient()
  const router = useRouter()
  
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [creationLoading, setCreationLoading] = useState(false)
  
  // Create Form State
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDescription] = useState('')
  const [newModel, setNewModel] = useState('google/gemini-2.0-flash-001')

  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch Agents via direct Supabase SDK
  const fetchAgents = async () => {
    if (!userId) return
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*, agent_skills(*, skills(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setAgents(data || [])
      if (data && data.length > 0 && !selectedAgent) {
        setSelectedAgent(data[0])
      }
    } catch (err: any) {
      console.error('Failed to fetch agents:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchAgents()
    }
  }, [userId])

  // Chat Logic
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: selectedAgent ? `/api/agent/${selectedAgent.id}/chat` : undefined,
    id: selectedAgent?.id,
  })

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Reset chat when switching agents
  useEffect(() => {
    if (selectedAgent) {
        setMessages([
            { id: 'welcome', role: 'assistant', content: `Neural bridge established. Sovereign Agent "${selectedAgent.name}" is online and ready for deployment. How can I assist you?` }
        ])
    }
  }, [selectedAgent?.id])

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setCreationLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert({
          user_id: userId,
          name: newName,
          description: newDesc,
          model_id: newModel,
          is_public: false
        })
        .select()
        .single()
      
      if (error) throw error
      
      setShowCreateModal(false)
      setNewName('')
      setNewDescription('')
      
      // Immediate refresh from Supabase
      const { data: refreshedAgents } = await supabase
          .from('agents')
          .select('*, agent_skills(*, skills(*))')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      
      if (refreshedAgents) {
          setAgents(refreshedAgents)
          const newAgent = refreshedAgents.find((a: any) => a.id === data.id)
          if (newAgent) setSelectedAgent(newAgent)
      }
    } catch (err: any) {
      console.error('Agent creation failed:', err.message)
      alert(`Deployment Failed: ${err.message || 'Unknown error'}`)
    } finally {
      setCreationLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] gap-6">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-zinc-500 font-black uppercase tracking-[0.3em] animate-pulse">Initializing Neural Console</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0a0a0a] overflow-hidden">
      
      {/* 1. AGENT SELECTOR SIDEBAR */}
      <aside className={`w-80 border-r border-zinc-800/50 bg-[#0c0c0c] flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:opacity-0'}`}>
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-500" />
            Neural Instances
          </h2>
          <Button 
            onClick={() => setShowCreateModal(true)}
            size="icon" 
            className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {agents.length === 0 ? (
            <div className="py-12 px-6 text-center border border-zinc-800 border-dashed rounded-2xl opacity-50">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                No agents deployed.<br/>Initialize your first instance.
              </p>
            </div>
          ) : (
            agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                  selectedAgent?.id === agent.id 
                    ? 'bg-indigo-600/10 border border-indigo-600/20 shadow-lg shadow-indigo-600/5' 
                    : 'border border-transparent hover:bg-zinc-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  selectedAgent?.id === agent.id ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'
                }`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div className="text-left flex-1 truncate">
                  <div className={`text-sm font-bold truncate ${selectedAgent?.id === agent.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {agent.name}
                  </div>
                  <div className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-400 truncate">
                    {agent.model_id}
                  </div>
                </div>
                {selectedAgent?.id === agent.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="p-6 border-t border-zinc-800/50 bg-black/20">
           <div className="flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              <span>Status</span>
              <span className="text-emerald-500">Global Ready</span>
           </div>
        </div>
      </aside>

      {/* 2. MAIN CONSOLE / CHAT */}
      <main className="flex-1 flex flex-col relative bg-black/20">
        {!selectedAgent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
             <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center mb-8 text-zinc-700">
                <Bot className="w-12 h-12" />
             </div>
             <h2 className="text-2xl font-black text-white tracking-tighter mb-4">Command Center Idle</h2>
             <p className="text-zinc-500 max-w-sm font-medium mb-8 leading-relaxed">
                Select an existing neural instance from the sidebar or deploy a new agent to begin execution.
             </p>
             <Button 
                onClick={() => setShowCreateModal(true)}
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-full font-black uppercase tracking-widest text-xs"
             >
                Initialize Instance
             </Button>
          </div>
        ) : (
          <>
            {/* Console Header */}
            <header className="h-16 border-b border-zinc-800/50 px-8 flex items-center justify-between backdrop-blur-xl bg-black/20 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden text-zinc-500" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Activity className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">{selectedAgent.name}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{selectedAgent.model_id}</span>
                    <span className="text-zinc-700 text-[8px]">•</span>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Bridged</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white rounded-lg">
                    <Settings className="w-4 h-4" />
                 </Button>
              </div>
            </header>

            {/* Chat Output */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : ''}`}
                >
                  {m.role !== 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-black/50">
                        <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`max-w-2xl space-y-4 ${m.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-6 rounded-3xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/10 rounded-tr-none' 
                        : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none backdrop-blur-sm shadow-xl'
                    }`}>
                      {m.content}
                    </div>

                    {/* Tool Tracking */}
                    {m.toolInvocations?.map((ti: any) => (
                        <div key={ti.toolCallId} className="p-4 bg-black/40 border border-zinc-800 rounded-2xl flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ti.state === 'result' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'}`}>
                                {ti.state === 'result' ? <Check className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                              </div>
                              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                EXEC: {ti.toolName.replace('__', ': ')}
                              </div>
                          </div>
                          {ti.state === 'result' && (
                            <div className="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">Success</div>
                          )}
                        </div>
                    ))}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/20">
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
                    <div className="h-10 w-24 bg-zinc-900/50 border border-zinc-800 rounded-full flex items-center justify-center gap-1 backdrop-blur-md">
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce delay-100" />
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-8 border-t border-zinc-800/50 bg-black/40 backdrop-blur-2xl">
              <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto group">
                <input 
                  placeholder={`Send instructions to ${selectedAgent.name}...`}
                  className="w-full h-16 bg-zinc-950 border border-zinc-800 rounded-2xl pl-6 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700 shadow-2xl"
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
              <div className="flex items-center justify-center gap-6 mt-6">
                 <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Sanitized Environment</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-indigo-500" />
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Low Latency Bridge</span>
                 </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* 3. CREATION MODAL OVERLAY */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2rem] p-10 shadow-2xl"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-500 shadow-2xl shadow-indigo-600/10">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-2">Deploy New Instance</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Configuring neural pathways</p>
              </div>

              <form onSubmit={handleCreateAgent} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Instance Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ALPHA-ASSISTANT"
                    className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Neural Model</label>
                  <select 
                    className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
                    value={newModel}
                    onChange={e => setNewModel(e.target.value)}
                  >
                    <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="openai/gpt-4o">GPT-4o</option>
                  </select>
                </div>

                <Button 
                  type="submit" 
                  disabled={creationLoading || !newName}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20"
                >
                  {creationLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Initialize Deployment'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
