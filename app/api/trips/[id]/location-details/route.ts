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
    const { location, destination, interests } = body;

    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    const prompt = `Provide detailed information about "${location}" in ${destination || 'the area'}.
The traveler is interested in: ${interests?.join(', ') || 'general tourism'}

Please provide:
1. A brief description of this location/attraction
2. Estimated cost/price range for visiting (in USD, be realistic)
3. Current weather conditions and best time to visit
4. 3-5 nearby food stops/restaurants with cuisine types
5. 3-5 concise travel tips for this location

Format your response as a JSON object with these exact keys:
{
  "description": "brief description",
  "price": "estimated cost",
  "weather": "current weather and best time",
  "foodStops": ["restaurant 1 - cuisine", "restaurant 2 - cuisine", ...],
  "tips": ["tip 1", "tip 2", ...]
}

Keep descriptions concise but informative.`;

    const { text } = await generateText({
      model: geminiModel,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 800,
    });

    // Try to parse as JSON, fallback to structured text parsing
    let details;
    try {
      details = JSON.parse(text);
    } catch {
      // Fallback parsing if JSON is malformed
      const lines = text.split('\n').filter(line => line.trim());
      details = {
        description: lines.find(line => line.toLowerCase().includes('description'))?.split(':')[1]?.trim() || 'A popular destination',
        price: lines.find(line => line.toLowerCase().includes('price') || line.toLowerCase().includes('cost'))?.split(':')[1]?.trim() || 'Varies',
        weather: lines.find(line => line.toLowerCase().includes('weather'))?.split(':')[1]?.trim() || 'Check local weather',
        foodStops: lines.filter(line => /(restaurant|food|cafe)/i.test(line)).slice(0, 5).map(line => line.replace(/^\d+\.\s*/, '').trim()),
        tips: lines.filter(line => /tip/i.test(line)).slice(0, 5).map(line => line.replace(/^\d+\.\s*/, '').replace(/^(tips?:)/i, '').trim()),
      };
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error('Error generating location details:', error);
    return NextResponse.json(
      {
        description: 'A popular destination worth visiting',
        price: 'Varies by activity',
        weather: 'Check local weather conditions',
        foodStops: ['Local restaurants available nearby'],
        tips: 'Enjoy your visit!'
      },
      { status: 500 }
    );
  }
}