import { CodeBlock } from '@/components/ui/CodeBlock'

export default function QuickstartPage() {
  const step1 = `npm install @helm-market/cve-scanner`
  const step2 = `import { Helm } from '@bgub/helm'
import { cveScanner } from '@helm-market/cve-scanner'

const agent = new Helm({ 
  skills: [cveScanner],
  token: 'YOUR_INSTALL_TOKEN' 
})`
  const step3 = `const result = await agent.run("Find critical CVEs for nginx")
console.log(result)`

  return (
    <div className="max-w-3xl mx-auto py-32 px-6">
      <h1 className="text-4xl md:text-5xl font-semibold text-white mb-12 tracking-tight">Quickstart</h1>
      
      <div className="space-y-24">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-indigo-400">1</div>
            <h2 className="text-xl font-medium text-white">Install a skill</h2>
          </div>
          <p className="text-zinc-400 pl-12">Install any skill from the marketplace via npm.</p>
          <div className="pl-12">
            <CodeBlock code={step1} lang="bash" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-indigo-400">2</div>
            <h2 className="text-xl font-medium text-white">Add to your Helm agent</h2>
          </div>
          <p className="text-zinc-400 pl-12">Import the skill and initialize the Helm agent with your installation token.</p>
          <div className="pl-12">
            <CodeBlock code={step2} lang="typescript" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-indigo-400">3</div>
            <h2 className="text-xl font-medium text-white">Use it</h2>
          </div>
          <p className="text-zinc-400 pl-12">Ask your agent to perform tasks using the newly added capabilities.</p>
          <div className="pl-12">
            <CodeBlock code={step3} lang="typescript" />
          </div>
        </div>
      </div>
    </div>
  )
}
