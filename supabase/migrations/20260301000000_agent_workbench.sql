-- Junction table: which skills are placed on which agent's canvas
CREATE TABLE IF NOT EXISTS agent_canvas_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  position_x DOUBLE PRECISION NOT NULL DEFAULT 300,
  position_y DOUBLE PRECISION NOT NULL DEFAULT 200,
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'processing', 'error', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(agent_id, skill_id)  -- prevent duplicate skill on same agent
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_canvas_agent ON agent_canvas_nodes(agent_id);

-- RLS policies (service role bypasses, but good practice)
ALTER TABLE agent_canvas_nodes ENABLE ROW LEVEL SECURITY;

-- Note: user_id references public.users(id) which are TEXT in our setup
CREATE POLICY "Users can manage their own canvas nodes"
  ON agent_canvas_nodes
  FOR ALL
  USING (
    agent_id IN (SELECT id FROM agents WHERE user_id = auth.jwt() ->> 'sub')
  );
