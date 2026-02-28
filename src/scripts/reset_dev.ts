import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string)

async function resetDeveloperAccount() {
  const userId = 'user_3AIVQi8ooSoBVmHK6jT14jaxkA8'
  console.log(`Resetting developer Stripe ID for user: ${userId}...`)
  
  const { error } = await supabase
    .from('developers')
    .update({ stripe_account_id: null })
    .eq('id', userId)

  if (error) {
    console.error('Error resetting developer:', error)
  } else {
    console.log('Stripe ID cleared! You can now create a new account via the UI.')
  }
}

resetDeveloperAccount()
