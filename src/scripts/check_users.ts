import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.error('Error fetching users:', error)
  } else {
    console.log('Users found:', data.length)
    console.log(JSON.stringify(data, null, 2))
  }
}

checkUsers()
