import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getDeveloper } from '@/services/supabase/skills'
import { LayoutDashboard, Package, BarChart3, CreditCard, Settings, Plus, CheckCircle2, Circle, ArrowUpRight, TrendingUp, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/onboarding')
  }

  const developer = await getDeveloper(userId)
  
  if (!developer?.stripe_account_id) {
    redirect('/onboarding')
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col lg:flex-row gap-12">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-24 space-y-8">
          <nav className="flex flex-col gap-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20">
              <LayoutDashboard className="w-5 h-5" /> Overview
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-gray-900 rounded-2xl transition-all font-bold text-sm">
              <Package className="w-5 h-5" /> My Skills
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-gray-900 rounded-2xl transition-all font-bold text-sm">
              <BarChart3 className="w-5 h-5" /> Analytics
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-gray-900 rounded-2xl transition-all font-bold text-sm">
              <CreditCard className="w-5 h-5" /> Earnings
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-gray-900 rounded-2xl transition-all font-bold text-sm">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </nav>

          <div className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-3xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-3">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium mb-4">Need help with your integration or payouts? Our team is active 24/7.</p>
            <Button variant="outline" className="w-full text-[10px] h-8 border-indigo-500/20 bg-transparent text-indigo-300 hover:bg-indigo-500/10 font-black uppercase tracking-widest">
              Open Ticket
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 space-y-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Developer Console</h1>
            <p className="text-gray-500 font-medium text-sm">Everything you need to scale your AI skill business.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
              <Link href="/publish"><Plus className="w-5 h-5 mr-2" /> Publish New Skill</Link>
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Earnings', val: '€0.00', trend: '↑ +0%', color: 'emerald' },
            { label: 'Active Installs', val: '0', trend: '↑ +0', color: 'emerald' },
            { label: 'Avg Rating', val: '-.--', trend: '-- reviews', color: 'gray' },
            { label: 'Skills Live', val: '0', trend: 'of ∞', color: 'indigo' }
          ].map((stat) => (
            <Card key={stat.label} className="bg-gray-900/30 border-gray-800/60 rounded-2xl shadow-inner group hover:border-indigo-500/30 transition-colors">
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.val}</div>
                <p className={`text-[10px] font-black uppercase tracking-widest flex items-center ${
                  stat.color === 'emerald' ? 'text-emerald-400' : 'text-gray-600'
                }`}>
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Checklist */}
            <div className="bg-[#0c0c0e] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -mr-32 -mt-32" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-500 rotate-45" /> Launch Checklist
                </h2>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">40% Complete</span>
                  <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-2/5 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Create developer account', done: true },
                  { label: 'Connect Stripe for secure payouts', done: true },
                  { label: 'Publish your first Helm skill', done: false, cta: 'Upload now' },
                  { label: 'Receive your first installation', done: false },
                  { label: 'Earn your first €10', done: false }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-4 ${item.done ? 'opacity-40' : ''}`}>
                    {item.done ? (
                      <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-700 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${item.done ? 'text-gray-400 line-through' : 'text-gray-200'}`}>{item.label}</p>
                      {!item.done && item.cta && (
                        <Link href="/publish" className="text-xs font-black text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center gap-1 uppercase tracking-widest group">
                          {item.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State Skills */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Active Skills</h2>
                <Link href="#" className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">View All Archive</Link>
              </div>
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-gray-900/20 border-2 border-gray-800 border-dashed rounded-[2.5rem] group hover:border-indigo-500/20 transition-all duration-500">
                <div className="w-20 h-20 bg-gray-800/50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Package className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No skills live yet</h3>
                <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-medium">
                  Thousands of developers are searching for the tool you're about to build. Get started today.
                </p>
                <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 h-14 px-10 rounded-2xl font-black shadow-xl">
                  <Link href="/publish">Publish Your First Skill</Link>
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            {/* Payouts UI */}
            <div className="bg-[#0c0c0e] border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-8 tracking-tight">Earning Flow</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-800 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center font-black">S</div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">Stripe Connect</p>
                    <p className="text-[10px] font-bold text-gray-600 mt-0.5 uppercase tracking-tighter">Verified Wallet</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-lg border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active
                </div>
              </div>

              <div className="space-y-8 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-800" />
                {[
                  { label: 'Sale occurs', sub: 'Customer installs skill', icon: TrendingUp, color: 'gray' },
                  { label: 'Funds clear', sub: '2-3 days processing', icon: ShieldCheck, color: 'gray' },
                  { label: 'Weekly Payout', sub: 'Sent every Monday', icon: CreditCard, color: 'indigo', active: true }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 relative z-10 group">
                    <div className={`w-6 h-6 rounded-full bg-gray-950 border ${
                      step.active ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gray-800'
                    } flex items-center justify-center shrink-0`}>
                      {step.active ? (
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-sm font-bold ${step.active ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-800/50">
                <p className="text-[10px] font-black text-indigo-400/60 text-center uppercase tracking-[0.3em]">Next Payout: March 24</p>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
