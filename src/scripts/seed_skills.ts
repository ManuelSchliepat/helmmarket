import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function seedSkills() {
  console.log('Seeding Sample Skills...')
  
  // Get the category ID for Productivity
  const { data: categories } = await supabase.from('categories').select('id').eq('slug', 'productivity').single()
  const catId = categories?.id

  const { error } = await supabase.from('skills').upsert([
    { 
      name: 'Data Analyzer Pro', 
      slug: 'data-analyzer-pro', 
      description: 'An advanced AI skill that can process CSV files and generate insights automatically.',
      price_cents: 2900,
      status: 'published',
      developer_id: 'user_3AIVQi8ooSoBVmHK6jT14jaxkA8', // Deine ID
      category_id: catId,
      permissions: ['read-files', 'internet-access'],
      tags: ['data', 'analysis', 'automation']
    },
    { 
      name: 'Email Architect', 
      slug: 'email-architect', 
      description: 'Drafts professional emails based on brief notes and learns your personal writing style.',
      price_cents: 1500,
      status: 'published',
      developer_id: 'user_3AIVQi8ooSoBVmHK6jT14jaxkA8',
      category_id: catId,
      permissions: ['user-identity'],
      tags: ['email', 'productivity', 'writing']
    }
  ], { onConflict: 'slug' })

  if (error) console.error('Error seeding skills:', error)
  else console.log('Skills seeded successfully!')
}

seedSkills()
