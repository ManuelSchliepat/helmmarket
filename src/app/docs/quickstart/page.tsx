'use client'

import { useState } from 'react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Zap, Timer, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function QuickstartPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoOutput, setDemoOutput] = useState<any>(null)

  const step1 = `npm install @helm-market/cve-scanner`
  const step2 = `import { Helm } from '@bgub/helm'
import { cveScanner } from '@helm-market/cve-scanner'

const agent = new Helm({ 
  skills: [cveScanner],
  token: 'YOUR_INSTALL_TOKEN' 
})`
  const step3 = `const result = await agent.run("Find critical CVEs for nginx")
console.log(result)`

  const handleDemo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt) return
    setLoading(true)
    try {
      const res = await fetch(`/api/skills/demo?slug=vuln-scanner&prompt=${encodeURIComponent(prompt)}`)
      const data = await res.json()
      setDemoOutput(data.output)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-32 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-none">Quickstart</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          <Timer className="w-3.5 h-3.5" />
          Average setup time: 4 minutes
        </div>
      </div>
      
      <div className="space-y-32">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-indigo-400">1</div>
            <h2 className="text-xl font-medium text-white tracking-tight">Install a skill</h2>
          </div>
          <p className="text-zinc-400 pl-12 font-medium">Install any skill from the marketplace via npm.</p>
          <div className="pl-12">
            <CodeBlock code={step1} lang="bash" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-indigo-400">2</div>
            <h2 className="text-xl font-medium text-white tracking-tight">Add to your Helm agent</h2>
          </div>
          <p className="text-zinc-400 pl-12 font-medium">Import the skill and initialize the Helm agent with your installation token.</p>
          <div className="pl-12">
            <CodeBlock code={step2} lang="typescript" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-indigo-400">3</div>
            <h2 className="text-xl font-medium text-white tracking-tight">Use it</h2>
          </div>
          <p className="text-zinc-400 pl-12 font-medium">Ask your agent to perform tasks using the newly added capabilities.</p>
          <div className="pl-12">
            <CodeBlock code={step3} lang="typescript" />
          </div>
        </div>

        {/* Try it section */}
        <div className="space-y-10 pt-16 border-t border-zinc-900">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-indigo-500 fill-current" />
            <h2 className="text-2xl font-semibold text-white tracking-tight">Try it without installing</h2>
          </div>
          <p className="text-zinc-400 font-medium">Experience how the CVE Scanner skill would respond to your prompt in a real agent environment.</p>
          
          <form onSubmit={handleDemo} className="space-y-6">
            <div className="flex gap-3">
              <Input 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Find critical CVEs for nginx..."
                className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 text-base font-medium"
              />
              <Button disabled={loading} type="submit" className="h-14 px-8 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold uppercase tracking-widest text-[10px] shrink-0 transition-all active:scale-95 shadow-xl shadow-white/5">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Play className="w-4 h-4 mr-2 fill-current" /> Preview Output</>}
              </Button>
            </div>
          </form>

          {demoOutput && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Realistic Agent Response (JSON)
              </label>
              <div className="rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
                <CodeBlock code={JSON.stringify(demoOutput, null, 2)} lang="json" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
