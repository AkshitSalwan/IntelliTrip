import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';
import { TripDetailTabs } from '@/components/dashboard/trip-detail-tabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getTripById(tripId: string, userId: string) {
  try {
    await connectDB();
    const trip = await Trip.findOne({ _id: tripId, userId });
    return trip ? JSON.parse(JSON.stringify(trip)) : null;
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    notFound();
  }

  const { id } = await params;
  const trip = await getTripById(id, userId);
  if (!trip) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/trips">
          <Button variant="outline" className="mb-4 border-teal-200/50 text-teal-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Button>
        </Link>
        <h1 className="text-4xl font-bold bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          {trip.title}
        </h1>
        <p className="mt-2 text-slate-600">{trip.destination}</p>
      </div>

      {/* Trip Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: 'Duration',
            value: trip.duration ? `${trip.duration} days` : 'Not set',
          },
          {
            label: 'Budget',
            value: `$${trip.budget?.toLocaleString() || '0'}`,
          },
          {
            label: 'Style',
            value: trip.travelStyle || 'Not set',
          },
          {
            label: 'Status',
            value: trip.status || 'Planning',
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-teal-200/50 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <TripDetailTabs trip={trip} />
    </div>
  );
}
