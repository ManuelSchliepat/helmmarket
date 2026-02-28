-- Migration: 20260228000005_update_users_for_settings.sql
-- Add preferred_language, is_publisher, and avatar_url to users table

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_publisher BOOLEAN DEFAULT false;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
