import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')

  const supabase = await createClient(true)
  
  // 1. Get user_id from token
  const { data: userInstall } = await supabase
    .from('installs')
    .select('user_id')
    .eq('token', token)
    .limit(1)
    .single()

  if (!userInstall) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Get all installs for this user
  const { data: installs } = await supabase
    .from('installs')
    .select('created_at, skills(slug, current_version)')
    .eq('user_id', userInstall.user_id)

  const formatted = (installs || []).map(inst => ({
    // @ts-ignore
    slug: inst.skills?.slug,
    // @ts-ignore
    version: inst.skills?.current_version || '1.0.0',
    installedAt: inst.created_at
  }))

  return NextResponse.json(formatted)
}
