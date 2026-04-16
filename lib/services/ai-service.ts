import { generateObject, generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
  apiKey:
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const geminiModel = google('gemini-2.0-flash');

const itinerarySchema = z.object({
  days: z.array(
    z.object({
      day: z.number(),
      activities: z.array(
        z.object({
          time: z.string(),
          activity: z.string(),
          description: z.string(),
          location: z.string().optional(),
          estimatedCost: z.number().optional(),
        })
      ),
    })
  ),
  highlights: z.array(z.string()),
  tips: z.array(z.string()),
});

interface GenerateItineraryParams {
  destination: string;
  duration: number;
  interests: string[];
  style: string;
}

interface GenerateChatResponseParams {
  message: string;
  context: {
    destination: string;
    duration: number;
    interests: string[];
  };
  history: Array<{ role: string; content: string }>;
}

export async function generateItinerary(params: GenerateItineraryParams) {
  const { destination, duration, interests, style } = params;

  const prompt = `Create a detailed ${duration}-day itinerary for ${destination}.
Travel style: ${style}
Interests: ${interests.join(', ')}

Please provide a structured itinerary with specific activities, times, locations, and estimated costs where applicable.`;

  try {
    const { object } = await generateObject({
      model: geminiModel,
      schema: itinerarySchema,
      prompt,
    });

    return object;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    // Return a placeholder if generation fails
    return {
      days: Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        activities: [
          {
            time: '9:00 AM',
            activity: `Explore ${destination}`,
            description: 'Discover local attractions and landmarks',
            location: destination,
          },
        ],
      })),
      highlights: [`Visit ${destination}`],
      tips: ['Plan ahead', 'Pack light', 'Stay hydrated'],
    };
  }
}

export async function generateChatResponse(
  params: GenerateChatResponseParams
) {
  const { message, context, history } = params;

  const systemPrompt = `You are a helpful travel planning assistant for a trip to ${context.destination}.
The traveler is interested in: ${context.interests.join(', ')}
Trip duration: ${context.duration} days

Help them with their trip planning questions, provide recommendations, and offer travel advice.
Be concise and helpful in your responses.`;

  const conversationHistory = history
    .slice(-6)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  try {
    const { text } = await generateText({
      model: geminiModel,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return { content: text };
  } catch (error) {
    console.error('Error generating chat response:', error);
    return {
      content:
        'I apologize, but I encountered an error. Please try again with a different question.',
    };
  }
}
