import { getSkillBySlug } from '@/services/supabase/skills'
export const dynamic = 'force-dynamic'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SkillDetailClient } from '@/components/skills/SkillDetailClient'
import { Download, ChevronLeft, ShieldCheck, Calendar, Globe, Layers } from 'lucide-react'

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  if (!skill) {
    notFound()
  }

  const price = (skill.price_cents / 100).toFixed(2)
  const authorName = skill.developers?.users?.full_name || 'Verified Publisher'
  const authorHandle = `@${authorName.toLowerCase().replace(/\s/g, '_')}`

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
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center bg-gray-900/20 p-8 rounded-3xl border border-gray-800/50 backdrop-blur-sm">
            <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-500/20 ring-4 ring-gray-900">
              <Layers className="w-14 h-14 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black text-[10px] tracking-widest px-3 py-1">
                  {skill.categories?.name || 'UTILITY'}
                </Badge>
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 font-black text-[10px] tracking-widest px-3 py-1 uppercase">
                  Verified Skill
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tighter">{skill.name}</h1>
              <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl">{skill.description || 'No description provided.'}</p>
              
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
          <Card className="bg-[#0c0c0e] border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Pricing</p>
                <div className="flex items-baseline gap-2">
                  <div className="text-5xl font-black text-white tracking-tighter">${price}</div>
                  <span className="text-gray-500 font-bold text-sm">/ lifetime</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full py-8 text-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/30 group transition-all">
                  <Download className="w-6 h-6 mr-2 group-hover:animate-bounce" /> Install Skill
                </Button>
                <Button variant="outline" className="w-full py-8 text-lg bg-transparent border-gray-800 text-gray-300 hover:bg-gray-800 font-bold rounded-2xl transition-all">
                  Start 14-day free trial
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-widest pt-2">
                  <ShieldCheck className="w-4 h-4" /> Secure via Stripe
                </div>
              </div>

              <div className="pt-8 border-t border-gray-800/50 space-y-5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Version
                  </span>
                  <span className="text-indigo-400 font-mono font-black bg-indigo-400/5 px-2 py-0.5 rounded border border-indigo-400/10">v2.1.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Updated
                  </span>
                  <span className="text-gray-300 font-bold">March 20, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" /> Published
                  </span>
                  <span className="text-gray-300 font-bold">Jan 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 px-4">
            <h3 className="font-black text-gray-500 uppercase text-[10px] tracking-[0.2em]">Similar Skills</h3>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Link key={i} href="/skills" className="flex gap-4 items-center group">
                  <div className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-2xl group-hover:border-indigo-500/50 transition-all flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-gray-700 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-300 group-hover:text-white transition-colors truncate">Recommendation {i}</h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mt-1 uppercase tracking-widest">
                      <span className="text-amber-500">★ 4.8</span>
                      <span>•</span>
                      <span>1.2k installs</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
