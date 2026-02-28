# helm-skill-currency
> Live and historical currency conversion via ECB rates

## Install
npm install helm-skill-currency

## Operations
| Operation | Permission | Description |
|-----------|------------|-------------|
| convert | allow | Convert an amount from one currency to another |
| getRate | allow | Get the current exchange rate |
| getHistoricalRate | allow | Get historical exchange rate |
| listCurrencies | allow | List all supported currencies |

## Example
```typescript
import { convert } from 'helm-skill-currency';

const result = await convert(100, 'USD', 'EUR');
console.log(result);
```

## APIs Used
- Frankfurter.app: https://www.frankfurter.app — no key required
