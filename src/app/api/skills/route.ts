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

    const { version, changelog, category, ...restSkillData } = skillData

    // Auto-assign developer_id and update config
    const finalSkillData: any = {
      ...restSkillData,
      config: parsedConfig,
      developer_id: userId,
      status: 'pending_review',
      current_version: version || '1.0.0',
    }

    // Attempt to lookup category_id if needed, but for now we'll just let it pass or omit if not matching exact schema
    // Let's find category_id by slug if category is provided
    if (category) {
      const { data: catData } = await supabase.from('categories').select('id').eq('slug', category).single()
      if (catData) finalSkillData.category_id = catData.id
    }

    // Check if skill already exists
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('id, total_versions')
      .eq('slug', finalSkillData.slug)
      .single()

    let skillId;
    if (existingSkill) {
      // Ensure owner matches
      const { data: ownerCheck } = await supabase.from('skills').select('id').eq('id', existingSkill.id).eq('developer_id', userId).single()
      if (!ownerCheck) {
        return NextResponse.json({ error: 'Skill slug already taken' }, { status: 403 })
      }

      finalSkillData.total_versions = (existingSkill.total_versions || 1) + 1;

      const { data: updatedSkill, error: updateError } = await supabase
        .from('skills')
        .update(finalSkillData)
        .eq('id', existingSkill.id)
        .select()
        .single()

      if (updateError) throw updateError
      skillId = updatedSkill.id

      // Set older versions to not latest
      await supabase.from('skill_versions').update({ is_latest: false }).eq('skill_id', skillId)
    } else {
      finalSkillData.total_versions = 1;
      const { data: newSkill, error: insertError } = await supabase
        .from('skills')
        .insert(finalSkillData)
        .select()
        .single()

      if (insertError) {
        console.error('Skill insert error details:', JSON.stringify(insertError))
        return NextResponse.json({ error: true, message: insertError.message }, { status: 500 })
      }
      skillId = newSkill.id
    }

    // Insert to skill_versions
    const { error: versionError } = await supabase
      .from('skill_versions')
      .insert({
        skill_id: skillId,
        version: version || '1.0.0',
        changelog: changelog || null,
        registry_endpoint: finalSkillData.registry_endpoint,
        is_latest: true
      })
      
    if (versionError && versionError.code !== '23505') {
       console.error('Skill version insert error:', versionError)
       // If unique constraint violation, it means version already exists, we can ignore or return error.
    }

    console.log("Skill created/updated successfully:", skillId)
    return NextResponse.json({ id: skillId })
  } catch (err: any) {
    console.error('Skill submission catch error:', err)
    return NextResponse.json({ 
      error: true, 
      message: err.message || 'Internal server error' 
    }, { status: 500 })
  }
}
