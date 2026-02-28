'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, BarChart3, CreditCard, Settings, CheckCircle2, Circle, ArrowRight, Star } from 'lucide-react'
import { placeholderSkills } from '@/lib/placeholder-data'
import { useI18n } from '@/lib/i18n-context'

export default function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ submitted?: string }> 
}) {
  const { t } = useI18n()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    searchParams.then(p => {
      if (p.submitted === 'true') setSubmitted(true)
    })
  }, [searchParams])

  // Hardcoded selection for demo populated state
  const mySkills = placeholderSkills.slice(0, 2);

  return (
    <div className="container mx-auto py-32 px-6 flex flex-col lg:flex-row gap-16 relative">
      {submitted && (
        <div className="absolute top-12 left-6 right-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-bold uppercase tracking-widest">
            {t('saved')} — Your skill has been submitted and is pending review.
          </p>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="space-y-2 lg:sticky lg:top-32">
          {[
            { label: t('account'), icon: LayoutDashboard, active: true },
            { label: t('mySkills'), icon: Package },
            { label: 'Analytics', icon: BarChart3 },
            { label: t('billing'), icon: CreditCard },
            { label: t('settings'), icon: Settings }
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
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">{t('devConsole')}</h1>
            <p className="text-zinc-500 font-medium">{t('manageSkills')}</p>
          </div>
          <Button asChild className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg shadow-indigo-600/20">
            <Link href="/publish">{t('submitNew')}</Link>
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t('revenue'), val: '€1,240.00' },
            { label: t('activeInstalls'), val: '84' },
            { label: t('avgRating'), val: '4.9' },
            { label: t('skillsLive'), val: '2' }
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
              <h2 className="text-xl font-medium text-white mb-8">{t('launchChecklist')}</h2>
              <div className="space-y-6">
                {[
                  { label: 'Developer account created', done: true },
                  { label: 'Stripe connected', done: true },
                  { label: 'Publish first Helm skill', done: true },
                  { label: 'First installation received', done: true }
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
              <h2 className="text-xl font-medium text-white px-1">{t('mySkills')}</h2>
              <div className="grid gap-4">
                {mySkills.map((skill) => (
                  <Link key={skill.id} href={`/skills/${skill.slug}`} className="group">
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between hover:border-zinc-600 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-indigo-400">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{skill.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <span>v1.0.4</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current text-amber-500" /> 4.9</span>
                            <span className="text-emerald-500">Active</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-1 group-hover:text-white transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-8 h-fit lg:sticky lg:top-32">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{t('payouts')}</h3>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-zinc-800">
              <div className="text-xs font-medium text-white">Stripe Connect</div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 bg-emerald-500/10 rounded-md">{t('connected')}</div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              {t('payoutSub')}
            </p>
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500">{t('pending')}</span>
                <span className="text-white font-medium">€142.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">{t('available')}</span>
                <span className="text-white font-medium">€0.00</span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
