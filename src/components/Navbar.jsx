import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { ThemeContext } from '@/pages/_app';
import { Sun, Moon, LogOut, User, Phone, BookOpen, School, Hash, Mail, Settings, Bell, Check, Trash2 } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { useUserInbox } from '@/context/user/UserInboxContext';
import { useUserProfile } from '@/context/user/UserProfileContext';
import { useAdminProfile } from '@/context/admin/AdminProfileContext';

export default function Navbar({ isDark = false }) {
  const router = useRouter();
  const { isDarkMode, toggleTheme, isLoggedIn, logout, userRole } = useContext(ThemeContext);
  const { userProfile } = useUserProfile() || {};
  const { adminProfile } = useAdminProfile() || {};
  const activeProfile = userRole === 'admin' ? adminProfile : userProfile;
  const { messages, unreadCount, markAsRead, clearAll } = useUserInbox() || { messages: [], unreadCount: 0 };
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
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
          
          {/* Inbox / Notifications */}
          {isLoggedIn && (
            <div className="relative">
              <button 
                onClick={() => {
                  setShowInbox(!showInbox);
                  setShowProfileCard(false);
                }}
                className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
                  showInbox 
                  ? 'bg-[#1A56DB] text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
                )}
              </button>

              {showInbox && (
                 <div className="absolute top-14 right-0 w-[320px] md:w-[380px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-1 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300">
                    <div className="relative overflow-hidden rounded-[28px] p-6 bg-white dark:bg-slate-900">
                      
                      {/* Subtle background glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                       <div className="relative z-10 flex justify-between items-center mb-6">
                          <h3 className="font-syne font-black text-2xl text-slate-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Inbox</h3>
                          <button 
                            onClick={clearAll}
                            className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm uppercase tracking-widest"
                          >
                            Clear All
                          </button>
                       </div>
                       
                       <div className="relative z-10 max-h-[350px] overflow-y-auto space-y-3 scrollbar-none pb-2">
                         {messages.length === 0 ? (
                           <div className="py-12 text-center opacity-40 flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                               <Bell size={24} />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest">No Messages</p>
                           </div>
                         ) : (
                           messages.map(msg => (
                             <div 
                               key={msg.id} 
                               onClick={() => markAsRead(msg.id)}
                               className={`p-4 rounded-[20px] transition-all cursor-pointer group hover:shadow-md ${
                                 msg.isRead 
                                 ? 'bg-slate-50/80 border border-transparent dark:bg-white/5 dark:border-white/5 opacity-60 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-white/10' 
                                 : 'bg-white border border-indigo-500/20 dark:bg-slate-800/80 dark:border-indigo-500/30 shadow-sm hover:border-indigo-500/50'
                               }`}
                             >
                                <div className="flex gap-4">
                                   <div className="relative shrink-0">
                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-inner ${msg.isRead ? 'bg-slate-400 dark:bg-slate-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                                       {msg.avatar || 'U'}
                                     </div>
                                     {!msg.isRead && (
                                       <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
                                     )}
                                   </div>
                                   <div className="flex-1">
                                      <h4 className={`text-sm font-bold leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${msg.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{msg.title}</h4>
                                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{msg.preview}</p>
                                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400/80 mt-2 block">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </span>
                                   </div>
                                </div>
                             </div>
                           ))
                         )}
                       </div>
                    </div>
                 </div>
              )}
            </div>
          )}
          
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
                 onClick={() => {
                   setShowProfileCard(!showProfileCard);
                   setShowInbox(false);
                 }}
                 className={`flex items-center gap-2 p-1.5 pr-4 rounded-2xl transition-all duration-300 ${
                   showProfileCard 
                   ? 'bg-[#1A56DB] text-white shadow-lg shadow-blue-500/20' 
                   : isDark 
                     ? 'bg-slate-900 border border-white/20 text-white hover:bg-slate-800'
                     : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:brightness-110'
                 }`}
               >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black overflow-hidden ${isDark ? 'bg-white/10' : 'bg-white/20'}`}>
                    {activeProfile?.avatar ? (
                      <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      activeProfile?.name?.charAt(0) || 'U'
                    )}
                  </div>
                 <span className="text-sm font-bold hidden md:block">Profile</span>
               </button>

               {/* Profile Details Card (Quick View Dropdown) */}
               {showProfileCard && (
                 <div className="absolute top-14 right-0 w-[300px] md:w-[340px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-1 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300">
                    
                    <div className="relative overflow-hidden rounded-[28px] p-6 bg-white dark:bg-slate-900">
                      {/* Subtle background glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                      <div className="relative z-10 flex justify-between items-start mb-6">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                          <div className="relative w-16 h-16 rounded-[18px] bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-3xl font-black shadow-lg overflow-hidden border-2 border-white/20">
                            {activeProfile?.avatar ? (
                              <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              activeProfile?.name?.charAt(0) || 'U'
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setIsModalOpen(true);
                              setShowProfileCard(false);
                            }}
                            className="p-2.5 rounded-xl text-slate-400 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-all shadow-sm"
                          >
                            <Settings size={18} />
                          </button>
                          <button onClick={logout} className="p-2.5 rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                            <LogOut size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="relative z-10 mb-6">
                        <h3 className="font-syne font-black text-2xl text-slate-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                          {activeProfile?.name || 'Student Name'}
                        </h3>
                        <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mt-2 bg-indigo-50 dark:bg-indigo-500/10 w-fit px-3 py-1 rounded-full">
                          <BookOpen size={12} />
                          {activeProfile?.course || 'No Course'} · {activeProfile?.semester || '0'} Sem
                        </p>
                      </div>

                      <div className="relative z-10 space-y-4 pt-5 border-t border-slate-100 dark:border-white/10">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group">
                          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:group-hover:bg-indigo-500/20 transition-colors">
                            <Mail size={14} />
                          </div>
                          <span className="text-xs font-semibold truncate group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{activeProfile?.email || 'email@college.edu'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group">
                          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:group-hover:bg-indigo-500/20 transition-colors">
                            <Phone size={14} />
                          </div>
                          <span className="text-xs font-semibold group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{activeProfile?.phone || 'No Mobile'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group">
                          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:group-hover:bg-indigo-500/20 transition-colors">
                            <School size={14} />
                          </div>
                          <span className="text-xs font-semibold line-clamp-1 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{activeProfile?.dept || 'No Department'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group">
                          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:group-hover:bg-indigo-500/20 transition-colors">
                            <Hash size={14} />
                          </div>
                          <span className="text-xs font-bold font-mono tracking-wider group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{activeProfile?.collegeId || 'ID PENDING'}</span>
                        </div>
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
