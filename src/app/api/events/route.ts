import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    const { skillId, eventType, metadata } = await req.json()

    if (!skillId || !['install', 'uninstall', 'execute', 'error', 'view'].includes(eventType)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { userId } = await auth()
    
    // Auth required for 'install'
    if (eventType === 'install' && !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient(true)

    // Rate limiting for 'view'
    if (eventType === 'view') {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'unknown'
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

      const { count } = await supabase
        .from('skill_events')
        .select('*', { count: 'exact', head: true })
        .eq('skill_id', skillId)
        .eq('event_type', 'view')
        .eq('metadata->>ip', ip)
        .gte('created_at', oneHourAgo)

      if (count !== null && count >= 10) {
        return NextResponse.json({ success: false, reason: 'rate_limited' })
      }

      // Add IP to metadata for rate limiting
      if (!metadata) {
        await supabase.from('skill_events').insert({ skill_id: skillId, event_type: eventType, user_id: userId, metadata: { ip } })
      } else {
        metadata.ip = ip;
        await supabase.from('skill_events').insert({ skill_id: skillId, event_type: eventType, user_id: userId, metadata })
      }
      return NextResponse.json({ success: true })
    }

    await supabase.from('skill_events').insert({
      skill_id: skillId,
      event_type: eventType,
      user_id: userId,
      metadata: metadata || {}
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Events error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
