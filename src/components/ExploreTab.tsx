import { useState } from 'react';
import { Search, Compass, Activity, Ticket, MapPin, Coffee } from 'lucide-react';
import { EventItem } from '../types';
import { useDebounce } from '../hooks/useDebounce';

export default function ExploreTab({ events }: { events: EventItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredEvents = events.filter(e => {
    // Search query filter (case-insensitive)
    const lowerQuery = debouncedSearchQuery.toLowerCase();
    const matchesSearch = lowerQuery === '' || 
      (e.title && e.title.toLowerCase().includes(lowerQuery)) || 
      (e.locationName && e.locationName.toLowerCase().includes(lowerQuery)) ||
      (e.aiSummary && e.aiSummary.toLowerCase().includes(lowerQuery));

    if (!matchesSearch) return false;

    // Category filter
    if (activeCategory && activeCategory !== 'الكل') {
      if (activeCategory === 'مغامرة') return e.title.includes('رياضة') || e.aiSummary.includes('مغامر') || e.category === 'حدث';
      if (activeCategory === 'ثقافة') return e.title.includes('معرض') || e.aiSummary.includes('ثقاف') || e.category === 'حدث';
      if (activeCategory === 'عروض') return e.category === 'عرض';
      if (activeCategory === 'تذوق') return e.aiSummary.includes('قهوة') || e.title.includes('محمصة') || e.category === 'افتتاح جديد';
    }
    
    return true;
  });

  return (
    <div className="h-full bg-transparent overflow-y-auto pb-24 p-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">اكتشف المزيد</h2>
        <p className="text-slate-400 text-sm">اخرج عن المألوف وجرب أماكن جديدة خارج اهتماماتك المعتادة.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن فعاليات، مدن، أو فئات..." 
          className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => setActiveCategory(activeCategory === 'مغامرة' ? null : 'مغامرة')}
          className={`bg-orange-500/10 border ${activeCategory === 'مغامرة' ? 'border-orange-400' : 'border-orange-500/20'} hover:bg-orange-500/20 transition-all p-4 rounded-3xl flex flex-col items-center justify-center gap-2 aspect-square`}
        >
          <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mb-1">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-bold text-orange-300">مغامرة</span>
        </button>
        <button 
          onClick={() => setActiveCategory(activeCategory === 'ثقافة' ? null : 'ثقافة')}
          className={`bg-blue-500/10 border ${activeCategory === 'ثقافة' ? 'border-blue-400' : 'border-blue-500/20'} hover:bg-blue-500/20 transition-all p-4 rounded-3xl flex flex-col items-center justify-center gap-2 aspect-square`}
        >
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-1">
            <Compass className="w-6 h-6" />
          </div>
          <span className="font-bold text-blue-300">ثقافة ومعارض</span>
        </button>
        <button 
          onClick={() => setActiveCategory(activeCategory === 'عروض' ? null : 'عروض')}
          className={`bg-rose-500/10 border ${activeCategory === 'عروض' ? 'border-rose-400' : 'border-rose-500/20'} hover:bg-rose-500/20 transition-all p-4 rounded-3xl flex flex-col items-center justify-center gap-2 aspect-square`}
        >
          <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-1">
            <Ticket className="w-6 h-6" />
          </div>
          <span className="font-bold text-rose-300">عروض وتسوق</span>
        </button>
        <button 
          onClick={() => setActiveCategory(activeCategory === 'تذوق' ? null : 'تذوق')}
          className={`bg-emerald-500/10 border ${activeCategory === 'تذوق' ? 'border-emerald-400' : 'border-emerald-500/20'} hover:bg-emerald-500/20 transition-all p-4 rounded-3xl flex flex-col items-center justify-center gap-2 aspect-square`}
        >
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-1">
            <Coffee className="w-6 h-6" />
          </div>
          <span className="font-bold text-emerald-300">تذوق</span>
        </button>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 text-white">
          {activeCategory ? `نتائج: ${activeCategory}` : 'فعاليات مقترحة قريباً'}
        </h3>
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.slice(0, 5).map((event, index) => (
              <div 
                key={`${event.id}-${index}`} 
                className={`glass p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden transition-all duration-300 ${
                  event.isPopular 
                    ? "border-orange-500/50 bg-orange-950/20 shadow-[0_0_20px_rgba(249,115,22,0.2)] ring-1 ring-orange-500/30" 
                    : ""
                }`}
              >
                {event.isPopular && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent blur-2xl pointer-events-none" />
                )}
                
                <div className="flex gap-4 items-center relative z-10">
                  <div className="w-16 h-16 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                    {event.category === 'حدث' ? '🎭' : event.category === 'عرض' ? '🏷️' : '✨'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white line-clamp-1">{event.title}</h4>
                      {event.isTrending && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">ترند 📈</span>}
                      {event.isPopular && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/30 whitespace-nowrap">الأكثر زيارة 🔥</span>}
                    </div>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {event.locationName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-indigo-300 bg-indigo-900/40 border border-indigo-500/30 px-2 py-1 rounded-md">
                    {event.time}
                  </span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-emerald-300 bg-emerald-900/40 border border-emerald-500/30 px-2 py-1 rounded-md hover:bg-emerald-800/40"
                  >
                    عرض في الخريطة القطعية
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm text-center p-4">لا توجد فعاليات مطابقة حالياً لهذه الفئة.</p>
          )}
        </div>
      </div>
    </div>
  );
}
