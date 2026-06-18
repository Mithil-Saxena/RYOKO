'use client';
import CityTile from '@/components/CityTile';
import CityDetail from '@/components/CityDetail';
import ItineraryView from '@/components/ItineraryView';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface City {
  name: string;
  overview: string;
  attractions: string[];
  best_time: string;
  daily_cost_inr: number;
  most_visited: boolean;
  image: string;
}

interface Itinerary {
  transport_to_destination: { description: string; estimated_cost_inr: number };
  days: {
    day: number;
    city: string;
    lat: number;
    lng: number;
    theme: string;
    activities: { time: string; activity: string; description: string; cost_inr: number }[];
    accommodation: { name: string; cost_inr: number };
  }[];
  budget_breakdown: {
    flights_inr: number;
    accommodation_inr: number;
    activities_inr: number;
    food_inr: number;
    transport_inr: number;
    total_inr: number;
  };
}

function ChatContent() {
  const [stage, setStage] = useState<'chat' | 'cities' | 'itinerary'>('chat');
  const [tripDetails, setTripDetails] = useState<null | {
    origin: string;
    destination: string;
    budget_inr: number;
    duration_days: number;
    vibe: string;
    occasion: string;
  }>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCityDetail, setSelectedCityDetail] = useState<City | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [recommendedRoute, setRecommendedRoute] = useState<string[]>([]);
  const [routeReason, setRouteReason] = useState('');
  const searchParams = useSearchParams();

  const sendToGemini = async (msgs: { role: string; content: string }[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
      });
      const data = await res.json();
      const reply = data.reply;
      try {
        const cleaned = reply.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.complete === true) {
          setTripDetails(parsed);
          setStage('cities');
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: `Perfect! Let me show you the best cities to visit in ${parsed.destination}. 🌍`
          }]);
          return;
        }
      } catch {
        // not JSON
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      const initial = { role: 'user', content: q };
      setMessages([initial]);
      sendToGemini([initial]);
    }
  }, []);

  useEffect(() => {
    if (stage === 'cities' && tripDetails) {
      setLoadingCities(true);
      fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: tripDetails.destination,
          occasion: tripDetails.occasion,
          vibe: tripDetails.vibe,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCities(data.cities);
          setRecommendedRoute(data.recommended_route || []);
          setRouteReason(data.route_reason || '');
        })
        .finally(() => setLoadingCities(false));
    }
  }, [stage, tripDetails]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    await sendToGemini(updatedMessages);
  };

  const generateItinerary = async () => {
    if (!tripDetails) return;
    setLoadingItinerary(true);
    setStage('itinerary');
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tripDetails, selectedCities }),
      });
      const data = await res.json();
      setItinerary(data.itinerary);
    } finally {
      setLoadingItinerary(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0a0f1e' }}>

      {/* Left Panel — Chat */}
      <div className="w-[35%] flex flex-col border-r" style={{ borderColor: '#c9a84c22' }}>

        <div className="p-6 border-b" style={{ borderColor: '#c9a84c22' }}>
          <h1 className="text-2xl font-bold tracking-widest" style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}>
            RYOKO
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-center mt-8" style={{ color: '#4a5568' }}>
              Your journey starts here...
            </p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="px-4 py-2 rounded-2xl max-w-[80%] text-sm"
                style={{
                  backgroundColor: msg.role === 'user' ? '#c9a84c' : '#131929',
                  color: msg.role === 'user' ? '#0a0f1e' : '#e2e8f0',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl text-sm" style={{ backgroundColor: '#131929', color: '#4a5568' }}>
                RYOKO is thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t" style={{ borderColor: '#c9a84c22' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tell me your plans..."
              className="flex-1 px-4 py-2 rounded-full text-sm text-white outline-none"
              style={{ backgroundColor: '#131929', border: '1px solid #c9a84c44' }}
              disabled={loading}
              autoFocus
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: loading ? '#4a5568' : '#c9a84c', color: '#0a0f1e' }}
            >
              Send
            </button>
          </div>
        </div>

      </div>

      {/* Right Panel — Output */}
      <div className="w-[65%] overflow-y-auto p-8">

        {stage === 'chat' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <p className="text-4xl">✈️</p>
              <p className="text-sm" style={{ color: '#4a5568' }}>
                Your travel plan will appear here...
              </p>
            </div>
          </div>
        )}

        {stage === 'cities' && tripDetails && (
          <div>
            <div className="flex gap-4 mb-6 text-sm flex-wrap" style={{ color: '#9aa3b8' }}>
              <span>📍 {tripDetails.origin} → {tripDetails.destination}</span>
              <span>📅 {tripDetails.duration_days} days</span>
              <span>💰 ₹{tripDetails.budget_inr.toLocaleString()}</span>
              <span>✨ {tripDetails.vibe}</span>
            </div>

            <h2 className="text-2xl font-bold mb-6" style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}>
              Choose your cities
            </h2>

            {recommendedRoute.length > 0 && (
              <div
                className="mb-6 p-4 rounded-2xl cursor-pointer"
                style={{ backgroundColor: '#c9a84c11', border: '1px solid #c9a84c44' }}
                onClick={() => setSelectedCities(recommendedRoute)}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium" style={{ color: '#c9a84c' }}>✨ RYOKO RECOMMENDS</p>
                  <button
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ backgroundColor: '#c9a84c', color: '#0a0f1e' }}
                  >
                    Use this route
                  </button>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: '#e2e8f0' }}>
                  {recommendedRoute.join(' → ')}
                </p>
                <p className="text-xs" style={{ color: '#9aa3b8' }}>{routeReason}</p>
              </div>
            )}

            {loadingCities ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ backgroundColor: '#131929' }} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {cities.map((city) => (
                  <CityTile
                    key={city.name}
                    city={city}
                    selected={selectedCities.includes(city.name)}
                    onToggle={() => {
                      setSelectedCities((prev) =>
                        prev.includes(city.name)
                          ? prev.filter((c) => c !== city.name)
                          : [...prev, city.name]
                      );
                    }}
                    onClick={() => setSelectedCityDetail(city)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {stage === 'itinerary' && (
          <div>
            {loadingItinerary ? (
              <div className="flex items-center justify-center" style={{ height: '60vh' }}>
                <div className="text-center space-y-3">
                  <p className="text-4xl">⏳</p>
                  <p className="text-sm" style={{ color: '#9aa3b8' }}>
                    Building your perfect itinerary...
                  </p>
                </div>
              </div>
            ) : itinerary ? (
              <ItineraryView itinerary={itinerary} />
            ) : (
              <p className="text-sm" style={{ color: '#4a5568' }}>
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        )}

      </div>

      {/* Plan My Trip Button */}
      {selectedCities.length > 0 && stage === 'cities' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={generateItinerary}
            className="px-8 py-4 rounded-full font-medium text-sm transition-all duration-300"
            style={{
              backgroundColor: '#c9a84c',
              color: '#0a0f1e',
              boxShadow: '0 0 40px #c9a84c66, 0 0 80px #c9a84c33',
            }}
            onMouseMove={(e) => {
              const btn = e.currentTarget;
              const rect = btn.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              btn.style.boxShadow = `${x / 5}px ${y / 5}px 40px #c9a84c88, 0 0 80px #c9a84c44, 0 0 120px #c9a84c22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px #c9a84c66, 0 0 80px #c9a84c33';
            }}
          >
            ✨ Plan My Trip ({selectedCities.length} {selectedCities.length === 1 ? 'city' : 'cities'}) →
          </button>
        </div>
      )}

      {/* City Detail Overlay */}
      {selectedCityDetail && (
        <CityDetail
          city={selectedCityDetail}
          onClose={() => setSelectedCityDetail(null)}
        />
      )}

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}