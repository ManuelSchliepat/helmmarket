# Helm Market Skills Collection

This directory contains 5 fully functional, production-ready skills for the `@bgub/helm` framework, ready to be published to npm and listed on Helm Market.

## Included Skills

| Skill | Category | Price | Description |
|-------|----------|-------|-------------|
| `cve-scanner` | Security | $199/month | Search NIST NVD for CVEs by ID, keyword, or recent critical findings. |
| `pii-scanner` | Compliance | $149/month | GDPR-compliant PII detection and redaction using an offline regex engine. |
| `dns-check` | Security | $49/month | Comprehensive DNS lookups and email security audits (MX, SPF, DKIM) via DoH. |
| `currency-converter` | Automation | $29/month | Live and historical currency conversion via ECB rates. |
| `weather-fetcher` | General | $19/month | Real-time weather and forecasts via Open-Meteo. |

## Running the Tests
To verify all 5 skills against real external APIs, run:

```bash
npx ts-node --esm test-all.ts
```

All skills are written in strict TypeScript and export a `plugin` object according to the Helm SDK builder pattern, defining `allow`, `ask`, or `deny` permissions per operation.
