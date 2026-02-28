import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

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

  // 2. Get skill details
  const { data: skill } = await supabase
    .from('skills')
    .select('id, registry_endpoint, current_version')
    .eq('slug', slug)
    .single()

  if (!skill) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // 3. Check access
  const { data: access } = await supabase
    .from('installs')
    .select('id')
    .eq('user_id', userInstall.user_id)
    .eq('skill_id', skill.id)
    .single()

  return NextResponse.json({
    npmPackage: skill.registry_endpoint,
    version: skill.current_version || '1.0.0',
    hasAccess: !!access
  })
}
