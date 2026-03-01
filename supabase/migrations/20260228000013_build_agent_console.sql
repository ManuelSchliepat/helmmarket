-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    model_id TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create agent_skills table (links agents to marketplace skills)
CREATE TABLE IF NOT EXISTS public.agent_skills (
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    permissions_map JSONB DEFAULT '{}' NOT NULL,
    PRIMARY KEY (agent_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;

-- Policies for agents
CREATE POLICY "Users can manage their own agents" 
    ON public.agents 
    FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public agents" 
    ON public.agents 
    FOR SELECT 
    USING (is_public = TRUE);

-- Policies for agent_skills
CREATE POLICY "Users can manage skills for their own agents" 
    ON public.agent_skills 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE agents.id = agent_skills.agent_id 
            AND agents.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view skills for public agents" 
    ON public.agent_skills 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE agents.id = agent_skills.agent_id 
            AND agents.is_public = TRUE
        )
    );
