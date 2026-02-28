import Stripe from 'stripe'

if (process.env.NODE_ENV === 'production') {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('CRITICAL: STRIPE_SECRET_KEY is not defined in production mode')
  } else if (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.warn('CRITICAL: Using Stripe TEST KEY in PRODUCTION mode')
  }
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
})
