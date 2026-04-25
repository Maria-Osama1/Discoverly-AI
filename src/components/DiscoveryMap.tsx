/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, Navigation, Search } from 'lucide-react';
import { EventItem, Interest } from '../types';
import EventCard from './EventCard';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DiscoveryMapProps {
  events: EventItem[];
  userInterests: Interest[];
  onAddEvent: (text: string) => void;
}

export default function DiscoveryMap({ events, userInterests, onAddEvent }: DiscoveryMapProps) {
  const [userPos, setUserPos] = useState<[number, number]>([24.6644, 46.7303]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  const normalizedUserInterests = userInterests.map(i => i.toLowerCase());
  const filteredEvents = events.filter(e => {
    const matchesInterest = userInterests.length === 0 || (e.tags && e.tags.some(t => normalizedUserInterests.includes(t.toLowerCase())));
    const matchesSearch = searchQuery === '' || 
           (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (e.locationName && e.locationName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesInterest && matchesSearch;
  });

  return (
    <div className="relative w-full h-full bg-slate-200">
      <MapContainer center={userPos} zoom={13} scrollWheelZoom={true} className="z-0 h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredEvents.map((event) => (
          <Marker 
            key={event.id} 
            position={event.coordinates}
            eventHandlers={{
              click: () => setSelectedEvent(event),
            }}
          />
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button className="p-3 bg-white rounded-2xl shadow-xl hover:bg-slate-50 transition-colors border border-slate-100 group">
          <Layers className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
        </button>
        <button className="p-3 bg-white rounded-2xl shadow-xl hover:bg-slate-50 transition-colors border border-slate-100 group">
          <Navigation className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
        </button>
      </div>

      {/* Floating Search Hub */}
      <div className="absolute top-4 left-4 right-16 z-10 lg:left-4 lg:right-auto lg:w-96">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for vibes, coffee, or events..."
            className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>
      
      {selectedEvent && (
        <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
