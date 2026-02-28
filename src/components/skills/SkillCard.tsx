'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Star, ShieldCheck, Zap, Check } from 'lucide-react'
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

  const categoryLabels: Record<string, string> = {
    'security': 'Security',
    'compliance': 'Compliance',
    'energy-industrial': 'Energy',
    'data-analytics': 'Analytics',
    'automation': 'Automation',
    'general': 'General',
  };

  // Badge logic: max 2 + "+N more"
  const badges = [];
  if (skill.provider_switchable) badges.push('Agnostic');
  if (skill.compliance_labels && skill.compliance_labels.length > 0) badges.push('Compliant');
  if (skill.price_cents === 0) badges.push('Free');
  // Add tags as potential badges to test the "+N more" logic
  skill.tags.forEach(tag => badges.push(tag.charAt(0).toUpperCase() + tag.slice(1)));

  const visibleBadges = badges.slice(0, 2);
  const remainingCount = badges.length - 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
      className="h-full"
    >
      <Link href={`/skills/${skill.slug}`} className="block h-full group">
        <Card className="h-full min-h-[320px] flex flex-col p-6 bg-zinc-900 border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all duration-300 shadow-none relative overflow-hidden">
          
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
            <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2 min-h-[3.4rem]">
              {skill.name}
            </h3>
            <p className="text-sm text-zinc-400 line-clamp-3 leading-[1.7] font-medium min-h-[4.5rem]">
              {skill.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
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
