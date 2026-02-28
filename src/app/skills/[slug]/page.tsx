import { getSkillBySlug } from '@/services/supabase/skills'
export const dynamic = 'force-dynamic'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SkillDetailClient } from '@/components/skills/SkillDetailClient'
import { Download, ChevronLeft, ShieldCheck, Calendar, Globe, Layers, Zap } from 'lucide-react'
import { placeholderSkills } from '@/lib/placeholder-data'

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Try to find in placeholder data first for Task demonstration
  let skill = placeholderSkills.find(s => s.slug === slug)
  
  if (!skill) {
    try {
      skill = await getSkillBySlug(slug)
    } catch (e) {
      // Not found
    }
  }

  if (!skill) {
    notFound()
  }

  const price = (skill.price_cents / 100).toFixed(2)
  const authorName = skill.developers?.users?.full_name || 'Verified Publisher'
  const authorHandle = `@${authorName.toLowerCase().replace(/\s/g, '_')}`

  const providerColors: Record<string, string> = {
    openai: 'bg-emerald-500',
    gemini: 'bg-blue-500',
    anthropic: 'bg-orange-500',
    llama: 'bg-purple-500',
    custom: 'bg-indigo-500',
  }

  const complianceConfig: Record<string, { color: string, description: string }> = {
    EU_AI_ACT: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', description: 'Verified compliance with European Union AI Act regulations.' },
    US_FEDERAL: { color: 'text-red-400 bg-red-500/10 border-red-500/20', description: 'Adheres to US Federal AI safety and transparency guidelines.' },
    GDPR: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', description: 'Strict adherence to General Data Protection Regulation (GDPR).' },
    SOC2: { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', description: 'SOC 2 Type II certified for security, availability, and confidentiality.' },
    ISO27001: { color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', description: 'ISO/IEC 27001 certified for information security management.' },
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      
      {/* Navigation */}
      <div className="mb-12">
        <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all group">
          <div className="p-2 bg-gray-900 rounded-lg border border-gray-800 group-hover:border-indigo-500/50 transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Marketplace
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-3 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* Hero section */}
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center bg-gray-900/20 p-8 rounded-[2.5rem] border border-gray-800/50 backdrop-blur-sm shadow-2xl">
            <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-500/20 ring-4 ring-gray-900">
              <Layers className="w-14 h-14 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black text-[10px] tracking-widest px-3 py-1">
                  {skill.category.toUpperCase()}
                </Badge>
                {skill.provider_switchable && (
                  <Badge className="bg-indigo-600 text-white font-black text-[10px] tracking-widest px-3 py-1 border-0">
                    Provider-Agnostic ✓
                  </Badge>
                )}
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 font-black text-[10px] tracking-widest px-3 py-1 uppercase">
                  Verified Skill
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tighter">{skill.name}</h1>
              <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mb-6">{skill.description || 'No description provided.'}</p>
              
              <div className="flex items-center gap-2 mb-8">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">Supported Providers:</span>
                <div className="flex gap-2">
                  {skill.providers?.map((p: string) => (
                    <div key={p} className="group relative">
                      <div className={`w-3 h-3 rounded-full ${providerColors[p] || 'bg-gray-400'} shadow-sm border border-black/20`} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[9px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none border border-gray-800 uppercase tracking-widest">
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-800/50">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-black text-[10px] text-indigo-400">
                    {authorName.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-indigo-400 transition-colors">{authorHandle}</span>
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <SkillDetailClient skill={skill} />

        </div>

        {/* Sidebar */}
        <div className="space-y-8 lg:sticky lg:top-24">
          <Card className="bg-[#0c0c0e] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-indigo-500/10">
            <CardContent className="p-10 space-y-10">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Lifetime License</p>
                <div className="flex items-baseline gap-2">
                  <div className="text-6xl font-black text-white tracking-tighter">${price}</div>
                  <span className="text-gray-500 font-bold text-sm">USD</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full py-10 text-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-2xl shadow-indigo-600/40 group transition-all active:scale-[0.98]">
                  <Download className="w-7 h-7 mr-3 group-hover:animate-bounce" /> Buy & Install
                </Button>
                <Button variant="outline" className="w-full py-8 text-lg bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800 font-bold rounded-2xl transition-all">
                  Try 14-day Demo
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pt-4">
                  <ShieldCheck className="w-4 h-4" /> Secured by Stripe Connect
                </div>
              </div>

              <div className="pt-10 border-t border-gray-800/50 space-y-6 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Version
                  </span>
                  <span className="text-indigo-400 font-mono font-black bg-indigo-400/5 px-2 py-0.5 rounded border border-indigo-400/10">v2.1.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Published
                  </span>
                  <span className="text-gray-300 font-bold">Jan 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 text-red-400">
                    <Zap className="w-3.5 h-3.5" /> Support
                  </span>
                  <span className="text-emerald-400 font-bold">Priority Tier</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Card */}
          {skill.compliance_labels.length > 0 && (
            <div className="p-8 bg-gray-900/30 border border-gray-800 rounded-[2.5rem] space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Compliance Certifications</h3>
              <div className="flex flex-col gap-3">
                {skill.compliance_labels.map(label => {
                  const config = complianceConfig[label] || { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', description: 'Self-declared compliance label.' };
                  return (
                    <div key={label} className="group relative">
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-black tracking-widest uppercase transition-all hover:scale-[1.02] cursor-help ${config.color}`}>
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <span>{label.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black text-gray-300 text-xs font-medium rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal w-64 z-20 pointer-events-none border border-gray-800 shadow-2xl leading-relaxed text-center">
                        {config.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
