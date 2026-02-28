## Why

Currently, Helm AI Agent Skills are limited to the Helm framework environment. By building an MCP (Model Context Protocol) compatibility layer, we allow every skill in our marketplace to be used instantly by any MCP-compatible client (such as Claude Desktop, Cursor, or Gemini CLI), significantly increasing the utility and reach of our developers' skills.

## What Changes

- **Automatic MCP Manifest Generation**: Every published skill will now have a dedicated MCP manifest endpoint.
- **Dynamic Tool Mapping**: Automatically map skill operations defined in `helm.config.json` to MCP tool definitions.
- **MCP Execution Bridge**: A new execution endpoint that translates MCP tool calls into Helm skill operation calls.
- **Marketplace UI Updates**: Show MCP connection details on skill pages for easy integration into external AI tools.

## Capabilities

### New Capabilities
- `mcp-server-generation`: Automatically serve MCP manifests and tool definitions for every skill in the registry.
- `mcp-execution-bridge`: Translate and proxy MCP tool execution requests to the underlying Helm skill operations.

### Modified Capabilities
- `skill-publishing`: Update the publishing workflow to validate and index `helm.config.json` for MCP tool mapping.

## Impact

- **API Routes**: New routes at `/api/mcp/[slug]/manifest` and `/api/mcp/[slug]/execute`.
- **Database**: The `skills` table will need to store or link to the parsed `helm.config.json` metadata for quick MCP tool mapping.
- **Frontend**: Updated skill detail pages with "Use in Claude/Cursor" installation instructions.
- **Registry**: Integration with the internal registry to fetch skill configuration during MCP requests.
