import { NextResponse } from 'next/server'

// Simple in-memory rate limiting map
const rateLimit = new Map<string, { count: number, lastReset: number }>()

const MOCK_RESPONSES: Record<string, any> = {
  'vuln-scanner': {
    findings: [
      { id: "CVE-2021-44228", severity: "CRITICAL", score: 10, package: "log4j-core", fixVersion: "2.15.0" }
    ],
    summary: "1 critical vulnerability detected in production environment."
  },
  'llm-bias-check': {
    hasBias: true,
    findings: [
      { type: "AGE_DISCRIMINATION", confidence: 0.98, snippet: "...energetic young professionals..." }
    ],
    suggestion: "Neutralize language: replace with 'results-oriented professionals'."
  },
  'pii-scanner': {
    hasPii: true,
    redacted: "Contact me at ******************** or call ***************",
    types: ["EMAIL", "PHONE_EU"]
  },
  'currency': {
    from: "USD",
    to: "EUR",
    amount: 1000,
    result: 923.40,
    rate: 0.9234,
    date: "2024-03-20"
  },
  'weather': {
    city: "Berlin",
    temp: 14.9,
    description: "Overcast",
    windSpeed: "12km/h",
    humidity: "65%"
  },
  'grid-optimizer': {
    efficiency_gain: "+14.2%",
    recommendation: "Shift 20MW load from Sector 7G to storage battery cluster B.",
    status: "OPTIMIZED"
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const prompt = searchParams.get('prompt')
  
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  
  // Rate limiting logic
  const now = Date.now()
  const userLimit = rateLimit.get(ip) || { count: 0, lastReset: now }
  
  if (now - userLimit.lastReset > 3600000) { // 1 hour reset
    userLimit.count = 0
    userLimit.lastReset = now
  }
  
  if (userLimit.count >= 3) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again in an hour." }, { status: 429 })
  }
  
  userLimit.count++
  rateLimit.set(ip, userLimit)

  if (!slug || !MOCK_RESPONSES[slug]) {
    return NextResponse.json({ 
      output: "Agent processed prompt successfully. Logic verified by Helm kernel." 
    })
  }

  // Small delay to simulate "AI processing"
  await new Promise(resolve => setTimeout(resolve, 800))

  return NextResponse.json({
    prompt,
    output: MOCK_RESPONSES[slug]
  })
}
