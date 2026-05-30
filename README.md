# RYOKO ✈️

An AI-powered conversational travel planner that turns your travel ideas into complete day-by-day itineraries.

## What it does

RYOKO feels like talking to a well-traveled friend. Instead of filling out forms, you just describe what you want - and RYOKO figures out the rest.

**The flow:**
1. **Chat** - Tell RYOKO where you want to go, your budget, duration, and vibe in plain language
2. **Discover** - Browse city tiles with real photos, attractions, and local tips. RYOKO also recommends the optimal route for your trip
3. **Plan** - Get a complete day-by-day itinerary with activities, accommodation, transport, and a full budget breakdown
4. **Explore** - View your route on an interactive map with numbered stops

## Features

- 🗣️ Natural language trip planning - no forms, no dropdowns
- 🏙️ City discovery with real travel photos via Pexels
- 🗺️ Interactive map with numbered day markers and route lines
- 💰 Budget breakdown with live price links to Google Flights and Booking.com
- ✨ Smart route recommendations based on your trip type
- 🌍 Works for any destination worldwide

## Tech Stack

- **Framework** - Next.js 14+ with App Router
- **Styling** - Tailwind CSS
- **AI** - Groq API (Llama 3.3 70B)
- **Maps** - Leaflet.js + OpenStreetMap
- **Images** - Pexels API
- **Deployment** - Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Groq API key - [console.groq.com](https://console.groq.com)
- Pexels API key - [pexels.com/api](https://www.pexels.com/api)

### Installation

```bash
git clone https://github.com/Mithil-Saxena/RYOKO.git
cd ryoko
npm install
```

Create a `.env.local` file in the root:
GROQ_API_KEY=your_groq_key_here
PEXELS_API_KEY=your_pexels_key_here

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Live Demo

[ryoko-virid.vercel.app](https://ryoko-virid.vercel.app)

## Project Structure
ryoko/
├── app/
│   ├── page.tsx              # Landing page with rotating prompts
│   ├── chat/page.tsx         # Main split-view chat + output
│   └── api/
│       ├── chat/route.ts     # Groq conversation handler
│       ├── cities/route.ts   # City suggestions + images
│       └── itinerary/route.ts # Full itinerary generator
├── components/
│   ├── CityTile.tsx          # City card with image and attractions
│   ├── CityDetail.tsx        # Full city detail overlay
│   ├── ItineraryView.tsx     # Day-by-day itinerary renderer
│   └── MapView.tsx           # Leaflet map with numbered pins
└── lib/
├── gemini.ts             # AI client setup
└── pexels.ts             # Image fetcher


## Built By

Mithil Saxena — [GitHub](https://github.com/Mithil-Saxena)
