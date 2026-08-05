import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useContext } from 'react';
import Navbar from '@/components/Navbar';
import { ThemeContext } from '@/pages/_app';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Mail, 
  MapPin,
  Code, 
  Activity, 
  Send, 
  Sparkles, 
  Terminal, 
  Globe,
  ChevronUp,
  ExternalLink,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const modules = [
  {
    letter: 'C',
    name: 'Caffinity',
    color: '#1A56DB',
    tagBg: 'rgba(26, 86, 219, 0.1)',
    tagLabel: 'Food & ordering',
    description: 'Pre-order food from the canteen, pick a time slot, and skip the queue entirely. Live menu and crowd status included.',
    href: '/user/caffinity'
  },
  {
    letter: 'A',
    name: 'Arena',
    color: '#D97706',
    tagBg: 'rgba(217, 119, 6, 0.1)',
    tagLabel: 'Events & activities',
    description: 'All campus events in one feed — hackathons, fests, competitions. Register before the deadline, never miss out again.',
    href: '/user/arena'
  },
  {
    letter: 'M',
    name: 'Mapping',
    color: '#059669',
    tagBg: 'rgba(5, 150, 105, 0.1)',
    tagLabel: 'Navigation',
    description: 'Interactive campus map to find classrooms, labs, canteens and offices. Built for new students and daily navigation.',
    href: '/user/map'
  },
  {
    letter: 'P',
    name: 'ProblemBox',
    color: '#DC2626',
    tagBg: 'rgba(220, 38, 38, 0.1)',
    tagLabel: 'Issue reporting',
    description: 'Report campus issues with a photo, location, and priority. Upvote shared problems and track status from reported to resolved.',
    href: '/user/problembox'
  },
  {
    letter: 'U',
    name: 'UAssist',
    color: '#7C3AED',
    tagBg: 'rgba(124, 58, 237, 0.1)',
    tagLabel: 'AI assistant',
    description: 'Your AI campus assistant. Ask anything — it finds directions, orders food, opens ProblemBox, or answers campus FAQs.',
    href: '/user/uassist'
  },
  {
    letter: 'S',
    name: 'Shopperz',
    color: '#EA580C',
    tagBg: 'rgba(234, 88, 12, 0.1)',
    tagLabel: 'Campus resources',
    description: 'Find stationery, books, notes and printouts available on campus. Check availability before you walk across campus for nothing.',
    href: '/user/shopperz'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { isLoggedIn } = useContext(ThemeContext);
  const [displayText, setDisplayText] = useState('');
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const fullText = "Your campus. Simplified.";
  
  // Interactive Support Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactForm.message.trim()) {
      showToast('⚠️ Please enter a message before submitting.');
      return;
    }
    showToast(`✨ Thank you, ${contactForm.name || 'Student'}! Your message has been routed to Campus Operations.`);
    setContactForm({ name: '', email: '', message: '' });
  };
  
  // 1. TYPEWRITER LOGIC
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setIsTypewriterDone(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [fullText]);

  // 2. SCROLL TRIGGER ANIMATIONS
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-x-0', 'translate-y-0', 'scale-100');
            entry.target.classList.remove('opacity-0', 'translate-x-12', '-translate-x-12', 'translate-y-12', 'scale-90');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
      observer.observe(elem);
    });

    // 3. SVG DRAW ON SCROLL
    const handleScroll = () => {
      const section = document.querySelector('.how-it-works-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollPercent = Math.max(0, Math.min(100, (window.innerHeight - rect.top) / rect.height * 100));
        document.documentElement.style.setProperty('--scroll-draw', 100 - scrollPercent);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 4. AUTH INTERCEPTION
  const handleModuleClick = (href) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${href}`);
    } else {
      router.push(href);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#020617] text-slate-900 dark:text-white overflow-x-hidden">
      <Navbar />

      {/* Floating Success Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-[200] bg-slate-900 text-white border border-slate-700/80 rounded-2xl px-6 py-3.5 shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest"
          >
            <Sparkles size={16} className="text-purple-400 animate-pulse shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] animate-mesh-1" />
        <div className="particle w-3 h-3 left-1/4 top-1/3 animation-delay-0"></div>
        <div className="particle w-4 h-4 left-3/4 top-1/4 animation-delay-2000"></div>
        <div className="particle w-2 h-2 left-1/2 top-2/3 animation-delay-4000"></div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="w-full text-center pt-24 md:pt-40 pb-16 px-6 max-w-[1440px] mx-auto">
        <div className="transition-all duration-1000 ease-out transform">
           <h1 className="font-syne font-black text-5xl md:text-7xl leading-[0.9] mb-8 tracking-tighter text-slate-900 dark:text-white">
             <span className="typewriter-cursor">{displayText}</span>
           </h1>
        </div>
        
        <p className={`max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-12 transition-all duration-1000 delay-500 font-medium ${isTypewriterDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          One platform for food, events, navigation, issues, AI help, and campus resources.
        </p>
        
        <div className={`transition-all duration-1000 delay-300 ease-out transform ${isTypewriterDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xs text-gray-400 font-black tracking-widest uppercase">
            6 Modules · 1 Platform · Built for Campus
          </p>
        </div>
      </section>

      {/* 3. SOCIAL PROOF MARQUEE */}
      <div className="w-full py-12 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="inline-flex items-center gap-12 px-12">
              <span className="text-sm font-black text-gray-400/80 dark:text-slate-500 tracking-widest uppercase">
                Built for 10,000+ students
              </span>
              <span className="text-2xl text-blue-500/30 font-black">·</span>
              <span className="text-sm font-black text-gray-400/80 dark:text-slate-500 tracking-widest uppercase">
                6 modules
              </span>
              <span className="text-2xl text-blue-500/30 font-black">·</span>
              <span className="text-sm font-black text-gray-400/80 dark:text-slate-500 tracking-widest uppercase">
                1 platform
              </span>
              <span className="text-2xl text-blue-500/30 font-black">·</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-32 mb-16 animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 delay-200">
        <span className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] font-black">
          Everything inside one word
        </span>
      </div>

      {/* 4. GLASSMORPHISM MODULES */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 mb-32 space-y-24">
        {modules.map((mod, i) => (
          <div 
            key={mod.letter}
            onClick={() => handleModuleClick(mod.href)}
            className={`animate-on-scroll opacity-0 transition-all duration-1000 ease-out flex items-center group
              ${i % 2 === 0 ? '-translate-x-12' : 'translate-x-12'}
            `}
          >
            <div className="glass-card w-full flex flex-col md:flex-row items-center p-8 md:p-12 rounded-[40px] cursor-pointer hover:shadow-2xl transition-all duration-500 border-l-[6px]"
                 style={{ borderLeftColor: mod.color }}>
              
              {/* Massive Letter */}
              <div className="w-32 md:w-56 flex-shrink-0 text-center flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 active:scale-95">
                <div 
                  className="font-syne font-black leading-none tracking-tighter select-none transition-all duration-500"
                  style={{ color: mod.color, fontSize: 'clamp(100px, 12vw, 120px)' }}
                >
                  {mod.letter}
                </div>
              </div>

              {/* Content Container */}
              <div className="flex-1 min-w-0 pr-6 mt-8 md:mt-0 md:pl-12">
                <h4 className="font-syne font-black text-3xl md:text-5xl mb-3 text-slate-900 dark:text-white tracking-tighter">
                  {mod.name}
                </h4>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mb-6 font-medium">
                  {mod.description}
                </p>

                <span 
                  className="inline-block text-[11px] font-black px-5 py-2 rounded-full tracking-wider uppercase transition-all duration-300 group-hover:shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)] group-hover:brightness-110"
                  style={{ backgroundColor: mod.tagBg, color: mod.color }}
                >
                  {mod.tagLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 5. REVAMPED "HOW IT WORKS" SECTION */}
      <section className="how-it-works-section w-full py-32 px-6 border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Streamlined University Intelligence</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-2 mb-20">
            How CAMPUSbuddy Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 Card */}
            <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-700 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-8 shadow-xl flex flex-col justify-between text-left relative overflow-hidden group hover:border-blue-500/50 hover:scale-[1.02]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    1
                  </span>
                  <Shield size={24} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                </div>
                <div>
                  <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Secure Sign-in</h4>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    Authenticate instantly with your student Roll ID or OTP credentials to unlock all customized university intelligence services.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-black text-blue-600 dark:text-blue-400 gap-1 uppercase tracking-wider">
                <span>Universal Single-Sign-On</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-700 delay-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-8 shadow-xl flex flex-col justify-between text-left relative overflow-hidden group hover:border-purple-500/50 hover:scale-[1.02]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 font-black text-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    2
                  </span>
                  <Zap size={24} className="text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors" />
                </div>
                <div>
                  <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Select a Module</h4>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    Choose dynamically from C A M P U S — whether you need cafeteria preorders, event registrations, or UAssist AI Copilot guidance.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-black text-purple-600 dark:text-purple-400 gap-1 uppercase tracking-wider">
                <span>6 Synchronized Engines</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-700 delay-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-8 shadow-xl flex flex-col justify-between text-left relative overflow-hidden group hover:border-emerald-500/50 hover:scale-[1.02]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    3
                  </span>
                  <CheckCircle2 size={24} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div>
                  <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Execute & Resolve</h4>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    Skip lines, report maintenance flaws with real-time GPS tracking, order notes in Shopperz, and track outcomes from start to finish.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-black text-emerald-600 dark:text-emerald-400 gap-1 uppercase tracking-wider">
                <span>Real-Time Completion</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. ELEVATED CALL-TO-ACTION BANNER (PREMIUM FINISH) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[45px] p-10 sm:p-16 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-4 relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> <span>Next-Gen Campus Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Ready for an Elevated University Experience?
            </h2>
            <p className="text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              Join thousands of campus students and faculty members connecting across dining, events, academic print studio, and neural AI assistance today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 shrink-0 w-full sm:w-auto justify-center">
            <button
              onClick={() => handleModuleClick('/user/dashboard')}
              className="px-8 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Campus Portal</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => handleModuleClick('/user/uassist')}
              className="px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-slate-800 dark:text-slate-200 font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 border border-slate-200/80 dark:border-white/10 shadow-sm"
            >
              <Bot size={16} className="text-purple-500" />
              <span>Ask UAssist AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. RE-ENGINEERED CONTACT & SUPPORT CONSOLE */}
      <section className="py-20 px-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Get in touch
            </span>
            <h2 className="font-black text-3xl md:text-5xl text-slate-900 dark:text-white tracking-tight">
              Campus Support & Communications
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Have questions, institutional integration requests, or feature feedback? Connect directly with our campus operations network.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Communication channels grid (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-xl space-y-5">
                <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal size={18} className="text-blue-500" />
                  <span>Direct Operations Channels</span>
                </h3>

                <div className="space-y-4 divide-y divide-slate-100 dark:divide-white/5">
                  <div className="pt-3 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-black">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Helpdesk & Feedback</p>
                      <a href="mailto:support@campusbuddy.edu.in" className="text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:underline block truncate">
                        support@campusbuddy.edu.in
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 font-black">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Campus Headquarters</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        Innovation Center, Block 4, Karnavati University Campus
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 font-black">
                      <Code size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Developer & API Specs</p>
                      <a href="https://github.com/campusbuddy" target="_blank" rel="noreferrer" className="text-sm font-extrabold text-slate-800 dark:text-slate-200 hover:underline flex items-center gap-1">
                        <span>github.com/campusbuddy</span>
                        <ExternalLink size={12} className="text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Neural Network Health</span>
                  </span>
                  <span className="text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    99.998% Online
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Interactive feedback dispatcher (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-7 sm:p-9 shadow-xl">
              <form onSubmit={handleSendMessage} className="space-y-5">
                <div className="border-b border-slate-100 dark:border-white/5 pb-4">
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">Send Quick Inquiry</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Fill out your message below to communicate directly with administrators.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Student or Faculty Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ananya Sharma" 
                      value={contactForm.name}
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Campus Email / ID</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. ananya.s@campus.edu" 
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Your Question or Feedback</label>
                  <textarea 
                    rows={4} 
                    required
                    placeholder="How can we help optimize your campus experience today?" 
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 ml-auto"
                >
                  <Send size={15} />
                  <span>Send Message to Operations</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 8. WORLD-CLASS EXECUTIVE MULTI-COLUMN FOOTER */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Brand column (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              <div className="font-extrabold text-2xl tracking-tight">
                <span className="text-blue-600 dark:text-blue-400 font-syne font-black">CAMPUS</span>buddy
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                The integrated campus intelligence platform designed to streamline student life, automate cafeteria queues, coordinate campus events, and dispatch maintenance solutions.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
                </span>
              </div>
            </div>

            {/* Core Modules column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Command Modules</h4>
              <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <li><button onClick={() => handleModuleClick('/user/caffinity')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Caffinity Dining</button></li>
                <li><button onClick={() => handleModuleClick('/user/arena')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Arena Events Hub</button></li>
                <li><button onClick={() => handleModuleClick('/user/map')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Interactive Mapping</button></li>
                <li><button onClick={() => handleModuleClick('/user/problembox')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ProblemBox Tickets</button></li>
                <li><button onClick={() => handleModuleClick('/user/uassist')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">UAssist AI Copilot</button></li>
                <li><button onClick={() => handleModuleClick('/user/shopperz')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shopperz & Print Studio</button></li>
              </ul>
            </div>

            {/* Management Hubs column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Management Portals</h4>
              <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <li><button onClick={() => handleModuleClick('/user/dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Student User Portal</button></li>
                <li><button onClick={() => router.push('/admin/dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admin Command HQ</button></li>
                <li><button onClick={() => router.push('/vendor/caffinity')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Vendor Cafeteria Hub</button></li>
                <li><button onClick={() => handleModuleClick('/user/problembox')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Specialist Dispatch Deck</button></li>
              </ul>
            </div>

            {/* Governance & Protocols column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Security & Protocols</h4>
              <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <li><button onClick={() => router.push('/security')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Zero-Knowledge Encryption</button></li>
                <li><button onClick={() => router.push('/privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Student Privacy Guidelines</button></li>
                <li><button onClick={() => router.push('/privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Campus Service</button></li>
                <li><a href="https://github.com/campusbuddy" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block">API Architecture Docs</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom copyright bar */}
          <div className="pt-8 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
            <p>© 2026 CAMPUSbuddy Inc. Engineered for modern university infrastructures. All rights reserved.</p>
            
            <div className="flex items-center gap-6">
              <button onClick={() => router.push('/privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold">Privacy Policy</button>
              <button onClick={() => router.push('/security')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold">Security Protocol</button>
              <button 
                onClick={scrollToTop}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-sm ml-2"
                title="Back to top"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
