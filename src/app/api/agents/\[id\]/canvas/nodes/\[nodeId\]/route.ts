import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const { id: agentId, nodeId } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { positionX, positionY, config, status } = await request.json()

    // 1. Verify that the agent belongs to the user
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('id', agentId)
      .eq('user_id', userId)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Unauthorized or Agent not found' }, { status: 403 })
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() }
    if (positionX !== undefined) updateData.position_x = positionX
    if (positionY !== undefined) updateData.position_y = positionY
    if (config !== undefined) updateData.config = config
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabaseAdmin
      .from('agent_canvas_nodes')
      .update(updateData)
      .eq('id', nodeId)
      .eq('agent_id', agentId)
      .select()
      .single()

    if (error) {
      console.error('[API] Error updating canvas node:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[API] Unhandled error in PATCH canvas node:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const { id: agentId, nodeId } = await params
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
      return NextResponse.json({ error: 'Unauthorized or Agent not found' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('agent_canvas_nodes')
      .delete()
      .eq('id', nodeId)
      .eq('agent_id', agentId)

    if (error) {
      console.error('[API] Error deleting canvas node:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] Unhandled error in DELETE canvas node:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
