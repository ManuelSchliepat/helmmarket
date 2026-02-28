import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Package, Star, Calendar } from 'lucide-react'
import { placeholderSkills } from '@/lib/placeholder-data'
import { SkillCard } from '@/components/skills/SkillCard'

export default async function PublisherPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const decodedUsername = decodeURIComponent(username)
  
  // For demo, we just show all skills as if they belong to this publisher
  const publisherSkills = placeholderSkills.slice(0, 4)

  return (
    <div className="container mx-auto py-32 px-6">
      <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-12 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Marketplace
      </Link>

      <div className="space-y-16">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-zinc-900 pb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-indigo-500/5">
              {decodedUsername.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tighter">{decodedUsername}</h1>
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex flex-wrap gap-6 text-sm font-medium text-zinc-500">
                <span className="flex items-center gap-2"><Package className="w-4 h-4" /> 14 skills published</span>
                <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> 4.9 average rating</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <h2 className="text-2xl font-bold text-white tracking-tight px-1 uppercase text-[10px] tracking-[0.2em] text-zinc-500">Skills by this publisher</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publisherSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
