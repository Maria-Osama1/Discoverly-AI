import { Trophy, Star, Gift, ChevronLeft } from 'lucide-react';

export default function RewardsTab() {
  return (
    <div className="h-full bg-transparent overflow-y-auto pb-24 p-5">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-white">المكافآت</h2>
          <p className="text-sm text-slate-400">مرحباً بك في خزنة نقاطك</p>
        </div>
        <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <div className="glass bg-amber-500/10 border-amber-500/30 rounded-3xl p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-20">
          <Star className="w-32 h-32 text-amber-500" />
        </div>
        
        <p className="font-medium text-amber-200 mb-1 relative z-10">رصيدك الحالي</p>
        <div className="flex items-end gap-2 mb-4 relative z-10">
          <h3 className="text-4xl font-extrabold text-amber-400">1,450</h3>
          <span className="mb-1 text-amber-200 font-medium">نقطة احتراف</span>
        </div>
        
        <button className="glass text-amber-400 hover:bg-white/10 font-bold py-2.5 px-5 rounded-xl text-sm relative z-10 transition-colors">
          كيف أجمع نقاط أكثر؟
        </button>
      </div>

      <h3 className="font-bold text-lg text-white mb-4">سوق المكافآت</h3>
      
      <div className="space-y-4">
        {[
          { id: 1, title: 'قهوة مجانية من هاف مليون', points: 500, label: 'متاح للتبديل' },
          { id: 2, title: 'خصم 20% على تذاكر السينما', points: 1200, label: 'متاح للتبديل' },
          { id: 3, title: 'دعوة VIP لمعرض الدرعية', points: 3000, label: 'تحتاج 1550 نقطة' }
        ].map((item, idx) => (
          <div key={item.id} className="glass p-4 rounded-2xl flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${idx === 2 ? 'glass opacity-50' : 'bg-emerald-500/20 border border-emerald-500/30'}`}>
                <Gift className={`w-6 h-6 ${idx === 2 ? 'text-slate-500' : 'text-emerald-400'}`} />
              </div>
              <div>
                <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-400">{item.points} نقطة</span>
                </div>
              </div>
            </div>
            <button className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${idx === 2 ? 'glass' : 'glass hover:bg-white/10'}`}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
