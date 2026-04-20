import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey:
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const geminiModel = google('gemini-2.0-flash');

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { query, type, destination, interests } = body;

    if (!query || !type) {
      return NextResponse.json({ error: 'Query and type are required' }, { status: 400 });
    }

    let prompt = '';
    if (type === 'location') {
      prompt = `Suggest 5-7 popular tourist locations/attractions in or near ${destination} that match these interests: ${interests?.join(', ') || 'general tourism'}.
The user is typing: "${query}"
Provide suggestions that start with or contain "${query}". Return only a JSON array of location names, no explanations.`;
    } else if (type === 'activity') {
      prompt = `Suggest 5-7 activity ideas for a trip to ${destination} that match these interests: ${interests?.join(', ') || 'general tourism'}.
The user is typing: "${query}"
Provide suggestions that start with or contain "${query}". Return only a JSON array of activity names, no explanations.`;
    }

    const { text } = await generateText({
      model: geminiModel,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 200,
    });

    // Try to parse as JSON array, fallback to splitting by newlines
    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(text);
    } catch {
      suggestions = text.split('\n').filter(s => s.trim()).slice(0, 7);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}