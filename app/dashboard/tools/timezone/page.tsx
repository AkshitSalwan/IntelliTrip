'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Globe } from 'lucide-react';

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York', value: 'America/New_York' },
  { label: 'Los Angeles', value: 'America/Los_Angeles' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Paris', value: 'Europe/Paris' },
  { label: 'Dubai', value: 'Asia/Dubai' },
  { label: 'Singapore', value: 'Asia/Singapore' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Sydney', value: 'Australia/Sydney' },
];

function formatDateTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export default function TimezoneConverterPage() {
  const [dateTime, setDateTime] = useState('');
  const [sourceZone, setSourceZone] = useState('UTC');

  const selectedDate = useMemo(() => {
    if (!dateTime) return null;
    return new Date(dateTime);
  }, [dateTime]);

  const convertedTimes = useMemo(() => {
    if (!selectedDate) return [];

    return TIMEZONES.filter((zone) => zone.value !== sourceZone).map((zone) => ({
      ...zone,
      valueText: formatDateTime(selectedDate, zone.value),
    }));
  }, [selectedDate, sourceZone]);

  const handleUseCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
          <Globe className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Time Zone Converter
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert departure times, meeting slots, and arrival windows across popular travel time zones.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-white/80 p-6 shadow-lg shadow-primary/5 backdrop-blur space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Date and Time
            </label>
            <Input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="border-primary/30"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Source Time Zone
            </label>
            <select
              value={sourceZone}
              onChange={(e) => setSourceZone(e.target.value)}
              className="w-full rounded-lg border border-primary/30 bg-white px-3 py-2 text-foreground focus:border-primary focus:ring-primary/30"
            >
              {TIMEZONES.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label} ({zone.value})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleUseCurrentTime} variant="outline" className="border-primary/30">
            Use Current Time
          </Button>
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-muted-foreground">
            Source: {sourceZone}
          </div>
        </div>
      </div>

      {selectedDate ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Original Time</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatDateTime(selectedDate, sourceZone)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {convertedTimes.map((zone) => (
              <div
                key={zone.value}
                className="rounded-xl border border-primary/20 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <p className="text-sm font-medium text-muted-foreground">{zone.label}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-primary">
                  {zone.value}
                </p>
                <p className="mt-3 text-base font-semibold text-foreground leading-relaxed">
                  {zone.valueText}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/5 p-10 text-center space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Enter a time to convert</h2>
          <p className="text-muted-foreground">
            Pick a date, select the source zone, and compare it across travel destinations.
          </p>
        </div>
      )}
    </div>
  );
}
