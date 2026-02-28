import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const supabase = await createClient(true)

    // 1. Fetch all published skills
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .eq('status', 'published')

    if (error || !skills) throw error

    // 2. Calculate scores
    const scoredSkills = skills.map(skill => {
      const score = (
        (skill.installs * 3) + 
        (Number(skill.avg_rating) * 20) + 
        ((skill.compliance_labels?.length || 0) * 10) + 
        (skill.quality_status === 'verified' ? 40 : 0)
      )
      return { id: skill.id, score }
    })

    // 3. Reset all picks
    await supabase.from('skills').update({ is_editors_pick: false, score: 0 })

    // 4. Set top 3 picks
    const top3 = scoredSkills.sort((a, b) => b.score - a.score).slice(0, 3)
    
    for (const s of scoredSkills) {
      const isPick = top3.some(pick => pick.id === s.id)
      await supabase.from('skills').update({ 
        score: s.score,
        is_editors_pick: isPick,
        editors_pick_since: isPick ? new Date().toISOString() : null
      }).eq('id', s.id)
    }

    return NextResponse.json({ success: true, top3: top3.map(p => p.id) })
  } catch (err: any) {
    console.error('Curation Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
