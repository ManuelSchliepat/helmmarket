-- Management Agent infrastructure
ALTER TABLE public.skill_events ADD COLUMN IF NOT EXISTS triggered_by text DEFAULT 'human' 
  CHECK (triggered_by IN ('human', 'helm-manager-agent', 'cron'));

CREATE TABLE IF NOT EXISTS public.developer_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id uuid REFERENCES public.developers(id),
  subject text,
  message text,
  answered boolean DEFAULT false,
  agent_reply text,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for developer_messages
ALTER TABLE public.developer_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can view their own messages" ON public.developer_messages
  FOR SELECT USING (auth.uid() = developer_id);

CREATE POLICY "Developers can insert their own messages" ON public.developer_messages
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Admins can manage all messages" ON public.developer_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
