'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ModuleCard({ icon: Icon, letter, name, description, href, color, className = "" }) {
  return (
    <motion.div variants={itemVariants} className={`block h-full ${className}`}>
      <Link href={href} className="group block h-full relative outline-none">
        {/* Glow behind the card */}
        <div 
          className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
          style={{ backgroundColor: `${color}40` }}
        />
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] shadow-sm border border-gray-200/50 dark:border-white/5 p-8 h-full flex flex-col items-start text-left overflow-hidden"
        >
          {/* Subtle mesh background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 dark:opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-150" style={{ backgroundColor: color }} />
          
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
            style={{ backgroundColor: color }}
          >
            {Icon ? <Icon size={32} strokeWidth={2.5} /> : <span className="font-bold text-3xl">{letter}</span>}
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="font-syne font-black text-2xl text-gray-900 dark:text-white mb-3 tracking-tight">{name}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm font-medium leading-relaxed flex-grow">{description}</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
