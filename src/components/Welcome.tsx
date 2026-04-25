import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Sparkles, Navigation, ChevronLeft } from 'lucide-react';

export default function Welcome({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Map className="w-16 h-16 text-indigo-400" />,
      title: "اكتشف مدينتك بذكاء",
      desc: "نربط اهتماماتك بالفعاليات والأماكن المخبأة حولك عبر خريطة تفاعلية حية."
    },
    {
      icon: <Sparkles className="w-16 h-16 text-amber-400" />,
      title: "توصيات فائقة الدقة",
      desc: "مساعدك الذكي يقرأ السوشيال ميديا ويصطاد لك أفضل الخصومات والافتتاحات الجديدة حصرياً."
    },
    {
      icon: <Navigation className="w-16 h-16 text-emerald-400" />,
      title: "اجمع النقاط واستمتع",
      desc: "كل اكتشاف ومشاركة تمنحك نقاطاً يمكنك استبدالها بمكافآت حقيقية."
    }
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden relative text-white items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-slate-900 pointer-events-none" />
      
      <div className="absolute top-1/4 left-1/3 w-64 h-48 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-64 bg-amber-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 w-full max-w-md flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center"
          >
            <div className="glass w-32 h-32 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
              {steps[step].icon}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{steps[step].title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed px-4">
              {steps[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full pb-8 z-10 relative">
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700'}`}
            />
          ))}
        </div>

        <button 
          onClick={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else onNext();
          }}
          className="w-full glass bg-indigo-600/30 hover:bg-indigo-600/50 border-indigo-500/50 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
        >
          {step < steps.length - 1 ? 'التالي' : 'ابدأ التسجيل'}
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
