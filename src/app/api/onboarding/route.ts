import { auth } from '@clerk/nextjs/server'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        error: "unauthorized", 
        message: "Please log in first" 
      }, { status: 401 })
    }

    // Security Check: sk_test warning in production
    if (process.env.NODE_ENV === 'production' && process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
      console.warn('CRITICAL: Using Stripe TEST KEY in PRODUCTION mode.')
    }

    const supabase = await createClient(true)

    // 1. Get existing stripe_account_id from Supabase 'users' table
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('stripe_account_id')
      .eq('id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase User Fetch Error:', fetchError)
      return NextResponse.json({ 
        error: "stripe_connect_failed", 
        message: `Database fetch failed: ${fetchError.message}` 
      }, { status: 500 })
    }

    let stripeAccountId = user?.stripe_account_id

    // 2. If ID exists, verify it still exists in Stripe
    if (stripeAccountId) {
      try {
        await stripe.accounts.retrieve(stripeAccountId)
        console.log('Using existing verified Stripe Account:', stripeAccountId)
      } catch (stripeRetrieveErr: any) {
        if (stripeRetrieveErr.code === 'resource_missing') {
          console.log('Stale Stripe account ID found, clearing and creating new one:', stripeAccountId)
          stripeAccountId = null
          await supabase
            .from('users')
            .update({ stripe_account_id: null, stripe_onboarding_complete: false })
            .eq('id', userId)
        } else {
          throw stripeRetrieveErr
        }
      }
    }

    // 3. Create new account if needed
    if (!stripeAccountId) {
      console.log('Creating new Stripe Express Account for user:', userId)
      try {
        const account = await stripe.accounts.create({
          type: 'express',
          capabilities: {
            transfers: { requested: true },
          },
        })
        stripeAccountId = account.id
        
        // Save to Supabase
        const { error: updateError } = await supabase
          .from('users')
          .update({ stripe_account_id: stripeAccountId })
          .eq('id', userId)

        if (updateError) {
          console.error('Supabase Stripe ID Update Error:', updateError)
          return NextResponse.json({ 
            error: "stripe_connect_failed", 
            message: `Failed to save account ID: ${updateError.message}` 
          }, { status: 500 })
        }
      } catch (stripeErr: any) {
        console.error('Stripe Account Creation Error:', stripeErr)
        return NextResponse.json({ 
          error: "stripe_connect_failed", 
          message: stripeErr.message,
          code: stripeErr.code
        }, { status: 500 })
      }
    }

    // 4. Create account link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://helmmarket.com'
    
    try {
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${appUrl}/dashboard/billing?refresh=true`,
        return_url: `${appUrl}/dashboard/billing?success=true`,
        type: 'account_onboarding',
      })

      return NextResponse.json({ url: accountLink.url })
    } catch (linkErr: any) {
      console.error('Stripe Account Link Error:', linkErr)
      return NextResponse.json({ 
        error: "stripe_connect_failed", 
        message: linkErr.message,
        code: linkErr.code
      }, { status: 500 })
    }
  } catch (globalErr: any) {
    console.error('Global Onboarding API Error:', globalErr)
    return NextResponse.json({ 
      error: "stripe_connect_failed", 
      message: `Internal server error: ${globalErr.message}` 
    }, { status: 500 })
  }
}
