const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

function getWeatherDescription(code: number): string {
  return WMO_CODES[code] || 'Unknown weather';
}

export async function getCurrentWeather(latitude: number, longitude: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const current = data.current;

  return {
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherDescription: getWeatherDescription(current.weather_code),
    precipitation: current.precipitation,
    unit: "celsius"
  };
}

export async function getForecast(latitude: number, longitude: number, days: number = 7) {
  if (days < 1 || days > 16) {
    throw new Error('Days must be between 1 and 16');
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=${days}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const daily = data.daily;
  const result = [];

  for (let i = 0; i < daily.time.length; i++) {
    result.push({
      date: daily.time[i],
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      precipitation: daily.precipitation_sum[i],
      weatherDescription: getWeatherDescription(daily.weather_code[i]),
      windSpeed: daily.wind_speed_10m_max[i]
    });
  }

  return result;
}

export async function getWeatherByCity(city: string) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error(`Open-Meteo Geocoding API error: ${geoResponse.status} ${geoResponse.statusText}`);
  }

  const geoData = await geoResponse.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  const location = geoData.results[0];
  const weather = await getCurrentWeather(location.latitude, location.longitude);

  return {
    ...weather,
    cityName: location.name,
    country: location.country,
    timezone: location.timezone
  };
}

export const plugin = {
  name: 'helm-skill-weather',
  operations: {
    getCurrentWeather: { permission: 'allow', handler: getCurrentWeather },
    getForecast: { permission: 'allow', handler: getForecast },
    getWeatherByCity: { permission: 'allow', handler: getWeatherByCity }
  }
};
