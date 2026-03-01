import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AgentForm } from '@/components/dashboard/AgentForm'

export const dynamic = 'force-dynamic'

export default async function NewAgentPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createClient()

  // Fetch user's installed skills
  const { data: installs, error } = await supabase
    .from('installs')
    .select('*, skills(*)')
    .eq('user_id', userId)

  if (error) {
      console.error('Error fetching installs:', error)
  }

  const availableSkills = (installs || []).map((i: any) => i.skills).filter(Boolean)

  return (
    <div className="container mx-auto py-32 px-6 max-w-2xl min-h-screen">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Create New Agent</h1>
        <p className="text-zinc-500 font-medium">Configure your autonomous AI assistant.</p>
      </header>
      
      <AgentForm availableSkills={availableSkills} userId={userId} />
    </div>
  )
}
