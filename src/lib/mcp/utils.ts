export interface HelmOperation {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface HelmConfig {
  name: string;
  version?: string;
  description?: string;
  operations: HelmOperation[];
}

export function translateToMCPManifest(config: HelmConfig, slug: string) {
  return {
    mcpVersion: "1.0.0",
    server: {
      name: config.name,
      version: config.version || "0.1.0",
      description: config.description || `MCP Server for ${config.name}`
    },
    tools: config.operations.map(op => ({
      name: op.name,
      description: op.description,
      inputSchema: {
        type: "object",
        properties: op.parameters || {},
        required: Object.keys(op.parameters || {})
      }
    }))
  };
}
