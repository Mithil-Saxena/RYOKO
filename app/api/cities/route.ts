import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { fetchImage } from '@/lib/pexels';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { destination, occasion, vibe } = await req.json();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a travel expert. Return ONLY a JSON object. No text before or after. No markdown.`,
        },
        {
          role: 'user',
          content: `Give me the top 5 cities to visit in ${destination} for a ${occasion} trip with a ${vibe} vibe.

Return ONLY this exact JSON object with no extra text:
{
  "recommended_route": ["City A", "City B", "City C"],
  "route_reason": "one line explaining why this route makes sense",
  "cities": [
    {
      "name": "City Name",
      "overview": "2 sentence description",
      "attractions": ["attraction 1", "attraction 2", "attraction 3"],
      "best_time": "best time to visit",
      "daily_cost_inr": 5000,
      "most_visited": true,
      "pexels_query": "search term for beautiful photo of this city"
    }
  ]
}`,
        },
      ],
    });

    const raw = response.choices[0].message.content || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const cities = parsed.cities || [];
    const recommended_route = parsed.recommended_route || [];
    const route_reason = parsed.route_reason || '';

    const citiesWithImages = await Promise.all(
      cities.map(async (city: { pexels_query: string; [key: string]: unknown }) => ({
        ...city,
        image: await fetchImage(city.pexels_query),
      }))
    );

    return NextResponse.json({ cities: citiesWithImages, recommended_route, route_reason });
  } catch (error) {
    console.error('CITIES ERROR:', error);
    return NextResponse.json({ cities: [], recommended_route: [], route_reason: '' }, { status: 500 });
  }
}