import { createClient } from '@supabase/supabase-js'
import { placeholderSkills } from '../lib/placeholder-data'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedSkills() {
  console.log("Starting seeding process...")
  
  // Get a valid developer ID from the database
  const { data: devs, error: devError } = await supabase.from('developers').select('id').limit(1)
  
  if (devError || !devs || devs.length === 0) {
    console.error("No developers found in database. Please register a developer first.")
    return
  }
  
  const devId = devs[0].id
  let count = 0

  for (const skill of placeholderSkills) {
    const { id, ...skillData } = skill
    
    const { error } = await supabase
      .from('skills')
      .upsert({
        ...skillData,
        developer_id: devId,
        status: 'published',
        review_status: skill.review_status,
        code_example: skill.code_example,
        compatibility: skill.compatibility,
        updated_at: skill.updated_at
      }, {
        onConflict: 'slug'
      })

    if (error) {
      console.error(`❌ Failed to seed: ${skill.name}`, error.message)
    } else {
      console.log(`✅ Seeded: ${skill.name}`)
      count++
    }
  }

  // Update dev verified status for demo
  await supabase.from('users').update({ is_publisher_verified: true }).eq('id', devId)

  console.log(`Done. ${count} skills seeded.`)
}

seedSkills()
