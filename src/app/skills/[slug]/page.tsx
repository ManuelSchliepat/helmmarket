import { getSkillBySlug } from '@/services/supabase/skills'
export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SkillDetailClient } from '@/components/skills/SkillDetailClient'
import { ChevronLeft, ShieldCheck } from 'lucide-react'
import { placeholderSkills } from '@/lib/placeholder-data'

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Try to find in placeholder data first
  let skill = placeholderSkills.find(s => s.slug === slug)
  if (!skill) {
    try {
      skill = await getSkillBySlug(slug)
    } catch (e) {}
  }

  if (!skill) notFound()

  const price = (skill.price_cents / 100).toFixed(2)
  const authorName = skill.developers?.users?.full_name || 'Verified Publisher'

  return (
    <div className="container mx-auto py-32 px-6">
      <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-12 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-16">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mb-6 uppercase tracking-wider">
              {skill.category.replace('-', ' ')}
              {skill.provider_switchable && <span className="text-zinc-600 px-2">•</span>}
              {skill.provider_switchable && <span className="text-zinc-500">Provider Agnostic</span>}
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold text-white mb-8 tracking-tight leading-tight">
              {skill.name}
            </h1>
            <p className="text-zinc-400 text-lg leading-[1.7] max-w-2xl">
              {skill.description || 'Enterprise-grade skill for autonomous agents.'}
            </p>
          </div>

          <SkillDetailClient skill={skill} />
        </div>

        <aside className="space-y-8 lg:sticky lg:top-32">
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-8 shadow-none">
            <div className="mb-8">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Lifetime License</div>
              <div className="text-4xl font-semibold text-white tracking-tight">${price}</div>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all">
                Buy Skill
              </Button>
              <Button variant="outline" className="w-full h-12 bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 rounded-full font-medium transition-all">
                Try 14-day Demo
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-800 space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-zinc-500">Publisher</span>
                <span className="text-white">{authorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status</span>
                <span className="text-emerald-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>
            </div>
          </Card>

          {skill.compliance_labels.length > 0 && (
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Compliance</h3>
              <div className="flex flex-col gap-4">
                {skill.compliance_labels.map(label => (
                  <div key={label} className="flex items-center gap-3 text-zinc-300 text-sm font-medium">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
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
