import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';

export default function ModuleLayout({ title, subtitle, color, children, hideHeader = false, isDark = false }) {
  const router = useRouter();

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${isDark ? 'bg-[#060606]' : 'bg-gray-50 dark:bg-[#020617]'}`}>
      <Navbar isDark={isDark} />
      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-8 space-y-6 max-w-[1440px]`}>
        {/* Module Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/user/home')}
            className={`flex items-center text-sm font-black uppercase tracking-widest transition ${isDark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'}`}
          >
            ← Back to Campus
          </button>
        </div>

        {!hideHeader && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-sm shrink-0"
              style={{ backgroundColor: color }}
            >
              {title.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <p className="text-gray-500 dark:text-slate-400 font-medium">{subtitle}</p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={`${hideHeader ? '' : 'bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5 min-h-[400px]'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
