# helm-skill-weather
> Real-time weather and forecasts via Open-Meteo

## Install
npm install helm-skill-weather

## Operations
| Operation | Permission | Description |
|-----------|------------|-------------|
| getCurrentWeather | allow | Get current weather by coordinates |
| getForecast | allow | Get weather forecast by coordinates |
| getWeatherByCity | allow | Get current weather by city name |

## Example
```typescript
import { getWeatherByCity } from 'helm-skill-weather';

const result = await getWeatherByCity('Berlin');
console.log(result);
```

## APIs Used
- Open-Meteo: https://api.open-meteo.com — no key required
