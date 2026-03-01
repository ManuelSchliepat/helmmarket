import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: agents, error } = await supabaseAdmin
      .from('agents')
      .select('*, agent_skills(*, skills(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[API] Error fetching agents:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agents })
  } catch (err) {
    console.error('[API] Unhandled error in GET /api/agents:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, model_id, is_public, skill_configs } = await request.json()

    if (!name || !model_id) {
      return NextResponse.json({ error: 'Name and Model are required' }, { status: 400 })
    }

    // 1. Create the agent
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .insert({
        user_id: userId,
        name,
        description,
        model_id,
        is_public: is_public || false
      })
      .select()
      .single()

    if (agentError) {
      console.error('[API] Error creating agent:', agentError)
      return NextResponse.json({ error: agentError.message }, { status: 500 })
    }

    // 2. Attach skills if provided
    if (skill_configs && skill_configs.length > 0) {
      const agentSkills = skill_configs.map((sc: any) => ({
        agent_id: agent.id,
        skill_id: sc.id,
        permissions_map: sc.permissions || {}
      }))

      const { error: skillsError } = await supabaseAdmin
        .from('agent_skills')
        .insert(agentSkills)

      if (skillsError) {
        console.error('[API] Error attaching skills:', skillsError)
      }
    }

    return NextResponse.json({ success: true, agent_id: agent.id })
  } catch (err) {
    console.error('[API] Unhandled error in POST /api/agents:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
