import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { skillId } = await req.json()
    if (!skillId) return NextResponse.json({ error: 'skillId is required' }, { status: 400 })

    const purchaserType = req.headers.get('x-purchaser-type') || 'human'
    const agentId = req.headers.get('x-agent-id') || 'unknown'

    const supabase = await createClient(true)
    const { data: skill } = await supabase.from('skills').select('*').eq('id', skillId).single()
    if (!skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 })

    if (purchaserType === 'agent') {
      // Step 2: Stripe Machine Payment support
      const paymentIntent = await stripe.paymentIntents.create({
        amount: skill.price_cents,
        currency: 'eur',
        metadata: {
          skill_id: skillId,
          purchaser_type: 'agent',
          agent_id: agentId,
        }
      });
      
      return NextResponse.json({ 
        client_secret: paymentIntent.client_secret,
        payment_address: paymentIntent.id 
      })
    }

    // Existing Human Checkout Flow
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
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
        skillId: skill.id,
        userId: userId,
        purchaser_type: 'human'
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
