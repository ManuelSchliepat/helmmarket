import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrate() {
  console.log("Running migrations...")
  const sql = `
    ALTER TABLE public.skills 
    ADD COLUMN IF NOT EXISTS providers TEXT[] DEFAULT ARRAY['openai']::TEXT[],
    ADD COLUMN IF NOT EXISTS provider_switchable BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
    ADD COLUMN IF NOT EXISTS compliance_labels TEXT[] DEFAULT ARRAY[]::TEXT[];
  `;
  
  // Note: Standard Supabase client doesn't have an 'sql' method.
  // We usually use a migration file or the dashboard.
  // However, sometimes an 'exec_sql' RPC is set up.
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error("Migration failed via RPC. Please run the SQL manually in Supabase dashboard:", error.message);
    console.log("SQL to run:");
    console.log(sql);
  } else {
    console.log("Migration successful!");
  }
}

migrate()
