import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getDeveloper } from '@/services/supabase/skills'
import { LayoutDashboard, Package, BarChart3, CreditCard, Settings, CheckCircle2, Circle, ArrowRight } from 'lucide-react'

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ submitted?: string }> 
}) {
  const { userId } = await auth()
  const params = await searchParams
  
  if (!userId) redirect('/onboarding')

  const developer = await getDeveloper(userId)
  if (!developer?.stripe_account_id) redirect('/onboarding')

  return (
    <div className="container mx-auto py-32 px-6 flex flex-col lg:flex-row gap-16 relative">
      {params.submitted === 'true' && (
        <div className="absolute top-12 left-6 right-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-bold uppercase tracking-widest">
            Your skill has been submitted and is pending review. You'll be notified when it goes live.
          </p>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="space-y-2 lg:sticky lg:top-32">
          {[
            { label: 'Overview', icon: LayoutDashboard, active: true },
            { label: 'My Skills', icon: Package },
            { label: 'Analytics', icon: BarChart3 },
            { label: 'Earnings', icon: CreditCard },
            { label: 'Settings', icon: Settings }
          ].map((item) => (
            <Link 
              key={item.label} 
              href="#" 
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
            <p className="text-zinc-500 font-medium">Manage your skills and track performance.</p>
          </div>
          <Button asChild className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg shadow-indigo-600/20">
            <Link href="/publish">Publish Skill</Link>
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Earnings', val: '€0.00' },
            { label: 'Active Installs', val: '0' },
            { label: 'Avg Rating', val: '-.--' },
            { label: 'Skills Live', val: '0' }
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
                  { label: 'Stripe connected', done: true },
                  { label: 'Publish first Helm skill', done: false, cta: 'Upload' },
                  { label: 'First installation received', done: false }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-4 ${item.done ? 'opacity-40' : ''}`}>
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.done ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>{item.label}</p>
                      {!item.done && item.cta && (
                        <Link href="/publish" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center gap-1 transition-all group">
                          {item.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            <div className="py-24 text-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No active skills</h3>
              <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium">Your first published skill will appear here.</p>
              <Button asChild variant="outline" className="h-10 px-8 border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white rounded-full transition-all">
                <Link href="/publish">Publish Now</Link>
              </Button>
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-8">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Payouts</h3>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-zinc-800">
              <div className="text-xs font-medium text-white">Stripe Connect</div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 bg-emerald-500/10 rounded-md">Active</div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Funds clear in 2-3 days and are paid out automatically every Monday to your linked bank account.
            </p>
          </aside>

        </div>
      </main>
    </div>
  )
}
