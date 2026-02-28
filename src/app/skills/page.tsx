'use client'

import { useState, useMemo } from 'react'
import { SkillCard } from '@/components/skills/SkillCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { categoryFilters, placeholderSkills, Skill } from '@/lib/placeholder-data'
import { Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [complianceOnly, setComplianceOnly] = useState(false)
  const [sortBy, setSortBy] = useState('trending')

  const filteredSkills = useMemo(() => {
    return placeholderSkills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
      const matchesCompliance = !complianceOnly || skill.compliance_labels.length > 0;
      
      return matchesSearch && matchesCategory && matchesCompliance;
    }).sort((a, b) => {
      if (sortBy === 'newest') return 1; // Simplification for mock
      return 0;
    });
  }, [searchQuery, activeCategory, complianceOnly, sortBy]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col gap-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-10">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter">Marketplace</h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.3em] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {placeholderSkills.length} Professional Skills Available
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <Input 
                placeholder="Search premium skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-gray-900/50 border-gray-800 h-14 rounded-2xl focus-visible:ring-indigo-500 text-lg font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setComplianceOnly(!complianceOnly)}
                className={`flex items-center gap-2 h-14 px-6 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${
                  complianceOnly 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' 
                    : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${complianceOnly ? 'text-white' : 'text-gray-600'}`} />
                Compliance Ready
              </button>

              <div className="relative h-14 bg-gray-900 border border-gray-800 rounded-2xl px-4 flex items-center gap-3 group">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent outline-none text-xs font-black uppercase tracking-widest text-gray-300 cursor-pointer appearance-none pr-4"
                >
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/30 scale-105'
                  : 'bg-gray-900/30 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {filteredSkills.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-40 bg-[#0c0c0e] border border-gray-800 border-dashed rounded-[3rem] flex flex-col items-center shadow-2xl"
          >
            <div className="w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center mb-8 border border-gray-800 shadow-inner">
              <Search className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">No skills matching your criteria</h3>
            <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">Try adjusting your filters or search terms. We're adding new enterprise skills every week.</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setComplianceOnly(false);
              }}
              className="bg-white text-black hover:bg-gray-200 h-14 px-10 rounded-2xl font-black shadow-xl transition-all active:scale-95"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
