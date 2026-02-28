import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('waitlist')
      .insert({ email })

    if (error) {
      console.error('Waitlist error code:', error.code)
      console.error('Waitlist error message:', error.message)
      
      // If it's a duplicate (already on waitlist), treat it as success or separate message
      if (error.code === '23505') {
         return NextResponse.json({ success: true, message: 'Already on list' })
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist catch error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
