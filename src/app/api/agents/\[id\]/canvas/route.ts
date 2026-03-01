import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Fetch agent - Ensure user owns it
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('user_id', userId)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // 2. Fetch canvas nodes with skill details
    const { data: canvasNodes, error: nodesError } = await supabaseAdmin
      .from('agent_canvas_nodes')
      .select(`
        id,
        skill_id,
        position_x,
        position_y,
        config,
        status,
        skills (
          id,
          name,
          description,
          icon,
          category
        )
      `)
      .eq('agent_id', agentId)

    if (nodesError) {
      console.error('[API] Error fetching canvas nodes:', nodesError)
      return NextResponse.json({ error: nodesError.message }, { status: 500 })
    }

    return NextResponse.json({ agent, canvasNodes: canvasNodes || [] })
  } catch (err) {
    console.error('[API] Unhandled error in GET canvas:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
