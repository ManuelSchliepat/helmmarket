import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'
import { RevenueChart } from './RevenueChart'

export const dynamic = 'force-dynamic'

export default async function AdminRevenuePage() {
  const supabase = await createClient(true)
  
  // Total revenue this month
  const firstDayOfMonth = new Date()
  firstDayOfMonth.setDate(1)
  firstDayOfMonth.setHours(0, 0, 0, 0)
  
  const { data: installsThisMonth } = await supabase
    .from('installs')
    .select('created_at, skills(price_cents)')
    .gte('created_at', firstDayOfMonth.toISOString())

  let totalRevenueMonth = 0;
  let chartData: Record<string, number> = {};
  
  if (installsThisMonth) {
    installsThisMonth.forEach(install => {
      // @ts-ignore
      const price = (install.skills?.price_cents || 0) / 100;
      totalRevenueMonth += price;
      
      const date = new Date(install.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      chartData[date] = (chartData[date] || 0) + price;
    })
  }

  const formattedChartData = Object.entries(chartData).map(([date, amount]) => ({ date, amount }))

  // Mocking top 5 for now until complex aggregations are written
  // Or actually, we can fetch all installs and group by
  const { data: allInstalls } = await supabase
    .from('installs')
    .select('skill_id, skills(name, price_cents, developers(users(full_name)))')

  const skillRevenue: Record<string, { name: string, rev: number }> = {}
  const pubRevenue: Record<string, { name: string, rev: number }> = {}

  if (allInstalls) {
    allInstalls.forEach(inst => {
      // @ts-ignore
      const name = inst.skills?.name || 'Unknown'
      // @ts-ignore
      const pubName = inst.skills?.developers?.users?.full_name || 'Unknown'
      // @ts-ignore
      const price = (inst.skills?.price_cents || 0) / 100

      if (!skillRevenue[name]) skillRevenue[name] = { name, rev: 0 }
      skillRevenue[name].rev += price
      
      if (!pubRevenue[pubName]) pubRevenue[pubName] = { name: pubName, rev: 0 }
      pubRevenue[pubName].rev += price
    })
  }

  const topSkills = Object.values(skillRevenue).sort((a, b) => b.rev - a.rev).slice(0, 5)
  const topPubs = Object.values(pubRevenue).sort((a, b) => b.rev - a.rev).slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Revenue Overview</h1>
        <p className="text-zinc-400 mt-2">Track marketplace financial performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl flex flex-col justify-center">
          <p className="text-sm font-medium text-zinc-400">Total Revenue This Month</p>
          <h3 className="text-4xl font-bold text-white mt-2">${totalRevenueMonth.toFixed(2)}</h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Top 5 Skills by Revenue</h3>
          <div className="space-y-3">
            {topSkills.map((skill, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-zinc-300">{skill.name}</span>
                <span className="font-bold text-white">${skill.rev.toFixed(2)}</span>
              </div>
            ))}
            {topSkills.length === 0 && <p className="text-sm text-zinc-500">No data yet.</p>}
          </div>
        </Card>
        
        <Card className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Top 5 Publishers by Revenue</h3>
          <div className="space-y-3">
            {topPubs.map((pub, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-zinc-300">{pub.name}</span>
                <span className="font-bold text-white">${pub.rev.toFixed(2)}</span>
              </div>
            ))}
            {topPubs.length === 0 && <p className="text-sm text-zinc-500">No data yet.</p>}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Revenue This Month</h3>
        <div className="h-72 w-full">
          <RevenueChart data={formattedChartData} />
        </div>
      </Card>
    </div>
  )
}
