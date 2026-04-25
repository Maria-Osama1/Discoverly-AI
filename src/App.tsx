import { useState, ReactNode } from 'react';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import OnboardingChat from './components/OnboardingChat';
import MapTab from './components/MapTab';
import ExploreTab from './components/ExploreTab';
import RemoteEventsTab from './components/RemoteEventsTab';
import RewardsTab from './components/RewardsTab';
import ScannerTab from './components/ScannerTab';
import ProfileTab from './components/ProfileTab';
import { mockEvents } from './data/mockEvents';
import { Interest, EventItem } from './types';
import { generateRecommendations } from './lib/gemini';
import { Map, Compass, MonitorPlay, Gift, Sparkles, User } from 'lucide-react';

type AppState = 'welcome' | 'auth' | 'chat' | 'main';
type Tab = 'map' | 'explore' | 'remote' | 'scanner' | 'rewards' | 'profile';

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [userLocation, setUserLocation] = useState<[number, number]>([24.1500, 47.3000]);
  const [events, setEvents] = useState<EventItem[]>(mockEvents);

  const [isGenerating, setIsGenerating] = useState(false);

  const fetchPersonalizedEvents = async (interests: Interest[], loc: [number, number]) => {
    try {
      setIsGenerating(true);
      const data = await generateRecommendations(interests, loc);
      if (data.events && data.events.length > 0) {
        // Add random IDs to AI generated events
        const newEvents = data.events.map((e: any) => ({
          ...e,
          id: 'gen-' + Math.random().toString(36).substr(2, 9)
        }));
        setEvents(prev => [...prev, ...newEvents]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOnboardingComplete = async (interests: Interest[]) => {
    setUserInterests(interests);
    
    // Pass interests for filtering or personalized features if needed
    // You can access userInterests state in the main view
    
    const finalize = (loc: [number, number]) => {
      fetchPersonalizedEvents(interests, loc);
      setAppState('main');
    };

    // Request accurate location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(newLoc);
          finalize(newLoc);
        },
        (err) => {
          console.error("Geolocation error:", err);
          finalize(userLocation); // Proceed anyway with default location
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      finalize(userLocation);
    }
  };

  const handleExtractEvent = (newEvent: EventItem) => {
    setEvents(prev => [...prev, newEvent]);
    setActiveTab('map');
  };

  if (appState === 'welcome') {
    return <Welcome onNext={() => setAppState('auth')} />;
  }

  if (appState === 'auth') {
    return <Auth onComplete={() => setAppState('chat')} />;
  }

  if (appState === 'chat') {
    return <OnboardingChat onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden relative text-slate-100">
      
      {/* Sidebar Navigation for Desktop */}
      <div className="hidden md:flex flex-col w-24 glass border-l border-white/10 z-[100] py-6 shrink-0">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-8 text-white shadow-lg shadow-indigo-600/30">
          D
        </div>
        <div className="flex flex-col gap-6 items-center">
          <NavItem 
            icon={<Map size={24} />} 
            label="الخريطة" 
            isActive={activeTab === 'map'} 
            onClick={() => setActiveTab('map')} 
            isDesktop
          />
          <NavItem 
            icon={<Compass size={24} />} 
            label="اكتشف" 
            isActive={activeTab === 'explore'} 
            onClick={() => setActiveTab('explore')} 
            isDesktop
          />
          <NavItem 
            icon={<Sparkles size={24} />} 
            label="الماسح" 
            isActive={activeTab === 'scanner'} 
            onClick={() => setActiveTab('scanner')} 
            isDesktop
          />
          <NavItem 
            icon={<MonitorPlay size={24} />} 
            label="عن بُعد" 
            isActive={activeTab === 'remote'} 
            onClick={() => setActiveTab('remote')} 
            isDesktop
          />
          <NavItem 
            icon={<Gift size={24} />} 
            label="مكافآت" 
            isActive={activeTab === 'rewards'} 
            onClick={() => setActiveTab('rewards')} 
            isDesktop
          />
          <NavItem 
            icon={<User size={24} />} 
            label="حسابي" 
            isActive={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            isDesktop
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative text-slate-100 pb-[72px] md:pb-0">
          {isGenerating && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[200] bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">الوكيل الذكي يحلل اهتماماتك لجلب أفضل الأماكن...</span>
            </div>
          )}
          {activeTab === 'map' && <MapTab events={events} userLocation={userLocation} userInterests={userInterests} />}
          {activeTab === 'explore' && <ExploreTab events={events} />}
          {activeTab === 'scanner' && <ScannerTab onExtract={handleExtractEvent} />}
          {activeTab === 'remote' && <RemoteEventsTab events={events} />}
          {activeTab === 'rewards' && <RewardsTab />}
          {activeTab === 'profile' && <ProfileTab interests={userInterests} onUpdateInterests={(ni) => setUserInterests(ni)} />}
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="md:hidden glass border-t border-white/10 pb-safe z-[100] absolute bottom-0 left-0 right-0">
          <div className="flex justify-around items-center p-3">
            <NavItem 
              icon={<Map size={24} />} 
              label="الخريطة" 
              isActive={activeTab === 'map'} 
              onClick={() => setActiveTab('map')} 
            />
            <NavItem 
              icon={<Compass size={24} />} 
              label="اكتشف" 
              isActive={activeTab === 'explore'} 
              onClick={() => setActiveTab('explore')} 
            />
            <NavItem 
              icon={<Sparkles size={24} />} 
              label="الماسح" 
              isActive={activeTab === 'scanner'} 
              onClick={() => setActiveTab('scanner')} 
            />
            <NavItem 
              icon={<MonitorPlay size={24} />} 
              label="عن بُعد" 
              isActive={activeTab === 'remote'} 
              onClick={() => setActiveTab('remote')} 
            />
            <NavItem 
              icon={<Gift size={24} />} 
              label="مكافآت" 
              isActive={activeTab === 'rewards'} 
              onClick={() => setActiveTab('rewards')} 
            />
            <NavItem 
              icon={<User size={24} />} 
              label="حسابي" 
              isActive={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, isDesktop }: { icon: ReactNode, label: string, isActive: boolean, onClick: () => void, isDesktop?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${isDesktop ? 'w-full' : 'w-14'} ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
    >
      <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-500/20 shadow-inner' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className="text-[10px] md:text-[11px] font-bold">{label}</span>
    </button>
  );
}
