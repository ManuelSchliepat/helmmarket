-- Task 1: Stripe Connect
ALTER TABLE public.developers 
  ADD COLUMN IF NOT EXISTS stripe_account_id text,
  ADD COLUMN IF NOT EXISTS payout_enabled boolean DEFAULT false;

-- Task 2: Editor's Pick Cron
ALTER TABLE public.skills 
  ADD COLUMN IF NOT EXISTS score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_editors_pick boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS editors_pick_since timestamptz,
  ADD COLUMN IF NOT EXISTS installs integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avg_rating numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS error_rate numeric DEFAULT 0;
