import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Link, CheckCircle, Search, Twitter, Instagram } from 'lucide-react';
import { EventItem } from '../types';
import { extractEventFromText } from '../lib/gemini';

export default function ScannerTab({ onExtract }: { onExtract: (event: EventItem) => void }) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<EventItem | null>(null);

  const handleScan = async () => {
    if (!url) return;
    setIsScanning(true);
    setResult(null);

    try {
      const data = await extractEventFromText(url);
      
      const eventWithId: EventItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        title: data.title || 'حدث جديد',
        category: (data.category as any) || 'حدث',
        locationName: data.locationName || 'الرياض',
        coordinates: (data.coordinates as [number, number]) || [24.7136, 46.6753],
        time: data.time || 'قريباً',
        aiSummary: data.aiSummary || 'استخراج ذكي للحدث.',
        isRemote: false,
        sourceUrl: url.startsWith('http') ? url : undefined,
        tags: (data.tags as any) || []
      };
      
      setResult(eventWithId);
    } catch (error) {
      console.error(error);
      alert('فشل استخراج البيانات. يرجى التأكد من إعداد مفتاح API بشكل صحيح.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full bg-transparent overflow-y-auto pb-24 p-5 flex flex-col items-center max-w-2xl mx-auto">
      <div className="mb-8 w-full text-center mt-6">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-400/30">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">استكشاف بالرابط</h2>
        <p className="text-slate-400 text-sm">الصق رابط تغريدة أو منشور إنستجرام وسيقوم وكيلنا الذكي باستخراج الحدث ووضعه على الخريطة.</p>
      </div>

      <div className="w-full glass p-6 rounded-3xl mb-8">
        <div className="relative mb-4">
          <Link className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="لصق رابط أو نص الإعلان هنا..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-right"
            dir="rtl"
          />
        </div>

        <button 
          onClick={handleScan}
          disabled={!url || isScanning}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          {isScanning ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري تحليل الرابط...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              استخراج البيانات
            </>
          )}
        </button>

        <div className="flex gap-4 justify-center mt-6">
          <div className="flex gap-2 text-slate-400 items-center text-xs">
            <Twitter className="w-4 h-4" /> مدعوم
          </div>
          <div className="flex gap-2 text-slate-400 items-center text-xs">
            <Instagram className="w-4 h-4" /> مدعوم
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass bg-emerald-900/20 border-emerald-500/30 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white">نجح الاستخراج!</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                <span className="text-xs text-slate-400 block mb-1">الحدث</span>
                <span className="text-sm text-white font-bold">{result.title}</span>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                <span className="text-xs text-slate-400 block mb-1">الموقع المكتشف</span>
                <span className="text-sm text-white font-bold">{result.locationName}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                onExtract(result);
                setResult(null);
                setUrl('');
              }}
              className="w-full glass bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-colors"
            >
              إضافة إلى خريطتي
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
