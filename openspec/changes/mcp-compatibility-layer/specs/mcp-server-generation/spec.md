## ADDED Requirements

### Requirement: MCP Manifest Endpoint
The system SHALL provide a dynamic API endpoint at `/api/mcp/[slug]/manifest` that returns a valid MCP server manifest for any published skill.

#### Scenario: Successful Manifest Fetch
- **WHEN** a client GETs `/api/mcp/data-analyzer-pro/manifest`
- **THEN** system returns the manifest including server name, version, and the list of mapped tools.

#### Scenario: Manifest Fetch for Non-Existent Skill
- **WHEN** a client GETs `/api/mcp/invalid-skill/manifest`
- **THEN** system returns a 404 error.

### Requirement: Tool Mapping from Skill Config
The system SHALL map each operation in a skill's `helm.config.json` to a corresponding tool in the MCP manifest.

#### Scenario: Skill with Operations
- **WHEN** a skill has an operation "analyze-csv" with "file-path" and "format" parameters
- **THEN** the MCP manifest includes a tool "analyze-csv" with a corresponding JSON schema for the parameters.
