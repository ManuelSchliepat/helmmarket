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
  code_example?: string;
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
  { handle: '@jakub_dev', skill: 'stripe-integration', timeAgo: '2 min ago' },
  { handle: '@mtech', skill: 'binance-connector', timeAgo: '5 min ago' },
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
    name: 'vuln-scanner',
    slug: 'vuln-scanner',
    description: 'Gibt einen Paketnamen oder CVE-ID ein und bekommt sofort Schweregrad, CVSS-Score und betroffene Versionen zurück — direkt aus der NIST NVD Datenbank. Für DevOps-Teams die Sicherheitslücken in ihrer Dependency-Pipeline erkennen müssen. Ersetzt 20 Minuten manuelles CVE-Recherchieren pro Vorfall.',
    price_cents: 19900,
    status: 'published',
    registry_endpoint: '@helm-market/vuln-scanner',
    permissions: ['internet-access'],
    tags: ['security', 'nist', 'vulnerability'],
    category: 'security',
    providers: ['openai', 'anthropic'],
    provider_switchable: true,
    compliance_labels: ['SOC2', 'ISO27001'],
    code_example: `import { vulnScanner } from '@helm-market/vuln-scanner'\nconst agent = new Helm({ skills: [vulnScanner] })\nconst report = await agent.run("Scan production dependencies")`,
  },
  {
    id: 'sec-2',
    name: 'zero-trust-checker',
    slug: 'zero-trust-checker',
    description: 'Prüft eine Netzwerk-Policy-Konfiguration gegen Zero Trust Prinzipien und gibt eine Liste konkreter Verstöße zurück. Für Security-Engineers die Compliance-Audits vorbereiten.',
    price_cents: 29900,
    status: 'published',
    registry_endpoint: '@helm-market/zero-trust',
    permissions: ['read-files', 'internet-access'],
    tags: ['security', 'zero-trust', 'compliance'],
    category: 'security',
    providers: ['llama', 'custom'],
    provider_switchable: true,
    compliance_labels: ['SOC2'],
    code_example: `import { zeroTrust } from '@helm-market/zero-trust'\nconst agent = new Helm({ skills: [zeroTrust] })\nconst audit = await agent.run("Verify network microsegmentation")`,
  },
  {
    id: 'sec-3',
    name: 'audit-trail',
    slug: 'audit-trail',
    description: 'Schreibt jeden AI-Agenten-Schritt als unveränderlichen Log-Eintrag in Supabase. Für Teams die AI-Entscheidungen rückverfolgbar machen müssen — z.B. für EU AI Act Audits.',
    price_cents: 9900,
    status: 'published',
    registry_endpoint: '@helm-market/audit-trail',
    permissions: ['write-files'],
    tags: ['security', 'audit', 'logging'],
    category: 'security',
    providers: ['openai'],
    provider_switchable: false,
    compliance_labels: ['GDPR', 'SOC2'],
    code_example: `import { auditTrail } from '@helm-market/audit-trail'\nconst agent = new Helm({ skills: [auditTrail] })\nawait agent.run("Log critical transaction #442")`,
  },
  {
    id: 'sec-4',
    name: 'anomaly-detect',
    slug: 'anomaly-detect',
    description: 'Analysiert Netzwerk-Traffic-Muster und meldet Abweichungen vom Baseline-Verhalten in Echtzeit. Für IT-Admins die nicht warten wollen bis ein Angriff Schaden angerichtet hat.',
    price_cents: 49900,
    status: 'published',
    registry_endpoint: '@helm-market/anomaly-detect',
    permissions: ['internet-access', 'execute-scripts'],
    tags: ['security', 'ai', 'network'],
    category: 'security',
    providers: ['openai', 'gemini', 'anthropic'],
    provider_switchable: true,
    compliance_labels: ['ISO27001'],
    code_example: `import { anomalyDetect } from '@helm-market/anomaly-detect'\nconst agent = new Helm({ skills: [anomalyDetect] })\nconst alerts = await agent.run("Monitor egress traffic for leaks")`,
  },

  // COMPLIANCE
  {
    id: 'comp-1',
    name: 'eu-ai-act-audit',
    slug: 'eu-ai-act-audit',
    description: 'Prüft AI-generierte Outputs gegen EU AI Act Anforderungen und gibt einen strukturierten Compliance-Report zurück. Für Unternehmen die AI in Hochrisiko-Anwendungen einsetzen und Nachweispflichten erfüllen müssen.',
    price_cents: 59900,
    status: 'published',
    registry_endpoint: '@helm-market/eu-ai-audit',
    permissions: ['internet-access'],
    tags: ['compliance', 'eu', 'ai-act'],
    category: 'compliance',
    providers: ['anthropic', 'openai'],
    provider_switchable: true,
    compliance_labels: ['EU_AI_ACT'],
    code_example: `import { aiAudit } from '@helm-market/eu-ai-audit'\nconst agent = new Helm({ skills: [aiAudit] })\nconst result = await agent.run("Audit last 100 model responses")`,
  },
  {
    id: 'comp-2',
    name: 'gdpr-data-scan',
    slug: 'gdpr-data-scan',
    description: 'Scannt Datenpipelines und Texte auf GDPR-relevante personenbezogene Daten — bevor sie in ein LLM fließen. Für Entwickler die keine Bußgelder riskieren wollen.',
    price_cents: 34900,
    status: 'published',
    registry_endpoint: '@helm-market/gdpr-scan',
    permissions: ['read-files'],
    tags: ['compliance', 'gdpr', 'pii'],
    category: 'compliance',
    providers: ['llama', 'custom'],
    provider_switchable: true,
    compliance_labels: ['GDPR'],
    code_example: `import { gdprScan } from '@helm-market/gdpr-scan'\nconst agent = new Helm({ skills: [gdprScan] })\nconst findings = await agent.run("Scan S3 bucket for PII")`,
  },
  {
    id: 'comp-3',
    name: 'us-federal-ai',
    slug: 'us-federal-ai',
    description: 'Validiert AI-System-Outputs gegen aktuelle US Federal AI Policy Vorgaben. Für Anbieter die US-Behörden beliefern oder beliefern wollen.',
    price_cents: 44900,
    status: 'published',
    registry_endpoint: '@helm-market/us-fed-ai',
    permissions: ['internet-access'],
    tags: ['compliance', 'us-federal', 'policy'],
    category: 'compliance',
    providers: ['openai', 'anthropic'],
    provider_switchable: false,
    compliance_labels: ['US_FEDERAL'],
    code_example: `import { usFedAi } from '@helm-market/us-fed-ai'\nconst agent = new Helm({ skills: [usFedAi] })\nawait agent.run("Verify model transparency reports")`,
  },
  {
    id: 'comp-4',
    name: 'llm-bias-check',
    slug: 'llm-bias-check',
    description: 'Analysiert LLM-Outputs auf Bias und Diskriminierungsmuster und liefert einen Report mit betroffenen Textstellen und Korrekturvorschlägen. Für Teams die AI in Produkten einsetzen und Compliance nachweisen müssen.',
    price_cents: 14900,
    status: 'published',
    registry_endpoint: '@helm-market/bias-check',
    permissions: ['internet-access'],
    tags: ['compliance', 'bias', 'ethics'],
    category: 'compliance',
    providers: ['openai', 'gemini', 'anthropic', 'llama'],
    provider_switchable: true,
    compliance_labels: ['EU_AI_ACT', 'US_FEDERAL'],
    code_example: `import { biasCheck } from '@helm-market/bias-check'\nconst agent = new Helm({ skills: [biasCheck] })\nconst report = await agent.run("Analyze sentiment for bias")`,
  },

  // ENERGY
  {
    id: 'energy-1',
    name: 'grid-optimizer',
    slug: 'grid-optimizer',
    description: 'Gibt Echtzeit-Lastdaten eines Stromnetzes ein und bekommt AI-optimierte Verteilungsempfehlungen zurück. Für Energieversorger die Überlastungen verhindern wollen.',
    price_cents: 79900,
    status: 'published',
    registry_endpoint: '@helm-market/grid-opt',
    permissions: ['internet-access', 'execute-scripts'],
    tags: ['energy', 'grid', 'optimization'],
    category: 'energy-industrial',
    providers: ['openai', 'custom'],
    provider_switchable: true,
    compliance_labels: ['ISO27001'],
    code_example: `import { gridOpt } from '@helm-market/grid-opt'\nconst agent = new Helm({ skills: [gridOpt] })\nawait agent.run("Balance load for Factory A")`,
  },
  {
    id: 'energy-2',
    name: 'energy-forecast',
    slug: 'energy-forecast',
    description: 'Erstellt eine 24h-Energiebedarfs-Prognose basierend auf historischen Verbrauchsdaten und Wetterdaten. Für Industriebetriebe die Energiekosten durch besseres Timing senken wollen.',
    price_cents: 29900,
    status: 'published',
    registry_endpoint: '@helm-market/energy-forecast',
    permissions: ['internet-access'],
    tags: ['energy', 'forecast', 'ai'],
    category: 'energy-industrial',
    providers: ['gemini', 'openai'],
    provider_switchable: true,
    compliance_labels: [],
    code_example: `import { forecast } from '@helm-market/energy-forecast'\nconst agent = new Helm({ skills: [forecast] })\nconst prediction = await agent.run("Forecast next 24h demand")`,
  },
  {
    id: 'energy-3',
    name: 'material-search',
    slug: 'material-search',
    description: 'Durchsucht wissenschaftliche Materialdatenbanken mit natürlicher Sprache und gibt strukturierte Ergebnisse zurück. Für Ingenieure die stundenlange Literaturrecherche auf Sekunden reduzieren wollen.',
    price_cents: 19900,
    status: 'published',
    registry_endpoint: '@helm-market/material-search',
    permissions: ['internet-access'],
    tags: ['industrial', 'science', 'research'],
    category: 'energy-industrial',
    providers: ['anthropic', 'openai'],
    provider_switchable: false,
    compliance_labels: [],
    code_example: `import { matSearch } from '@helm-market/material-search'\nconst agent = new Helm({ skills: [matSearch] })\nconst results = await agent.run("Search for high-temp alloys")`,
  },
  {
    id: 'energy-4',
    name: 'sensor-pipeline',
    slug: 'sensor-pipeline',
    description: 'Verarbeitet rohe IoT-Sensordaten und gibt AI-interpretierte Insights zurück — Anomalien, Trends, Handlungsempfehlungen. Für Produktionsleiter die ihre Maschinen verstehen wollen ohne Data Science Team.',
    price_cents: 39900,
    status: 'published',
    registry_endpoint: '@helm-market/sensor-pipeline',
    permissions: ['read-files', 'execute-scripts'],
    tags: ['industrial', 'iot', 'telemetry'],
    category: 'energy-industrial',
    providers: ['llama', 'custom'],
    provider_switchable: true,
    compliance_labels: ['SOC2'],
    code_example: `import { sensorPipe } from '@helm-market/sensor-pipeline'\nconst agent = new Helm({ skills: [sensorPipe] })\nawait agent.run("Process last 10k telemetry packets")`,
  },

  // GENERAL
  {
    id: 'gen-1',
    name: 'weather',
    slug: 'weather',
    description: 'Gibt eine Stadt oder GPS-Koordinaten ein und bekommt Echtzeit-Wetter und 7-Tage-Prognose zurück — ohne API-Key, ohne Kosten. Für jeden Agent der wetterbezogene Entscheidungen treffen muss.',
    price_cents: 1900,
    status: 'published',
    registry_endpoint: '@helm-market/weather',
    permissions: ['internet-access'],
    tags: ['general', 'weather', 'api'],
    category: 'general',
    providers: ['openai', 'gemini'],
    provider_switchable: true,
    compliance_labels: [],
    code_example: `import { weather } from '@helm-market/weather'\nconst agent = new Helm({ skills: [weather] })\nconst current = await agent.run("Check weather in Munich")`,
  },
  {
    id: 'gen-2',
    name: 'currency',
    slug: 'currency',
    description: 'Konvertiert Beträge zwischen 170+ Währungen mit tagesaktuellen EZB-Kursen. Für Finance-Agenten, E-Commerce und internationale Preisberechnungen.',
    price_cents: 2900,
    status: 'published',
    registry_endpoint: '@helm-market/currency',
    permissions: ['internet-access'],
    tags: ['general', 'currency', 'finance'],
    category: 'automation',
    providers: ['openai', 'anthropic'],
    provider_switchable: true,
    compliance_labels: [],
    code_example: `import { currency } from '@helm-market/currency'\nconst agent = new Helm({ skills: [currency] })\nconst converted = await agent.run("Convert 100 EUR to USD")`,
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
