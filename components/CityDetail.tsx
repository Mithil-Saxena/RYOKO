import Image from 'next/image';

interface City {
  name: string;
  overview: string;
  attractions: string[];
  best_time: string;
  daily_cost_inr: number;
  most_visited: boolean;
  image: string;
}

interface CityDetailProps {
  city: City;
  onClose: () => void;
}

export default function CityDetail({ city, onClose }: CityDetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: '#0a0f1e' }}
    >
      {/* Hero Image */}
      <div className="relative h-72 w-full">
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, #0a0f1e 100%)' }}
        />

        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: '#0a0f1eaa', color: '#c9a84c', border: '1px solid #c9a84c44' }}
        >
          ← Back
        </button>

        {/* City name over image */}
        <div className="absolute bottom-6 left-8">
          <h1
            className="text-4xl font-bold"
            style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}
          >
            {city.name}
          </h1>
          {city.most_visited && (
            <span
              className="text-xs px-2 py-1 rounded-full mt-2 inline-block"
              style={{ backgroundColor: '#c9a84c', color: '#0a0f1e' }}
            >
              Most Visited
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">

        {/* Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#c9a84c' }}>Overview</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#9aa3b8' }}>{city.overview}</p>
        </div>

        {/* Attractions */}
        <div>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#c9a84c' }}>Top Attractions</h2>
          <ul className="space-y-2">
            {city.attractions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#e2e8f0' }}>
                <span style={{ color: '#c9a84c' }}>✦</span> {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#131929' }}
          >
            <p className="text-xs mb-1" style={{ color: '#4a5568' }}>Best Time to Visit</p>
            <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{city.best_time}</p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#131929' }}
          >
            <p className="text-xs mb-1" style={{ color: '#4a5568' }}>Estimated Daily Cost</p>
            <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>₹{city.daily_cost_inr.toLocaleString()}/day</p>
          </div>
        </div>

        <p className="text-xs" style={{ color: '#4a5568' }}>via Lonely Planet</p>
      </div>
    </div>
  );
}