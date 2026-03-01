'use client'

/** BUILD VERIFICATION: CLEAN DEPLOYMENT V4 (Workbench Integration) **/

import { useState, useEffect } from 'react'
import { 
  Bot, Plus, Activity, X, Check, 
  Settings, Globe, Lock, Loader2, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import AgentWorkbench from '@/components/workbench/AgentWorkbench'

// Agent Console - Unified High-Performance Interface with Visual Workbench
export default function AgentConsolePage() {
  const { userId } = useAuth()
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

  // Fetch Agents via server-side API routes
  const fetchAgents = async () => {
    if (!userId) return
    try {
      const res = await fetch('/api/agents')
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setAgents(data.agents || [])
      
      if (data.agents && data.agents.length > 0 && !selectedAgent) {
        setSelectedAgent(data.agents[0])
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

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setCreationLoading(true)
    
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          model_id: newModel,
          is_public: false
        })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Creation failed')
      
      setShowCreateModal(false)
      setNewName('')
      setNewDescription('')
      
      await fetchAgents()
      
      if (data.agent_id) {
          const resRefresh = await fetch('/api/agents')
          const dataRefresh = await resRefresh.json()
          const newAgent = dataRefresh.agents?.find((a: any) => a.id === data.agent_id)
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
    <div className="flex h-[calc(100vh-64px)] bg-[#0a0a1a] overflow-hidden">
      
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

      {/* 2. MAIN WORKBENCH */}
      <main className="flex-1 flex flex-col relative">
        {!selectedAgent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-black/20">
             <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center mb-8 text-zinc-700">
                <Bot className="w-12 h-12" />
             </div>
             <h2 className="text-2xl font-black text-white tracking-tighter mb-4">Workbench Idle</h2>
             <p className="text-zinc-500 max-w-sm font-medium mb-8 leading-relaxed">
                Select an existing neural instance from the sidebar or deploy a new agent to begin configuring your workbench.
             </p>
             <Button 
                onClick={() => setShowCreateModal(true)}
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-full font-black uppercase tracking-widest text-xs"
             >
                Initialize Instance
             </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Header */}
            <header className="h-16 border-b border-zinc-800/50 px-8 flex items-center justify-between backdrop-blur-xl bg-black/20 absolute top-0 left-0 right-0 z-10">
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
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Workbench Connected</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white rounded-lg">
                    <Settings className="w-4 h-4" />
                 </Button>
              </div>
            </header>

            {/* THE WORKBENCH CANVAS */}
            <div className="flex-1 pt-16">
               <AgentWorkbench agentId={selectedAgent.id} />
            </div>
          </div>
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
