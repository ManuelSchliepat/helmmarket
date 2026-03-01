import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: agent, error } = await supabaseAdmin
      .from('agents')
      .select('*, agent_skills(*, skills(*))')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('[API] Error fetching agent:', error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ agent })
  } catch (err) {
    console.error('[API] Unhandled error in GET /api/agents/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Ensure we only update the user's agent
    const { data: agent, error } = await supabaseAdmin
      .from('agents')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('[API] Error updating agent:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, agent })
  } catch (err) {
    console.error('[API] Unhandled error in PATCH /api/agents/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabaseAdmin
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[API] Error deleting agent:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] Unhandled error in DELETE /api/agents/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
