import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient(true)

  // Get total counts
  const { data: counts, error: countErr } = await supabase
    .from('skill_events')
    .select('event_type')
    .eq('skill_id', id)

  if (countErr) {
    return NextResponse.json({ error: countErr.message }, { status: 500 })
  }

  let totalInstalls = 0
  let totalViews = 0
  let totalExecutions = 0

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  thirtyDaysAgo.setHours(0, 0, 0, 0)
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString()

  counts.forEach(event => {
    if (event.event_type === 'install') totalInstalls++
    if (event.event_type === 'execute') totalExecutions++
  })

  // For views this week
  const { count: viewsThisWeek } = await supabase
    .from('skill_events')
    .select('*', { count: 'exact', head: true })
    .eq('skill_id', id)
    .eq('event_type', 'view')
    .gte('created_at', new Date(sevenDaysAgo).toISOString())

  totalViews = viewsThisWeek || 0;

  // Daily Data for last 30 days
  const { data: recentEvents } = await supabase
    .from('skill_events')
    .select('event_type, created_at')
    .eq('skill_id', id)
    .in('event_type', ['install', 'view'])
    .gte('created_at', thirtyDaysAgoIso)

  const dailyDataMap: Record<string, { installs: number, views: number }> = {}

  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    dailyDataMap[dateStr] = { installs: 0, views: 0 }
  }

  if (recentEvents) {
    recentEvents.forEach(e => {
      const dateStr = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (dailyDataMap[dateStr]) {
        if (e.event_type === 'install') dailyDataMap[dateStr].installs++
        if (e.event_type === 'view') dailyDataMap[dateStr].views++
      }
    })
  }

  const dailyData = Object.entries(dailyDataMap)
    .map(([date, counts]) => ({ date, ...counts }))
    .reverse() // chronological order

  return NextResponse.json({
    totalInstalls,
    totalViews,
    totalExecutions,
    dailyData
  })
}
