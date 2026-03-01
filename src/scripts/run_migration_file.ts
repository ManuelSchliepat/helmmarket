import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function runMigrationFile() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Please provide a migration file path as an argument.')
    process.exit(1)
  }

  const sql = fs.readFileSync(filePath, 'utf8')
  console.log(`Running migration: ${filePath}`)
  
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
  
  if (error) {
    console.error('Migration failed:', error)
  } else {
    console.log('Migration successful!')
  }
}

runMigrationFile()
