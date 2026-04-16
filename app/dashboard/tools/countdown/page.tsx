'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownPage() {
  const [tripDate, setTripDate] = useState('');
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [isActive, setIsActive] = useState(false);

  const calculateCountdown = (date: string) => {
    if (!date) return null;
    const tripTime = new Date(date).getTime();
    const now = new Date().getTime();
    const difference = tripTime - now;

    if (difference < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    if (!isActive || !tripDate) return;

    const interval = setInterval(() => {
      const data = calculateCountdown(tripDate);
      setCountdown(data);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, tripDate]);

  const handleStartCountdown = () => {
    if (tripDate) {
      setCountdown(calculateCountdown(tripDate));
      setIsActive(true);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Trip Countdown
        </h1>
        <p className="text-lg text-muted-foreground">
          Count down to your next adventure
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-xl border border-primary/30 bg-white p-8 space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Trip Date
          </label>
          <Input
            type="datetime-local"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="border-primary/30 text-lg py-6"
          />
        </div>

        <Button
          onClick={handleStartCountdown}
          disabled={!tripDate}
          className="w-full btn-gradient py-6 text-lg"
        >
          Start Countdown
        </Button>
      </div>

      {/* Countdown Display */}
      {countdown && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-4">Time until your trip:</p>
            <p className="text-2xl font-semibold text-foreground">{formatDate(tripDate)}</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 border border-primary/30 p-6 text-center space-y-2"
              >
                <p className="text-4xl font-bold text-primary">
                  {String(item.value).padStart(2, '0')}
                </p>
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 && (
            <div className="rounded-xl bg-linear-to-r from-primary/20 to-secondary/20 border border-primary/30 p-6 text-center space-y-2">
              <p className="text-2xl font-bold text-foreground">🎉 Happy Travels! 🎉</p>
              <p className="text-muted-foreground">Your trip has started!</p>
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Before Your Trip</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[
            'Complete your itinerary planning',
            'Check visa and travel requirements',
            'Book accommodations and activities',
            'Arrange travel insurance',
            'Notify your bank of your trip dates',
            'Pack according to the packing list',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg mt-1">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
