## ADDED Requirements

### Requirement: MCP Execution Endpoint
The system SHALL provide a POST API endpoint at `/api/mcp/[slug]/execute` that accepts MCP tool execution requests for any published skill.

#### Scenario: Successful Tool Execution
- **WHEN** a client POSTs an MCP tool call "analyze-csv" with parameters to `/api/mcp/data-analyzer-pro/execute`
- **THEN** system translates the call, forwards it to the Helm skill execution logic, and returns the result in an MCP-compatible response format.

#### Scenario: Execution of Non-Existent Tool
- **WHEN** a client POSTs an MCP tool call "non-existent-tool" to `/api/mcp/data-analyzer-pro/execute`
- **THEN** system returns an MCP-compatible error indicating the tool was not found.

### Requirement: Execution Result Mapping
The system SHALL map results from the underlying Helm skill operation to an MCP-compatible response.

#### Scenario: Successful Execution Result
- **WHEN** a skill operation returns a JSON object `{ "status": "success", "data": "analysis result" }`
- **THEN** system maps this result to the `content` field of the MCP execution response.
