## 1. Database & Infrastructure

- [ ] 1.1 Create the `agents` and `agent_skills` tables in Supabase via a new migration.
- [ ] 1.2 Set up RLS policies for `agents` and `agent_skills` (users can only manage their own agents).
- [ ] 1.3 Update the TypeScript types for the new tables in `@/types/supabase`.

## 2. Agent Management Dashboard

- [ ] 2.1 Create the `/dashboard/agents` layout and list view to display user-created agents.
- [ ] 2.2 Implement the Agent Creation Form (name, description, model selection).
- [ ] 2.3 Implement the Skill Attachment UI within the agent configuration flow.
- [ ] 2.4 Add granular permission controls (allow/ask/deny) for each attached skill.

## 3. Agent Execution Core

- [ ] 3.1 Set up the Vercel AI SDK integration for multi-model support (OpenAI, Anthropic, Gemini).
- [ ] 3.2 Implement the tool execution bridge that maps Helm skills to AI SDK tools.
- [ ] 3.3 Create the server-side route for streaming agent responses (`/api/agent/[id]/chat`).
- [ ] 3.4 Implement the permission check logic (handle 'ask' and 'deny' states during execution).

## 4. Agent Console (UI)

- [ ] 4.1 Create the dedicated chat interface at `/agent/[id]`.
- [ ] 4.2 Add the real-time execution log sidebar to show tool calls and results.
- [ ] 4.3 Implement inline approval buttons for 'ask' operations within the chat stream.
- [ ] 4.4 Add support for public agent sharing (optional sign-in, read-only mode if needed).

## 5. Polishing & Verification

- [ ] 5.1 Test end-to-end agent interaction with multiple attached skills.
- [ ] 5.2 Verify that permission settings ('ask', 'deny') are correctly enforced.
- [ ] 5.3 Ensure responsive design for both dashboard and chat console.
- [ ] 5.4 Document the new agent console capabilities in the main README.
