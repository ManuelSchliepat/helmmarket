const WMO_CODES: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow fall', 95: 'Thunderstorm'
};

export interface WeatherOptions {
  apiKey?: string;
  provider?: 'open-meteo' | 'openweathermap';
}

export async function getCurrentWeather(lat: number, lon: number, options: WeatherOptions = {}) {
  // If an API key is provided, we default to OpenWeatherMap (Industry Standard)
  if (options.apiKey || options.provider === 'openweathermap') {
    if (!options.apiKey) throw new Error("API Key required for OpenWeatherMap provider.");
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${options.apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenWeatherMap Error: ${res.statusText}`);
    const data = await res.json();
    
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weatherDescription: data.weather[0].description,
      precipitation: 0, // OWM current weather has different structure for precip
      unit: "celsius",
      provider: "openweathermap"
    };
  }

  // Fallback to Open-Meteo (Free/No-Key)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo Error: ${res.statusText}`);
  const data = await res.json();
  
  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.temperature_2m, // Simplified for fallback
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherDescription: WMO_CODES[data.current.weather_code] || 'Clear',
    precipitation: 0,
    unit: "celsius",
    provider: "open-meteo"
  };
}

export async function getWeatherByCity(city: string, options: WeatherOptions = {}) {
  // 1. Geocoding
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();
  
  if (!geoData.results?.length) throw new Error(`City not found: ${city}`);
  const { latitude, longitude, name, country } = geoData.results[0];

  // 2. Weather
  const weather = await getCurrentWeather(latitude, longitude, options);
  
  return {
    ...weather,
    cityName: name,
    country
  };
}

export const plugin = {
  name: 'weather',
  operations: {
    getCurrentWeather: { permission: 'allow', handler: getCurrentWeather },
    getWeatherByCity: { permission: 'allow', handler: getWeatherByCity }
  }
};
