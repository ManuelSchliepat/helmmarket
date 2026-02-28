import { getPublishers } from '@/services/supabase/admin'
import { PublishersTable } from './PublishersTable'

export const dynamic = 'force-dynamic'

export default async function AdminPublishersPage() {
  const publishers = await getPublishers()

  // Calculate revenue per publisher locally
  const publishersWithStats = publishers.map(pub => {
    // For now, mocking revenue calculation as we need an installs table join. 
    // Wait, the original spec just says "Revenue".
    // We will do a basic mock or zero if not available.
    const publishedSkills = pub.skills || []
    const totalRevenue = publishedSkills.reduce((acc: number, skill: any) => acc + (skill.price_cents || 0), 0)
    
    return {
      ...pub,
      skillsCount: publishedSkills.length,
      revenue: totalRevenue / 100 // mock revenue based on just skill prices for now
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Publisher Management</h1>
        <p className="text-zinc-400 mt-2">Manage developer accounts and verifications.</p>
      </div>

      <PublishersTable initialPublishers={publishersWithStats} />
    </div>
  )
}
