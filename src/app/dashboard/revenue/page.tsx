import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'
import { TrendingUp, Package, DollarSign, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function RevenueDashboard() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createClient()

  // 1. Fetch total earned
  const { data: payouts } = await supabase
    .from('payouts')
    .select('*, skills(name)')
    .eq('developer_id', userId)
    .order('created_at', { ascending: false })

  const totalEarnedAllTime = (payouts || []).reduce((acc, p) => acc + p.amount_cents, 0)
  
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  
  const totalEarnedThisMonth = (payouts || [])
    .filter(p => p.created_at >= firstDayOfMonth)
    .reduce((acc, p) => acc + p.amount_cents, 0)

  // 2. Per-skill breakdown
  const skillBreakdown: Record<string, { name: string, installs: number, revenue: number, share: number }> = {}
  
  payouts?.forEach(p => {
    const skillId = p.skill_id
    if (!skillBreakdown[skillId]) {
      skillBreakdown[skillId] = { name: p.skills?.name || 'Unknown', installs: 0, revenue: 0, share: 0 }
    }
    skillBreakdown[skillId].installs++
    skillBreakdown[skillId].share += p.amount_cents
    skillBreakdown[skillId].revenue += (p.amount_cents + (p.platform_fee_cents || 0))
  })

  const breakdownList = Object.values(skillBreakdown)

  return (
    <div className="container mx-auto py-32 px-6 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Revenue Dashboard</h1>
          <p className="text-zinc-500 font-medium mt-2">Track your earnings and payout history.</p>
        </div>
        <Link 
          href="/api/connect/onboard" 
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm font-bold text-white hover:border-zinc-600 transition-all"
        >
          Stripe Dashboard <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-zinc-900 border-zinc-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Monthly Revenue</p>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <h2 className="text-4xl font-black text-white">€{(totalEarnedThisMonth / 100).toFixed(2)}</h2>
          <p className="text-xs text-zinc-600 font-medium">Your 70% share this month</p>
        </Card>

        <Card className="p-8 bg-zinc-900 border-zinc-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Earned</p>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-white">€{(totalEarnedAllTime / 100).toFixed(2)}</h2>
          <p className="text-xs text-zinc-600 font-medium">Net earnings all time</p>
        </Card>

        <Card className="p-8 bg-zinc-900 border-zinc-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Next Payout</p>
            <Package className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-4xl font-black text-white italic">Rolling</h2>
          <p className="text-xs text-zinc-600 font-medium">Daily automatic transfers</p>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Per-Skill Breakdown</h3>
        <Card className="bg-zinc-900 border-zinc-800 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-black/20">
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Skill Name</th>
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Installs</th>
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Revenue</th>
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Your Share (70%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {breakdownList.map((skill, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-6 text-sm font-bold text-white">{skill.name}</td>
                    <td className="p-6 text-sm text-zinc-400">{skill.installs}</td>
                    <td className="p-6 text-sm text-zinc-400">€{(skill.revenue / 100).toFixed(2)}</td>
                    <td className="p-6 text-sm font-black text-emerald-400 text-right">€{(skill.share / 100).toFixed(2)}</td>
                  </tr>
                ))}
                {breakdownList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-zinc-600 font-medium">No sales recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
