import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Interest } from '../types';
import { chatOnboarding } from '../lib/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function OnboardingChat({ onComplete }: { onComplete: (interests: Interest[]) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "مرحباً بك! 👋 أنا Discoverly، دليلك الذكي في المدينة. ما الذي تبحث عنه اليوم؟ (مثلاً: قهوة هادئة، فنانين، تقنية...)" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gatheredInterests, setGatheredInterests] = useState<Interest[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        text: m.text,
        isBot: m.role === 'model'
      }));

      const { reply, detectedInterests, isComplete } = await chatOnboarding(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      
      const newInterests = Array.from(new Set([...gatheredInterests, ...detectedInterests] as Interest[]));
      setGatheredInterests(newInterests);
      
      if (isComplete) {
        setTimeout(() => onComplete(newInterests), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ ما. هل يمكنك المحاولة مرة أخرى؟" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[#1e293b]/90 rounded-[2.5rem] overflow-hidden flex flex-col h-[80vh] shadow-3xl border border-white/10"
      >
        {/* Header */}
        <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1e293b] rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-white leading-tight">Discoverly AI</h2>
              <p className="text-emerald-400 text-[10px] font-medium">نشط الآن • دليلك المحلي</p>
            </div>
          </div>
          <button onClick={() => onComplete(gatheredInterests)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/2">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: m.role === 'user' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-3 max-w-[90%]",
                m.role === 'user' ? "mr-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
                m.role === 'user' ? "bg-blue-500/20 text-blue-300" : "bg-white/10 text-gray-300"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-xl",
                m.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tl-none border border-blue-400/30" 
                  : "bg-white/5 border border-white/10 text-gray-100 rounded-tr-none"
              )}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-400 animate-pulse" />
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-400 text-sm italic rounded-tr-none">
                جاري التفكير...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white/2 border-t border-white/5 space-y-3">
          {gatheredInterests.length > 0 && (
            <button
              onClick={() => onComplete(gatheredInterests)}
              className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              ابدأ تجربتك <Sparkles className="w-4 h-4" />
            </button>
          )}
          <div className="flex gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/10 ring-1 ring-white/5 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اسألني أي شيء..."
              className="flex-1 bg-transparent px-4 py-3 outline-none text-white text-sm"
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center"
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
