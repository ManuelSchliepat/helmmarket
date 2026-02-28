import { NextResponse } from 'next/server'
import { updatePublisherVerification } from '@/services/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient(true)
    const { data: user } = await supabase.from('users').select('is_admin').eq('id', userId).single()
    if (!user?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, is_verified } = await req.json()
    if (!id || typeof is_verified !== 'boolean') {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await updatePublisherVerification(id, is_verified)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update verification error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
