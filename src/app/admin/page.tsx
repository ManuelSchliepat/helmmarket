import { getAdminStats } from '@/services/supabase/admin'
import { Card } from '@/components/ui/card'
import { Package, Users, DollarSign, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOverview() {
  const stats = await getAdminStats()

  const statCards = [
    { name: 'Total Skills', value: stats.totalSkills, icon: Package, color: 'text-blue-500' },
    { name: 'Total Publishers', value: stats.totalPublishers, icon: Users, color: 'text-green-500' },
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-indigo-500' },
    { name: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'text-amber-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Overview</h1>
        <p className="text-zinc-400 mt-2">Manage the marketplace, skills, and publishers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.name} className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
