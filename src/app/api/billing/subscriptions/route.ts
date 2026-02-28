import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient(true)
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (!user) throw new Error('User not found')

    const customers = await stripe.customers.list({ email: user.email, limit: 1 })
    const customerId = customers.data[0]?.id

    if (!customerId) {
      return NextResponse.json({ subscriptions: [] })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.plan.product'],
    })

    const formatted = subscriptions.data.map((sub: any) => ({
      id: sub.id,
      skillName: sub.plan.product.name,
      price: sub.plan.amount / 100,
      currency: sub.plan.currency,
      nextBilling: new Date(sub.current_period_end * 1000).toISOString(),
      status: sub.status,
    }))

    return NextResponse.json({ subscriptions: formatted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
