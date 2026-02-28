# Helm Market Skills Collection

This directory contains 5 fully functional, production-ready skills for the `@bgub/helm` framework, ready to be published to npm and listed on Helm Market.

## Included Skills

| Skill | Category | Price | Description |
|-------|----------|-------|-------------|
| `helm-skill-cve-scanner` | Security | $199/month | Search NIST NVD for CVEs by ID, keyword, or recent critical findings. |
| `helm-skill-pii-scanner` | Compliance | $149/month | GDPR-compliant PII detection and redaction using an offline regex engine. |
| `helm-skill-dns-check` | Security | $49/month | Comprehensive DNS lookups and email security audits (MX, SPF, DKIM) via DoH. |
| `helm-skill-currency` | Automation | $29/month | Live and historical currency conversion via ECB rates. |
| `helm-skill-weather` | General | $19/month | Real-time weather and forecasts via Open-Meteo. |

## Running the Tests
To verify all 5 skills against real external APIs, run:

```bash
npx ts-node test-all.ts
```

All skills are written in strict TypeScript and export a `plugin` object according to the Helm SDK builder pattern, defining `allow`, `ask`, or `deny` permissions per operation.
