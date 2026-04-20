/**
 * Weather Service
 * Uses Open-Meteo API (free, no API key required)
 * Provides weather data for given coordinates
 */

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string; // weather code for icon mapping
  location: string;
  timestamp: number;
}

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Get coordinates from location name
 */
export async function getCoordinates(location: string): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error('Geocoding API error');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

/**
 * Get weather for given coordinates
 */
export async function getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();
    const current = data.current;
    const weatherCode = current.weather_code;

    return {
      temperature: Math.round(current.temperature_2m),
      description: getWeatherDescription(weatherCode),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      icon: getWeatherIcon(weatherCode),
      location: `${data.timezone}`,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting weather:', error);
    return null;
  }
}

/**
 * Get weather for location by name
 */
export async function getWeatherByLocation(location: string): Promise<WeatherData | null> {
  try {
    const coords = await getCoordinates(location);
    if (!coords) return null;

    const weather = await getWeather(coords.latitude, coords.longitude);
    if (weather) {
      weather.location = `${coords.name}, ${coords.country}`;
    }
    return weather;
  } catch (error) {
    console.error('Error getting weather by location:', error);
    return null;
  }
}

/**
 * Map WMO weather codes to descriptions
 */
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[code] || 'Unknown';
}

/**
 * Map weather codes to emoji icons
 */
function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌧️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '⛈️';
  if (code >= 85 && code <= 86) return '❄️';
  if (code >= 95 && code <= 99) return '⚡';
  return '🌡️';
}
