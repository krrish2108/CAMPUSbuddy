import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useContext } from 'react';
import Navbar from '@/components/Navbar';
import { ThemeContext } from '@/pages/_app';

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
  }, []);

  // 2. SCROLL TRIGGER ANIMATIONS
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-x-0', 'translate-y-0');
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

  // 4. AUTH AUTO-REDIRECT
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/user/home');
    }
  }, [isLoggedIn, router]);

  // 5. AUTH INTERCEPTION
  const handleModuleClick = (href) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${href}`);
    } else {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#020617]">
      <Navbar />

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
        
        <p className={`max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-12 transition-all duration-1000 delay-500 ${isTypewriterDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          One platform for food, events, navigation, issues, AI help, and campus resources.
        </p>
        
        <div className={`transition-all duration-1000 delay-300 ease-out transform ${isTypewriterDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
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
            <div className={`glass-card w-full flex flex-col md:flex-row items-center p-8 md:p-12 rounded-[40px] cursor-pointer hover:shadow-2xl transition-all duration-500 border-l-[6px]`}
                 style={{ borderLeftColor: mod.color }}>
              
              {/* Massive Letter - HOVER BOUNCE */}
              <div 
                className="w-32 md:w-56 flex-shrink-0 text-center flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 active:scale-95"
              >
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

      {/* 5. HOW IT WORKS SECTION */}
      <section className="how-it-works-section w-full py-32 px-6 border-y border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 relative">
        <div className="max-w-[1440px] mx-auto text-center px-6 md:px-12 lg:px-16">
          <h2 className="font-syne font-black text-4xl mb-32 text-[#0F172A] dark:text-white tracking-tighter">
            How it works
          </h2>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
            
            {/* SVG Connecting Line */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4/5 hidden md:block">
              <svg className="w-full h-1" viewBox="0 0 100 1" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" strokeDasharray="100" strokeDashoffset="100"
                      className="text-blue-500/20 animate-on-scroll transition-all duration-[2000ms] delay-500"
                      style={{ strokeDashoffset: 'var(--scroll-draw, 100)' }} />
              </svg>
            </div>

            {/* Step 1 */}
            <div className="animate-on-scroll opacity-0 scale-90 transition-all duration-700 flex-1 text-center flex flex-col items-center group">
              <div className="w-[64px] h-[64px] rounded-full border-2 border-[#1A56DB] dark:border-blue-500 flex items-center justify-center text-2xl font-black text-[#1A56DB] dark:text-blue-500 bg-white dark:bg-slate-900 shadow-xl transition-transform group-hover:scale-110">
                1
              </div>
              <h4 className="font-black text-xl text-[#0F172A] dark:text-white mt-8 tracking-tighter">Sign in</h4>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 font-semibold">
                Login with your account.
              </p>
            </div>

            {/* Step 2 */}
            <div className="animate-on-scroll opacity-0 scale-90 transition-all duration-700 delay-200 flex-1 text-center flex flex-col items-center group">
              <div className="w-[64px] h-[64px] rounded-full border-2 border-[#1A56DB] dark:border-blue-500 flex items-center justify-center text-2xl font-black text-[#1A56DB] dark:text-blue-500 bg-white dark:bg-slate-900 shadow-xl transition-transform group-hover:scale-110">
                2
              </div>
              <h4 className="font-black text-xl text-[#0F172A] dark:text-white mt-8 tracking-tighter">Pick any</h4>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 font-semibold">
                Choose from C A M P U S based on your needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="animate-on-scroll opacity-0 scale-90 transition-all duration-700 delay-400 flex-1 text-center flex flex-col items-center group">
              <div className="w-[64px] h-[64px] rounded-full border-2 border-[#1A56DB] dark:border-blue-500 flex items-center justify-center text-2xl font-black text-[#1A56DB] dark:text-blue-500 bg-white dark:bg-slate-900 shadow-xl transition-transform group-hover:scale-110">
                3
              </div>
              <h4 className="font-black text-xl text-[#0F172A] dark:text-white mt-8 tracking-tighter">Get done</h4>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 font-semibold">
                Order, report, find — all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ABOUT US (Team section) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <p className="text-center text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">
            The team behind it
          </p>

          {/* Title */}
          <h2 className="text-center font-syne font-extrabold text-4xl text-gray-900 dark:text-white mb-3">
            Meet Process Busters
          </h2>

          {/* Subtitle */}
          <p className="text-center text-sm text-gray-400 max-w-sm mx-auto leading-relaxed mb-14 font-medium">
            A group of students who got tired of campus problems 
            and decided to build the solution.
          </p>

          {/* Team grid */}
          {(() => {
            const members = [
              { name: "Krish",   role: "Lead Developer & UI/UX Architect",  initials: "K", bg: "#E6F1FB", color: "#0C447C" },
              { name: "Avinash", role: "Backend & Database Architect",      initials: "A", bg: "#FAEEDA", color: "#633806" },
              { name: "Sangam",  role: "AI Integration & Logic Engineer", initials: "S", bg: "#E1F5EE", color: "#085041" },
              { name: "Ayush",   role: "Cloud & Integrations Specialist",   initials: "A", bg: "#EEEDFE", color: "#3C3489" },
              { name: "Mahek",   role: "Product Strategist & Pitch Lead",   initials: "M", bg: "#FCEBEB", color: "#791F1F" },
              { name: "Palak",   role: "QA & Data Operations",              initials: "P", bg: "#F3E8FF", color: "#581C87" },
            ]
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {members.map((m, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 dark:border-white/5 rounded-2xl p-5 text-center 
                               hover:-translate-y-1 transition-transform duration-200 bg-white dark:bg-slate-900 shadow-sm"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center 
                                 font-extrabold text-lg mx-auto mb-3"
                      style={{ background: m.bg, color: m.color, fontFamily: 'Syne, sans-serif' }}
                    >
                      {m.initials}
                    </div>
                    <p className="text-sm font-black text-gray-900 dark:text-white mb-1">{m.name}</p>
                    <p className="text-[10px] text-gray-400 leading-tight font-bold uppercase tracking-tight">{m.role}</p>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </section>

      {/* thin divider between sections */}
      <div className="h-px bg-gray-100 dark:bg-white/5 max-w-2xl mx-auto" />

      {/* 7. CONTACT US */}
      <section className="py-20 px-6 bg-gray-50/50 dark:bg-white/5">
        <div className="max-w-lg mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">
            Get in touch
          </p>

          {/* Title */}
          <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white mb-3 font-syne tracking-tight">
            Contact us
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed mb-10 font-medium">
            Have questions or feedback about CAMPUSbuddy? 
            We would love to hear from you.
          </p>

          {/* Info cards grid */}
          {(() => {
            const contacts = [
              { label: "Email",      value: "team@campusbuddy.in",      link: "mailto:team@campusbuddy.in" },
              { label: "Hackathon",  value: "UITxKIIF 2025",            link: null },
              { label: "GitHub",     value: "github.com/campusbuddy",   link: "https://github.com/campusbuddy" },
              { label: "Team",       value: "Process Busters",          link: null },
            ]
            return (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {contacts.map((c, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-xl p-4 text-left shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {c.label}
                    </p>
                    {c.link ? (
                      <a href={c.link}
                         className="text-sm font-bold text-[#1A56DB] dark:text-blue-400 hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{c.value}</p>
                    )}
                  </div>
                ))}
              </div>
            )
          })()}

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-full px-5 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
              Built live at UITxKIIF Hackathon 2025
            </span>
          </div>
        </div>
      </section>

      {/* 8. NEW FOOTER */}
      <footer className="flex items-center justify-between flex-wrap gap-3 px-10 py-5 border-t border-gray-100 dark:border-white/5 transition-colors">
        <div className="font-extrabold text-base font-syne">
          <span className="text-[#1A56DB] dark:text-blue-400">CAMPUS</span>buddy
        </div>
        <p className="text-xs text-gray-400 font-medium">
          © 2025 Process Busters · UITxKIIF Hackathon
        </p>
      </footer>
    </div>
  );
}
