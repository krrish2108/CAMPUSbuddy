import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';
import { useUserUAssist } from '@/context/user/UserUAssistContext';

export default function GlobalBroadcast() {
  const { globalBroadcast, dismissBroadcast } = useUserUAssist();

  return (
    <AnimatePresence>
      {globalBroadcast && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0, transition: { duration: 0.3 } }}
          className="fixed top-0 left-0 w-full z-[100] px-4 py-4 md:px-12 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[25px] p-1 shadow-[0_10px_40px_rgba(79,70,229,0.5)] border border-white/20 pointer-events-auto overflow-hidden relative">
            
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-overlay" />
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-blue-400/20 rounded-full blur-[30px] pointer-events-none" />

            <div className="bg-slate-900/40 backdrop-blur-md rounded-[23px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shrink-0 text-white shadow-inner relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-pulse" />
                   <Megaphone size={20} className="relative z-10" />
                </div>
                <div>
                   <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                     HQ Announcement <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
                   </h4>
                   <p className="text-white/90 font-bold text-sm mt-0.5 leading-snug">{globalBroadcast.message}</p>
                </div>
              </div>

              <button 
                onClick={dismissBroadcast}
                className="w-full md:w-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shrink-0 border border-white/10"
              >
                Dismiss <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
