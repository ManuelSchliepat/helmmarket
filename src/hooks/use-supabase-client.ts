import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

export function useSupabaseClient() {
  const { session } = useSession();
  
  return useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: async () => {
            const token = await session?.getToken({ template: 'supabase' });
            return {
              Authorization: `Bearer ${token}`,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            };
          },
        },
      }
    );
  }, [session]);
}
