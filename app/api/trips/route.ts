import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';
import { User } from '@/lib/models/user';
import { NextResponse } from 'next/server';

function normalizeTravelStyle(value: string) {
  const style = value?.toLowerCase();
  if (style === 'budget') return 'budget';
  if (style === 'luxury') return 'luxury';
  if (style === 'adventure') return 'adventure';
  return 'standard';
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, destination, startDate, endDate, budget, travelStyle, interests } = body;

    if (!title || !destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, destination, start date, and end date are required.' },
        { status: 400 }
      );
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    const parsedBudget = Number.parseFloat(String(budget));

    if (Number.isNaN(parsedStartDate.getTime()) || Number.isNaN(parsedEndDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start or end date.' },
        { status: 400 }
      );
    }

    if (Number.isNaN(parsedBudget)) {
      return NextResponse.json(
        { error: 'Budget must be a valid number.' },
        { status: 400 }
      );
    }

    // Create trip
    const trip = new Trip({
      userId,
      ownerId: userId,
      title,
      destination,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      budget: parsedBudget,
      travelStyle: normalizeTravelStyle(travelStyle),
      interests: Array.isArray(interests) ? interests : [],
      status: 'planning',
    });

    await trip.save();

    // Link trip to user record if available (non-blocking).
    try {
      await User.findOneAndUpdate(
        { clerkId: userId },
        { $addToSet: { trips: trip._id } },
        { new: true }
      );
    } catch (linkError) {
      console.warn('Could not link trip to user document:', linkError);
    }

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);

    if (error instanceof Error && process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
