import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, BarChart3, CreditCard, Settings, CheckCircle2, Circle, ArrowRight, Star, MessageSquare } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ submitted?: string, stripe?: string }> 
}) {
  const params = await searchParams
  const submitted = params.submitted === 'true'
  const stripeConnected = params.stripe === 'connected'

  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createClient()

  // Fetch developer
  const { data: developer } = await supabase
    .from('developers')
    .select('*')
    .eq('id', userId)
    .single()

  if (!developer) redirect('/onboarding')

  // Fetch real skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('developer_id', userId)
    .order('created_at', { ascending: false })

  const mySkills = skills || []

  // Calculate real stats
  let totalRevenueCents = 0;
  let activeInstalls = 0;
  let skillsLive = 0;
  
  const skillStats: Record<string, { views: number, installs: number, revenue: number }> = {}
  
  if (mySkills.length > 0) {
    const skillIds = mySkills.map((s: any) => s.id)
    
    // Count Live
    skillsLive = mySkills.filter((s: any) => s.status === 'published').length

    // Fetch Events for these skills
    const { data: events } = await supabase
      .from('skill_events')
      .select('skill_id, event_type')
      .in('skill_id', skillIds)

    if (events) {
      events.forEach(e => {
        if (!skillStats[e.skill_id]) skillStats[e.skill_id] = { views: 0, installs: 0, revenue: 0 }
        
        if (e.event_type === 'view') {
          skillStats[e.skill_id].views++
        } else if (e.event_type === 'install') {
          skillStats[e.skill_id].installs++
          activeInstalls++
          
          const skill = mySkills.find((s: any) => s.id === e.skill_id)
          if (skill) {
            skillStats[e.skill_id].revenue += skill.price_cents
            totalRevenueCents += skill.price_cents
          }
        }
      })
    }
  }

  const revenueStr = `€${((totalRevenueCents * 0.7) / 100).toFixed(2)}` // Showing developer's 70% share

  return (
    <div className="container mx-auto py-32 px-6 flex flex-col lg:flex-row gap-16 relative">
      {submitted && (
        <div className="absolute top-12 left-6 right-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-bold uppercase tracking-widest">
            Saved — Your skill has been submitted and is pending review.
          </p>
        </div>
      )}

      {stripeConnected && (
        <div className="absolute top-12 left-6 right-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-3 text-indigo-400 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <CreditCard className="w-5 h-5" />
          <p className="text-sm font-bold uppercase tracking-widest">
            Stripe Connected — Payouts are now enabled for your account.
          </p>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="space-y-2 lg:sticky lg:top-32">
          {[
            { label: 'Account', icon: LayoutDashboard, active: true, href: '/dashboard' },
            { label: 'My Skills', icon: Package, href: '/dashboard' },
            { label: 'Analytics', icon: BarChart3, href: '/dashboard' },
            { label: 'Billing', icon: CreditCard, href: '/dashboard' },
            { label: 'Settings', icon: Settings, href: '/dashboard' },
            { label: 'Support', icon: MessageSquare, href: '/dashboard/support' }
          ].map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-16">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Developer Console</h1>
            <p className="text-zinc-500 font-medium">Manage your published skills and analytics.</p>
          </div>
          <Button asChild className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg shadow-indigo-600/20">
            <Link href="/publish">Submit New Skill</Link>
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Your Earnings (70%)', val: revenueStr },
            { label: 'Active Installs', val: activeInstalls.toString() },
            { label: 'Avg Rating', val: 'N/A' },
            { label: 'Skills Live', val: skillsLive.toString() }
          ].map((stat) => (
            <Card key={stat.label} className="bg-zinc-900 border-zinc-800 rounded-2xl p-6 shadow-none">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="text-2xl font-semibold text-white tracking-tight">{stat.val}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Checklist */}
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden">
              <h2 className="text-xl font-medium text-white mb-8">Launch Checklist</h2>
              <div className="space-y-6">
                {[
                  { label: 'Developer account created', done: true },
                  { label: 'Stripe connected', done: !!developer?.stripe_account_id },
                  { label: 'Publish first Helm skill', done: mySkills.length > 0 },
                  { label: 'First installation received', done: activeInstalls > 0 }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-4 ${item.done ? 'opacity-40' : ''}`}>
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.done ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Skills List */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-white px-1">My Skills</h2>
              <div className="grid gap-4">
                {mySkills.length === 0 && (
                  <div className="p-8 text-center text-zinc-500 bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl">
                    You haven't published any skills yet.
                  </div>
                )}
                {mySkills.map((skill: any) => {
                  const stats = skillStats[skill.id] || { views: 0, installs: 0, revenue: 0 };
                  
                  return (
                    <Link key={skill.id} href={`/skills/${skill.slug}`} className="group">
                      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between hover:border-zinc-600 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-indigo-400">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{skill.name}</h3>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              <span>v{skill.current_version || '1.0.0'}</span>
                              <span className={skill.status === 'published' ? 'text-emerald-500' : skill.status === 'rejected' ? 'text-red-500' : 'text-amber-500'}>
                                {skill.status}
                              </span>
                              <span>•</span>
                              <span>{stats.views} Views</span>
                              <span>{stats.installs} Installs</span>
                              <span>€{((stats.revenue * 0.7) / 100).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-1 group-hover:text-white transition-all" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-8 h-fit lg:sticky lg:top-32">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Payouts</h3>
            
            {developer?.stripe_account_id ? (
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-zinc-800">
                <div className="text-xs font-medium text-white">Payout enabled ✓</div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 bg-emerald-500/10 rounded-md">Connected</div>
              </div>
            ) : (
              <Button asChild variant="outline" className="w-full bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 rounded-xl font-bold h-12 shadow-lg shadow-indigo-600/20">
                <Link href="/api/connect/onboard">Connect Stripe</Link>
              </Button>
            )}

            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Payouts are processed automatically via Stripe Connect. Developer share: 70% of gross revenue.
            </p>
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500">Pending</span>
                <span className="text-white font-medium">€0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Available</span>
                <span className="text-white font-medium">€0.00</span>
              </div>
            </div>
            
            <div className="pt-8 border-t border-zinc-800">
              <Button asChild variant="outline" className="w-full bg-transparent border-zinc-800 text-zinc-400 hover:text-white rounded-xl font-bold">
                <Link href="/dashboard/support">Contact Support</Link>
              </Button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
