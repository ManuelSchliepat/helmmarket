import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SettingsClient } from '@/components/settings/SettingsClient'

export default async function SettingsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = await createClient(true)
  
  // 1. Get user profile
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (!user) {
    // This could happen if clerk webhook hasn't fired yet
    // Redirect to onboarding or just wait
    redirect('/')
  }

  // 2. Get installs
  const { data: installs } = await supabase
    .from('installs')
    .select('*, skills(*)')
    .eq('user_id', userId)

  return (
    <div className="container mx-auto px-6">
      <SettingsClient user={user} initialInstalls={installs || []} />
    </div>
  )
}
