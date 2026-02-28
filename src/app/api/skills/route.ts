import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Verify developer exists
  const { data: developer, error: devError } = await supabase
    .from('developers')
    .select('id')
    .eq('id', userId)
    .single()

  if (devError || !developer) {
    return NextResponse.json({ error: 'Not registered as a developer' }, { status: 403 })
  }

  try {
    const skillData = await request.json()
    
    // Auto-assign developer_id
    const finalSkillData = {
      ...skillData,
      developer_id: userId,
      status: 'pending_review'
    }

    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .insert(finalSkillData)
      .select()
      .single()

    if (skillError) {
      console.error('Skill insert error:', skillError)
      return NextResponse.json({ error: skillError.message }, { status: 500 })
    }

    return NextResponse.json(skill)
  } catch (err) {
    console.error('Skill submission catch error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
