import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedInstalls() {
  console.log("Seeding installs for demo...")
  
  // Manuel's ID
  const userId = 'user_3AIVQi8ooSoBVmHK6jT14jaxkA8'
  
  // Get some skills
  const { data: skills } = await supabase.from('skills').select('id, slug').in('slug', ['vuln-scanner', 'weather', 'currency'])
  
  if (!skills || skills.length === 0) {
    console.error("No skills found. Please run seed-skills.ts first.")
    return
  }

  const installs = skills.map(s => ({
    user_id: userId,
    skill_id: s.id,
    token: `inst_${Math.random().toString(36).substring(7)}`,
    provider: 'helm-market',
    created_at: new Date().toISOString()
  }))

  const { error } = await supabase.from('installs').upsert(installs, { onConflict: 'user_id, skill_id' })

  if (error) {
    console.error("Error seeding installs:", error)
  } else {
    console.log(`✅ Seeded ${installs.length} installs for user ${userId}`)
  }
}

seedInstalls()
