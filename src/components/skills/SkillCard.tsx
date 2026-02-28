'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Star, ShieldCheck, Zap } from 'lucide-react'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
      className="h-full"
    >
      <Link href={`/skills/${skill.slug}`} className="block h-full group">
        <Card className="h-full min-h-[280px] flex flex-col p-6 bg-zinc-900 border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all duration-300 shadow-none">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {categoryLabels[skill.category]}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
              {skill.name}
            </h3>
            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              {skill.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>{rating.toFixed(1)}</span>
                <span className="text-zinc-600">({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{authorHandle}</span>
              </div>
            </div>
            <div className="text-sm font-semibold text-white">
              ${price}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
