import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';
import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/services/ai-service';

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
    const { message, context } = body;

    const response = await generateChatResponse({
      message,
      context: {
        destination: context.destination,
        duration: context.duration,
        interests: context.interests,
      },
      history: trip.chatHistory || [],
    });

    // Save to chat history
    if (!trip.chatHistory) {
      trip.chatHistory = [];
    }
    trip.chatHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });
    trip.chatHistory.push({
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
    });
    await trip.save();

    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating chat response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
