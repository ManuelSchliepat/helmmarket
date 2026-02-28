import { getSkillBySlug } from '@/services/supabase/skills'
export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SkillDetailClient } from '@/components/skills/SkillDetailClient'
import { ChevronLeft, ShieldCheck } from 'lucide-react'
import { placeholderSkills } from '@/lib/placeholder-data'
import { CheckoutButton } from '@/components/checkout/CheckoutButton'

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // 1. Fetch from Supabase FIRST (Real UUID needed for Checkout)
  let skill = null;
  try {
    skill = await getSkillBySlug(slug)
  } catch (e) {
    console.warn(`Skill with slug ${slug} not found in Supabase, checking placeholders...`)
  }
  
  // 2. Fallback to placeholder data for UI/demo purposes if DB is empty
  if (!skill) {
    skill = placeholderSkills.find(s => s.slug === slug)
  }

  if (!skill) notFound()

  const price = (skill.price_cents / 100).toFixed(2)
  const authorName = skill.developers?.users?.full_name || 'Verified Publisher'

  return (
    <div className="container mx-auto py-48 px-6">
      <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-16 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-start">
        <div className="lg:col-span-2 space-y-24">
          <div>
            <div className="flex items-center gap-3 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">
              {skill.category.replace('-', ' ')}
              {skill.provider_switchable && <span className="text-zinc-700 px-1">•</span>}
              {skill.provider_switchable && <span className="text-zinc-500">Provider Agnostic</span>}
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold text-white mb-10 tracking-tight leading-tight">
              {skill.name}
            </h1>
            <p className="text-zinc-400 text-xl leading-[1.8] max-w-2xl">
              {skill.description || 'Enterprise-grade skill for autonomous agent capabilities.'}
            </p>
          </div>

          <SkillDetailClient skill={skill} />
        </div>

        <aside className="space-y-12 lg:sticky lg:top-32">
          <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-10 shadow-none">
            <div className="mb-10">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Lifetime License</div>
              <div className="text-5xl font-semibold text-white tracking-tighter">${price}</div>
            </div>
            
            <div className="space-y-4">
              <CheckoutButton skillId={skill.id} />
              <Button variant="outline" className="w-full h-14 bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 rounded-full font-bold transition-all text-base uppercase tracking-widest">
                Trial
              </Button>
            </div>

            <div className="mt-12 pt-10 border-t border-zinc-800 space-y-6 text-sm font-medium">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Publisher</span>
                <span className="text-white font-bold">{authorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Integrity</span>
                <span className="text-emerald-500 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  Verified
                </span>
              </div>
            </div>
          </Card>

          {skill.compliance_labels && skill.compliance_labels.length > 0 && (
            <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-3xl">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-10">Compliance</h3>
              <div className="flex flex-col gap-6">
                {skill.compliance_labels.map((label: string) => (
                  <div key={label} className="flex items-center gap-4 text-zinc-300 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                    {label.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
