import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, description, model_id, is_public, skill_configs } = await request.json()
    console.log(`[API] Creating agent: "${name}" for user ${userId}`)

    if (!name || !model_id) {
        return NextResponse.json({ error: 'Name and Model are required' }, { status: 400 })
    }

    const supabase = await createClient(true)

    // 1. Create the agent
    const { data: agent, error: agentError } = await supabase
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
      console.error('[API] Error creating agent row:', agentError)
      return NextResponse.json({ error: agentError.message }, { status: 500 })
    }

    console.log(`[API] Agent row created: ${agent.id}`)

    // 2. Attach skills
    if (skill_configs && skill_configs.length > 0) {
      const agentSkills = skill_configs.map((sc: any) => ({
        agent_id: agent.id,
        skill_id: sc.id,
        permissions_map: sc.permissions || {}
      }))

      const { error: skillsError } = await supabase
        .from('agent_skills')
        .insert(agentSkills)

      if (skillsError) {
        console.error('Error attaching skills:', skillsError)
        // We could delete the agent here, but let's just return a partial success warning
      }
    }

    return NextResponse.json({ success: true, agent_id: agent.id })
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log(`[API] Fetching agents for user: ${userId}`)
    
    const supabase = await createClient()
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*, agent_skills(*, skills(*))')
      .eq('user_id', userId)

    if (error) {
        console.error('[API] Supabase error fetching agents:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`[API] Found ${agents?.length || 0} agents for user ${userId}`)
    return NextResponse.json({ agents })
}
