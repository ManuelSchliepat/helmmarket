import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'
import { sendPurchaseConfirmation, sendDeveloperRevenueAlert } from '@/lib/email'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') as string

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const skillId = session.metadata?.skillId
    const userId = session.metadata?.userId

    if (skillId && userId) {
      const supabase = await createClient(true)
      
      // Fetch skill and developer
      const { data: skill } = await supabase
        .from('skills')
        .select('*, developers(id, stripe_account_id, payout_enabled, users(email))')
        .eq('id', skillId)
        .single()

      if (skill) {
        const developerShare = Math.floor(skill.price_cents * 0.70)
        let transferId = null

        // Task 1: Stripe Connect Transfer
        if (skill.developers?.stripe_account_id && skill.developers?.payout_enabled) {
          try {
            const transfer = await stripe.transfers.create({
              amount: developerShare,
              currency: 'eur',
              destination: skill.developers.stripe_account_id,
              transfer_group: `purchase_${session.id}`,
            })
            transferId = transfer.id
          } catch (err) {
            console.error('Stripe Transfer failed:', err)
          }
        }

        // Log to payouts table
        await supabase.from('payouts').insert({
          developer_id: skill.developer_id,
          amount_cents: developerShare,
          status: transferId ? 'transferred' : 'pending',
          stripe_transfer_id: transferId
        })

        // Track install
        await supabase.from('skill_events').insert({
          skill_id: skill.id,
          user_id: userId,
          event_type: 'install'
        }).catch(err => console.error("Failed to log install:", err));

        // Task 3: Email Notifications
        const { data: userData } = await supabase.from('users').select('email').eq('id', userId).single()
        
        if (userData?.email) {
          await sendPurchaseConfirmation(
            userData.email, 
            skill.name, 
            `helm install @helm-market/${skill.slug}`
          )
        }

        if (skill.developers?.users?.email) {
          await sendDeveloperRevenueAlert(
            skill.developers.users.email,
            skill.name,
            (developerShare / 100).toFixed(2)
          )
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
