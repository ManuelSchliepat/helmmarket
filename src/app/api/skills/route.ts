import { auth } from '@clerk/nextjs/server'
export const dynamic = 'force-dynamic'
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
    console.log("Skill submission received for user:", userId, skillData)
    
    // Parse and validate config if provided
    let parsedConfig = {}
    if (skillData.config) {
      try {
        parsedConfig = JSON.parse(skillData.config)
      } catch (e) {
        console.error("Invalid config JSON:", skillData.config)
        return NextResponse.json({ error: 'Invalid JSON in helm.config.json' }, { status: 400 })
      }
    }

    // Auto-assign developer_id and update config
    const finalSkillData = {
      ...skillData,
      config: parsedConfig,
      developer_id: userId,
      status: 'pending_review'
    }

    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .insert(finalSkillData)
      .select()
      .single()

    if (skillError) {
      console.error('Skill insert error details:', JSON.stringify(skillError))
      return NextResponse.json({ 
        error: true, 
        message: skillError.message,
        details: skillError.details
      }, { status: 500 })
    }

    console.log("Skill created successfully:", skill.id)
    return NextResponse.json(skill)
  } catch (err: any) {
    console.error('Skill submission catch error:', err)
    return NextResponse.json({ 
      error: true, 
      message: err.message || 'Internal server error' 
    }, { status: 500 })
  }
}
