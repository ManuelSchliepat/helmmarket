import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Find the Stripe customer ID for this user
    // In a real app, we should store stripe_customer_id in users table
    // For now, let's assume we can find them by email or we need to add the column
    
    const supabase = await createClient(true)
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (!user) throw new Error('User not found')

    // Find or create customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 })
    let customerId = customers.data[0]?.id

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { userId } })
      customerId = customer.id
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Portal Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
