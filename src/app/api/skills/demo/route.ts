import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { slug, prompt } = await req.json()
    if (!slug || !prompt) {
      return NextResponse.json({ error: 'Missing slug or prompt' }, { status: 400 })
    }

    const supabase = await createClient(true)

    // Lookup skill
    const { data: skill } = await supabase.from('skills').select('id, slug').eq('slug', slug).single()
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Rate limiting: 3 free demos per hour per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'unknown'
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { count } = await supabase
      .from('skill_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'execute')
      .eq('metadata->>ip', ip)
      .eq('metadata->>demo', 'true')
      .gte('created_at', oneHourAgo)

    if (count !== null && count >= 3) {
      return NextResponse.json({ 
        error: "rate_limited", 
        message: "3 free demos per hour. Sign up for unlimited." 
      }, { status: 429 })
    }

    // Log execute event
    await supabase.from('skill_events').insert({
      skill_id: skill.id,
      event_type: 'execute',
      metadata: { ip, demo: 'true', prompt }
    })

    // Simulate execution time
    const executionMs = Math.floor(Math.random() * 600) + 200;
    await new Promise(r => setTimeout(r, executionMs));

    const pLower = prompt.toLowerCase()
    let responseData: any = { message: "Execution completed successfully.", _meta: { executionMs, model: "helm-sandbox-v1", cached: false } }

    if (slug === 'vuln-scanner' || pLower.includes('log4j') || pLower.includes('cve')) {
      responseData = {
        id: pLower.match(/cve-\d{4}-\d+/)?.[0]?.toUpperCase() || "CVE-2021-44228",
        description: "Apache Log4j2 JNDI features do not protect against attacker controlled LDAP and other JNDI related endpoints.",
        severity: "CRITICAL",
        cvssScore: 10.0,
        affectedVersions: ["2.0-beta9 to 2.14.1"],
        patch: "Upgrade to 2.15.0 or later",
        _meta: { executionMs, model: "helm-sandbox-v1", cached: false }
      }
    } else if (slug === 'pii-scanner' || pLower.includes('email') || pLower.includes('@')) {
      responseData = {
        hasPii: true,
        riskLevel: "high",
        findings: [{ type: "EMAIL", value: "[REDACTED]", gdprRelevant: true }],
        redacted: prompt.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, "[REDACTED]"),
        _meta: { executionMs, model: "helm-sandbox-v1", cached: false }
      }
    } else if (slug === 'currency' || pLower.includes('usd') || pLower.includes('eur')) {
      responseData = {
        from: "USD",
        to: "EUR",
        result: 0.92,
        rate: 0.9234,
        _meta: { executionMs, model: "helm-sandbox-v1", cached: false }
      }
    } else if (slug === 'weather' || pLower.includes('weather')) {
      responseData = {
        city: pLower.match(/in ([a-z]+)/)?.[1]?.toUpperCase() || "BERLIN",
        temp: 14.9,
        description: "Overcast",
        _meta: { executionMs, model: "helm-sandbox-v1", cached: false }
      }
    } else {
      // generic
      responseData = {
        success: true,
        summary: `Processed prompt: "${prompt.substring(0, 30)}..."`,
        _meta: { executionMs, model: "helm-sandbox-v1", cached: false }
      }
    }

    return NextResponse.json(responseData)
  } catch (err: any) {
    console.error('Demo API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
