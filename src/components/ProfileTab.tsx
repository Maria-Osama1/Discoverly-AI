import { useState } from 'react';
import { Interest } from '../types';
import { User, Save, X, Plus, Mail } from 'lucide-react';

interface ProfileTabProps {
  interests: Interest[];
  onUpdateInterests: (interests: Interest[]) => void;
}

export default function ProfileTab({ interests, onUpdateInterests }: ProfileTabProps) {
  const [editingInterests, setEditingInterests] = useState<Interest[]>(interests);
  const [newInterest, setNewInterest] = useState('');
  const [userName, setUserName] = useState('مستخدم ديسكافيرلي');
  const [userEmail, setUserEmail] = useState('user@example.com');

  const addInterest = () => {
    if (newInterest.trim() && !editingInterests.includes(newInterest.trim())) {
      setEditingInterests(prev => [...prev, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: Interest) => {
    setEditingInterests(prev => prev.filter(i => i !== interest));
  };

  const handleSave = () => {
    onUpdateInterests(editingInterests);
    console.log('Saved interests:', editingInterests);
    alert('تم حفظ البيانات بنجاح!');
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
            <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">الملف الشخصي</h2>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/10 mb-6 space-y-4">
        <h3 className="text-lg font-bold">المعلومات الشخصية</h3>
        <div>
            <label className="text-xs text-gray-400">الاسم</label>
            <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <div>
            <label className="text-xs text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> البريد الإلكتروني</label>
            <input 
                type="email" 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/10 mb-6">
        <h3 className="text-lg font-bold mb-4">اهتماماتي</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="أضف اهتماماً جديداً..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => e.key === 'Enter' && addInterest()}
          />
          <button 
            onClick={addInterest}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
            {editingInterests.map(interest => (
                <span
                    key={interest}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-indigo-600 border border-indigo-500 text-white"
                >
                    {interest}
                    <button onClick={() => removeInterest(interest)}>
                      <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
        </div>
        
        <button
            onClick={handleSave}
            className="mt-6 w-full py-3 bg-white text-indigo-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
        >
            <Save className="w-4 h-4" />
            حفظ التعديلات
        </button>
      </div>
    </div>
  );
}
