## 1. Database & Infrastructure

- [x] 1.1 Add `config` JSONB column to the `skills` table in Supabase via migration.
- [x] 1.2 Update the `skills` table RLS policies to allow public read access for the `config` column on published skills.

## 2. Skill Publishing Update

- [x] 2.1 Update the `SkillSubmissionForm` UI to include an input for `helm.config.json`.
- [x] 2.2 Add server-side validation for `helm.config.json` during the skill submission process.
- [x] 2.3 Update the skill creation service to store the parsed `config` in Supabase.

## 3. MCP Protocol Implementation

- [x] 3.1 Create a utility library for translating Helm operation definitions to MCP tool JSON schemas.
- [x] 3.2 Implement the catch-all API route at `src/app/api/mcp/[slug]/manifest/route.ts` to serve manifests.
- [x] 3.3 Implement the execution bridge route at `src/app/api/mcp/[slug]/execute/route.ts`.
- [x] 3.4 Ensure the execution bridge correctly proxies requests and handles error responses.

## 4. Marketplace Frontend Updates

- [x] 4.1 Design and implement an "MCP Integration" card for the skill detail page.
- [x] 4.2 Add a "Copy MCP Server URL" button with a success toast notification.
- [x] 4.3 Add a brief guide on the skill page explaining how to use the skill with external MCP clients (Claude/Cursor).

## 5. Verification

- [ ] 5.1 Test MCP manifest generation for a variety of sample skills.
- [ ] 5.2 Verify end-to-end execution of a tool via the MCP bridge endpoint.
- [ ] 5.3 Ensure the publishing flow correctly captures and stores the `helm.config.json`.
