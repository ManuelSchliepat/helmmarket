// Comprehensive Placeholder Data for Helm Market

export type Provider = 'openai' | 'gemini' | 'anthropic' | 'llama' | 'custom';
export type Category = 'general' | 'security' | 'energy-industrial' | 'data-analytics' | 'automation' | 'compliance';
export type ComplianceLabel = 'EU_AI_ACT' | 'US_FEDERAL' | 'GDPR' | 'SOC2' | 'ISO27001';

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  status: string;
  registry_endpoint: string;
  permissions: string[];
  tags: string[];
  category: Category;
  providers: Provider[];
  provider_switchable: boolean;
  compliance_labels: ComplianceLabel[];
  developer_id?: string;
  developers?: {
    users?: {
      full_name: string;
    }
  };
}

export const landingStats = {
  developers: 2400,
  installations: 12847,
  payouts: 847293, // in Euros
};

export const companies = [
  { name: 'Vercel', logo: '/vercel.svg', color: '#000000' },
  { name: 'Stripe', logo: '/stripe.svg', color: '#635BFF' },
  { name: 'OpenAI', logo: '/openai.svg', color: '#10A37F' },
  { name: 'Linear', logo: '/linear.svg', color: '#5E6AD2' },
  { name: 'GitHub', logo: '/github.svg', color: '#181717' },
  { name: 'Supabase', logo: '/supabase.svg', color: '#3ECF8E' },
];

export const providers = [
  { id: 'openai', name: 'OpenAI', color: '#10A37F' },
  { id: 'gemini', name: 'Google Gemini', color: '#4285F4' },
  { id: 'anthropic', name: 'Anthropic', color: '#D97706' },
  { id: 'llama', name: 'Meta Llama', color: '#9333EA' },
  { id: 'mistral', name: 'Mistral', color: '#FACC15' },
  { id: 'custom', name: 'Custom/Self-hosted', color: '#6366F1' },
];

export const featuredIn = [
  { name: 'TLDR AI', logo: 'TLDR' },
  { name: 'Hacker News', logo: 'HN' },
  { name: 'Product Hunt', logo: 'PH' },
  { name: 'Dev.to', logo: 'DEV' }
];

export const testimonials = [
  {
    name: 'Sarah Drasner',
    handle: 'sarah_edo',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Drasner&background=random',
    rating: 5,
    quote: 'Helm Market completely changed how we ship AI features. Found a stripe integration skill and had it working in production in 2 hours instead of 2 weeks.',
  },
  {
    name: 'Guillermo Rauch',
    handle: 'rauchg',
    avatar: 'https://ui-avatars.com/api/?name=Guillermo+Rauch&background=random',
    rating: 5,
    quote: 'The standard for AI agent skills. Sandboxed, typed, and incredibly easy to use. The future of software is agents, and this is their App Store.',
  },
  {
    name: 'Lee Robinson',
    handle: 'leerob',
    avatar: 'https://ui-avatars.com/api/?name=Lee+Robinson&background=random',
    rating: 5,
    quote: 'I used to write custom tools for every new Claude setup. Now I just helm install. Unbelievable time saver for any serious developer.',
  },
];

export const recentInstalls = [
  { handle: '@jakub_dev', skill: 'helm-skill-stripe', timeAgo: '2 min ago' },
  { handle: '@mtech', skill: 'helm-skill-binance', timeAgo: '5 min ago' },
  { handle: '@alex_code', skill: 'data-analyzer-pro', timeAgo: '12 min ago' },
  { handle: '@sarah_js', skill: 'email-architect', timeAgo: '18 min ago' },
  { handle: '@dev_ops_ninja', skill: 'aws-manager', timeAgo: '22 min ago' },
  { handle: '@frontend_fanatic', skill: 'figma-to-react', timeAgo: '31 min ago' },
  { handle: '@backend_bro', skill: 'postgres-admin', timeAgo: '45 min ago' },
  { handle: '@ai_enthusiast', skill: 'claude-context-builder', timeAgo: '1 hr ago' },
  { handle: '@ruby_dev', skill: 'redis-optimizer', timeAgo: '1 hr ago' },
  { handle: '@golang_guru', skill: 'github-pr-reviewer', timeAgo: '2 hrs ago' },
];

