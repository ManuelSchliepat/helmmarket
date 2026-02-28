## Why

Currently, Helm Market allows users to discover and developers to publish skills, but there is no central place for users to actually *compose* and *interact* with these skills through a unified AI agent interface. This change introduces an Agent Console to provide a playground and deployment platform for custom AI agents built using the skills available in the marketplace.

## What Changes

- **Agent Management Dashboard**: A new `/dashboard/agents` area to create, edit, and delete agents.
- **Agent Configuration**: UI to name agents, select base models (GPT-4, Claude, Gemini), and attach installed skills.
- **Granular Permissions**: Per-operation permission settings (allow/ask/deny) for attached skills.
- **Agent Chat Interface**: A dedicated chat UI at `/agent/[id]` for interacting with agents.
- **Human-in-the-loop Execution**: Inline approval buttons for operations marked as 'ask'.
- **Transparency Sidebar**: Real-time execution log showing skill calls and outputs.
- **Agent Sharing**: Public URLs, embed codes, and API endpoints for external integration.

## Capabilities

### New Capabilities
- `agent-management`: CRUD operations for AI agents and their configurations.
- `agent-chat-interface`: Real-time chat interaction layer with model selection and skill execution.
- `agent-sharing`: Mechanisms for public access, embedding, and API-based agent interaction.

### Modified Capabilities
- `marketplace-core`: Link installed skills to the agent configuration workflow.

## Impact

- **Database**: New `agents` and `agent_skills` tables in Supabase.
- **API Routes**: New endpoints for agent execution, management, and public interaction.
- **Frontend**: New dashboard pages, chat components, and sharing utilities.
- **Dependencies**: Integration with the Vercel AI SDK (`ai` package) for multi-model support.
