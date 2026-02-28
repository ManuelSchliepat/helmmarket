import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Introducing Helm Market v1.0',
  description: 'The official launch of the capability infrastructure for AI agents. Built on MCP, powered by verified skills.',
  openGraph: {
    title: 'Introducing Helm Market v1.0',
    description: 'The official launch of the capability infrastructure for AI agents. Built on MCP, powered by verified skills.',
    images: [{ url: 'https://helmmarket.com/logo.svg' }],
    type: 'article',
    publishedTime: '2026-02-28T00:00:00.000Z',
    authors: ['Manuel Schliepat'],
  },
}

export default function IntroducingHelmMarket() {
  return (
    <article className="min-h-screen bg-[#0a0a0a] text-zinc-400 py-32 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/skills" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <header className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Introducing Helm Market v1.0: The Capability Infrastructure for AI Agents
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-white">Manuel Schliepat</span>
              <span className="text-zinc-600">•</span>
              <time dateTime="2026-02-28" className="text-zinc-500">February 28, 2026</time>
            </div>
          </div>
        </header>

        <div className="prose prose-zinc prose-invert max-w-none space-y-8 text-lg leading-relaxed">
          <p className="text-xl text-zinc-300">
            Today, we are thrilled to announce the official release of Helm Market v1.0.
          </p>

          <p>
            AI agents are evolving rapidly, but they still lack a unified, secure, and commercially viable way to acquire new capabilities. Helm Market changes that. Built on the Model Context Protocol (MCP), Helm Market provides a specialized marketplace where developers can publish, discover, and install verified AI agent skills.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Why Helm Market?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-zinc-200">Verified & Compliant:</strong> Every skill on Helm Market undergoes a multi-stage review process. We ensure skills are secure, well-documented, and compliant with standards like the EU AI Act and GDPR.
              </li>
              <li>
                <strong className="text-zinc-200">Developer First:</strong> We offer a 70/30 revenue split, automatic payouts via Stripe Connect, and a robust CLI tool for seamless integration.
              </li>
              <li>
                <strong className="text-zinc-200">Programmatic Discovery:</strong> AI agents can discover and purchase skills programmatically via our machine-readable API.
              </li>
              <li>
                <strong className="text-zinc-200">Sandboxed Execution:</strong> Test skills in our secure sandbox before you buy.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Getting Started</h2>
            <p>
              Whether you are a developer looking to monetize your AI skills or a team building the next generation of autonomous agents, Helm Market is built for you.
            </p>
            <p>
              Visit our <Link href="/skills" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Marketplace</Link> to explore verified skills or check out our <Link href="/docs/quickstart" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Quickstart guide</Link>.
            </p>
          </section>
        </div>

        <footer className="pt-12 border-t border-zinc-900">
          <p className="text-sm text-zinc-600">
            © 2026 Helm Market. Built for the agentic future.
          </p>
        </footer>
      </div>
    </article>
  )
}
