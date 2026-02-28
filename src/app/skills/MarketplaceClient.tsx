'use client'

import { useState, useMemo, useEffect } from 'react'
import { SkillCard } from '@/components/skills/SkillCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { categoryFilters, Skill } from '@/lib/placeholder-data'
import { applyFilters, computeCategoryCounts, Filters } from '@/lib/marketplace-filters'
import { Search, ShieldCheck, Menu, X, Filter, SlidersHorizontal, SearchX, PackageOpen, ArrowRight, Package, Shield, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FocusLock from 'react-focus-lock'
import { RemoveScroll } from 'react-remove-scroll'
import Link from 'next/link'

interface MarketplaceClientProps {
  initialSkills: Skill[];
}

export default function MarketplaceClient({ initialSkills }: MarketplaceClientProps) {
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    activeCategory: 'all',
    complianceOnly: false,
    providerAgnosticOnly: false,
    freeOnly: false,
    priceRange: 800,
    sortBy: 'popular'
  });

  const [activeComplianceFilter, setActiveComplianceFilter] = useState<string>('all');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // 8. Performance: Memoized results and counts
  const filteredSkills = useMemo(() => {
    let result = applyFilters(initialSkills, filters);
    if (activeComplianceFilter !== 'all') {
      result = result.filter(s => s.compliance_labels?.includes(activeComplianceFilter as any));
    }
    return result;
  }, [initialSkills, filters, activeComplianceFilter]);

  const editorsPicks = useMemo(() => {
    return initialSkills.filter(s => (s as any).is_editors_pick).slice(0, 3);
  }, [initialSkills]);

  const categoryCounts = useMemo(() => computeCategoryCounts(initialSkills, filters), [initialSkills, filters]);

  // Reset scroll when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.activeCategory]);

  const updateFilter = (updates: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleApply = () => {
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SidebarContent = () => (
    <div className="space-y-10">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Categories</h3>
        <div className="flex flex-col gap-1">
          {categoryFilters.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isActive = filters.activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter({ activeCategory: cat.id })}
                disabled={count === 0 && !isActive}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group border-l-2 ${
                  isActive 
                    ? 'border-indigo-500 bg-indigo-500/5 text-white' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed'
                }`}
              >
                <span>{cat.name.split(' ')[0]}</span>
                <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-400' : 'text-zinc-600'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compliance Filter */}
      <div className="space-y-4 border-t border-zinc-900 pt-8">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
          <Shield className="w-3 h-3" /> Compliance
        </h3>
        <div className="flex flex-col gap-1">
          {[
            { id: 'all', label: 'All Labels' },
            { id: 'EU_AI_ACT', label: 'EU AI Act' },
            { id: 'GDPR', label: 'GDPR' },
            { id: 'SOC2', label: 'SOC2' },
            { id: 'ISO27001', label: 'ISO27001' }
          ].map((label) => (
            <button
              key={label.id}
              onClick={() => setActiveComplianceFilter(label.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all border-l-2 ${
                activeComplianceFilter === label.id 
                  ? 'border-indigo-500 bg-indigo-500/5 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {label.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 border-t border-zinc-900 pt-8">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Refine</h3>
        <div className="space-y-3 px-2">
          {[
            { id: 'providerAgnosticOnly', label: 'Provider Agnostic' },
            { id: 'complianceOnly', label: 'Compliance Ready' },
            { id: 'freeOnly', label: 'Free Skills' }
          ].map(f => (
            <label key={f.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={(filters as any)[f.id]} 
                onChange={e => updateFilter({ [f.id]: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" 
              />
              <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-4 border-t border-zinc-900 pt-8">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Sort By</h3>
        <div className="space-y-2 px-2">
          {[
            { id: 'popular', label: 'Most Popular' },
            { id: 'newest', label: 'Newest' },
            { id: 'price-low', label: 'Price: Low to High' },
            { id: 'price-high', label: 'Price: High to Low' }
          ].map(item => (
            <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="sort" 
                checked={filters.sortBy === item.id} 
                onChange={() => updateFilter({ sortBy: item.id })}
                className="w-4 h-4 border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" 
              />
              <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4 border-t border-zinc-900 pt-8">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Price Range</h3>
          <span className="text-[10px] font-bold text-indigo-400">${filters.priceRange === 800 ? 'Any' : `<$${filters.priceRange}`}</span>
        </div>
        <div className="px-2">
          <input 
            type="range" min="0" max="800" step="50" 
            value={filters.priceRange} 
            onChange={e => updateFilter({ priceRange: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
            <span>$0</span>
            <span>$800+</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 pb-20">
      <div className="flex relative">
        
        {/* 4. SIDEBAR (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[280px] h-[calc(100vh-64px)] sticky top-16 border-r border-zinc-900 p-8 overflow-y-auto no-scrollbar shrink-0">
          <SidebarContent />
        </aside>

        {/* MAIN GRID AREA */}
        <main className="flex-1 min-w-0">
          
          {/* Mobile Header / Filters Trigger */}
          <div className="lg:hidden flex items-center justify-between p-6 pt-24 border-b border-zinc-900">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-white transition-all active:scale-95 hover:border-zinc-600"
             >
               <Filter className="w-4 h-4" /> Filters
             </button>
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{filteredSkills.length} skills found</span>
          </div>

          <div className="p-6 lg:p-12 space-y-12">
            {/* Sticky Search Bar (Top of Main) */}
            <div className="sticky top-20 z-40 bg-[#0a0a0a]/80 backdrop-blur-md pb-8 -mx-4 px-4 lg:mx-0 lg:px-0">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative group flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <Input 
                    placeholder="Search premium skills..." 
                    value={filters.searchQuery}
                    onChange={(e) => updateFilter({ searchQuery: e.target.value })}
                    className="pl-12 bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus-visible:ring-indigo-500 text-lg font-medium w-full shadow-2xl transition-all"
                  />
                </div>
                <div className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 px-4">
                  {filteredSkills.length} results
                </div>
              </div>
            </div>

            {/* Editor's Pick Section */}
            {editorsPicks.length > 0 && filters.searchQuery === '' && filters.activeCategory === 'all' && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Editor's Pick</h2>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">Updated daily by our curation algorithm</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editorsPicks.map((skill, index) => (
                    <div key={skill.id} className="relative group">
                      <div className="absolute -top-2 -right-2 z-10 px-2 py-1 bg-amber-500 text-black text-[8px] font-black uppercase rounded shadow-lg shadow-amber-500/20 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> Editor's Pick
                      </div>
                      <div className="h-full border border-amber-500/30 rounded-2xl overflow-hidden group-hover:border-amber-500/50 transition-all duration-300">
                        <SkillCard skill={skill} index={index} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-b border-zinc-900 pt-8" />
              </section>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
              </AnimatePresence>
            </div>

            {/* 7. EMPTY STATES */}
            {filteredSkills.length === 0 && (
              <div className="py-48 text-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-[3rem] flex flex-col items-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-[2rem] flex items-center justify-center mb-8">
                  {filters.searchQuery ? (
                    <SearchX className="w-10 h-10 text-zinc-600" />
                  ) : filters.activeCategory !== 'all' ? (
                    <PackageOpen className="w-10 h-10 text-zinc-600" />
                  ) : (
                    <Package className="w-10 h-10 text-zinc-600" />
                  )}
                </div>
                
                {filters.searchQuery ? (
                  <>
                    <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">No skills match '{filters.searchQuery}'</h3>
                    <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed font-medium text-sm">Try a different keyword or browse all skills.</p>
                    <button 
                      onClick={() => updateFilter({ searchQuery: '' })}
                      className="text-indigo-400 font-bold hover:text-white transition-colors uppercase text-[10px] tracking-widest"
                    >
                      Clear search
                    </button>
                  </>
                ) : filters.activeCategory !== 'all' || activeComplianceFilter !== 'all' ? (
                  <>
                    <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">No results found</h3>
                    <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed font-medium text-sm">Try adjusting your category or compliance filters.</p>
                    <div className="flex gap-6">
                      <button 
                        onClick={() => {
                          updateFilter({ activeCategory: 'all' });
                          setActiveComplianceFilter('all');
                        }}
                        className="text-zinc-400 font-bold hover:text-white transition-colors uppercase text-[10px] tracking-widest"
                      >
                        Reset filters
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">No skills found</h3>
                    <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed font-medium text-sm">Try adjusting your filters.</p>
                    <button 
                      onClick={() => updateFilter({ priceRange: 800, complianceOnly: false, providerAgnosticOnly: false, freeOnly: false })}
                      className="text-indigo-400 font-bold hover:text-white transition-colors uppercase text-[10px] tracking-widest"
                    >
                      Reset all filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 5. MOBILE DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <RemoveScroll>
              <FocusLock returnFocus>
                <motion.div 
                  role="dialog" 
                  aria-modal="true"
                  aria-label="Filters"
                  onKeyDown={(e) => e.key === 'Escape' && setIsSidebarOpen(false)}
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute inset-y-0 left-0 w-full max-w-xs bg-zinc-950 border-r border-zinc-800 p-8 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-12">
                    <span className="font-bold text-white uppercase text-xs tracking-[0.2em]">Filters</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                      <X className="w-6 h-6 text-zinc-500" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
                    <SidebarContent />
                  </div>

                  <Button 
                    onClick={handleApply}
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest mt-8 shadow-lg shadow-indigo-600/20"
                  >
                    Apply Filters
                  </Button>
                </motion.div>
              </FocusLock>
            </RemoveScroll>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