export const categoryFilters = [
  { name: 'All Skills', id: 'all', count: 247 },
  { name: 'Security 🔒', id: 'security', count: 34 },
  { name: 'Compliance ✅', id: 'compliance', count: 28 },
  { name: 'Energy ⚡', id: 'energy-industrial', count: 41 },
  { name: 'Analytics 📊', id: 'data-analytics', count: 38 },
  { name: 'Automation 🤖', id: 'automation', count: 31 },
  { name: 'General 🔧', id: 'general', count: 22 },
];

export const placeholderSkills: Skill[] = [
  // SECURITY
  {
    id: 'sec-1',
    name: 'helm-skill-vuln-scanner',
    slug: 'vuln-scanner',
    description: 'Automated vulnerability scan via NIST NVD API. Provides real-time threat intelligence for your dependencies.',
    price_cents: 19900,
    status: 'published',
    registry_endpoint: '@helm-market/vuln-scanner',
    permissions: ['internet-access'],
    tags: ['security', 'nist', 'vulnerability'],
    category: 'security',
    providers: ['openai', 'anthropic'],
    provider_switchable: true,
    compliance_labels: ['SOC2', 'ISO27001'],
  },
  {
    id: 'sec-2',
    name: 'helm-skill-zero-trust-checker',
    slug: 'zero-trust-checker',
    description: 'Validates Zero Trust policy compliance across your distributed network architecture.',
    price_cents: 29900,
    status: 'published',
    registry_endpoint: '@helm-market/zero-trust',
    permissions: ['read-files', 'internet-access'],
    tags: ['security', 'zero-trust', 'compliance'],
    category: 'security',
    providers: ['llama', 'custom'],
    provider_switchable: true,
    compliance_labels: ['SOC2'],
  },
  {
    id: 'sec-3',
    name: 'helm-skill-audit-trail',
    slug: 'audit-trail',
    description: 'Immutable audit log writer to Supabase. Ensures all agent actions are logged for forensic analysis.',
    price_cents: 9900,
    status: 'published',
    registry_endpoint: '@helm-market/audit-trail',
    permissions: ['write-files'],
    tags: ['security', 'audit', 'logging'],
    category: 'security',
    providers: ['openai'],
    provider_switchable: false,
    compliance_labels: ['GDPR', 'SOC2'],
  },
  {
    id: 'sec-4',
    name: 'helm-skill-anomaly-detect',
    slug: 'anomaly-detect',
    description: 'Network anomaly detection via baseline AI. Identifies suspicious traffic patterns in real-time.',
    price_cents: 49900,
    status: 'published',
    registry_endpoint: '@helm-market/anomaly-detect',
    permissions: ['internet-access', 'execute-scripts'],
    tags: ['security', 'ai', 'network'],
    category: 'security',
    providers: ['openai', 'gemini', 'anthropic'],
    provider_switchable: true,
    compliance_labels: ['ISO27001'],
  },

  // COMPLIANCE
  {
    id: 'comp-1',
    name: 'helm-skill-eu-ai-act-audit',
    slug: 'eu-ai-act-audit',
    description: 'Checks AI outputs against EU AI Act rules. Automatically generates compliance reports for regulators.',
    price_cents: 59900,
    status: 'published',
    registry_endpoint: '@helm-market/eu-ai-audit',
    permissions: ['internet-access'],
    tags: ['compliance', 'eu', 'ai-act'],
    category: 'compliance',
    providers: ['anthropic', 'openai'],
    provider_switchable: true,
    compliance_labels: ['EU_AI_ACT'],
  },
  {
    id: 'comp-2',
    name: 'helm-skill-gdpr-data-scan',
    slug: 'gdpr-data-scan',
    description: 'Scans data pipelines for GDPR violations. Detects PII leaks before they hit your production database.',
    price_cents: 34900,
    status: 'published',
    registry_endpoint: '@helm-market/gdpr-scan',
    permissions: ['read-files'],
    tags: ['compliance', 'gdpr', 'pii'],
    category: 'compliance',
    providers: ['llama', 'custom'],
    provider_switchable: true,
    compliance_labels: ['GDPR'],
  },
  {
    id: 'comp-3',
    name: 'helm-skill-us-federal-ai',
    slug: 'us-federal-ai',
    description: 'Validates AI use against US Federal AI policy. Ensures your agents meet government transparency standards.',
    price_cents: 44900,
    status: 'published',
    registry_endpoint: '@helm-market/us-fed-ai',
    permissions: ['internet-access'],
    tags: ['compliance', 'us-federal', 'policy'],
    category: 'compliance',
    providers: ['openai', 'anthropic'],
    provider_switchable: false,
    compliance_labels: ['US_FEDERAL'],
  },
  {
    id: 'comp-4',
    name: 'helm-skill-llm-bias-check',
    slug: 'llm-bias-check',
    description: 'Detects bias in LLM outputs with detailed reporting. Essential for ethical AI deployment.',
    price_cents: 14900,
    status: 'published',
    registry_endpoint: '@helm-market/bias-check',
    permissions: ['internet-access'],
    tags: ['compliance', 'bias', 'ethics'],
    category: 'compliance',
    providers: ['openai', 'gemini', 'anthropic', 'llama'],
    provider_switchable: true,
    compliance_labels: ['EU_AI_ACT', 'US_FEDERAL'],
  },

  // ENERGY
  {
    id: 'energy-1',
    name: 'helm-skill-grid-optimizer',
    slug: 'grid-optimizer',
    description: 'Smart grid load balancing via AI prediction. Optimizes energy distribution for industrial facilities.',
    price_cents: 79900,
    status: 'published',
    registry_endpoint: '@helm-market/grid-opt',
    permissions: ['internet-access', 'execute-scripts'],
    tags: ['energy', 'grid', 'optimization'],
    category: 'energy-industrial',
    providers: ['openai', 'custom'],
    provider_switchable: true,
    compliance_labels: ['ISO27001'],
  },
  {
    id: 'energy-2',
    name: 'helm-skill-energy-forecast',
    slug: 'energy-forecast',
    description: '24h energy demand forecasting agent. Uses historical data and weather patterns to predict usage.',
    price_cents: 29900,
    status: 'published',
    registry_endpoint: '@helm-market/energy-forecast',
    permissions: ['internet-access'],
    tags: ['energy', 'forecast', 'ai'],
    category: 'energy-industrial',
    providers: ['gemini', 'openai'],
    provider_switchable: true,
    compliance_labels: [],
  },
  {
    id: 'energy-3',
    name: 'helm-skill-material-search',
    slug: 'material-search',
    description: 'AI search over material science databases. Accelerates R&D for new industrial materials.',
    price_cents: 19900,
    status: 'published',
    registry_endpoint: '@helm-market/material-search',
    permissions: ['internet-access'],
    tags: ['industrial', 'science', 'research'],
    category: 'energy-industrial',
    providers: ['anthropic', 'openai'],
    provider_switchable: false,
    compliance_labels: [],
  },
  {
    id: 'energy-4',
    name: 'helm-skill-sensor-pipeline',
    slug: 'sensor-pipeline',
    description: 'Industrial IoT sensor data → AI insights. Processes high-frequency telemetry into actionable reports.',
    price_cents: 39900,
    status: 'published',
    registry_endpoint: '@helm-market/sensor-pipeline',
    permissions: ['read-files', 'execute-scripts'],
    tags: ['industrial', 'iot', 'telemetry'],
    category: 'energy-industrial',
    providers: ['llama', 'custom'],
    provider_switchable: true,
    compliance_labels: ['SOC2'],
  },
];

