import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { translateToMCPManifest, generateSkillMd, HelmConfig } from '@/lib/mcp/utils'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    const { data: skill, error } = await supabaseAdmin
      .from('skills')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    const config = skill.config as HelmConfig
    if (!config || !config.operations) {
      return NextResponse.json({ error: 'Skill has no valid configuration' }, { status: 400 })
    }

    if (format === 'md' || format === 'skill.md') {
      const markdown = generateSkillMd(config, slug)
      return new Response(markdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Default to MCP JSON manifest
    const manifest = translateToMCPManifest(config, slug)
    return NextResponse.json(manifest, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (err) {
    console.error('[API] Unhandled error in skill manifest:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
