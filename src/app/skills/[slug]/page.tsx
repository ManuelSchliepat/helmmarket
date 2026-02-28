import { getSkillBySlug } from '@/services/supabase/skills'
export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SkillDetailClient } from '@/components/skills/SkillDetailClient'
import { ChevronLeft, ShieldCheck, Clock, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import { placeholderSkills, Skill } from '@/lib/placeholder-data'
import { CheckoutButton } from '@/components/checkout/CheckoutButton'
import { auth } from '@clerk/nextjs/server'

function getRelativeTime(dateString: string | undefined) {
  if (!dateString) return "some time ago";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "just now";
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}

const defaultCompatibility = {
  node: "18+",
  typescript: "4.9+",
  helm: "1.x",
  nextjs: "13+"
};

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { userId } = await auth()
  
  let rawSkill: any = null;
  try {
    rawSkill = await getSkillBySlug(slug)
  } catch (e) {
    console.warn(`Skill slug ${slug} not found in DB, trying placeholders.`);
  }
  
  if (!rawSkill) {
    rawSkill = placeholderSkills.find(s => s.slug === slug)
  }

  if (!rawSkill) notFound()

  // Normalize Skill Data
  const skill: Skill = {
    ...rawSkill,
    category: rawSkill.category || rawSkill.categories?.slug || 'general',
    tags: rawSkill.tags || [],
    compliance_labels: rawSkill.compliance_labels || [],
    provider_switchable: rawSkill.provider_switchable ?? true,
    price_cents: rawSkill.price_cents ?? 0,
    updated_at: rawSkill.updated_at || new Date().toISOString(),
    compatibility: rawSkill.compatibility || defaultCompatibility
  };

  const price = (skill.price_cents / 100).toFixed(2)
  const publisher = skill.developers?.users;
  const isOwner = userId === skill.developer_id;
  const lastUpdated = new Date(skill.updated_at);
  const monthsOld = (new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const isOld = monthsOld > 3;

  return (
    <div className="container mx-auto py-32 px-6">
      {/* 1. Review Status Banner (Owner Only) */}
      {isOwner && (
        <div className="mb-12">
          {skill.review_status === 'in_review' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-500">
              <Clock className="w-5 h-5" />
              <p className="text-sm font-bold uppercase tracking-widest">This skill is under review. Usually takes 24-48 hours.</p>
            </div>
          )}
          {skill.review_status === 'live' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-sm font-bold uppercase tracking-widest">Live — visible to all users</p>
            </div>
          )}
          {skill.review_status === 'rejected' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-widest">Rejected: {skill.review_note || 'Policy violation'}</p>
                <Link href="/publish" className="text-xs font-black underline mt-1 block">Edit and resubmit →</Link>
              </div>
            </div>
          )}
        </div>
      )}

      <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-12 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-16">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-3 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em]">
                {skill.category.replace('-', ' ')}
                <span className="text-zinc-700 px-1">•</span>
                <span className="text-zinc-500">{skill.provider_switchable ? 'Provider Agnostic' : 'Fixed Provider'}</span>
              </div>
              
              {/* Publisher Block */}
              <Link href={`/publishers/${publisher?.full_name || 'verified'}`} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all group">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">
                  {publisher?.full_name?.charAt(0) || 'H'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                    {publisher?.full_name || 'Helm Market Official'}
                    {publisher?.is_publisher_verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1 ${isOld ? 'text-orange-500' : 'text-zinc-500'}`}>
                    {isOld && <AlertCircle className="w-3 h-3" />}
                    Last updated: {getRelativeTime(skill.updated_at)}
                  </div>
                </div>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-tight">
                {skill.name}
              </h1>
              {skill.current_version && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-sm font-medium border border-zinc-700 hover:bg-zinc-700 transition-colors cursor-pointer group relative">
                    v{skill.current_version}
                    
                    {/* Version History Dropdown (Hover) */}
                    <div className="absolute top-full left-0 mt-2 w-64 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="text-xs font-bold text-white mb-1">v{skill.current_version} — Current</div>
                      <div className="text-xs text-zinc-400">See changelog in dashboard.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              <p className="text-zinc-400 text-xl leading-[1.8] max-w-2xl">
                {skill.description}
              </p>

              {/* POINT 4: Compatibility Section */}
              <div className="flex flex-wrap gap-3">
                <CompatibilityChip label={`Node ${skill.compatibility.node}`} tooltip="Minimum required Node.js version" isRestrictive={skill.compatibility.node.startsWith('2')} />
                <CompatibilityChip label={`Next.js ${skill.compatibility.nextjs}`} tooltip="Compatible with Next.js versions" />
                <CompatibilityChip label={`TS ${skill.compatibility.typescript}`} tooltip="TypeScript version support" />
                <CompatibilityChip label={`Helm ${skill.compatibility.helm}`} tooltip="Required Helm SDK version" />
              </div>
            </div>
          </div>

          <SkillDetailClient skill={skill} />
        </div>

        <aside className="space-y-8 lg:sticky lg:top-32">
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
          </Card>

          {/* POINT 5: Get Started in 5 Min Card */}
          <Card className="bg-indigo-600 border-indigo-500 rounded-3xl p-8 shadow-2xl shadow-indigo-600/20">
            <h3 className="text-white font-bold flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 fill-white" />
              Up and running in <br /> under 5 minutes
            </h3>
            <div className="space-y-4 text-indigo-100 text-sm font-medium mb-8">
              <div className="flex gap-3">
                <span className="opacity-50">1.</span>
                <span>npm install {skill.registry_endpoint || skill.slug}{skill.current_version ? `@${skill.current_version}` : ''}</span>
              </div>
              <div className="flex gap-3">
                <span className="opacity-50">2.</span>
                <span>Import + initialize</span>
              </div>
              <div className="flex gap-3">
                <span className="opacity-50">3.</span>
                <span>Run your first prompt</span>
              </div>
            </div>
            <Button asChild className="w-full h-12 bg-white text-indigo-600 hover:bg-zinc-100 rounded-full font-bold uppercase tracking-widest text-xs">
              <Link href="#quick-start">View Quick Start →</Link>
            </Button>
          </Card>

          {skill.compliance_labels.length > 0 && (
            <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-3xl">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-10">Compliance</h3>
              <div className="flex flex-col gap-6">
                {skill.compliance_labels.map(label => (
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

function CompatibilityChip({ label, tooltip, isRestrictive = false }: { label: string, tooltip: string, isRestrictive?: boolean }) {
  return (
    <div className="group relative">
      <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-tighter ${isRestrictive ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
        {label}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
        {tooltip}
      </div>
    </div>
  )
}
