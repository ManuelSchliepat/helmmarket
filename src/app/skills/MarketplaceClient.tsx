'use client'

import { useState, useMemo, useEffect } from 'react'
import { SkillCard } from '@/components/skills/SkillCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { categoryFilters, Skill } from '@/lib/placeholder-data'
import { Search, ShieldCheck, Menu, X, Filter, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface MarketplaceClientProps {
  initialSkills: Skill[];
}

export default function MarketplaceClient({ initialSkills }: MarketplaceClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [complianceOnly, setComplianceOnly] = useState(false)
  const [providerAgnosticOnly, setProviderAgnosticOnly] = useState(false)
  const [freeOnly, setFreeOnly] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState(500)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Client-side filtering logic
  const filteredSkills = useMemo(() => {
    let results = initialSkills.filter(skill => {
      const searchContent = `${skill.name} ${skill.description} ${skill.category} ${skill.tags.join(' ')}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
      const matchesCompliance = !complianceOnly || (skill.compliance_labels && skill.compliance_labels.length > 0);
      const matchesAgnostic = !providerAgnosticOnly || skill.provider_switchable;
      const matchesFree = !freeOnly || skill.price_cents === 0;
      const matchesPrice = skill.price_cents / 100 <= priceRange;
      
      return matchesSearch && matchesCategory && matchesCompliance && matchesAgnostic && matchesFree && matchesPrice;
    });

    // Sorting
    results = [...results].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.id).getTime() - new Date(a.id).getTime(); // Placeholder date logic
      if (sortBy === 'price-low') return a.price_cents - b.price_cents;
      if (sortBy === 'price-high') return b.price_cents - a.price_cents;
      return 0; // Default: popular (stable)
    });

    return results;
  }, [initialSkills, searchQuery, activeCategory, complianceOnly, providerAgnosticOnly, freeOnly, sortBy, priceRange]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialSkills.length };
    initialSkills.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [initialSkills]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400">
      <div className="flex relative">
        
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[280px] h-[calc(100vh-64px)] sticky top-16 border-r border-zinc-900 p-8 overflow-y-auto no-scrollbar shrink-0">
          <div className="space-y-10">
            
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Categories</h3>
              <div className="flex flex-col gap-1">
                {categoryFilters.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group border-l-2 ${
                      activeCategory === cat.id 
                        ? 'border-indigo-500 bg-indigo-500/5 text-white' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <span>{cat.name.split(' ')[0]}</span>
                    <span className={`text-[10px] font-bold ${activeCategory === cat.id ? 'text-indigo-400' : 'text-zinc-600'}`}>
                      {categoryCounts[cat.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Filters</h3>
              <div className="space-y-3 px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={providerAgnosticOnly} onChange={e => setProviderAgnosticOnly(e.target.checked)} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                  <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">Provider Agnostic</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={complianceOnly} onChange={e => setComplianceOnly(e.target.checked)} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                  <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">Compliance Ready</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                  <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">Free Skills</span>
                </label>
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Sort By</h3>
              <div className="space-y-2 px-2">
                {[
                  { id: 'popular', label: 'Most Popular' },
                  { id: 'newest', label: 'Newest' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="sort" checked={sortBy === item.id} onChange={() => setSortBy(item.id)} className="w-4 h-4 border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                    <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Price Range</h3>
                <span className="text-[10px] font-bold text-indigo-400">${priceRange}+</span>
              </div>
              <div className="px-2">
                <input 
                  type="range" min="0" max="800" step="50" 
                  value={priceRange} 
                  onChange={e => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-600">
                  <span>$0</span>
                  <span>$800+</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* MAIN GRID AREA */}
        <main className="flex-1 p-6 lg:p-12 space-y-12">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-8 pt-16">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-white"
             >
               <Menu className="w-4 h-4" /> Filters
             </button>
             <span className="text-xs font-bold uppercase tracking-widest">{filteredSkills.length} skills</span>
          </div>

          {/* Sticky Search Bar */}
          <div className="sticky top-20 z-40 bg-[#0a0a0a]/80 backdrop-blur-md pt-4 pb-8 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative group flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <Input 
                  placeholder="Search skills, categories, or keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 text-lg font-medium w-full shadow-2xl"
                />
              </div>
              <div className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 px-4 whitespace-nowrap">
                {filteredSkills.length} results
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredSkills.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-48 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-[3rem] flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-zinc-800 rounded-[2rem] flex items-center justify-center mb-8">
                <Filter className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No skills found for "{searchQuery}"</h3>
              <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">Try adjusting your filters or category to find more capabilities.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setComplianceOnly(false);
                  setProviderAgnosticOnly(false);
                  setFreeOnly(false);
                  setPriceRange(800);
                }}
                className="text-indigo-400 font-bold hover:text-white transition-colors uppercase text-xs tracking-widest"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </main>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-zinc-950 border-r border-zinc-800 z-[160] p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-bold text-white uppercase text-xs tracking-[0.2em]">Filters</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-zinc-500" />
                </button>
              </div>

              {/* Duplicate Sidebar Content for Mobile */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryFilters.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border ${
                          activeCategory === cat.id 
                            ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                            : 'border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {cat.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Features</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input type="checkbox" checked={providerAgnosticOnly} onChange={e => setProviderAgnosticOnly(e.target.checked)} className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 text-indigo-600" />
                      <span className="text-sm font-medium text-zinc-300">Provider Agnostic</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input type="checkbox" checked={complianceOnly} onChange={e => setComplianceOnly(e.target.checked)} className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 text-indigo-600" />
                      <span className="text-sm font-medium text-zinc-300">Compliance Ready</span>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold uppercase tracking-widest mt-8"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
