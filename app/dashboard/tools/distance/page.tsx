'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Route, ArrowRightLeft } from 'lucide-react';

interface Place {
  name: string;
  lat: number;
  lon: number;
}

const PRESETS: Place[] = [
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function parseNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function DistanceCalculatorPage() {
  const [fromName, setFromName] = useState('New York');
  const [toName, setToName] = useState('London');
  const [fromLat, setFromLat] = useState('40.7128');
  const [fromLon, setFromLon] = useState('-74.0060');
  const [toLat, setToLat] = useState('51.5074');
  const [toLon, setToLon] = useState('-0.1278');

  const distance = useMemo(() => {
    const lat1 = parseNumber(fromLat);
    const lon1 = parseNumber(fromLon);
    const lat2 = parseNumber(toLat);
    const lon2 = parseNumber(toLon);

    if (
      lat1 === null ||
      lon1 === null ||
      lat2 === null ||
      lon2 === null
    ) {
      return null;
    }

    return haversineDistance(lat1, lon1, lat2, lon2);
  }, [fromLat, fromLon, toLat, toLon]);

  const handlePresetSelect = (place: Place, target: 'from' | 'to') => {
    if (target === 'from') {
      setFromName(place.name);
      setFromLat(place.lat.toString());
      setFromLon(place.lon.toString());
    } else {
      setToName(place.name);
      setToLat(place.lat.toString());
      setToLon(place.lon.toString());
    }
  };

  const swapPlaces = () => {
    setFromName(toName);
    setToName(fromName);
    setFromLat(toLat);
    setFromLon(toLon);
    setToLat(fromLat);
    setToLon(fromLon);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20">
          <Route className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Distance Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Estimate the distance between destinations using coordinates or quick city presets.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-start">
        <div className="rounded-2xl border border-primary/20 bg-white p-6 space-y-5 shadow-sm">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              From
            </label>
            <Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Origin name" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={fromLat} onChange={(e) => setFromLat(e.target.value)} placeholder="Latitude" />
              <Input value={fromLon} onChange={(e) => setFromLon(e.target.value)} placeholder="Longitude" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Quick presets</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRESETS.map((place) => (
                <button
                  key={`${place.name}-from`}
                  onClick={() => handlePresetSelect(place, 'from')}
                  className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-left text-sm text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors"
                >
                  {place.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:pt-24">
          <Button variant="outline" onClick={swapPlaces} className="rounded-full border-primary/30">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Swap
          </Button>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-white p-6 space-y-5 shadow-sm">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              To
            </label>
            <Input value={toName} onChange={(e) => setToName(e.target.value)} placeholder="Destination name" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={toLat} onChange={(e) => setToLat(e.target.value)} placeholder="Latitude" />
              <Input value={toLon} onChange={(e) => setToLon(e.target.value)} placeholder="Longitude" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Quick presets</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRESETS.map((place) => (
                <button
                  key={`${place.name}-to`}
                  onClick={() => handlePresetSelect(place, 'to')}
                  className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-left text-sm text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors"
                >
                  {place.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10 p-8 text-center shadow-sm space-y-3">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Calculated Distance</p>
        <p className="text-5xl font-bold text-foreground">
          {distance === null ? '--' : `${distance.toFixed(1)} km`}
        </p>
        <p className="text-muted-foreground">
          {distance === null
            ? 'Enter valid latitude and longitude values to calculate the route distance.'
            : `${(distance * 0.621371).toFixed(1)} miles`}
        </p>
      </div>
    </div>
  );
}
