-- Migration: 20260228000007_add_admin_role.sql
-- Add is_admin to users table

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- INSTRUCTION: Manually set yourself as admin after migration
-- UPDATE public.users SET is_admin = true WHERE email = '[your clerk email]';
