import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Plus, ArrowRight, Settings, Trash2, Globe, Lock } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AgentsDashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createClient()

  // Fetch agents for current user
  const { data: agents, error } = await supabase
    .from('agents')
    .select('*, agent_skills(*, skills(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error && error.code !== 'PGRST116') {
      console.error('Error fetching agents:', error)
  }

  const myAgents = agents || []

  return (
    <div className="container mx-auto py-32 px-6 flex flex-col lg:flex-row gap-16 relative">
      {/* Sidebar - Same as dashboard */}
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="space-y-2 lg:sticky lg:top-32">
          {[
            { label: 'Account', icon: Bot, href: '/dashboard' },
            { label: 'AI Agents', icon: Bot, active: true, href: '/dashboard/agents' },
            { label: 'My Skills', icon: Bot, href: '#' },
            { label: 'Analytics', icon: Bot, href: '#' },
            { label: 'Billing', icon: Bot, href: '#' },
            { label: 'Settings', icon: Bot, href: '#' }
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
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Agent Console</h1>
            <p className="text-zinc-500 font-medium">Create and manage your custom AI agents.</p>
          </div>
          <Button asChild className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg shadow-indigo-600/20">
            <Link href="/dashboard/agents/new">
              <Plus className="w-4 h-4 mr-2" />
              Create New Agent
            </Link>
          </Button>
        </header>

        {/* Agents Grid */}
        <div className="grid gap-6">
          {myAgents.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-500">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No agents created yet</h3>
              <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                Compose your first AI agent by selecting a model and attaching marketplace skills.
              </p>
              <Button asChild variant="outline" className="rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                <Link href="/dashboard/agents/new">Create Your First Agent</Link>
              </Button>
            </div>
          ) : (
            myAgents.map((agent: any) => (
              <div key={agent.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500">
                      <Bot className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-1 group-hover:text-indigo-400 transition-colors">{agent.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{agent.model_id}</span>
                        <span className="text-zinc-700 text-[8px]">•</span>
                        {agent.is_public ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            <Globe className="w-3 h-3" /> Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Private
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl" asChild>
                       <Link href={`/dashboard/agents/${agent.id}/edit`}>
                         <Settings className="w-4 h-4" />
                       </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm mb-8 line-clamp-2">{agent.description || 'No description provided.'}</p>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                   <div className="flex -space-x-2">
                      {agent.agent_skills?.map((as: any) => (
                        <div key={as.skill_id} className="w-8 h-8 rounded-lg bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-zinc-400 text-[10px] font-bold overflow-hidden" title={as.skills?.name}>
                          {as.skills?.name?.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {(!agent.agent_skills || agent.agent_skills.length === 0) && (
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-2">No skills attached</span>
                      )}
                   </div>
                   <Button asChild className="rounded-full bg-zinc-800 hover:bg-indigo-600 text-white font-medium group/btn">
                     <Link href={`/agent/${agent.id}`} className="flex items-center gap-2">
                       Launch Console
                       <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                     </Link>
                   </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
