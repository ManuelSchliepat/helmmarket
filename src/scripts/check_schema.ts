import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function checkSchema() {
  const { data: skills, error } = await supabase.from('skills').select('*').limit(1)
  if (error) {
    console.error('Error fetching skills:', error)
    return
  }
  if (skills && skills.length > 0) {
    console.log('Columns in skills table:', Object.keys(skills[0]))
  } else {
    console.log('No skills found in table.')
  }
}

checkSchema()
