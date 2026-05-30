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

interface CityTileProps {
  city: City;
  selected: boolean;
  onToggle: () => void;
  onClick: () => void;
}

export default function CityTile({ city, selected, onToggle, onClick }: CityTileProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        border: selected ? '2px solid #c9a84c' : '2px solid transparent',
        backgroundColor: '#131929',
      }}
    >
      {/* Image */}
      <div className="relative h-48 w-full" onClick={onClick}>
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover"
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, #131929 100%)' }} />
        
        {/* Most visited badge */}
        {city.most_visited && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#c9a84c', color: '#0a0f1e' }}>
            Most Visited
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold" style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}>
            {city.name}
          </h3>
          {/* Select toggle */}
          <button
            onClick={onToggle}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: '#c9a84c',
              backgroundColor: selected ? '#c9a84c' : 'transparent',
            }}
          >
            {selected && <span style={{ color: '#0a0f1e', fontSize: '12px' }}>✓</span>}
          </button>
        </div>

        <p className="text-xs mb-3" style={{ color: '#9aa3b8' }}>{city.overview}</p>

        <ul className="space-y-1 mb-3">
          {city.attractions.map((a, i) => (
            <li key={i} className="text-xs flex items-start gap-1" style={{ color: '#e2e8f0' }}>
              <span style={{ color: '#c9a84c' }}>•</span> {a}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between text-xs" style={{ color: '#4a5568' }}>
          <span>🕐 {city.best_time}</span>
          <span>~₹{city.daily_cost_inr.toLocaleString()}/day</span>
        </div>

        <p className="text-xs mt-2" style={{ color: '#4a5568' }}>via Lonely Planet</p>
      </div>
    </div>
  );
}