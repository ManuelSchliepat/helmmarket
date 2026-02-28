import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function DELETE() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient(true)
    
    // 1. Delete from Supabase (cascade should handle it if set up, but let's be explicit)
    // Actually, mirroring schema has ON DELETE CASCADE for skills and developers.
    await supabase.from('users').delete().eq('id', userId)

    // 2. Delete from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Delete User Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
