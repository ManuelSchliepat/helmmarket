import { getSkills } from '@/services/supabase/skills'
export const dynamic = 'force-dynamic'
import { SkillCard } from '@/components/skills/SkillCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { categoryFilters } from '@/lib/placeholder-data'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'

export default async function SkillsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; category?: string }> 
}) {
  const params = await searchParams;
  const skills = await getSkills({ search: params.q, categoryId: params.category })

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-10">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
            <form>
              <Input 
                name="q" 
                placeholder="Search 247 skills..." 
                defaultValue={params.q}
                className="pl-10 bg-gray-900/50 border-gray-800 h-12 rounded-xl focus-visible:ring-indigo-500"
              />
            </form>
          </div>

          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <SlidersHorizontal className="w-3 h-3" /> Categories
            </h2>
            <div className="flex flex-col gap-1">
              {categoryFilters.map((cat) => (
                <Link 
                  key={cat.name} 
                  href={`/skills${cat.name === 'All Skills' ? '' : `?category=${cat.name.toLowerCase()}`}`}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    (params.category === cat.name.toLowerCase()) || (!params.category && cat.name === 'All Skills')
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    (params.category === cat.name.toLowerCase()) || (!params.category && cat.name === 'All Skills')
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700 group-hover:text-gray-300'
                  }`}>
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Marketplace</h1>
              <p className="text-gray-500 font-medium">Discover, install, and monetize agentic skills.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-4 h-11 bg-gray-900 border border-gray-800 rounded-xl text-sm font-medium text-gray-400">
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Sort by:</span>
                <select className="bg-transparent outline-none text-gray-200 cursor-pointer">
                  <option>Trending</option>
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          </div>

          {skills && skills.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill: any, index: number) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-900/30 border border-gray-800 border-dashed rounded-3xl flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">No skills matching your search</h3>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">Adjust your filters or search terms to find what you're looking for.</p>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-bold">
                <Link href="/skills">View all skills</Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
