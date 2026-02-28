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
    <div className="container mx-auto py-32 px-6">
      <div className="flex flex-col gap-16">
        
        {/* Header Area */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">Marketplace</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Discover production-ready skills for your autonomous agents.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              <Input 
                placeholder="Search skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-zinc-900 border-zinc-800 h-12 rounded-xl focus-visible:ring-indigo-500 text-base"
              />
            </div>
            
            <button 
              onClick={() => setComplianceOnly(!complianceOnly)}
              className={`flex items-center gap-2 h-12 px-6 rounded-xl border transition-all text-sm font-medium ${
                complianceOnly 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Compliance Ready
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-white border-white text-black'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {filteredSkills.length === 0 && (
          <div className="py-32 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <p className="text-zinc-500">No skills found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
