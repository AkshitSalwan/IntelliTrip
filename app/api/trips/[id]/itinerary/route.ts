import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';
import { NextResponse } from 'next/server';
import { generateItinerary } from '@/lib/services/ai-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const body = await request.json();
    const itinerary = await generateItinerary({
      destination: body.destination,
      duration: body.duration,
      interests: body.interests,
      style: body.style,
    });

    // Save itinerary to trip
    trip.itinerary = itinerary;
    await trip.save();

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
