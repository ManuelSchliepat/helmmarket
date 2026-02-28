import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function checkDevs() {
  const { data, error } = await supabase.from('developers').select('*')
  if (error) {
    console.error('Error fetching developers:', error)
  } else {
    console.log('Developers found:', data.length)
    console.log(JSON.stringify(data, null, 2))
  }
}

checkDevs()
