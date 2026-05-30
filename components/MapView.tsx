'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapPin {
  city: string;
  day: number;
  theme: string;
  lat: number;
  lng: number;
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
}

function createNumberedIcon(number: number) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background-color: #c9a84c;
        color: #0a0f1e;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 13px;
        font-family: Inter, sans-serif;
        box-shadow: 0 0 12px #c9a84caa;
        border: 2px solid #fff;
      ">
        <span style="transform: rotate(45deg)">${number}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
  });
}

export default function MapView({ pins }: { pins: MapPin[] }) {
  if (pins.length === 0) return null;

  // deduplicate pins with same coordinates by slightly offsetting them
  const adjustedPins = pins.map((pin, index) => {
    const duplicates = pins.slice(0, index).filter(
      (p) => p.lat === pin.lat && p.lng === pin.lng
    );
    const offset = duplicates.length * 0.008;
    return {
      ...pin,
      lat: pin.lat + offset,
      lng: pin.lng + offset,
    };
  });

  const center: [number, number] = [adjustedPins[0].lat, adjustedPins[0].lng];
  const positions: [number, number][] = adjustedPins.map((p) => [p.lat, p.lng]);

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds positions={positions} />

      <Polyline
  positions={positions}
  pathOptions={{ color: '#000000', weight: 4, opacity: 0.8 }}
/>

      {adjustedPins.map((pin) => (
        <Marker
          key={pin.day}
          position={[pin.lat, pin.lng]}
          icon={createNumberedIcon(pin.day)}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong style={{ color: '#c9a84c' }}>Day {pin.day}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{pin.city}</p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>{pin.theme}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}