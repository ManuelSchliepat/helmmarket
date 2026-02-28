import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient(true)
  
  const { data: skills } = await supabase
    .from('skills')
    .select('*, developers(users(full_name))')
    .eq('status', 'published')

  const formattedSkills = (skills || []).map(s => {
    // Compute Trust Score
    let trustScore = 0
    if (s.quality_status === 'verified') trustScore += 40
    if (s.compliance_labels) {
      trustScore += Math.min(s.compliance_labels.length * 10, 30)
    }
    // Using real ratings/verified info
    if (Number(s.avg_rating) >= 4.5) trustScore += 20
    
    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      price_cents: s.price_cents,
      currency: 'eur',
      compliance_labels: s.compliance_labels || [],
      quality_status: s.quality_status || 'pending',
      trust_score: s.score || trustScore, // using curation score as base or fallback
      is_editors_pick: s.is_editors_pick,
      mcp_endpoint: s.registry_endpoint,
      purchase_endpoint: `https://helmmarket.com/api/v1/purchase`,
      agent_compatible: true
    }
  })

  return NextResponse.json({
    schema_version: "1.0",
    marketplace: "helm-market",
    purchaser_types: ["human", "agent"],
    skills: formattedSkills
  })
}
