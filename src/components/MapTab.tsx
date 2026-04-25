import { useState, useEffect } from 'react';
import { EventItem, Interest } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Sparkles, MapPin, Navigation, Search, X, Layers } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import EventCard from './EventCard';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom icons for leaflet
const createIcon = (color: string, isPopular?: boolean) => {
  const size = isPopular ? 36 : 24;
  const shadow = isPopular 
    ? `0 0 0 6px rgba(249, 115, 22, 0.2), 0 0 20px ${color}` 
    : '0 4px 6px rgba(0,0,0,0.1)';
    
  return L.divIcon({
    className: 'bg-transparent',
    html: `<div style="
      background-color: ${color}; 
      width: ${size}px; 
      height: ${size}px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    ">
      ${isPopular ? '<span style="font-size: 16px; drop-shadow: 0 1px 1px rgba(0,0,0,0.5);">🔥</span>' : ''}
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

const colors = {
  'حدث': '#8b5cf6', 
  'عرض': '#ec4899', 
  'افتتاح جديد': '#10b981',
  'مكان': '#3b82f6' 
};

function MapUpdater({ center, searchResults }: { center: [number, number], searchResults: EventItem[] }) {
  const map = useMap();
  useEffect(() => {
    if (searchResults.length > 0 && searchResults[0].coordinates) {
      map.setView(searchResults[0].coordinates, 13);
    } else {
      map.setView(center, map.getZoom());
    }
  }, [center, searchResults, map]);
  return null;
}

export default function MapTab({ events, userLocation, userInterests }: { events: EventItem[], userLocation: [number, number], userInterests: Interest[] }) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(0.2);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const normalizedUserInterests = userInterests.map(i => i.toLowerCase());
  
  // Calculate distance helper
  const getDistance = (coord1: [number, number], coord2: [number, number]) => {
    const lat1 = coord1[0], lon1 = coord1[1];
    const lat2 = coord2[0], lon2 = coord2[1];
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
  };

  const localEvents = events
    .filter(e => {
      if (e.isRemote || !Array.isArray(e.coordinates) || e.coordinates.length !== 2) return false;
      
      const matchesInterest = userInterests.length === 0 || (e.tags && e.tags.some(t => normalizedUserInterests.includes(t.toLowerCase())));
      if (!matchesInterest) return false;

      // Distance filter
      if (getDistance(userLocation, e.coordinates) > maxDistance) return false;

      if (debouncedSearchQuery === '') return true;
      
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      return (e.title && e.title.toLowerCase().includes(lowerQuery)) || 
             (e.locationName && e.locationName.toLowerCase().includes(lowerQuery)) ||
             (e.category && e.category.toLowerCase().includes(lowerQuery));
    })
    .sort((a, b) => getDistance(userLocation, a.coordinates) - getDistance(userLocation, b.coordinates));

  return (
    <div className="relative h-full w-full bg-slate-200">
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={userLocation} searchResults={searchQuery !== '' ? localEvents : []} />

        {/* User Location Marker */}
        <Marker position={userLocation} icon={createIcon('#3b82f6')} />

        {/* Event Markers */}
        {localEvents.map((event, index) => (
          <Marker 
            key={`${event.id}-${index}`} 
            position={[
              event.coordinates[0] + (Math.random() - 0.5) * 0.001, 
              event.coordinates[1] + (Math.random() - 0.5) * 0.001
            ]}
            icon={createIcon(colors[event.category as keyof typeof colors] || '#8b5cf6', event.isPopular)}
            eventHandlers={{
              click: () => setSelectedEvent(event)
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
      <div className="absolute top-4 left-4 right-16 z-10 lg:left-4 lg:right-auto lg:w-96 flex flex-col gap-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search for vibes, coffee, or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">المدى</span>
          <input 
            type="range" 
            min="0.01" 
            max="1.0" 
            step="0.01"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
      
      {isScanning && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-[40] glass bg-indigo-600/90 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          الذكاء الاصطناعي يقوم بمسح تويتر وإنستجرام...
        </motion.div>
      )}

      {selectedEvent && (
        <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
