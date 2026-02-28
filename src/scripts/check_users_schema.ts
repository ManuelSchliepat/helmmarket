import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function checkUsersSchema() {
  const { data: users, error } = await supabase.from('users').select('*').limit(1)
  if (error) {
    console.error('Error fetching users:', error)
    return
  }
  if (users && users.length > 0) {
    console.log('Columns in users table:', Object.keys(users[0]))
  } else {
    console.log('No users found in table.')
  }
}

checkUsersSchema()
