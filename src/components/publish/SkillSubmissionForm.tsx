'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Info, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export function SkillSubmissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    registry_endpoint: '',
    config: '',
    permissions: [] as string[],
    tags: [] as string[],
    category: 'general',
    providers: ['openai'] as string[],
    provider_switchable: false,
    compliance_labels: [] as string[]
  })
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [currentTag, setCurrentTag] = useState('')

  const availablePermissions = ['internet-access', 'read-files', 'write-files', 'execute-scripts', 'user-identity']
  const availableProviders = [
    { id: 'openai', name: 'OpenAI' },
    { id: 'gemini', name: 'Gemini' },
    { id: 'anthropic', name: 'Anthropic' },
    { id: 'llama', name: 'Llama' },
    { id: 'custom', name: 'Custom/Self-hosted' }
  ]
  const availableCategories = [
    { id: 'general', name: 'General 🔧' },
    { id: 'security', name: 'Security 🔒' },
    { id: 'compliance', name: 'Compliance ✅' },
    { id: 'energy-industrial', name: 'Energy ⚡' },
    { id: 'data-analytics', name: 'Analytics 📊' },
    { id: 'automation', name: 'Automation 🤖' }
  ]
  const availableCompliance = ['EU_AI_ACT', 'US_FEDERAL', 'GDPR', 'SOC2', 'ISO27001']

  const handleToggle = (field: 'permissions' | 'providers' | 'compliance_labels', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(v => v !== value) 
        : [...prev[field], value]
    }))
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
      }
      setCurrentTag('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-20 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/20">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter">Skill Submitted!</h2>
        <p className="mt-4 text-gray-400 font-medium max-w-sm mx-auto">Your skill is now pending review. Our engineers will verify the sandbox integrity and notify you once it's live.</p>
        <Button variant="outline" className="mt-10 border-gray-800 text-gray-300 hover:bg-gray-800" onClick={() => setStatus('idle')}>Submit Another</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-3xl mx-auto pb-20">
      <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">1</div>
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Skill Name</label>
            <Input 
              placeholder="e.g. Data Analyzer Pro" 
              value={formData.name} 
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s/g, '-') }))} 
              required 
              className="bg-gray-900/50 border-gray-800 h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Marketplace Slug</label>
            <Input 
              placeholder="e.g. data-analyzer" 
              value={formData.slug} 
              onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} 
              required 
              className="bg-gray-900/50 border-gray-800 h-12 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Category</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                  formData.category === cat.id 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Description</label>
          <textarea 
            placeholder="Describe what your skill does and how it helps developers..." 
            className="flex min-h-[120px] w-full rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">2</div>
          Provider Configuration
        </h2>
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Supported AI Providers</label>
          <div className="flex flex-wrap gap-2">
            {availableProviders.map(provider => (
              <Badge 
                key={provider.id} 
                variant={formData.providers.includes(provider.id) ? 'default' : 'outline'}
                className="cursor-pointer py-2 px-4 rounded-xl text-xs font-bold border-gray-800"
                onClick={() => handleToggle('providers', provider.id)}
              >
                {provider.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-3xl flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Provider Switchable</p>
              <p className="text-xs text-gray-500 mt-1">Allow buyers to choose their own AI backend at install time.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, provider_switchable: !prev.provider_switchable }))}
            className={`w-12 h-6 rounded-full relative transition-colors ${formData.provider_switchable ? 'bg-indigo-600' : 'bg-gray-800'}`}
          >
            <motion.div 
              animate={{ x: formData.provider_switchable ? 26 : 2 }}
              className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" 
            />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">3</div>
          Compliance & Security
        </h2>
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Permissions Declaration</label>
          <div className="flex flex-wrap gap-2">
            {availablePermissions.map(perm => (
              <Badge 
                key={perm} 
                variant={formData.permissions.includes(perm) ? 'default' : 'outline'}
                className="cursor-pointer py-2 px-4 rounded-xl text-xs font-bold border-gray-800"
                onClick={() => handleToggle('permissions', perm)}
              >
                {perm}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Compliance Certifications (Self-Declared)</label>
          <div className="flex flex-wrap gap-2">
            {availableCompliance.map(label => (
              <Badge 
                key={label} 
                variant={formData.compliance_labels.includes(label) ? 'default' : 'outline'}
                className={`cursor-pointer py-2 px-4 rounded-xl text-xs font-bold border-gray-800 ${
                  formData.compliance_labels.includes(label) ? 'bg-emerald-600 border-emerald-500' : ''
                }`}
                onClick={() => handleToggle('compliance_labels', label)}
              >
                {label}
              </Badge>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter px-1 italic flex items-center gap-1.5">
            <Info className="w-3 h-3" /> These labels are self-declared. Helm Market reserves the right to verify and remove inaccurate labels.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">4</div>
          Metadata & Registry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Price (Cents)</label>
            <Input 
              type="number" 
              placeholder="e.g. 19900 for $199.00" 
              value={formData.price_cents} 
              onChange={e => setFormData(prev => ({ ...prev, price_cents: parseInt(e.target.value) }))} 
              required 
              className="bg-gray-900/50 border-gray-800 h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Registry Endpoint</label>
            <Input 
              placeholder="e.g. @helm-market/analyzer" 
              value={formData.registry_endpoint} 
              onChange={e => setFormData(prev => ({ ...prev, registry_endpoint: e.target.value }))} 
              required 
              className="bg-gray-900/50 border-gray-800 h-12 rounded-xl font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2 pt-4">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center justify-between">
            <span>helm.config.json (Optional, required for MCP)</span>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase">JSON</span>
          </label>
          <textarea 
            placeholder='{ "name": "my-skill", "operations": [...] }' 
            className="flex min-h-[150px] w-full rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={formData.config}
            onChange={e => setFormData(prev => ({ ...prev, config: e.target.value }))}
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full h-16 text-xl bg-white text-black hover:bg-gray-200 rounded-2xl font-black shadow-2xl transition-all active:scale-[0.98]" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Verifying Integrity...' : 'Submit Skill for Review'}
      </Button>
    </form>
  )
}

function Zap(props: any) {
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
      <path d="M4 14.71 12 2.5l1.54 10.29H20L12 21.5l-1.54-10.29H4Z" />
    </svg>
  )
}
