import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { agent_id, max_monthly_spend_cents, allowed_labels, verified_only } = await req.json()
    if (!agent_id) return NextResponse.json({ error: 'agent_id is required' }, { status: 400 })

    const supabase = await createClient(true)
    
    const { data, error } = await supabase
      .from('agent_policies')
      .upsert({
        agent_id,
        owner_user_id: userId,
        max_monthly_spend_cents: max_monthly_spend_cents || 50000,
        allowed_compliance_labels: allowed_labels || ['GDPR', 'SOC2'],
        verified_only: verified_only ?? true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'agent_id' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, policy: data })
  } catch (err: any) {
    console.error('Agent Policy error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
