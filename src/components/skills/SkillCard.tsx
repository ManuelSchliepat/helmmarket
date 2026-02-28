'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Download, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export function SkillCard({ skill, index = 0 }: { skill: any, index?: number }) {
  const price = (skill.price_cents / 100).toFixed(2)
  
  // Deterministic fake data based on index/slug
  const baseValue = (skill.slug.length * 13) + (index * 7);
  const installs = 1200 + (baseValue % 5000);
  const rating = 4.5 + ((baseValue % 5) / 10);
  const reviewCount = 40 + (baseValue % 200);
  
  const isTrending = index < 3;
  const isNew = index >= 3 && index < 6;
  const authorName = skill.developers?.users?.full_name || 'Verified Publisher';
  const authorHandle = `@${(skill.developers?.users?.full_name || 'Verified').toLowerCase().replace(/\s/g, '_')}`;
  const version = `v${(baseValue % 3) + 1}.${baseValue % 5}.${baseValue % 10}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 10) * 0.05 }}
    >
      <Link href={`/skills/${skill.slug}`} className="block h-full">
        <Card className="h-full flex flex-col group hover:border-indigo-500/50 transition-all duration-500 bg-[#0c0c0e] border-gray-800/60 overflow-hidden relative rounded-2xl">
          {isTrending && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-bl-xl z-10 flex items-center gap-1 shadow-lg tracking-widest">
              <TrendingUp className="w-3 h-3" /> TRENDING
            </div>
          )}
          {isNew && !isTrending && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-3 py-1.5 rounded-bl-xl z-10 flex items-center gap-1 shadow-lg tracking-widest">
              <Sparkles className="w-3 h-3" /> NEW
            </div>
          )}
          
          <div className="flex-1 flex flex-col p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  {/* Random icon based on name length */}
                  {skill.name.length % 3 === 0 ? <Zap className="w-7 h-7" /> : skill.name.length % 3 === 1 ? <TrendingUp className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
                  {skill.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-xs text-gray-500 font-medium">{authorHandle}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500/80" />
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
              {skill.description || 'No description provided.'}
            </p>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rating.toFixed(1)}</span>
                  <span className="text-amber-500/50">({reviewCount})</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded-lg">
                  <Download className="w-3 h-3" />
                  <span>{installs.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-5 border-t border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-indigo-400/80 bg-indigo-400/5 px-2 py-0.5 rounded border border-indigo-400/10">
                    {skill.categories?.name || 'UTILITY'}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono font-bold tracking-tighter">{version}</span>
                </div>
                <div className="text-lg font-black text-white">
                  ${price}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
