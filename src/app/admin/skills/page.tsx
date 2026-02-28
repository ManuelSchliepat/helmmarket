import { getSkillsForReview } from '@/services/supabase/admin'
import { SkillsTable } from './SkillsTable'

export const dynamic = 'force-dynamic'

export default async function AdminSkillsPage() {
  const skills = await getSkillsForReview()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Skill Review Queue</h1>
        <p className="text-zinc-400 mt-2">Approve or reject submitted skills.</p>
      </div>

      <SkillsTable initialSkills={skills} />
    </div>
  )
}
