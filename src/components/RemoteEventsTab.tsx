import { EventItem } from '../types';
import { Globe, Users, MonitorPlay, ExternalLink } from 'lucide-react';

export default function RemoteEventsTab({ events }: { events: EventItem[] }) {
  const remoteEvents = events.filter(e => e.isRemote);

  return (
    <div className="h-full bg-transparent overflow-y-auto pb-24 p-5">
      <div className="mb-6 glass -mx-5 -mt-5 p-8 rounded-b-3xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Globe className="w-48 h-48 -mr-10 -mt-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2 relative z-10">الأحداث عن بُعد</h2>
        <p className="text-indigo-200 text-sm max-w-[250px] relative z-10">
          ندوات، بطولات إلكترونية، وعروض حية يمكنك حضورها من أي مكان في العالم.
        </p>
      </div>

      <div className="space-y-4">
        {remoteEvents.length > 0 ? (
          remoteEvents.map((event, index) => (
            <div key={`${event.id}-${index}`} className="glass rounded-3xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 p-2 rounded-xl">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                  أونلاين
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-white mb-1">{event.title}</h3>
              <p className="text-sm text-slate-400 mb-3">{event.time}</p>
              
              <div className="bg-white/5 p-3 rounded-xl mb-4 border border-white/10 text-sm text-slate-300">
                {event.aiSummary}
              </div>
              
              <a 
                href={event.sourceUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 glass hover:bg-white/10 text-indigo-300 hover:text-indigo-200 py-2.5 rounded-xl font-bold transition-colors"
              >
                انضم للحدث
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-300 mb-2">لا توجد أحداث عن بُعد حالياً</h3>
            <p className="text-slate-500 text-sm max-w-[250px]">الذكاء الاصطناعي الخاص بنا يبحث باستمرار عن فعاليات جديدة تناسبك.</p>
          </div>
        )}
      </div>
    </div>
  );
}
