import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify agent ownership
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('id', agentId)
      .eq('user_id', userId)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const { skillId, positionX, positionY } = await request.json()

    const { data, error } = await supabaseAdmin
      .from('agent_canvas_nodes')
      .insert({
        agent_id: agentId,
        skill_id: skillId,
        position_x: positionX,
        position_y: positionY,
      })
      .select(`
        id, skill_id, position_x, position_y, config, status,
        skills ( id, name, description, icon, category )
      `)
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Skill already connected' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[API] Unhandled error in POST canvas node:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
