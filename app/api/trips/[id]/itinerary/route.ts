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

    // Flatten the activities from all days
    const flattenedActivities = itinerary.days.flatMap(day =>
      day.activities.map(activity => ({
        id: `${day.day}-${activity.time}-${activity.activity}`.replace(/\s+/g, '-').toLowerCase(),
        day: day.day,
        title: activity.activity,
        description: activity.description,
        time: activity.time,
        location: activity.location || body.destination,
        category: 'Sightseeing',
      }))
    );

    // Save flattened activities to trip
    trip.itinerary = flattenedActivities;
    await trip.save();

    return NextResponse.json({
      success: true,
      data: flattenedActivities,
      message: 'Itinerary generated successfully'
    });
  } catch (error: any) {
    console.error('Error generating itinerary:', error?.message);
    
    // Check if it's a quota error
    const isQuotaError = error?.statusCode === 429 || error?.message?.includes('quota');
    
    return NextResponse.json(
      { 
        error: isQuotaError 
          ? 'API quota exceeded. Using template itinerary.' 
          : 'Error generating itinerary. Please try again.',
        isQuotaError,
        message: error?.message || 'Internal server error'
      },
      { status: isQuotaError ? 200 : 500 }
    );
  }
}
