import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function runSql() {
  const sql = `ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';`;
  console.log(`Trying to run SQL: ${sql}`);
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('Error running SQL via RPC:', error);
    return;
  }
  console.log('SQL ran successfully!');
}

runSql();
