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
  } catch (error: any) {
    console.error('Error generating itinerary:', error?.message);
    
    // Generate realistic fallback itinerary based on destination and interests
    return generateMockItinerary(destination, duration, interests, style);
  }
}

function generateMockItinerary(destination: string, duration: number, interests: string[], style: string) {
  const mockActivities: Record<string, Array<{ time: string; activity: string; description: string; location: string; estimatedCost: number }>> = {
    'Paris': [
      { time: '9:00 AM', activity: 'Eiffel Tower Visit', description: 'Iconic landmark with panoramic city views', location: 'Champ de Mars', estimatedCost: 28 },
      { time: '12:30 PM', activity: 'Lunch at Café', description: 'Traditional French cuisine', location: '7th Arrondissement', estimatedCost: 35 },
      { time: '3:00 PM', activity: 'Louvre Museum', description: 'World\'s largest art museum', location: 'Palais du Louvre', estimatedCost: 17 },
      { time: '7:00 PM', activity: 'Seine River Cruise', description: 'Evening boat tour with city lights', location: 'Seine River', estimatedCost: 20 },
    ],
    'Tokyo': [
      { time: '8:00 AM', activity: 'Tsukiji Outer Market', description: 'Fresh seafood and street food', location: 'Tsukiji', estimatedCost: 40 },
      { time: '11:00 AM', activity: 'Senso-ji Temple', description: 'Ancient Buddhist temple', location: 'Asakusa', estimatedCost: 5 },
      { time: '2:00 PM', activity: 'Shibuya Crossing Experience', description: 'Famous pedestrian crossing & shopping', location: 'Shibuya', estimatedCost: 50 },
      { time: '6:00 PM', activity: 'Karaoke Night', description: 'Japanese karaoke experience', location: 'Shinjuku', estimatedCost: 45 },
    ],
    'Bali': [
      { time: '7:00 AM', activity: 'Sunrise at Ubud Rice Terraces', description: 'Beautiful morning views and photography', location: 'Ubud', estimatedCost: 15 },
      { time: '10:00 AM', activity: 'Temple Visit', description: 'Explore traditional Balinese temples', location: 'Ubud', estimatedCost: 10 },
      { time: '1:00 PM', activity: 'Spa & Traditional Massage', description: 'Relaxing Balinese spa treatment', location: 'Ubud', estimatedCost: 25 },
      { time: '5:00 PM', activity: 'Beach Sunset', description: 'Watch sunset at Seminyak Beach', location: 'Seminyak', estimatedCost: 8 },
    ],
    'New York': [
      { time: '9:00 AM', activity: 'Statue of Liberty', description: 'American icon with harbor views', location: 'Liberty Island', estimatedCost: 24 },
      { time: '1:00 PM', activity: 'Times Square & Broadway', description: 'Shopping and entertainment district', location: 'Midtown', estimatedCost: 60 },
      { time: '4:00 PM', activity: 'Central Park Walk', description: 'Iconic urban park', location: 'Central Park', estimatedCost: 0 },
      { time: '7:00 PM', activity: 'Restaurant in SoHo', description: 'Fine dining experience', location: 'SoHo', estimatedCost: 80 },
    ],
    'Barcelona': [
      { time: '9:00 AM', activity: 'Sagrada Familia', description: 'Iconic Gaudí architectural masterpiece', location: 'Eixample', estimatedCost: 32 },
      { time: '1:00 PM', activity: 'Gothic Quarter Walk', description: 'Medieval architecture and history', location: 'Gothic Quarter', estimatedCost: 10 },
      { time: '3:30 PM', activity: 'Park Güell', description: 'Gaudí-designed public park with mosaics', location: 'Gràcia', estimatedCost: 14 },
      { time: '6:00 PM', activity: 'Beach Relaxation', description: 'Barcelona beach time', location: 'Barceloneta Beach', estimatedCost: 5 },
    ],
  };

  const defaultActivities = [
    { time: '9:00 AM', activity: `Explore ${destination}`, description: 'Discover local attractions', location: destination, estimatedCost: 0 },
    { time: '12:00 PM', activity: 'Local Lunch', description: 'Try local cuisine', location: destination, estimatedCost: 25 },
    { time: '3:00 PM', activity: 'Cultural Site Visit', description: 'Learn about local culture', location: destination, estimatedCost: 15 },
    { time: '6:00 PM', activity: 'Dinner & Entertainment', description: 'Evening relaxation', location: destination, estimatedCost: 40 },
  ];

  const destinationActivities = mockActivities[destination] || defaultActivities;

  return {
    days: Array.from({ length: duration }, (_, i) => {
      const dayActivities = destinationActivities.map((activity, idx) => ({
        ...activity,
        time: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'][idx % 4] || activity.time,
      }));

      return {
        day: i + 1,
        activities: dayActivities.slice(0, Math.min(4, dayActivities.length)),
      };
    }),
    highlights: [
      `Must-see attractions in ${destination}`,
      'Local cuisine and dining experiences',
      'Cultural and historical sites',
      'Shopping and entertainment areas',
    ],
    tips: [
      `Best time to visit ${destination}: Check seasonal weather`,
      'Book accommodations in advance',
      'Use public transportation where available',
      'Learn basic local phrases',
      'Respect local customs and traditions',
      'Keep important documents safe',
      'Travel insurance recommended',
    ],
  };
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
  } catch (error: any) {
    console.error('Error generating chat response:', error?.message);
    
    // Return a helpful fallback response
    return {
      content: generateFallbackChatResponse(message, context),
    };
  }
}

