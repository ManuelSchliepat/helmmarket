import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Box } from 'lucide-react'

export default function WhatIsMCP() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 py-32 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/skills" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
        
        <div className="space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 mb-8">
            <Box className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            What is MCP?
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-normal">
            MCP (Model Context Protocol) is the standard way to add capabilities to AI agents. 
            Think of it like USB — one universal connector that works with any compatible device. 
            Install a Helm Market skill once, use it in any MCP-compatible agent forever.
          </p>
        </div>

        <div className="pt-12 border-t border-zinc-900">
          <Button asChild className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all">
            <Link href="/skills">Explore Verified Skills</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