export const placeholderReviews = [
  { id: 1, user: 'Alex C.', avatar: 'https://ui-avatars.com/api/?name=Alex+C&background=random', date: '2024-03-15', rating: 5, text: 'Works perfectly out of the box. The MCP integration is seamless.' },
  { id: 2, user: 'Maria S.', avatar: 'https://ui-avatars.com/api/?name=Maria+S&background=random', date: '2024-03-10', rating: 4, text: 'Great skill, saves me hours every week. Documentation could be slightly more detailed on advanced use cases.' },
  { id: 3, user: 'John D.', avatar: 'https://ui-avatars.com/api/?name=John+D&background=random', date: '2024-03-05', rating: 5, text: 'Exactly what I needed for my autonomous agent workflow. High quality code.' },
  { id: 4, user: 'Emily R.', avatar: 'https://ui-avatars.com/api/?name=Emily+R&background=random', date: '2024-02-28', rating: 5, text: 'The permissions model is clear and secure. I feel comfortable running this.' },
  { id: 5, user: 'Chris B.', avatar: 'https://ui-avatars.com/api/?name=Chris+B&background=random', date: '2024-02-20', rating: 5, text: 'Best 15 bucks I spent this month.' },
  { id: 6, user: 'Jessica T.', avatar: 'https://ui-avatars.com/api/?name=Jessica+T&background=random', date: '2024-02-15', rating: 3, text: 'Good, but had some issues with the initial setup on Windows.' },
  { id: 7, user: 'David W.', avatar: 'https://ui-avatars.com/api/?name=David+W&background=random', date: '2024-02-10', rating: 5, text: 'Instant productivity boost.' },
  { id: 8, user: 'Laura M.', avatar: 'https://ui-avatars.com/api/?name=Laura+M&background=random', date: '2024-02-01', rating: 4, text: 'Solid implementation. Waiting for the next update for more features.' },
];

