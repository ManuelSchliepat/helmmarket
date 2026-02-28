-- Curation Agent Columns
ALTER TABLE public.skills 
  ADD COLUMN IF NOT EXISTS score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_editors_pick boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS editors_pick_since timestamptz,
  ADD COLUMN IF NOT EXISTS installs integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avg_rating numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS error_rate numeric DEFAULT 0;

-- Revenue Autopilot Columns
ALTER TABLE public.developers 
  ADD COLUMN IF NOT EXISTS payout_enabled boolean DEFAULT false;

-- Payouts Table Update (add platform_fee_cents)
ALTER TABLE public.payouts
  ADD COLUMN IF NOT EXISTS skill_id uuid REFERENCES public.skills(id),
  ADD COLUMN IF NOT EXISTS platform_fee_cents integer;
