import { useState } from 'react';
import { Mail, Lock, User, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function Auth({ onComplete }: { onComplete: () => void }) {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden relative text-white p-6 items-center">
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/40 to-slate-900 pointer-events-none" />
      
      <div className="flex-1 w-full max-w-md flex flex-col justify-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto mb-4">
            D
          </div>
          <h1 className="text-3xl font-bold mb-2">Discoverly AI</h1>
          <p className="text-slate-400">سجل دخولك لاكتشاف مدينتك بشكل مختلف.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 space-y-4"
        >
          {!isLogin && (
             <div className="relative">
             <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="الاسم الكامل" 
               className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500"
             />
           </div>
          )}

          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500"
            />
          </div>

          <button 
            onClick={onComplete}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold transition-colors mt-2"
          >
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 relative"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-900 text-slate-400">أو أكمل باستخدام</span>
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="mt-6 flex gap-4"
        >
          <button onClick={onComplete} className="flex-1 glass py-3 rounded-xl flex items-center justify-center gap-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
             Google
          </button>
          <button onClick={onComplete} className="flex-1 glass py-3 rounded-xl flex items-center justify-center gap-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <Github className="w-5 h-5" /> Apple
          </button>
        </motion.div>

      </div>

      <div className="text-center pb-6 z-10 relative">
         <p className="text-slate-400 text-sm">
           {isLogin ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
           <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 font-bold hover:underline">
             {isLogin ? "إنشاء حساب جديد" : "تسجيل الدخول"}
           </button>
         </p>
      </div>

    </div>
  );
}
