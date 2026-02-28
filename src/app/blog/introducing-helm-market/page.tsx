import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Introducing Helm Market',
  description: 'The first verified, compliant, revenue-generating marketplace for AI Agent Skills. Built on MCP, architected for autonomy.',
  openGraph: {
    title: 'Introducing Helm Market',
    description: 'The first verified, compliant, revenue-generating marketplace for AI Agent Skills. Built on MCP, architected for autonomy.',
    images: [{ url: 'https://helmmarket.com/logo.svg' }],
    type: 'article',
    publishedTime: '2026-02-28T00:00:00.000Z',
    authors: ['Manuel Schliepat'],
  },
}

export default function IntroducingHelmMarket() {
  return (
    <article className="min-h-screen bg-[#0a0a0a] text-zinc-400 py-32 px-6 selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/skills" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
        </Link>

        <header className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Introducing Helm Market
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-white">Manuel Schliepat</span>
              <span className="text-zinc-700">•</span>
              <time dateTime="2026-02-28" className="text-zinc-500">February 28, 2026</time>
            </div>
          </div>
          <div className="h-px w-full bg-zinc-900" />
        </header>

        <div className="prose prose-zinc prose-invert max-w-none space-y-12 text-lg leading-relaxed font-normal">
          <p className="text-xl text-zinc-300 italic">
            We have been thinking about this problem for a long time.
          </p>

          <p>
            AI Agents are real. The infrastructure around them is not. Every week, thousands of developers build agents that can reason, plan, and act — and then spend the next three weeks building the same GDPR scanner, the same audit logger, the same vulnerability checker that hundreds of others already built. Alone. In private repos. With no way to share, monetize, or discover any of it.
          </p>

          <p className="text-white font-bold border-l-4 border-indigo-500 pl-6 py-2 bg-indigo-500/5">
            Helm Market is the first verified, compliant, revenue-generating marketplace for AI Agent Skills.
          </p>

          <section className="space-y-6 pt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Why this had to exist</h2>
            <p>
              The MCP ecosystem grew faster than anyone predicted. Smithery crossed 7,600 listed servers. But raw volume is not infrastructure. A directory is not a marketplace. A list of GitHub links is not a product.
            </p>
            <p>
              When a Fortune 500 company wants to extend their agent with a GDPR compliance checker, they do not search GitHub. They ask their Legal team. Legal says no. The agent gets built without the tool. The tool gets built again from scratch, internally, at 10x the cost.
            </p>
            <p>
              We asked ourselves a simple question: what would it take for an enterprise legal team to say <em className="text-indigo-400 not-italic font-bold">yes</em> to an MCP skill they found online?
            </p>
            <p>
              The answer became Helm Market.
            </p>
          </section>

          <section className="space-y-8 pt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">What we built</h2>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Verified quality at the infrastructure level</h3>
              <p>
                Every skill on Helm Market passes a three-stage quality system before a single user sees it. Automated security scanning. Human review. Continuous live monitoring. The <code className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded border border-indigo-400/20 font-mono text-sm">Helm Market Verified</code> seal is not a badge — it is a guarantee. Every skill carries a Trust Score from 0 to 100, computed from install count, average rating, compliance labels, and time since last verification. Machines can read it. Humans can trust it.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Compliance as a first-class citizen</h3>
              <p>
                EU AI Act. GDPR. SOC2. ISO27001. These are not checkboxes we added at the end. They are the first thing a buyer sees on every skill card. We built a compliance filter into the marketplace before we built most other features. Because the question <span className="italic text-zinc-300">"is this legal to use in our stack"</span> is the question that blocks every enterprise purchase. We answer it before it is asked.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Real developer revenue</h3>
              <p>
                We believe the people who build the tools should be paid for building the tools. 70% of every transaction flows directly to the publisher via Stripe Connect — automatically, instantly, without manual invoices or minimum payout thresholds. The remaining 30% sustains the platform. No one extracts value here without creating it first.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">A CLI that respects developers</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 font-mono text-sm group relative overflow-hidden">
                <div className="text-indigo-400">helm install @helm-market/gdpr-data-scan</div>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">v1.0.0</div>
                </div>
              </div>
              <p>
                One command. Works with Claude Desktop, Cursor, VS Code Copilot, and any custom agent built on MCP. No configuration files. No API keys to manage. No documentation to read before you can start.
              </p>
            </div>
          </section>

          <section className="space-y-6 pt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">The architecture of autonomy</h2>
            <p>
              Helm Market does not run on human attention. It runs on systems.
            </p>
            <p>
              Every morning at 03:00 UTC, a curation algorithm scores every published skill and promotes the top three as Editor's Picks. No human decides. No skill can buy its way to the top. The algorithm rewards installs, ratings, compliance depth, and freshness — in that order.
            </p>
            <p>
              Every morning at 08:00 UTC, a Claude-powered management agent reviews pending submissions, answers developer support tickets, and flags skills with elevated error rates. A human reviews the log and can override any decision. But the system acts first.
            </p>
            <p>
              Every purchase triggers an immediate chain: Stripe transfer to the developer, confirmation email to the buyer with their install command, revenue notification to the publisher. No human is in that loop. It does not need one.
            </p>
            <p className="font-bold text-zinc-200">
              This is what we mean when we say autonomous infrastructure. Not a demo. Not a roadmap item. Running today.
            </p>
          </section>

          <section className="space-y-6 pt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Agent-to-Agent Commerce</h2>
            <p>
              We are building for the present. But we are architecting for what comes next.
            </p>
            <p>
              Stripe launched Machine Payments in February 2026. AI agents can now transact autonomously — not as a theoretical concept, but as a live API primitive. We already support it.
            </p>
            <p>
              When an agent needs a new capability, it should be able to find it, evaluate it, purchase it, and install it — without a human clicking anything. Helm Market's <code className="text-zinc-300">/api/v1/skills/index</code> returns a machine-readable catalog with Trust Scores and compliance metadata. Our checkout route accepts <code className="text-zinc-300">x-purchaser-type: agent</code>. Our Agent Policy system lets human owners set spending limits, allowed compliance labels, and verified-only filters for any agent acting on their behalf.
            </p>
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">
              The rails are built. The trains will come.
            </p>
          </section>

          <section className="space-y-6 pt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">For the developers who will build on this</h2>
            <p>
              We are not the product. You are.
            </p>
            <p>
              If you have built a skill that solves a real problem — a bias checker, a log analyzer, an EU AI Act auditor, a PII scanner — Helm Market is where it belongs. Where it gets discovered. Where it gets paid for. Where it gets maintained because it is worth maintaining.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 font-mono text-sm">
              <div className="text-emerald-400">helm publish ./my-skill</div>
            </div>
            <p>
              Your skill. Your terms. Your 70%.
            </p>
            <p>
              We handle discovery, payments, compliance verification, developer tooling, and enterprise distribution. You handle the code.
            </p>
          </section>

          <section className="space-y-6 pt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">What comes next</h2>
            <p>
              In the coming weeks we will ship the Agent Dashboard — a live node graph showing every installed skill, their dependencies, and their activity over time. Think GitHub contribution graph, but for your agent's capabilities.
            </p>
            <p>
              In the coming months we will open the Enterprise Program — compliance reports as downloadable PDFs, SSO for teams, and dedicated support for organizations deploying skills at scale.
            </p>
            <p>
              And when the Agent-to-Agent economy becomes the default — when millions of agents are autonomously extending each other's capabilities every hour — Helm Market will be the infrastructure that makes it safe, verified, and economically fair.
            </p>
            <p className="text-xl text-white font-bold">
              We are ready.
            </p>
          </section>
        </div>

        <footer className="pt-16 border-t border-zinc-900 space-y-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
            <div className="space-y-2">
              <p className="text-sm font-bold text-white uppercase tracking-[0.2em]">helmmarket.com</p>
              <p className="text-xs text-zinc-600">
                Helm Market is built by Skilld GmbH.
              </p>
            </div>
            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
              <Link href="/docs" className="text-zinc-500 hover:text-white transition-colors">Documentation</Link>
              <Link href="mailto:contact@helmmarket.com" className="text-zinc-500 hover:text-white transition-colors">Enterprise</Link>
            </div>
          </div>
          <div className="text-[10px] text-zinc-700 font-medium leading-relaxed max-w-sm">
            Questions? Find us on Hacker News, Product Hunt, and GitHub.
          </div>
        </footer>
      </div>
    </article>
  )
}
