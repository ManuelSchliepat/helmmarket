import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function checkSkills() {
  const { data: skills, error } = await supabase.from('skills').select('slug, config')
  if (error) {
    console.error('Error fetching skills:', error)
    return
  }
  console.log('--- Skills Configs ---')
  skills.forEach(s => {
    console.log(`Slug: ${s.slug}`)
    console.log(`Config: ${JSON.stringify(s.config, null, 2)}`)
    console.log('---')
  })
}

checkSkills()
