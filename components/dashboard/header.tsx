'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { WeatherData } from '@/lib/services/weather-service';

export function Header() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch weather on component mount (default location)
  useEffect(() => {
    fetchWeatherByLocation('London');
  }, []);

  const fetchWeatherByLocation = async (location: string) => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error('Location not found');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherByLocation(searchLocation);
  };

  return (
    <header className="border-b border-primary/30 bg-linear-to-r from-white to-primary/5 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4 gap-6">
        {/* Weather Widget */}
        <div className="flex items-center gap-3 min-w-fit">
          {weather && (
            <div className="flex items-center gap-2 bg-white/40 rounded-lg px-4 py-2 backdrop-blur-sm border border-primary/20">
              <span className="text-3xl">{weather.icon}</span>
              <div className="flex flex-col">
                <div className="text-lg font-semibold text-foreground">
                  {weather.temperature}°C
                </div>
                <div className="text-sm text-muted-foreground">
                  {weather.location}
                </div>
              </div>
              <div className="hidden sm:flex flex-col text-sm text-muted-foreground ml-2 pl-2 border-l border-primary/30">
                <span>{weather.description}</span>
                <span>Humidity: {weather.humidity}%</span>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="text-base text-muted-foreground animate-pulse">
              Loading weather...
            </div>
          )}
          {error && (
            <div className="text-base text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
          <Input
            type="text"
            placeholder="Search location or trips..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="border-primary/30 bg-white/60 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/30"
          />
          {searchLocation && (
            <button
              type="submit"
              className="absolute right-2 top-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Search
            </button>
          )}
        </form>
      </div>
    </header>
  );
}
