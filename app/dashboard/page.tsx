import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/dashboard/trip-card';
import { Plus, MapPin } from 'lucide-react';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
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
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-foreground">Your Trips</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder trips */}
          {[1, 2, 3].map((i) => (
            <TripCard
              key={i}
              id={`trip-${i}`}
              title={`Trip ${i}`}
              destination={`Destination ${i}`}
              startDate={new Date(2024, 5, 15).toISOString()}
              endDate={new Date(2024, 5, 22).toISOString()}
              image={`https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=300&fit=crop`}
            />
          ))}
        </div>
      </section>

      {/* Empty State */}
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
    </div>
  );
}
