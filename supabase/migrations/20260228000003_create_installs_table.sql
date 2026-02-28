CREATE TABLE IF NOT EXISTS public.installs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, skill_id)
);

ALTER TABLE public.installs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own installs" ON public.installs FOR SELECT USING (auth.uid() = user_id);
