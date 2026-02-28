ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS revenue_share_percent integer DEFAULT 70;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS quality_status text DEFAULT 'pending' CHECK (quality_status IN ('pending', 'reviewing', 'verified', 'flagged'));
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS verified_at timestamptz;

CREATE TABLE IF NOT EXISTS public.payouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id uuid REFERENCES public.users(id),
  amount_cents integer,
  stripe_transfer_id text,
  period_start date,
  period_end date,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_policies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id text UNIQUE NOT NULL,
  owner_user_id uuid REFERENCES public.users(id),
  max_monthly_spend_cents integer DEFAULT 50000,
  allowed_compliance_labels text[] DEFAULT ARRAY['GDPR','SOC2'],
  verified_only boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
