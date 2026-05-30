'use client';
import dynamic from 'next/dynamic';
import { MapContainer } from 'react-leaflet/MapContainer';
const MapView = dynamic(() => import('./MapView'), { ssr: false });

interface Activity {
  time: string;
  activity: string;
  description: string;
  cost_inr: number;
}

interface Day {
  day: number;
  city: string;
  lat: number;
  lng: number;
  theme: string;
  activities: Activity[];
  accommodation: { name: string; cost_inr: number };
}

interface Itinerary {
  transport_to_destination: { description: string; estimated_cost_inr: number };
  days: Day[];
  budget_breakdown: {
    flights_inr: number;
    accommodation_inr: number;
    activities_inr: number;
    food_inr: number;
    transport_inr: number;
    total_inr: number;
  };
}

export default function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}>
          Your Itinerary
        </h2>
        <p className="text-sm" style={{ color: '#9aa3b8' }}>
          A perfect plan crafted just for you
        </p>
      </div>

      <div className="p-4 rounded-2xl" style={{ backgroundColor: '#131929', border: '1px solid #c9a84c22' }}>
        <p className="text-xs mb-1" style={{ color: '#c9a84c' }}>GETTING THERE</p>
        <p className="text-sm" style={{ color: '#e2e8f0' }}>{itinerary.transport_to_destination.description}</p>
          <div className="flex items-center gap-2 mt-2">
          <span className="text-xs" style={{ color: '#4a5568' }}>
            Estimated: ₹{itinerary.transport_to_destination.estimated_cost_inr.toLocaleString()}
          </span>
          <span style={{ color: '#4a5568' }}>·</span>
          <a
            href="https://www.google.com/flights"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs"
            style={{ color: '#c9a84c' }}
          >
            Check live prices →
          </a>
        </div>
      </div>

      {/* MapContainer was duplicated here and referenced an undefined `center`. MapView handles the map below. Removed the erroneous block. */}

      {/* Map */}
<div style={{ 
  height: '300px', 
  width: '100%',
  marginBottom: '2rem', 
  borderRadius: '16px', 
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0
}}>
  <MapView
    pins={itinerary.days.map((d) => ({
      city: d.city,
      day: d.day,
      theme: d.theme,
      lat: d.lat,
      lng: d.lng,
    }))}
  />
</div>

      {itinerary.days.map((day) => (
        <div key={day.day} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#131929', border: '1px solid #c9a84c22' }}>

          <div className="px-6 py-4" style={{ borderBottom: '1px solid #c9a84c22' }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium" style={{ color: '#c9a84c' }}>DAY {day.day}</span>
                <h3 className="text-xl font-bold" style={{ color: '#e2e8f0', fontFamily: 'Playfair Display, serif' }}>
                  {day.city}
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#c9a84c22', color: '#c9a84c' }}>
                {day.theme}
              </span>
            </div>
          </div>

          <div className="px-6 py-4 space-y-4">
            {day.activities.map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-20 shrink-0">
                  <span className="text-xs font-medium" style={{ color: '#c9a84c' }}>{activity.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={{ color: '#e2e8f0' }}>{activity.activity}</p>
                  <p className="text-xs" style={{ color: '#9aa3b8' }}>{activity.description}</p>
                </div>
                <div className="shrink-0 text-xs" style={{ color: '#4a5568' }}>
                  ₹{activity.cost_inr.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #c9a84c11', backgroundColor: '#0a0f1e44' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">🏨</span>
              <span className="text-xs" style={{ color: '#9aa3b8' }}>{day.accommodation.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: '#4a5568' }}>₹{day.accommodation.cost_inr.toLocaleString()}/night</span>
              <a
                href="https://www.booking.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: '#c9a84c22', color: '#c9a84c' }}
              >
                Check live price →
              </a>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: '#131929', border: '1px solid #c9a84c22' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}>
          Budget Breakdown
        </h3>
        {[
          { label: 'Flights', value: itinerary.budget_breakdown.flights_inr },
          { label: 'Accommodation', value: itinerary.budget_breakdown.accommodation_inr },
          { label: 'Activities', value: itinerary.budget_breakdown.activities_inr },
          { label: 'Food', value: itinerary.budget_breakdown.food_inr },
          { label: 'Local Transport', value: itinerary.budget_breakdown.transport_inr },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#9aa3b8' }}>{item.label}</span>
            <span className="text-sm" style={{ color: '#e2e8f0' }}>₹{item.value.toLocaleString()}</span>
          </div>
        ))}
        <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #c9a84c44' }}>
          <span className="text-sm font-bold" style={{ color: '#c9a84c' }}>Total Estimate</span>
          <span className="text-lg font-bold" style={{ color: '#c9a84c' }}>
            ₹{itinerary.budget_breakdown.total_inr.toLocaleString()}
          </span>
        </div>
      </div>

    </div>
  );
}