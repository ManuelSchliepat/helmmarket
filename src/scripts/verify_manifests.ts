// Self-contained verification script to avoid ESM import issues with ts-node
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

const sample1: HelmConfig = {
  name: "Simple Skill",
  version: "1.0.0",
  description: "A simple price fetcher",
  operations: [
    {
      name: "getPrice",
      description: "Get current price for a symbol",
      parameters: {
        symbol: { type: "string", description: "The ticker symbol" }
      }
    }
  ]
};

const sample2: HelmConfig = {
  name: "Mixed Permissions Skill",
  version: "0.1.0",
  description: "Skill with different operation types",
  operations: [
    {
      name: "readPublicData",
      description: "Always allowed (allow)",
      parameters: { id: { type: "string" } }
    },
    {
      name: "deleteUserData",
      description: "Requires confirmation (ask)",
      parameters: { userId: { type: "string" } }
    },
    {
      name: "internalReset",
      description: "Restricted operation (deny)",
      parameters: { secret: { type: "string" } }
    }
  ]
};

const sample3: HelmConfig = {
  name: "Nested Skill",
  version: "2.0.0",
  operations: [
    {
      name: "complexAction",
      description: "Operation with nested parameters",
      parameters: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            profile: {
              type: "object",
              properties: {
                name: { type: "string" },
                age: { type: "number" }
              }
            }
          }
        },
        tags: {
          type: "array",
          items: { type: "string" }
        }
      }
    }
  ]
};

function verify(name: string, config: HelmConfig) {
  console.log(`--- Verifying ${name} ---`);
  const manifest = translateToMCPManifest(config, name.toLowerCase().replace(/ /g, '-'));
  console.log(JSON.stringify(manifest, null, 2));
  console.log("\n");
}

verify("Simple Skill", sample1);
verify("Mixed Permissions Skill", sample2);
verify("Nested Skill", sample3);
