import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { ThemeContext } from '@/pages/_app';
import { Sun, Moon, LogOut, User, Phone, BookOpen, School, Hash, Mail, Settings } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

export default function Navbar({ isDark = false }) {
  const router = useRouter();
  const { isDarkMode, toggleTheme, isLoggedIn, logout, userProfile } = useContext(ThemeContext);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <nav className={`sticky top-0 z-50 w-full transition-colors duration-500 backdrop-blur-xl border-b ${
      isDark 
      ? 'bg-[#0f0f12]/40 border-white/5' 
      : 'bg-white/60 dark:bg-slate-950/60 border-gray-100 dark:border-white/5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <div 
          onClick={() => router.push('/')}
          className="font-syne font-black text-2xl tracking-tighter cursor-pointer group"
        >
          <span className={`${isDark ? 'text-white' : 'text-[#1A56DB] dark:text-blue-400'} group-hover:text-blue-700 transition-colors`}>CAMPUS</span>
          <span className={`${isDark ? 'text-white/60' : 'text-gray-900 dark:text-white'} transition-colors`}>buddy</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Auth & Profile */}
          {isLoggedIn ? (
             <div className="flex items-center gap-4">
               {/* Quick Dashboard Access */}
               <button 
                 onClick={() => router.push(userProfile?.role === 'admin' ? '/admin/dashboard' : '/user/home')}
                 className="hidden md:block px-5 py-2 rounded-full text-sm font-bold bg-[#1A56DB]/10 dark:bg-blue-400/10 text-[#1A56DB] dark:text-blue-400 hover:bg-[#1A56DB] hover:text-white dark:hover:bg-blue-400 dark:hover:text-[#020617] transition-all"
               >
                 Dashboard
               </button>

               <div className="relative">
                 <button 
                 onClick={() => setShowProfileCard(!showProfileCard)}
                 className={`flex items-center gap-2 p-1.5 pr-4 rounded-2xl transition-all duration-300 ${
                   showProfileCard 
                   ? 'bg-[#1A56DB] text-white shadow-lg shadow-blue-500/20' 
                   : isDark 
                     ? 'bg-slate-900 border border-white/20 text-white hover:bg-slate-800'
                     : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:brightness-110'
                 }`}
               >
                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${isDark ? 'bg-white/10' : 'bg-white/20'}`}>
                   {userProfile?.name?.charAt(0) || 'U'}
                 </div>
                 <span className="text-sm font-bold hidden md:block">Profile</span>
               </button>

               {/* Profile Details Card (Quick View Dropdown) */}
               {showProfileCard && (
                 <div className="absolute top-14 right-0 w-[280px] md:w-[320px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#1A56DB] dark:bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg overflow-hidden">
                        {userProfile?.avatar ? <img src={userProfile.avatar} className="w-full h-full object-cover" /> : userProfile?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setIsModalOpen(true);
                            setShowProfileCard(false);
                          }}
                          className="p-2 rounded-xl text-gray-400 bg-gray-50 dark:bg-white/5 hover:bg-[#1A56DB] hover:text-white transition-all shadow-sm"
                        >
                          <Settings size={18} />
                        </button>
                        <button onClick={logout} className="p-2 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all">
                          <LogOut size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-syne font-black text-xl text-slate-900 dark:text-white tracking-tighter">
                        {userProfile?.name || 'Student Name'}
                      </h3>
                      <p className="text-xs font-bold text-[#1A56DB] dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <BookOpen size={12} />
                        {userProfile?.course || 'No Course'} · {userProfile?.semester || '0'} Sem
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <Mail size={16} />
                        <span className="text-xs font-medium truncate">{userProfile?.email || 'email@college.edu'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <Phone size={16} />
                        <span className="text-xs font-medium">{userProfile?.phone || 'No Mobile'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <School size={16} />
                        <span className="text-xs font-medium line-clamp-1">{userProfile?.dept || 'No Department'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <Hash size={16} />
                        <span className="text-xs font-medium">ID: {userProfile?.collegeId || 'Not Set'}</span>
                      </div>
                    </div>
                 </div>
               )}
               </div>
             </div>
          ) : (
            <button 
              onClick={() => router.push('/login')}
              className="border-[1.5px] border-[#1A56DB] dark:border-blue-400 text-[#1A56DB] dark:text-blue-400 px-6 py-2 rounded-full text-sm font-bold hover:bg-[#1A56DB] dark:hover:bg-blue-400 hover:text-white dark:hover:text-[#020617] transition-all duration-300 shadow-lg shadow-blue-500/5"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
    <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
