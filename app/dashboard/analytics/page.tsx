'use client';

import { useEffect, useState } from 'react';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import { Spinner } from '@/components/ui/spinner';

export default function AnalyticsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Analytics & Insights
        </h1>
        <p className="mt-2 text-slate-600">Track your travel patterns and spending insights</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-lg border border-teal-200/50 bg-white p-8 text-center">
          <p className="text-slate-600">Create your first trip to see analytics!</p>
        </div>
      ) : (
        <AnalyticsDashboard trips={trips} />
      )}
    </div>
  );
}
