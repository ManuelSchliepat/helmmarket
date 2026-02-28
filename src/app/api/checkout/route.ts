import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { skillId } = await request.json()
    console.log("Looking up skill ID for checkout:", skillId)
    
    if (!skillId) return NextResponse.json({ error: 'Missing skillId' }, { status: 400 })

    const supabase = await createClient()
    const { data: skill, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', skillId)
      .single()

    if (error || !skill) {
      console.error("Skill not found in Supabase during checkout. ID:", skillId, error)
      return NextResponse.json({ error: 'skill_not_found' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: skill.name,
              description: skill.description,
            },
            unit_amount: skill.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/install/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/skills/${skill.slug}`,
      metadata: {
        userId,
        skillId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Checkout Global Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
