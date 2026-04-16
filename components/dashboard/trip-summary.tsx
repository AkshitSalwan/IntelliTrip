'use client';

import { Share2, Download, Star, MapPin, Calendar, Users, DollarSign, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripSummaryProps {
  trip: any;
}

export function TripSummary({ trip }: TripSummaryProps) {
  const totalExpenses = (trip.expenses || []).reduce((sum: number, e: any) => sum + e.amount, 0);
  const averageRating = trip.reviews && trip.reviews.length > 0
    ? (trip.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / trip.reviews.length).toFixed(1)
    : 'N/A';
  const collaborators = trip.collaborators || [];
  const days = trip.duration || 0;
  
  // Sample recommendations based on interests
  const recommendations = [
    { category: 'Restaurant', title: 'Local Cuisine Hotspot', description: 'Must-try authentic dining experience' },
    { category: 'Activity', title: 'Adventure Tour', description: 'Exciting outdoor adventure matching your interests' },
    { category: 'Landmark', title: 'Historic Site', description: 'Popular cultural landmark you shouldn\'t miss' },
  ];

  // Sample weather
  const weatherForecast = [
    { day: 'Day 1', condition: 'Sunny', temp: '28°C' },
    { day: 'Day 2', condition: 'Cloudy', temp: '26°C' },
    { day: 'Day 3', condition: 'Rainy', temp: '23°C' },
  ];

  const handleExportPDF = () => {
    alert('PDF export feature coming soon!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Check out my trip to ${trip.destination}: ${typeof window !== 'undefined' ? window.location.href : ''}`
    );
    alert('Trip link copied!');
  };

  return (
    <div className="space-y-8">
      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-teal-200/50 bg-white p-4 text-center">
          <p className="text-sm text-slate-600">Days</p>
          <p className="mt-2 text-3xl font-bold text-teal-600">{days}</p>
        </div>
        <div className="rounded-lg border border-teal-200/50 bg-white p-4 text-center">
          <p className="text-sm text-slate-600">Spent</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-teal-200/50 bg-white p-4 text-center">
          <p className="text-sm text-slate-600">Rating</p>
          <p className="mt-2 text-3xl font-bold text-amber-500">{averageRating}</p>
        </div>
        <div className="rounded-lg border border-teal-200/50 bg-white p-4 text-center">
          <p className="text-sm text-slate-600">Team</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{collaborators.length + 1}</p>
        </div>
        <div className="rounded-lg border border-teal-200/50 bg-white p-4 text-center">
          <p className="text-sm text-slate-600">Status</p>
          <p className="mt-2 text-lg font-bold text-teal-600">{trip.status || 'Planning'}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleExportPDF} className="btn-gradient gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
        <Button onClick={handleShare} variant="outline" className="border-teal-200/50 gap-2 text-teal-700">
          <Share2 className="h-4 w-4" />
          Share Trip
        </Button>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Recommended for You</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="rounded-lg border border-teal-200/50 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                  {rec.category}
                </span>
              </div>
              <h4 className="font-medium text-slate-900">{rec.title}</h4>
              <p className="text-sm text-slate-600">{rec.description}</p>
              <Button size="sm" className="btn-gradient w-full mt-2">Learn More</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Cloud className="h-5 w-5 text-teal-600" />
          Weather Forecast
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {weatherForecast.map((weather, idx) => (
            <div key={idx} className="rounded-lg border border-teal-200/50 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-center">
              <p className="font-medium text-slate-900">{weather.day}</p>
              <p className="text-2xl text-blue-600 mt-2">☀️</p>
              <p className="mt-2 text-sm text-slate-700">{weather.condition}</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{weather.temp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Overview */}
      <div className="rounded-lg border border-teal-200/50 bg-white p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Trip Overview</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-700">
            <MapPin className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-sm text-slate-600">Destination</p>
              <p className="font-medium">{trip.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Calendar className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-sm text-slate-600">Duration</p>
              <p className="font-medium">{trip.duration} days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <DollarSign className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-sm text-slate-600">Budget</p>
              <p className="font-medium">${trip.budget?.toLocaleString() || '0'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Users className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-sm text-slate-600">Travel Style</p>
              <p className="font-medium">{trip.travelStyle || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
