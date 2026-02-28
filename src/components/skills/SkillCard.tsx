'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Star, Download, ShieldCheck, Zap, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skill } from '@/lib/placeholder-data'

export function SkillCard({ skill, index = 0 }: { skill: Skill, index?: number }) {
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

  const categoryColors = {
    'security': 'bg-red-500/10 text-red-400 border-red-500/20',
    'compliance': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'energy-industrial': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'data-analytics': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'automation': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'general': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const providerColors: Record<string, string> = {
    'openai': 'bg-emerald-500',
    'gemini': 'bg-blue-500',
    'anthropic': 'bg-orange-500',
    'llama': 'bg-purple-500',
    'custom': 'bg-indigo-500',
  };

  const categoryLabels = {
    'security': 'Security 🔒',
    'compliance': 'Compliance ✅',
    'energy-industrial': 'Energy ⚡',
    'data-analytics': 'Analytics 📊',
    'automation': 'Automation 🤖',
    'general': 'General 🔧',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 10) * 0.05 }}
    >
      <Link href={`/skills/${skill.slug}`} className="block h-full">
        <Card className="h-full flex flex-col group hover:border-indigo-500/50 transition-all duration-500 bg-[#0c0c0e] border-gray-800/60 overflow-hidden relative rounded-3xl shadow-2xl">
          {isTrending && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black px-3 py-1.5 rounded-bl-2xl z-10 flex items-center gap-1 shadow-lg tracking-widest uppercase">
              <TrendingUp className="w-3 h-3" /> Trending
            </div>
          )}
          {isNew && !isTrending && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black px-3 py-1.5 rounded-bl-2xl z-10 flex items-center gap-1 shadow-lg tracking-widest uppercase">
              <Sparkles className="w-3 h-3" /> New
            </div>
          )}

          {/* Category Badge - Top Left */}
          <div className={`absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm z-10 ${categoryColors[skill.category]}`}>
            {categoryLabels[skill.category]}
          </div>
          
          <div className="flex-1 flex flex-col p-8 pt-14">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  {skill.name.length % 3 === 0 ? <Zap className="w-8 h-8" /> : skill.name.length % 3 === 1 ? <TrendingUp className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-xl font-black text-white truncate group-hover:text-indigo-400 transition-colors duration-300 leading-tight tracking-tight">
                  {skill.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs font-bold text-gray-500">{authorHandle}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500/80" />
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2 mb-8 flex-1 leading-relaxed font-medium">
              {skill.description || 'No description provided.'}
            </p>

            {/* Compliance Labels */}
            {skill.compliance_labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {skill.compliance_labels.map(label => (
                  <span key={label} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/5 border border-emerald-500/10 text-[9px] font-black text-emerald-500/80 tracking-tighter">
                    <Shield className="w-2 h-2" /> {label}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-5 mt-auto">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/5 px-2.5 py-1.5 rounded-xl border border-amber-500/10 shadow-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rating.toFixed(1)}</span>
                  <span className="text-amber-500/40">({reviewCount})</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/30 px-2.5 py-1.5 rounded-xl border border-gray-700/30">
                  <Download className="w-3 h-3" />
                  <span>{installs.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {skill.providers.slice(0, 4).map(p => (
                        <div key={p} className={`w-2 h-2 rounded-full border border-black ${providerColors[p] || 'bg-gray-400'}`} title={p} />
                      ))}
                    </div>
                    {skill.provider_switchable && <span className="text-[8px] font-black text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded border border-indigo-400/20 tracking-tighter">AGNOSTIC ✓</span>}
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono font-bold tracking-tighter uppercase">{version}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold text-gray-600">$</span>
                  <span className="text-2xl font-black text-white tracking-tighter">
                    {(skill.price_cents / 100).toFixed(0)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-600">.{(skill.price_cents % 100).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
