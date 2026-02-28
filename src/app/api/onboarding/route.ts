import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      console.error('Onboarding Error: No userId found (User not logged in via Clerk)')
      return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
    }

    const supabase = await createClient(true)

    // 1. Get or create developer
    const { data: developer, error: fetchError } = await supabase
      .from('developers')
      .select('stripe_account_id')
      .eq('id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" which is fine
      console.error('Supabase Fetch Error:', fetchError)
      return NextResponse.json({ error: `Database fetch failed: ${fetchError.message}` }, { status: 500 })
    }

    let stripeAccountId = developer?.stripe_account_id

    if (!stripeAccountId) {
      console.log('Creating new Stripe Account for user:', userId)
      try {
        const account = await stripe.accounts.create({
          type: 'standard',
        })
        stripeAccountId = account.id
      } catch (stripeErr: any) {
        console.error('Stripe Account Creation Error:', stripeErr)
        return NextResponse.json({ error: `Stripe error: ${stripeErr.message}` }, { status: 500 })
      }

      console.log('Upserting developer into Supabase with Stripe ID:', stripeAccountId)
      const { error: insertError } = await supabase.from('developers').upsert({
        id: userId,
        stripe_account_id: stripeAccountId,
      })

      if (insertError) {
        console.error('Supabase Upsert Error:', insertError)
        return NextResponse.json({ error: `Database update failed: ${insertError.message}.` }, { status: 500 })
      }
    }

    // 2. Create account link
    console.log('Creating Stripe Account Link for:', stripeAccountId)
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (globalErr: any) {
    console.error('Global Onboarding API Error:', globalErr)
    return NextResponse.json({ error: `Server error: ${globalErr.message}` }, { status: 500 })
  }
}
