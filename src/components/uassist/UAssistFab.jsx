import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Zap } from 'lucide-react';
import { useUserUAssist } from '@/context/user/UserUAssistContext';

export default function UAssistFab() {
  const { isOpen, setIsOpen } = useUserUAssist();

  if (isOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, shadow: "0 0 30px rgba(79, 70, 229, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(true)}
      className="fixed bottom-10 right-10 z-[1000] flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-2 border-white/20 group overflow-hidden"
    >
      <div className="relative">
        <MessageSquareText size={20} className="relative z-10" />
        {/* Constant Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-full"
        />
      </div>
      
      <span className="font-black italic uppercase tracking-widest text-[10px] flex items-center gap-2">
        Ask UAssist <Zap size={14} fill="currentColor" className="text-yellow-400 group-hover:animate-bounce" />
      </span>

      {/* INNER GLOW SHIMMER */}
      <motion.div 
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
      />
      
      {/* OUTER GLOW */}
      <div className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/20 blur-xl transition-all duration-300" />
    </motion.button>
  );
}
