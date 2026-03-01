'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bot, Plus, X, Check, Globe, Lock, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AgentFormProps {
  availableSkills: any[]
  userId: string
}

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '⚡' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: '🧪' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', icon: '✨' },
]

export function AgentForm({ availableSkills, userId }: AgentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [isPublic, setIsPublic] = useState(false)
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [skillPermissions, setSkillPermissions] = useState<Record<string, Record<string, string>>>({})

  const toggleSkill = (skill: any) => {
    const skillId = skill.id
    if (selectedSkillIds.includes(skillId)) {
        setSelectedSkillIds(prev => prev.filter(id => id !== skillId))
        const newPerms = { ...skillPermissions }
        delete newPerms[skillId]
        setSkillPermissions(newPerms)
    } else {
        setSelectedSkillIds(prev => [...prev, skillId])
        // Init permissions for each operation
        const perms: any = {}
        skill.config?.operations?.forEach((op: any) => {
            perms[op.name] = 'ask' // Default
        })
        setSkillPermissions(prev => ({ ...prev, [skillId]: perms }))
    }
  }

  const updatePermission = (skillId: string, opName: string, mode: string) => {
      setSkillPermissions(prev => ({
          ...prev,
          [skillId]: {
              ...(prev[skillId] || {}),
              [opName]: mode
          }
      }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Map permissions for the API
      const skill_configs = selectedSkillIds.map(sid => ({
          id: sid,
          permissions: skillPermissions[sid] || {}
      }))

      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          model_id: selectedModel,
          is_public: isPublic,
          skill_configs // Sending detailed configs instead of just IDs
        })
      })

      if (res.ok) {
        router.push('/dashboard/agents')
        router.refresh()
      } else {
        const err = await res.json()
        alert(`Error: ${err.error}`)
      }
    } catch (err) {
      console.error('Submission failed:', err)
      alert('Failed to create agent.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-24">
      {/* Name & Description */}
      <section className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Agent Name</label>
          <input 
            type="text" 
            placeholder="e.g. My Security Assistant"
            className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Description (Optional)</label>
          <textarea 
            placeholder="What should this agent help you with?"
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 resize-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      </section>

      {/* Model Selection */}
      <section className="space-y-6">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Select Base Model</label>
        <div className="grid sm:grid-cols-3 gap-4">
          {MODELS.map(model => (
            <button
              key={model.id}
              type="button"
              onClick={() => setSelectedModel(model.id)}
              className={`p-6 bg-zinc-900 border-2 rounded-2xl text-left transition-all relative overflow-hidden group ${
                selectedModel === model.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="text-2xl mb-4">{model.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{model.name}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{model.provider}</div>
              {selectedModel === model.id && (
                <div className="absolute top-4 right-4 text-indigo-500">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Skills Attachment */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Attach Installed Skills</label>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{selectedSkillIds.length} Selected</span>
        </div>
        <div className="grid gap-4">
          {availableSkills.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl text-zinc-500 text-sm">
              You haven't installed any skills yet. Visit the <a href="/skills" className="text-indigo-400 hover:underline">Marketplace</a> to find some.
            </div>
          ) : (
            availableSkills.map(skill => {
              const isSelected = selectedSkillIds.includes(skill.id)
              return (
                <div key={skill.id} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`w-full p-4 bg-zinc-900 border-2 rounded-2xl flex items-center justify-between transition-all ${
                      isSelected ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                          <Bot className="w-5 h-5" />
                       </div>
                       <div className="text-left">
                         <div className="text-sm font-bold text-white">{skill.name}</div>
                         <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{skill.category}</div>
                       </div>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-zinc-700" />
                    )}
                  </button>
                  
                  {/* Detailed Permissions for Selected Skill */}
                  <AnimatePresence>
                    {isSelected && skill.config?.operations && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 p-6 bg-zinc-900/30 border-l border-indigo-500/30 space-y-4">
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Set Operation Permissions</h4>
                          {skill.config.operations.map((op: any) => (
                            <div key={op.name} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-[11px] font-bold text-zinc-300">{op.name}</div>
                                <div className="text-[9px] text-zinc-600 line-clamp-1">{op.description}</div>
                              </div>
                              <div className="flex gap-1 p-1 bg-black rounded-lg border border-zinc-800">
                                {['allow', 'ask', 'deny'].map(mode => (
                                  <button
                                    key={mode}
                                    type="button"
                                    onClick={() => updatePermission(skill.id, op.name, mode)}
                                    className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${
                                      skillPermissions[skill.id]?.[op.name] === mode 
                                        ? 'bg-indigo-600 text-white shadow-lg' 
                                        : 'text-zinc-600 hover:text-zinc-400'
                                    }`}
                                  >
                                    {mode}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* Visibility Switch */}
      <section className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isPublic ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
            {isPublic ? <Globe className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
             <div className="text-sm font-bold text-white">Public Agent</div>
             <div className="text-xs font-medium text-zinc-500 mt-1">Make this agent accessible via a public URL.</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          className={`w-14 h-8 rounded-full p-1 transition-colors relative ${isPublic ? 'bg-emerald-500' : 'bg-zinc-800'}`}
        >
          <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-md ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-8">
        <Button 
          type="submit" 
          disabled={loading || !name}
          className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
            <span className="flex items-center gap-2 justify-center">
              Create Agent <Sparkles className="w-5 h-5" />
            </span>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.back()}
          className="h-14 px-8 border-zinc-800 text-zinc-300 hover:bg-zinc-800 rounded-2xl font-bold"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
