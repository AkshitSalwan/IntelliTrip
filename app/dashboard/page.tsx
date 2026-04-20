import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/dashboard/trip-card';
import { Plus, MapPin } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';

async function getUserTrips(userId: string) {
  try {
    await connectDB();
    const trips = await Trip.find({ userId }).sort({ createdAt: -1 }).limit(6);
    return JSON.parse(JSON.stringify(trips));
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const user = await currentUser();
  
  let trips: any[] = [];
  if (user?.id) {
    trips = await getUserTrips(user.id);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
            Welcome back, {user?.firstName || 'Traveler'}!
          </h1>
          <p className="mt-2 text-teal-600/80">
            Manage your trips and create new adventures
          </p>
        </div>
        <Link href="/dashboard/trips/new">
          <Button className="btn-gradient gap-2">
            <Plus className="h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Trips Section */}
      {trips.length > 0 ? (
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Your Trips</h2>
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
        </section>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-card/30 px-6 py-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No trips yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start planning your first adventure with IntelliTrip
          </p>
          <Link href="/dashboard/trips/new">
            <Button className="mt-4">Create Your First Trip</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
