import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { full_name, preferred_language, avatar_url } = body

    const supabase = await createClient(true) // Use admin to update
    
    const updateData: any = {}
    if (full_name !== undefined) updateData.full_name = full_name
    if (preferred_language !== undefined) updateData.preferred_language = preferred_language
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
