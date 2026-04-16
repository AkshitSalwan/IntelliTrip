'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Zap, Users, Calendar, Star } from 'lucide-react';

const POPULAR_DESTINATIONS = [
  { name: 'Paris, France', image: '🗼', rating: 4.8, reviews: 2843, styles: ['Cultural', 'Food & Wine', 'Luxury'] },
  { name: 'Tokyo, Japan', image: '🏯', rating: 4.7, reviews: 1926, styles: ['Cultural', 'Food & Wine', 'Adventure'] },
  { name: 'Barcelona, Spain', image: '🏖️', rating: 4.6, reviews: 1654, styles: ['Relaxation', 'Food & Wine', 'Budget'] },
  { name: 'New York, USA', image: '🗽', rating: 4.5, reviews: 3021, styles: ['Cultural', 'Food & Wine', 'Luxury'] },
  { name: 'London, UK', image: '☕', rating: 4.6, reviews: 2341, styles: ['Cultural', 'Luxury', 'Food & Wine'] },
  { name: 'Rome, Italy', image: '🎭', rating: 4.7, reviews: 1876, styles: ['Cultural', 'Food & Wine', 'Relaxation'] },
  { name: 'Dubai, UAE', image: '🏙️', rating: 4.4, reviews: 1543, styles: ['Luxury', 'Relaxation'] },
  { name: 'Sydney, Australia', image: '🦘', rating: 4.5, reviews: 1289, styles: ['Adventure', 'Relaxation', 'Budget'] },
];

const TRAVEL_STYLES = [
  { name: 'Adventure', icon: '⛺', description: 'Hiking, climbing, outdoor activities' },
  { name: 'Cultural', icon: '🏛️', description: 'Museums, historical sites, local culture' },
  { name: 'Relaxation', icon: '🏝️', description: 'Beaches, spas, resort experiences' },
  { name: 'Food & Wine', icon: '🍷', description: 'Restaurants, cooking classes, markets' },
  { name: 'Budget', icon: '💰', description: 'Hostels, street food, local experiences' },
  { name: 'Luxury', icon: '✨', description: 'Five-star hotels, fine dining, exclusive tours' },
];

export default function DestinationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = !selectedStyle || d.styles.includes(selectedStyle);
    return matchesQuery && matchesStyle;
  });

  const getFormTravelStyle = (style: string) => {
    if (style === 'Budget') return 'Budget';
    if (style === 'Luxury') return 'Luxury';
    return 'Comfort';
  };

  const planDestination = (destinationName: string, style: string | null) => {
    const now = new Date();
    const startDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 21);
    const endDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 6);

    const params = new URLSearchParams({
      destination: destinationName,
      title: `${destinationName.split(',')[0]} Trip`,
      travelStyle: getFormTravelStyle(style ?? 'Comfort'),
      budget: style === 'Luxury' ? '4500' : style === 'Budget' ? '1500' : '2800',
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      interests: style ?? 'Culture',
    });

    router.push(`/dashboard/trips/new?${params.toString()}`);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Explore Destinations
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover amazing places and plan your next adventure
        </p>
      </div>

      {/* Search Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-primary/60" />
          <Input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg border-primary/30 focus:border-primary focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Travel Styles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Travel Style</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {TRAVEL_STYLES.map((style) => (
            <button
              key={style.name}
              onClick={() => setSelectedStyle(selectedStyle === style.name ? null : style.name)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedStyle === style.name
                  ? 'border-primary bg-primary/10'
                  : 'border-primary/30 bg-white hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-2">{style.icon}</div>
              <h3 className="font-semibold text-foreground">{style.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Popular Destinations</h2>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.name}
                className="rounded-xl border border-primary/30 bg-white hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
              >
                <div className="h-32 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                  {destination.image}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {destination.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="text-sm font-medium text-foreground">{destination.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({destination.reviews} reviews)</span>
                  </div>
                  <Button
                    className="w-full btn-gradient mt-2"
                    onClick={() => planDestination(destination.name, selectedStyle ?? destination.styles[0] ?? null)}
                  >
                    Plan Trip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No destinations found for "{searchQuery}"
            </p>
            <Button onClick={() => setSearchQuery('')} variant="outline" className="mt-4 border-primary/30">
              View All Destinations
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 rounded-xl border border-primary/30 bg-primary/5 p-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">250+</div>
          <p className="text-muted-foreground mt-1">Destinations</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">50K+</div>
          <p className="text-muted-foreground mt-1">Happy Travelers</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">5M+</div>
          <p className="text-muted-foreground mt-1">Trips Planned</p>
        </div>
      </div>
    </div>
  );
}
