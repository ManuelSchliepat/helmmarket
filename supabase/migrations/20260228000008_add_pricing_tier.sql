ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS pricing_tier text 
  DEFAULT 'standard' 
  CHECK (pricing_tier IN ('community', 'standard', 'verified', 'enterprise'));
