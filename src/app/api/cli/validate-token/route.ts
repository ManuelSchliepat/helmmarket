import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  
  const supabase = await createClient(true)
  const { data: install } = await supabase
    .from('installs')
    .select('user_id, users(full_name, email)')
    .eq('token', token)
    .limit(1)
    .single()

  if (!install) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  return NextResponse.json({ 
    valid: true, 
    // @ts-ignore
    username: install.users?.full_name || install.users?.email || 'User' 
  })
}
