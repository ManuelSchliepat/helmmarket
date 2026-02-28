import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { HelmConfig } from '@/lib/mcp/utils'

export const dynamic = 'force-dynamic'

export async function POST(
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

  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid install_token' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]

  // TODO: In a real implementation, we would verify the install_token against a database of issued tokens.
  // For now, we allow any token for the sake of the bridge demonstration.
  if (token !== 'test-install-token') {
     return NextResponse.json({ error: 'Unauthorized: Invalid install_token' }, { status: 403 })
  }

  try {
    const { toolName, arguments: args } = await request.json()
    const config = (skill as any).config as HelmConfig
    const operation = config.operations.find(op => op.name === toolName)

    if (!operation) {
      return NextResponse.json({ error: `Tool ${toolName} not found` }, { status: 400 })
    }

    // Here we would proxy to the actual skill execution logic.
    // For now, we simulate a successful execution result.
    return NextResponse.json({
      content: [
        {
          type: "text",
          text: `Executed ${toolName} for ${slug} with args: ${JSON.stringify(args)}`
        }
      ]
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
