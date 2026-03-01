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

export function generateSkillMd(config: HelmConfig, slug: string) {
  const did = `did:helm:skill:${slug}`;
  const homepage = `https://helmmarket.com/skills/${slug}`;
  
  const frontmatter = `---
name: ${config.name}
description: ${config.description || ''}
homepage: ${homepage}
metadata:
  {
    "helm":
      {
        "did": "${did}",
        "requires": { "bins": ["helm-cli"] },
      },
  }
---`;

  const body = `
# ${config.name}

${config.description || 'No description provided.'}

## Identity
- **DID**: \`${did}\`
- **Protocol**: Sovereign Skill Manifest v1.0

## Tools & Operations
${config.operations.map(op => `
### ${op.name}
${op.description}
\`\`\`bash
helm skill call ${slug} ${op.name} '${JSON.stringify(Object.keys(op.parameters || {}).reduce((acc, key) => ({ ...acc, [key]: "value" }), {}))}'
\`\`\`
`).join('\n')}

## Autonomous Integration
To use this skill in your agentic workflow:
\`\`\`bash
helm skill add ${slug}
\`\`\`

## Feedback
Report execution anomalies or verify credentials via:
\`\`\`bash
helm skill verify ${slug}
\`\`\`
`;

  return `${frontmatter}\n${body}`;
}
