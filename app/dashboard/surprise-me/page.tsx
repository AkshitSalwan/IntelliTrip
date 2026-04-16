'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Users, DollarSign, RotateCcw } from 'lucide-react';

const SURPRISE_OPTIONS = {
  destinations: [
    { name: 'Bali, Indonesia', emoji: '🏝️', vibe: 'Beach & Culture', budget: '$$ / night', rating: 4.7 },
    { name: 'Prague, Czech Republic', emoji: '🏰', vibe: 'History & Culture', budget: '$ / night', rating: 4.6 },
    { name: 'Iceland', emoji: '❄️', vibe: 'Adventure & Nature', budget: '$$$$ / night', rating: 4.8 },
    { name: 'Morocco', emoji: '🇲🇦', vibe: 'Exotic & Cultural', budget: '$ / night', rating: 4.5 },
    { name: 'Greece', emoji: '🏛️', vibe: 'Beach & History', budget: '$$ / night', rating: 4.7 },
    { name: 'Thailand', emoji: '🏮', vibe: 'Beach & Culture', budget: '$ / night', rating: 4.6 },
    { name: 'New Zealand', emoji: '🏔️', vibe: 'Adventure & Nature', budget: '$$$ / night', rating: 4.8 },
    { name: 'Portugal', emoji: '🍷', vibe: 'Food & Culture', budget: '$ / night', rating: 4.5 },
  ],
  activities: [
    '🥾 Hiking in mountain ranges',
    '🤿 Scuba diving in coral reefs',
    '🍴 Street food tours',
    '🚴 Cycling through countryside',
    '🎨 Art gallery visits',
    '🏖️ Beach relaxation',
    '🏛️ Historical site exploration',
    '🎭 Theater and cultural shows',
    '🧘 Yoga and wellness retreats',
    '📸 Photography tours',
  ],
  budgets: [
    { range: 'Backpacker', emoji: '🎒', daily: '$30-50' },
    { range: 'Budget-Conscious', emoji: '💼', daily: '$50-100' },
    { range: 'Mid-Range', emoji: '🏨', daily: '$100-200' },
    { range: 'Comfortable', emoji: '⭐', daily: '$200-400' },
    { range: 'Luxury', emoji: '👑', daily: '$400+' },
  ],
  durations: [
    { days: 'Weekend Getaway', emoji: '⏰', range: '2-3 days' },
    { days: 'Short Trip', emoji: '📅', range: '4-7 days' },
    { days: 'Week+ Adventure', emoji: '🗓️', range: '8-14 days' },
    { days: 'Extended Trip', emoji: '📆', range: '15+ days' },
  ],
};

interface SurpriseRecommendation {
  destination: string;
  activity: string;
  budget: string;
  duration: string;
}

export default function SurpriseMePage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<SurpriseRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [createTripError, setCreateTripError] = useState<string | null>(null);

  const generateSurprise = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const dest = SURPRISE_OPTIONS.destinations[Math.floor(Math.random() * SURPRISE_OPTIONS.destinations.length)];
      const activity = SURPRISE_OPTIONS.activities[Math.floor(Math.random() * SURPRISE_OPTIONS.activities.length)];
      const budget = SURPRISE_OPTIONS.budgets[Math.floor(Math.random() * SURPRISE_OPTIONS.budgets.length)];
      const duration = SURPRISE_OPTIONS.durations[Math.floor(Math.random() * SURPRISE_OPTIONS.durations.length)];

      setRecommendation({
        destination: dest.name,
        activity,
        budget: budget.range,
        duration: duration.days,
      });
      setIsGenerating(false);
    }, 1500);
  };

  const planSuggestedTrip = async () => {
    if (!recommendation) return;

    setCreateTripError(null);
    setIsCreatingTrip(true);

    const now = new Date();
    const startDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14);
    const endDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 5);

    const payload = {
      destination: recommendation.destination,
      title: `${recommendation.destination.split(',')[0]} Adventure`,
      travelStyle: 'Comfort',
      budget: '2500',
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      interests: [recommendation.activity],
    };

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'Failed to create trip from surprise recommendation.');
      }

      const { _id } = await response.json();
      router.push(`/dashboard/trips/${_id}`);
    } catch (error) {
      setCreateTripError(
        error instanceof Error ? error.message : 'Unable to create trip right now.'
      );

      const params = new URLSearchParams({
        destination: payload.destination,
        title: payload.title,
        travelStyle: payload.travelStyle,
        budget: payload.budget,
        startDate: payload.startDate,
        endDate: payload.endDate,
        interests: payload.interests.join(','),
      });
      router.push(`/dashboard/trips/new?${params.toString()}`);
    } finally {
      setIsCreatingTrip(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Surprise Me! ✨
        </h1>
        <p className="text-lg text-muted-foreground">
          Can't decide where to go? Let us suggest a perfect trip!
        </p>
      </div>

      {/* Main CTA */}
      <div className="rounded-xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-secondary/10 p-12 text-center space-y-6">
        <div className="text-6xl">🎲</div>
        <p className="text-xl text-foreground">Feel lucky? Let AI suggest your next adventure!</p>
        <Button
          onClick={generateSurprise}
          disabled={isGenerating}
          className="btn-gradient py-6 px-8 text-lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Surprise Me!
            </>
          )}
        </Button>
      </div>

      {/* Recommendation Card */}
      {recommendation && (
        <div className="rounded-xl border border-primary/30 bg-white p-8 space-y-6 shadow-lg">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Your Perfect Trip</p>
            <h2 className="text-3xl font-bold text-foreground">{recommendation.destination}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: MapPin, label: 'Destination', value: recommendation.destination.split(',')[0] },
              { icon: DollarSign, label: 'Budget', value: recommendation.budget },
              { icon: Users, label: 'Activity', value: recommendation.activity.split(' ')[1] },
              { icon: '📅', label: 'Duration', value: recommendation.duration },
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-primary/5 border border-primary/30 p-4 text-center space-y-2">
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <p className="font-semibold text-foreground text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Suggested Activity</p>
            <p className="text-lg font-bold text-foreground mt-2">{recommendation.activity}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={planSuggestedTrip} disabled={isCreatingTrip} className="flex-1 btn-gradient">
              {isCreatingTrip ? 'Creating Trip...' : 'Plan This Trip'}
            </Button>
            <Button onClick={generateSurprise} variant="outline" className="border-primary/30">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>

          {createTripError && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {createTripError}
            </p>
          )}
        </div>
      )}

      {/* How it Works */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">How it Works</h3>
        <div className="space-y-3">
          {[
            { step: 1, text: 'Click "Surprise Me!" button' },
            { step: 2, text: 'Our AI generates a random but awesome destination' },
            { step: 3, text: 'Get matched with activities and budget type' },
            { step: 4, text: 'Start planning your adventure immediately' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {step}
              </div>
              <p className="text-foreground pt-1">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 rounded-xl border border-primary/30 bg-white p-6">
        <div className="text-center space-y-2">
          <p className="text-3xl font-bold text-primary">{SURPRISE_OPTIONS.destinations.length}</p>
          <p className="text-sm text-muted-foreground">Destinations</p>
        </div>
        <div className="text-center space-y-2">
          <p className="text-3xl font-bold text-primary">{SURPRISE_OPTIONS.activities.length}</p>
          <p className="text-sm text-muted-foreground">Activities</p>
        </div>
        <div className="text-center space-y-2">
          <p className="text-3xl font-bold text-primary">∞</p>
          <p className="text-sm text-muted-foreground">Combinations</p>
        </div>
      </div>
    </div>
  );
}
