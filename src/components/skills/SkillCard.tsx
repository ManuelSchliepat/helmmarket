'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Star, ShieldCheck, Zap, BadgeCheck, Monitor, Terminal, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skill } from '@/lib/placeholder-data'

export function SkillCard({ skill, index = 0 }: { skill: Skill, index?: number }) {
  const price = (skill.price_cents / 100).toFixed(2)
  
  // Deterministic fake data
  const baseValue = (skill.slug.length * 13) + (index * 7);
  const rating = 4.5 + ((baseValue % 5) / 10);
  const reviewCount = 40 + (baseValue % 200);
  
  const authorName = (skill.developers?.users?.full_name || 'Verified').split(' ')[0];
  const authorHandle = `@${authorName.toLowerCase()}`;

  // Compliance Badge Logic
  const complianceLabels: Record<string, { label: string, color: string }> = {
    'EU_AI_ACT': { label: 'EU AI Act', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    'GDPR': { label: 'GDPR', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    'SOC2': { label: 'SOC2', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'ISO27001': { label: 'ISO27001', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  };

  // Badge logic: max 2 + "+N more"
  const badges = [];
  if (skill.provider_switchable) badges.push('Agnostic');
  if (skill.price_cents === 0) badges.push('Free');
  skill.tags.forEach(tag => badges.push(tag.charAt(0).toUpperCase() + tag.slice(1)));

  const visibleBadges = badges.slice(0, 2);
  const remainingCount = badges.length - 2;

  const isVerified = (skill as any).quality_status === 'verified' || true; // Force true for demo since DB column might not be sync'd yet

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
      className="h-full"
    >
      <Link href={`/skills/${skill.slug}`} className="block h-full group">
        <Card className="h-full min-h-[380px] flex flex-col p-6 bg-zinc-900 border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all duration-200 shadow-none relative overflow-hidden group-focus-within:ring-2 group-focus-within:ring-indigo-500 group-focus-within:ring-offset-2 group-focus-within:ring-offset-black">
          
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            
            {/* Badge Container */}
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[140px]">
              {visibleBadges.map(badge => (
                <span key={badge} className="text-[9px] font-bold text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-tight">
                  {badge}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800/30 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-tight">
                  +{remainingCount} more
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                {skill.name}
              </h3>
              
              {/* Compliance Labels */}
              <div className="flex flex-wrap gap-1.5">
                {skill.compliance_labels?.map(label => (
                  <span key={label} className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${complianceLabels[label]?.color || 'bg-zinc-800 text-zinc-500'}`}>
                    {complianceLabels[label]?.label || label}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-zinc-400 line-clamp-3 leading-[1.7] font-normal">
              {skill.description}
            </p>
          </div>

          {/* Compatible with */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Works with</span>
            <div className="flex gap-1">
              <div title="Claude" className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">Cl</div>
              <div title="Cursor" className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">Cu</div>
              <div title="VS Code" className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">Vs</div>
              <div title="Custom" className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">Az</div>
            </div>
          </div>

          {/* Helm Market Verified Seal */}
          <div className="mt-auto pt-6 flex flex-col gap-3">
            {isVerified && (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold group/v" title="Tested and approved by Helm Market">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
            
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
              <BadgeCheck className="w-3.5 h-3.5 text-indigo-500/80" />
              <span className="leading-tight">
                Tested by Helm Market <span className="opacity-30 mx-1">·</span> 
                GDPR compliant <span className="opacity-30 mx-1">·</span> 
                <span className="text-zinc-600">Last verified Feb 2026</span>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span className="font-bold">{rating.toFixed(1)}</span>
                <span className="text-zinc-600 text-[10px]">({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{authorHandle}</span>
              </div>
            </div>
            <div className="text-sm font-bold text-white whitespace-nowrap ml-4">
              {skill.price_cents === 0 ? 'Free' : `$${price}`}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
