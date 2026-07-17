import Navbar from '@/components/Navbar';
import ModuleCard from '@/components/ModuleCard';
import { motion } from 'framer-motion';
import { Coffee, Trophy, Map, Wrench, BookOpen, ShoppingBag, Sun, Moon, Sunset } from 'lucide-react';
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const firstName = 'Student';
  const [greeting, setGreeting] = useState('Welcome');
  const [TimeIcon, setTimeIcon] = useState(() => Sun);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
      setTimeIcon(() => Sun);
    } else if (hour < 18) {
      setGreeting('Good afternoon');
      setTimeIcon(() => Sunset);
    } else {
      setGreeting('Good evening');
      setTimeIcon(() => Moon);
    }
  }, []);

  const modules = [
    {
      icon: Coffee,
      name: 'Caffinity',
      description: 'Campus food ordering system. Skip the queue and order ahead for quick pickups across all canteens.',
      href: '/user/caffinity',
      color: '#1A56DB', // blue
      className: 'md:col-span-2'
    },
    {
      icon: Trophy,
      name: 'Arena',
      description: 'Sports and facility booking. Reserve your spot on the court.',
      href: '/user/arena',
      color: '#D97706', // amber
      className: ''
    },
    {
      icon: Map,
      name: 'Mapping',
      description: 'Find your way around campus with detailed maps and routing.',
      href: '/user/map',
      color: '#0F6E56', // green
      className: ''
    },
    {
      icon: BookOpen,
      name: 'UAssist',
      description: 'Academic resources, notes, and collaborative study groups.',
      href: '/user/uassist',
      color: '#7C3AED', // purple
      className: 'md:col-span-2 lg:col-span-3' // Span full width on bottom for visual anchor
    },
    {
      icon: Wrench,
      name: 'ProblemBox',
      description: 'Report issues and track maintenance requests on campus.',
      href: '/user/problembox',
      color: '#DC2626', // red
      className: ''
    },
    {
      icon: ShoppingBag,
      name: 'Shopperz',
      description: 'Buy and sell textbooks, electronics, and dorm essentials.',
      href: '/user/shopperz',
      color: '#EA580C', // orange
      className: ''
    }
  ];

  // Re-arrange for the perfect 3-column bento grid
  const orderedModules = [
    modules[0], // Caffinity (Span 2)
    modules[1], // Arena (Span 1)
    modules[2], // Mapping (Span 1)
    modules[4], // ProblemBox (Span 1)
    modules[5], // Shopperz (Span 1)
    modules[3], // UAssist (Span 3)
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] flex flex-col font-sans transition-colors duration-500 overflow-hidden relative">
      {/* Absolute Ambient Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-100/50 via-purple-50/20 to-transparent dark:from-blue-900/20 dark:via-purple-900/10 -z-10 pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 space-y-12 pb-24">
        {/* Dynamic Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[40px] p-10 md:p-14 shadow-lg border border-white/50 dark:border-white/10 overflow-hidden group"
        >
          {/* Animated Mesh Gradients */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000 animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4 text-gray-500 dark:text-slate-400">
                {isMounted && <TimeIcon size={24} className="animate-pulse text-amber-500" />}
                <span className="font-bold tracking-widest uppercase text-sm">{greeting}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-syne text-gray-900 dark:text-white tracking-tight leading-none">
                Hello, <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{firstName}</span>.
              </h1>
            </div>
            <p className="text-gray-500 dark:text-slate-400 font-medium max-w-sm md:text-right">Your campus ecosystem at a glance. Select a module below to get started.</p>
          </div>
        </motion.div>

        {/* Bento Grid */}
        {isMounted && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]"
          >
            {orderedModules.map((mod) => (
              <ModuleCard
                key={mod.name}
                icon={mod.icon}
                name={mod.name}
                description={mod.description}
                href={mod.href}
                color={mod.color}
                className={mod.className}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
