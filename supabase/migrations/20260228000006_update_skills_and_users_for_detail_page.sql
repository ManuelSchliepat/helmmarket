-- Migration: 20260228000006_update_skills_and_users_for_detail_page.sql
-- Add is_publisher_verified to users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_publisher_verified BOOLEAN DEFAULT false;

-- Add new columns to skills
ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS review_status TEXT 
  DEFAULT 'in_review' 
  CHECK (review_status IN ('in_review', 'live', 'rejected', 'draft'));

ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS review_note TEXT;

ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS code_example TEXT;

ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS compatibility JSONB 
  DEFAULT '{"node":"18+","typescript":"4.9+","helm":"1.x","nextjs":"13+"}'::jsonb;
