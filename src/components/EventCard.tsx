/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Sparkles, Navigation } from 'lucide-react';
import { EventItem } from '../types';

export default function EventCard({ event, onClose }: { event: EventItem, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="absolute top-20 left-4 right-4 z-40 max-w-[400px]"
    >
      <div className="glass-dark rounded-[32px] overflow-hidden bg-slate-900/90 backdrop-blur-lg border border-slate-700 shadow-2xl">
        {/* Banner Image Placeholder */}
        <div className="relative h-48 bg-slate-800">
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
            {event.category}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-4 right-6 left-6">
            <h2 className="text-xl font-bold text-white leading-tight">{event.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-gray-300 mt-2">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${event.coordinates[0]},${event.coordinates[1]}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{event.locationName}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">تحليل الذكاء الاصطناعي</span>
            </div>
            <p className="text-sm text-blue-100/80 leading-relaxed font-medium italic">
              {event.aiSummary}
            </p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed font-medium">
            {event.time}
          </p>

          <div className="flex justify-between pt-2">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${event.coordinates[0]},${event.coordinates[1]}`}
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-2.5 bg-indigo-600 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/40 hover:bg-indigo-500 transition-all text-white flex items-center gap-2"
            >
              <span>الاتجاهات</span>
              <Navigation className="w-3.5 h-3.5" />
            </a>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-700 rounded-xl text-xs font-bold hover:bg-slate-600 transition-all text-white"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
