## Context

Currently, users can only view skills. We need to transition from a pure directory to an active execution platform where users can create persistent agent configurations that leverage these skills.

## Goals / Non-Goals

**Goals:**
- Provide a user-friendly UI for configuring agents with specific skills and models.
- Implement a robust chat interface that supports human-in-the-loop tool execution.
- Enable sharing agents via public URLs and embeddable components.

**Non-Goals:**
- Multi-agent orchestration (one agent at a time for now).
- Custom prompt engineering or complex agent personalities (standard helpful assistant for now).
- Native mobile apps (web-based console only).

## Decisions

### 1. Data Model
**Decision**: Create `agents` and `agent_skills` tables.
- `agents`: `id`, `user_id`, `name`, `description`, `model_id`, `is_public`.
- `agent_skills`: `agent_id`, `skill_id`, `permissions_map` (JSONB).
**Rationale**: This structure allows users to own multiple agents and attach many marketplace skills to each with granular control.

### 2. Execution Engine
**Decision**: Use Vercel AI SDK (`ai`) with `streamText` and `tools`.
**Rationale**: It provides a unified API for interacting with GPT-4, Claude, and Gemini, while natively supporting tool-calling patterns that map directly to our Helm skills.

### 3. Permission Handling
**Decision**: Handle 'ask' permissions via client-side tool results.
- When a tool requires approval, the server returns a special 'approval_required' response.
- The Chat UI renders approval buttons.
- Upon approval, the client re-triggers the execution with the approval token.
**Rationale**: Keeps the execution flow responsive and gives the user explicit control over sensitive operations.

### 4. Sharing Mechanism
**Decision**: Use a dedicated `/agent/[id]` route that checks `is_public` status.
- Public agents won't require Clerk authentication for basic interaction (or optional sign-in).
**Rationale**: Lowers the barrier for people to try out agents created on Helm Market.

## Risks / Trade-offs

- **[Risk] Latency** -> Nested tool calls and model switching might slow down responses.
  - **Mitigation**: Use streaming for all responses and provide clear execution logs in the UI.
- **[Risk] Security** -> Public agents could be abused if skills have too much access.
  - **Mitigation**: Default all public agent skill permissions to 'ask' or 'deny' for sensitive operations.
- **[Risk] Cost** -> Users running agents on our platform will incur LLM costs.
  - **Mitigation**: Implement usage limits or require users to provide their own API keys for public/shared use cases.
