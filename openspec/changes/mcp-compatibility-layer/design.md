## Context

Helm Market currently serves as a registry for skills that are designed to be installed and run within a Helm-compatible environment. To expand the ecosystem, we need to expose these skills through the Model Context Protocol (MCP), allowing them to be used as tools by external LLM clients.

## Goals / Non-Goals

**Goals:**
- **Zero-Config MCP**: Developers should not need to write additional code for MCP support.
- **Dynamic Mapping**: Automatically translate `helm.config.json` operations into MCP-compatible JSON schema tool definitions.
- **Protocol Bridge**: Provide a reliable execution endpoint that proxies MCP tool calls to the underlying skill logic.
- **UI Integration**: Update the marketplace to provide MCP server URLs for every published skill.

**Non-Goals:**
- **Custom MCP Servers**: This change does not allow developers to upload their own specialized MCP server implementations; it is a standardized auto-generation layer.
- **State Persistence**: The MCP bridge will be stateless; state management remains within the skill's own implementation.

## Decisions

### 1. Dynamic API Route Structure
**Decision**: Use a Next.js catch-all route at `src/app/api/mcp/[slug]/[...route]/route.ts`.
**Rationale**: This allows a single handler to manage `manifest`, `execute`, and potentially future MCP endpoints for all skills based on their slug.

### 2. Metadata Storage (Skill Config)
**Decision**: Add a `config` (JSONB) column to the `skills` table.
**Rationale**: Instead of fetching and parsing `helm.config.json` from the registry on every MCP request, we store the metadata at the time of publishing. This ensures high performance for manifest generation.

### 3. Tool Mapping Strategy
**Decision**: Map `helm.config.json` operations to MCP tool definitions.
**Mapping**:
- `operation.name` -> `mcp.tool.name`
- `operation.description` -> `mcp.tool.description`
- `operation.parameters` -> `mcp.tool.inputSchema`

### 4. Authentication and Security
**Decision**: Initial version will use standard Helm Market API keys for the execution bridge.
**Rationale**: We need to ensure that the execution bridge remains secure while allowing authorized MCP clients to call the skills.

## Risks / Trade-offs

- **[Risk] Schema Incompatibility** -> Some complex Helm operations might not map perfectly to simple MCP JSON schemas.
  - **Mitigation**: Implement a robust fallback or validation step during the publishing phase to warn developers of MCP-incompatible operations.
- **[Risk] Latency** -> Proxying calls through the Marketplace API adds an extra hop.
  - **Mitigation**: Use efficient server-side fetching and minimize overhead in the translation layer.
- **[Risk] Metadata Sync** -> If `helm.config.json` changes on the registry, the Marketplace cache might become stale.
  - **Mitigation**: Trigger a metadata refresh whenever a new version of a skill is published.
