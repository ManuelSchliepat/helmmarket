import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data: developer } = await supabase
      .from('developers')
      .select('stripe_account_id')
      .eq('id', userId)
      .single()

    let accountId = developer?.stripe_account_id

    if (!accountId) {
      // Create Stripe Connect Express account
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          transfers: { requested: true },
        },
        metadata: { userId }
      })
      
      accountId = account.id
      
      await supabase
        .from('developers')
        .update({ stripe_account_id: accountId, payout_enabled: true }) // Auto-enabling for demo
        .eq('id', userId)
    }

    // Create Account Link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/developer?stripe=connected`,
      type: 'account_onboarding',
    })

    return NextResponse.redirect(accountLink.url)
  } catch (err: any) {
    console.error('Connect error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
