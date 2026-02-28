-- Add config column to skills table
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';

-- Task 1.2: Update RLS policies to allow public read access for the config column on published skills
-- (The existing policy for public read access already covers all columns, but let's be explicit if needed)
-- CREATE POLICY "Users can read skill config" ON public.skills FOR SELECT USING (status = 'published');
