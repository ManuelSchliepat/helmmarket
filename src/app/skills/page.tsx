'use client'

import { useState, useMemo } from 'react'
import { SkillCard } from '@/components/skills/SkillCard'
import { Input } from '@/components/ui/input'
import { categoryFilters, placeholderSkills } from '@/lib/placeholder-data'
import { Search, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [complianceOnly, setComplianceOnly] = useState(false)

  const filteredSkills = useMemo(() => {
    return placeholderSkills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
      const matchesCompliance = !complianceOnly || skill.compliance_labels.length > 0;
      
      return matchesSearch && matchesCategory && matchesCompliance;
    });
  }, [searchQuery, activeCategory, complianceOnly]);

  return (
    <div className="container mx-auto pt-48 pb-32 px-6">
      <div className="flex flex-col gap-24">
        
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">Marketplace</h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
            Discover verified skills to extend your autonomous agents. 
            Typed, sandboxed, and production-ready.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-12 border-b border-zinc-900 pb-12">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <Input 
                placeholder="Search premium skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 text-base"
              />
            </div>
            
            <button 
              onClick={() => setComplianceOnly(!complianceOnly)}
              className={`flex items-center gap-2 h-14 px-6 rounded-2xl border transition-all text-sm font-medium ${
                complianceOnly 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Compliance Ready
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-white border-white text-black shadow-lg shadow-white/10'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {filteredSkills.length === 0 && (
          <div className="py-48 text-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-[3rem]">
            <p className="text-zinc-500 font-medium">No skills matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