export const reviewStats = {
  total: 127,
  average: 4.8,
  breakdown: [
    { stars: 5, percentage: 68 },
    { stars: 4, percentage: 21 },
    { stars: 3, percentage: 8 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ]
};

export const changelog = [
  { version: 'v2.1.4', date: 'March 20, 2024', changes: ['Fixed an edge case in data parsing', 'Improved memory usage during large operations'] },
  { version: 'v2.1.3', date: 'March 10, 2024', changes: ['Added support for concurrent requests', 'Updated dependencies to patch security vulnerabilities'] },
  { version: 'v2.0.0', date: 'February 15, 2024', changes: ['Major rewrite for MCP compatibility', 'Introduced new fine-grained permission model', 'Performance improvements across all operations'] },
];

export const chartData = {
  installs: [
    { name: 'Day 1', installs: 40 },
    { name: 'Day 5', installs: 30 },
    { name: 'Day 10', installs: 55 },
    { name: 'Day 15', installs: 45 },
    { name: 'Day 20', installs: 70 },
    { name: 'Day 25', installs: 65 },
    { name: 'Day 30', installs: 85 },
  ],
  countries: [
    { name: 'United States', value: 45 },
    { name: 'Germany', value: 20 },
    { name: 'United Kingdom', value: 15 },
    { name: 'India', value: 10 },
    { name: 'Canada', value: 10 },
  ]
};

export const sampleReadme = `
# Skill Documentation

This skill allows your AI agent to seamlessly integrate with external services, providing robust functionality out of the box.

## Quick Start

\`\`\`bash
helm install @helm-market/this-skill
\`\`\`

## Configuration

Add the following to your agent's configuration:

\`\`\`json
{
  "skills": ["@helm-market/this-skill"],
  "permissions": {
    "internet-access": true
  }
}
\`\`\`

## Advanced Usage

For more advanced workflows, you can chain operations...
`;
