import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

    if (sessionId === 'mock_session') {
      return NextResponse.json({
        skill_name: 'vuln-scanner',
        registry_endpoint: '@helm-market/vuln-scanner',
        token: 'helm_tok_mock_a1b2c3d4e5f6g7h8i9j0'
      })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Session not paid' }, { status: 400 })
    }

    const skillId = session.metadata?.skillId
    if (!skillId) return NextResponse.json({ error: 'No skillId in metadata' }, { status: 400 })

    const supabase = await createClient(true)
    
    // 1. Get skill details
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('name, registry_endpoint')
      .eq('id', skillId)
      .single()

    if (skillError || !skill) throw new Error('Skill not found')

    // 2. Check for existing install or create new one
    const { data: existingInstall } = await supabase
      .from('installs')
      .select('token')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .single()

    let token = existingInstall?.token

    if (!token) {
      token = `helm_tok_${uuidv4().replace(/-/g, '')}`
      const { error: installError } = await supabase
        .from('installs')
        .insert({
          user_id: userId,
          skill_id: skillId,
          token
        })
      
      if (installError) {
        // If race condition happened, fetch the existing one
        if (installError.code === '23505') {
           const { data: retry } = await supabase
            .from('installs')
            .select('token')
            .eq('user_id', userId)
            .eq('skill_id', skillId)
            .single()
           token = retry?.token
        } else {
          throw new Error('Failed to create installation record')
        }
      }
    }

    return NextResponse.json({
      skill_name: skill.name,
      registry_endpoint: skill.registry_endpoint || `@helm-market/${skill.name.toLowerCase().replace(/\s/g, '-')}`,
      token
    })
  } catch (err: any) {
    console.error('Success API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
