import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Seeding categories...')
  const { error } = await supabase.from('categories').upsert([
    { name: 'Productivity', slug: 'productivity', description: 'Skills that help you get more done.' },
    { name: 'Finance', slug: 'finance', description: 'Tools for analyzing and managing money.' },
    { name: 'DevOps', slug: 'devops', description: 'Automations for deployments and infrastructure.' },
    { name: 'Entertainment', slug: 'entertainment', description: 'Skills for games, music and fun.' }
  ], { onConflict: 'slug' })

  if (error) {
    console.error('Error seeding categories:', error)
  } else {
    console.log('Categories seeded successfully!')
  }
}

seed()
