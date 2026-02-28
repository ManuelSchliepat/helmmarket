-- Add Stripe-related columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT false;
