# helm-skill-dns-check
> DNS lookups and email security audits (SPF, DKIM, MX) via Cloudflare DoH

## Install
npm install helm-skill-dns-check

## Operations
| Operation | Permission | Description |
|-----------|------------|-------------|
| lookup | allow | Perform arbitrary DNS lookup via DoH |
| checkMxRecords | allow | Get mail servers for a domain |
| checkSpf | allow | Analyze Sender Policy Framework record |
| checkDkim | allow | Verify DKIM public key for a given selector |
| fullEmailSecurityAudit | ask | Comprehensive email security check (MX, SPF, DKIM) with scoring |

## Example
```typescript
import { fullEmailSecurityAudit } from 'helm-skill-dns-check';

const result = await fullEmailSecurityAudit('github.com');
console.log(`Grade: ${result.grade} (Score: ${result.score})`);
```

## APIs Used
- Cloudflare DNS over HTTPS: https://cloudflare-dns.com/dns-query — no key required
