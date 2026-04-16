import { TripForm } from '@/components/dashboard/trip-form';

export default function NewTripPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Trip</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us about your next adventure and let AI help you plan it
        </p>
      </div>

      <TripForm />
    </div>
  );
}
