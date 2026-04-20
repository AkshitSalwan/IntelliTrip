import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

// Simple in-memory storage for suggestions (or you can use MongoDB)
const suggestions: any[] = [];

// Optional: Create a MongoDB model for suggestions if needed
interface FeatureSuggestion {
  name: string;
  email: string;
  feature: string;
  description: string;
  submittedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, feature, description } = body;

    // Validate required fields
    if (!name || !email || !feature || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const suggestion: FeatureSuggestion = {
      name,
      email,
      feature,
      description,
      submittedAt: new Date(),
    };

    // Option 1: Store in memory (for demo)
    suggestions.push(suggestion);

    // Option 2: Uncomment to save to MongoDB
    // try {
    //   await connectDB();
    //   const Suggestion = mongoose.model('FeatureSuggestion', new mongoose.Schema({
    //     name: String,
    //     email: String,
    //     feature: String,
    //     description: String,
    //     submittedAt: { type: Date, default: Date.now }
    //   }));
    //   await Suggestion.create(suggestion);
    // } catch (dbError) {
    //   console.warn('Could not save to MongoDB:', dbError);
    // }

    console.log('Feature suggestion received:', suggestion);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your suggestion!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing feature suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to process suggestion' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    suggestions: suggestions.length,
    lastSuggestions: suggestions.slice(-5),
  });
}
