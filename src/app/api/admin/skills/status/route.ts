import { NextResponse } from 'next/server'
import { updateSkillStatus } from '@/services/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify admin
    const supabase = await createClient(true)
    const { data: user } = await supabase.from('users').select('is_admin').eq('id', userId).single()
    if (!user?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, status, note } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    await updateSkillStatus(id, status, note)

    // Fetch the skill to get publisher id
    const { data: skillData } = await supabase.from('skills').select('developer_id, name, slug').eq('id', id).single()

    if (skillData) {
      // Trigger Webhooks
      const { createWebhookDelivery } = await import('@/lib/webhooks')
      const evt = status === 'published' ? 'review.approved' : 'review.rejected'
      
      // Fire and forget
      createWebhookDelivery(skillData.developer_id, evt, {
        skillId: id,
        skillName: skillData.name,
        skillSlug: skillData.slug,
        status,
        note
      }).catch(err => console.error("Webhook trigger failed", err))
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update status error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
