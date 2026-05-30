import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, budget_inr, duration_days, vibe, occasion, selectedCities } = await req.json();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a travel expert. Return ONLY valid JSON. No text before or after.`,
        },
        {
          role: 'user',
          content: `Create a detailed ${duration_days}-day ${occasion} trip itinerary.
Origin: ${origin}
Destination: ${destination}
Cities to cover: ${selectedCities.join(', ')}
Budget: ₹${budget_inr}
Vibe: ${vibe}

Return ONLY this JSON:
{
  "transport_to_destination": {
    "description": "how to get from origin to first city",
    "estimated_cost_inr": 0
  },
  "days": [
    {
      "day": 1,
      "city": "city name",
      "lat": 0.0,
      "lng": 0.0,
      "theme": "one line theme for the day",
      "activities": [
        {
          "time": "Morning",
          "activity": "activity name",
          "description": "brief description",
          "cost_inr": 0
        }
      ],
      "accommodation": {
        "name": "hotel/stay name",
        "cost_inr": 0
      }
    }
  ],
  "budget_breakdown": {
    "flights_inr": 0,
    "accommodation_inr": 0,
    "activities_inr": 0,
    "food_inr": 0,
    "transport_inr": 0,
    "total_inr": 0
  }
}`,
        },
      ],
    });

    const raw = response.choices[0].message.content || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const itinerary = JSON.parse(cleaned);

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error('ITINERARY ERROR:', error);
    return NextResponse.json({ itinerary: null }, { status: 500 });
  }
}