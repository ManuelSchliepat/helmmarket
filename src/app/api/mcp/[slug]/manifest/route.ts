import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { translateToMCPManifest, HelmConfig } from '@/lib/mcp/utils'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient(true)
  const { data: skill, error } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }

  const config = skill.config as HelmConfig
  if (!config || !config.operations) {
    return NextResponse.json({ error: 'Skill has no MCP-compatible configuration' }, { status: 400 })
  }

  const manifest = translateToMCPManifest(config, slug)
  return NextResponse.json(manifest)
}
