import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SkillNodeGraph from '@/components/dashboard/SkillNodeGraph'
import InstallHistoryLog from '@/components/dashboard/InstallHistoryLog'

export const dynamic = 'force-dynamic'

export default async function AgentDashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createClient()

  // 1. Fetch purchased skills (installs)
  const { data: installs, error: installsError } = await supabase
    .from('installs')
    .select('*, skills(*, categories(*))')
    .eq('user_id', userId)

  if (installsError) {
    console.error('Error fetching installs:', installsError)
  }

  // 2. Fetch install history (events)
  const { data: events, error: eventsError } = await supabase
    .from('skill_events')
    .select('*, skills(*)')
    .eq('user_id', userId)
    .in('event_type', ['install', 'upgrade', 'remove', 'uninstall'])
    .order('created_at', { ascending: false })
    .limit(20)

  if (eventsError) {
    console.error('Error fetching events:', eventsError)
  }

  const mappedSkills = (installs || []).map((i: any) => ({
    id: i.skill_id,
    name: i.skills?.name || 'Unknown',
    slug: i.skills?.slug || '',
    version: i.skills?.current_version || '1.0.0',
    category: i.skills?.categories?.slug || 'general',
    installDate: i.created_at,
  }))

  const mappedEvents = (events || []).map((e: any) => ({
    id: e.id,
    event_type: e.event_type === 'uninstall' ? 'remove' : e.event_type,
    skill_name: e.skills?.name || 'Unknown',
    version: e.metadata?.version || e.skills?.current_version || '1.0.0',
    helm_command: e.metadata?.command || `helm install @helm-market/${e.skills?.slug || 'skill'}`,
    created_at: e.created_at,
  }))

  return (
    <div className="container mx-auto py-32 px-6 flex flex-col gap-8 min-h-screen bg-[#0a0a0a]">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Agent Overview</h1>
        <p className="text-zinc-500 font-medium mt-2">Your installed skills and history</p>
      </div>

      <div className="flex flex-col gap-6 h-[120vh]">
        {/* Graph: 60% of viewport height (approx) */}
        <div className="flex-[6] min-h-[500px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden relative shadow-2xl">
          <SkillNodeGraph skills={mappedSkills} />
        </div>

        {/* Log: 40% of viewport height (approx) */}
        <div className="flex-[4] min-h-[300px]">
          <InstallHistoryLog events={mappedEvents} />
        </div>
      </div>
    </div>
  )
}
