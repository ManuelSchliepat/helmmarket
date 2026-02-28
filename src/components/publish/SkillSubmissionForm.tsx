'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Info, ShieldCheck, Zap, HelpCircle, X, ExternalLink, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { useRouter } from 'next/navigation'

export function SkillSubmissionForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    registry_endpoint: '',
    config: '',
    version: '',
    changelog: '',
    permissions: [] as string[],
    tags: [] as string[],
    category: 'general',
    providers: ['openai'] as string[],
    provider_switchable: false,
    compliance_labels: [] as string[]
  })
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [showExampleModal, setShowExampleModal] = useState(false)

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

  const exampleConfig = `{
  "name": "cve-scanner",
  "version": "1.0.0",
  "operations": [
    {
      "name": "searchByCve",
      "description": "Search NIST NVD for a specific CVE ID",
      "parameters": {
        "cveId": { "type": "string", "description": "CVE ID (e.g. CVE-2021-44228)" }
      }
    },
    {
      "name": "getRecentCritical",
      "description": "Fetch critical vulnerabilities from the last 7 days",
      "parameters": {
        "daysBack": { "type": "number", "default": 7 }
      }
    }
  ]
}`;

  const templateConfig = `{
  "name": "my-agent-skill",
  "version": "1.0.0",
  "operations": [
    {
      "name": "getData",
      "description": "Describe what this operation does",
      "parameters": {
        "query": { "type": "string" }
      }
    },
    {
      "name": "processAction",
      "description": "Describe this secondary operation",
      "parameters": {
        "id": { "type": "number" }
      }
    }
  ]
}`;

  const handleToggle = (field: 'permissions' | 'providers' | 'compliance_labels', value: string) => {
    setFormData(prev => {
      if (field === 'providers' && !prev.provider_switchable) {
        return { ...prev, [field]: [value] }
      }
      return {
        ...prev,
        [field]: prev[field].includes(value) 
          ? prev[field].filter(v => v !== value) 
          : [...prev[field], value]
      }
    })
  }

  const handleProviderSwitchableToggle = () => {
    setFormData(prev => {
      const isSwitchable = !prev.provider_switchable;
      const providers = (!isSwitchable && prev.providers.length > 1) 
        ? [prev.providers[0]] 
        : prev.providers;
      return { ...prev, provider_switchable: isSwitchable, providers }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Semver validation
    if (!/^\d+\.\d+\.\d+$/.test(formData.version)) {
      alert("Version must be in format 1.0.0");
      return;
    }

    setStatus('submitting')
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setStatus('success')
        router.push('/dashboard?submitted=true')
      } else {
        const errData = await response.json()
        console.error('Submission failed:', errData)
        setStatus('error')
        alert(`Submission failed: ${errData.message || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error('Submission error:', err)
      setStatus('error')
      alert(`An error occurred: ${err.message}`)
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-32 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <ShieldCheck className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter">Submission Received</h2>
        <p className="mt-6 text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed">Your skill is now in the verification queue. Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-20 max-w-3xl mx-auto pb-32">
      {/* 1. Basic Info */}
      <div className="space-y-10">
        <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-indigo-400">01</span>
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Skill Name</label>
            <Input 
              placeholder="e.g. Data Analyzer Pro" 
              value={formData.name} 
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s/g, '-') }))} 
              required 
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 font-medium"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Marketplace Slug</label>
            <Input 
              placeholder="e.g. data-analyzer" 
              value={formData.slug} 
              onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} 
              required 
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 font-mono text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Version</label>
            <Input 
              placeholder="1.0.0" 
              value={formData.version} 
              onChange={e => setFormData(prev => ({ ...prev, version: e.target.value }))} 
              required 
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 font-mono text-sm"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Changelog</label>
            <Input 
              placeholder="What changed in this version?" 
              value={formData.changelog} 
              onChange={e => setFormData(prev => ({ ...prev, changelog: e.target.value }))} 
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 text-sm"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Category</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all uppercase tracking-tighter ${
                  formData.category === cat.id 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Detailed Description</label>
          <textarea 
            placeholder="Describe what your skill does and how it helps agents..." 
            className="flex min-h-[150px] w-full rounded-[2rem] border border-zinc-800 bg-zinc-900 px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-zinc-300 leading-relaxed"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* 2. Providers */}
      <div className="space-y-10">
        <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-indigo-400">02</span>
          Infrastucture
        </h2>
        <div className="space-y-6">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] flex items-center justify-between">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-base font-medium text-white">Provider Switchable</p>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Allow buyers to choose their own AI backend at install time.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleProviderSwitchableToggle}
              className={`w-14 h-7 rounded-full relative transition-colors ${formData.provider_switchable ? 'bg-indigo-600' : 'bg-zinc-800'}`}
            >
              <motion.div 
                animate={{ x: formData.provider_switchable ? 30 : 2 }}
                className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-lg" 
              />
            </button>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              {formData.provider_switchable ? 'Supported AI Providers (Multi-select)' : 'Fixed AI Provider (Single-select)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableProviders.map(provider => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleToggle('providers', provider.id)}
                  className={`px-5 py-2 rounded-full border text-[11px] font-bold uppercase tracking-tight transition-all ${
                    formData.providers.includes(provider.id) 
                      ? 'bg-white border-white text-black shadow-lg shadow-white/5' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Security & Compliance */}
      <div className="space-y-10">
        <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-indigo-400">03</span>
          Governance
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Permissions Declaration</label>
            <div className="flex flex-wrap gap-2">
              {availablePermissions.map(perm => (
                <button
                  key={perm}
                  type="button"
                  onClick={() => handleToggle('permissions', perm)}
                  className={`px-5 py-2 rounded-full border text-[11px] font-bold transition-all ${
                    formData.permissions.includes(perm) 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {perm}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 font-medium px-1 leading-relaxed">
              Select what your skill is allowed to access. Most skills only need <code className="text-indigo-400">internet-access</code>.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-900">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Compliance Certifications (Self-Declared)</label>
            <div className="flex flex-wrap gap-2">
              {availableCompliance.map(label => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleToggle('compliance_labels', label)}
                  className={`px-5 py-2 rounded-full border text-[11px] font-bold uppercase tracking-tight transition-all ${
                    formData.compliance_labels.includes(label) 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {label.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 font-medium px-1 leading-relaxed">
              Only check labels that genuinely apply. Inaccurate labels will be removed after manual audit.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Registry & MCP */}
      <div className="space-y-10">
        <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-indigo-400">04</span>
          Registry & Protocol
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Price (Cents)</label>
            <Input 
              type="number" 
              placeholder="e.g. 1990" 
              value={formData.price_cents} 
              onChange={e => setFormData(prev => ({ ...prev, price_cents: parseInt(e.target.value) }))} 
              required 
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-zinc-500 font-medium px-1 leading-relaxed">
              Enter price in US cents. Example: <code className="text-zinc-300">1990</code> = $19.90/mo. Enter 0 for free.
            </p>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Registry Endpoint</label>
            <Input 
              placeholder="e.g. @helm-market/analyzer" 
              value={formData.registry_endpoint} 
              onChange={e => setFormData(prev => ({ ...prev, registry_endpoint: e.target.value }))} 
              required 
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 font-mono text-sm"
            />
            <p className="text-xs text-zinc-500 font-medium px-1 leading-relaxed">
              Your published npm package name. Example: <code className="text-zinc-300">@helm-market/my-skill</code>
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-900">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              helm.config.json Definition
              <button 
                type="button"
                onClick={() => setShowExampleModal(true)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors normal-case lowercase tracking-normal font-medium"
              >
                See example →
              </button>
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, config: templateConfig }))}
              className="text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-all bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg shadow-sm"
            >
              Fill with Example
            </button>
          </div>
          <textarea 
            placeholder='{ "name": "my-skill", "operations": [...] }' 
            className="flex min-h-[250px] w-full rounded-[2rem] border border-zinc-800 bg-zinc-900 px-6 py-5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-zinc-300 leading-relaxed shadow-inner"
            value={formData.config}
            onChange={e => setFormData(prev => ({ ...prev, config: e.target.value }))}
          />
          <p className="text-xs text-zinc-500 font-medium px-1 leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Describe your skill's operations. This metadata is strictly required for seamless MCP protocol integration.
          </p>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full h-20 text-xl bg-white text-black hover:bg-zinc-200 rounded-3xl font-black uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Verifying Integrity...</span>
          </div>
        ) : 'Submit Skill for Review'}
      </Button>

      {/* Example Modal */}
      <AnimatePresence>
        {showExampleModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExampleModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight">Definition Example</h3>
                  <p className="text-sm text-zinc-500 font-medium mt-1">Based on the CVE Scanner skill</p>
                </div>
                <button onClick={() => setShowExampleModal(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-zinc-500" />
                </button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto rounded-2xl border border-zinc-800 custom-scrollbar">
                <CodeBlock code={exampleConfig} lang="json" />
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, config: exampleConfig }));
                    setShowExampleModal(false);
                  }}
                  className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 rounded-full font-bold"
                >
                  Use this example
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="flex-1 h-12 bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 rounded-full font-bold"
                >
                  <a href="https://docs.helmmarket.com/config" target="_blank" className="flex items-center justify-center gap-2">
                    Documentation <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </form>
  )
}
