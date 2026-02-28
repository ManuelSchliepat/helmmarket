import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function seedMcpSkills() {
  console.log('Seeding MCP Sample Skills...')
  
  const { data: categories } = await supabase.from('categories').select('id').eq('slug', 'finance').single()
  const catId = categories?.id

  const { error } = await supabase.from('skills').upsert([
    { 
      name: 'Simple Price Skill', 
      slug: 'simple-skill', 
      description: 'A simple skill to fetch asset prices.',
      price_cents: 1000,
      status: 'published',
      developer_id: 'user_3AIVQi8ooSoBVmHK6jT14jaxkA8',
      category_id: catId,
      permissions: ['internet-access'],
      tags: ['finance', 'mcp'],
      config: {
        name: 'Simple Price Skill',
        version: '1.0.0',
        description: 'Asset price fetcher',
        operations: [
          {
            name: 'getPrice',
            description: 'Get current price for a symbol',
            parameters: {
              symbol: { type: 'string', description: 'The ticker symbol (e.g. AAPL)' }
            }
          }
        ]
      }
    }
  ], { onConflict: 'slug' })

  if (error) console.error('Error seeding MCP skills:', error)
  else console.log('MCP Skills seeded successfully!')
}

seedMcpSkills()
