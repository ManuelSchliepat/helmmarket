# helm-skill-pii-scanner
> GDPR-compliant PII detection and redaction — no external API needed

## Install
npm install helm-skill-pii-scanner

## Operations
| Operation | Permission | Description |
|-----------|------------|-------------|
| scanText | ask | Detect PII in text string |
| redactText | ask | Redact PII from text string |
| scanObject | ask | Recursively scan all strings in a JSON object for PII |

## Example
```typescript
import { redactText } from 'helm-skill-pii-scanner';

const result = await redactText('My email is test@example.com and card is 4532 1234 5678 9012');
console.log(result.redacted);
// Output: My email is **************** and card is *******************
```

## APIs Used
- None. Runs entirely locally using native regex engine.
