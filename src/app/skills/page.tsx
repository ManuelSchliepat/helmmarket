import { getSkills } from '@/services/supabase/skills'
import { SkillCard } from '@/components/skills/SkillCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function SkillsPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; category?: string } 
}) {
  const skills = await getSkills({ search: searchParams.q, categoryId: searchParams.category })

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
        <p className="text-xl text-gray-500 mb-8">Discover top AI Agent Skills created by our developer community.</p>
        
        <form className="flex gap-2 max-w-xl">
          <Input 
            name="q" 
            placeholder="Search skills..." 
            defaultValue={searchParams.q}
          />
          <Button type="submit">Search</Button>
        </form>
      </header>

      {skills && skills.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((skill: any) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 border rounded-lg">
          <p className="text-gray-500 text-lg">No skills found matching your search.</p>
          <Button variant="link" asChild className="mt-4">
            <a href="/skills">View all skills</a>
          </Button>
        </div>
      )}
    </div>
  )
}
