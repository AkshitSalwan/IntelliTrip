import { currentUser } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/dashboard/trip-card';
import { Plus } from 'lucide-react';

async function getUserTrips(userId: string) {
  try {
    await connectDB();
    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(trips));
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

export default async function TripsPage() {
  const user = await currentUser();
  if (!user?.id) {
    return null;
  }

  const trips = await getUserTrips(user.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all your planned adventures
          </p>
        </div>
        <Link href="/dashboard/trips/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/30 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-foreground">No trips yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first trip to start planning your adventure
          </p>
          <Link href="/dashboard/trips/new">
            <Button className="mt-4">Create New Trip</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip: any) => (
            <TripCard
              key={trip._id}
              id={trip._id}
              title={trip.title}
              destination={trip.destination}
              startDate={trip.startDate}
              endDate={trip.endDate}
              image={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