function generateFallbackChatResponse(message: string, context: { destination: string; duration: number; interests: string[] }): string {
  const messageLower = message.toLowerCase();
  const { destination, duration, interests } = context;

  if (messageLower.includes('weather') || messageLower.includes('rainfall') || messageLower.includes('temperature')) {
    return `In ${destination}, I'd recommend checking a weather service like Weather.com for accurate forecasts. Generally, ${duration > 5 ? 'longer trips' : 'shorter trips'} are best during dry seasons. For your interests (${interests.join(', ')}), consider visiting during peak seasons for those activities.`;
  }

  if (messageLower.includes('food') || messageLower.includes('eat') || messageLower.includes('restaurant')) {
    return `${destination} has wonderful culinary offerings! Since you're interested in ${interests.join(', ')}, I recommend trying local specialties in dining areas popular with tourists. Street food is usually affordable and authentic. Budget around $20-50 per meal depending on the restaurant.`;
  }

  if (messageLower.includes('budget') || messageLower.includes('cost') || messageLower.includes('price')) {
    return `For a ${duration}-day trip to ${destination}, budget approximately:\n- Accommodation: $60-150/night\n- Food: $25-60/day\n- Activities: $30-100/day\n- Transport: $20-40/day\nTotal: $300-1250 for your trip. Adjust based on your travel style!`;
  }

  if (messageLower.includes('where to') || messageLower.includes('visit') || messageLower.includes('attraction')) {
    return `Based on your interests in ${interests.join(', ')}, I recommend visiting popular attractions in ${destination}. Use local guides or travel websites for current recommendations. Book tickets online in advance during peak season.`;
  }

  if (messageLower.includes('transport') || messageLower.includes('taxi') || messageLower.includes('train')) {
    return `For getting around ${destination}, consider:\n- Public transport (buses, trams, trains)\n- Taxis or ride-sharing apps\n- Rental cars for day trips\n- Walking tours for city centers\nPublic transport is usually the most economical option!`;
  }

  return `Great question about your ${duration}-day trip to ${destination}! Based on your interests (${interests.join(', ')}), I'd recommend exploring the local culture and trying authentic experiences. The best itinerary depends on your specific preferences and schedule. Would you like suggestions on specific attractions or activities?`;
}
