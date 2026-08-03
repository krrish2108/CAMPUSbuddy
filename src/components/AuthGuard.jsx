import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeContext } from '@/pages/_app';
import { Lock, Loader2, AlertTriangle } from 'lucide-react';

const PROTECTED_ROUTES = ['/user', '/admin', '/vendor'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isLoggedIn, userProfile, logout } = useContext(ThemeContext);
  const [showPopup, setShowPopup] = useState(false);

  // Check if current route is protected
  const isProtected = PROTECTED_ROUTES.some(route => router.pathname.startsWith(route));

  // Check real-time suspension / hold status from user database
  let accountStatus = userProfile?.status || 'Active';
  if (isLoggedIn && typeof window !== 'undefined' && userProfile?.email) {
    const savedDb = localStorage.getItem('campus_user_db');
    if (savedDb) {
      try {
        const db = JSON.parse(savedDb);
        const match = db.find(u => u.email.toLowerCase() === userProfile.email.toLowerCase() || u.name.toLowerCase() === userProfile.name?.toLowerCase());
        if (match && match.status) {
          accountStatus = match.status;
        }
      } catch (e) {}
    }
  }

  // Admin users bypass restriction on /admin routes so they can manage accounts, otherwise block
  const isRestricted = (accountStatus === 'Suspended' || accountStatus === 'On Hold' || accountStatus === 'Under Review') && !router.pathname.startsWith('/admin');

  useEffect(() => {
    if (isProtected && !isLoggedIn) {
      setShowPopup(true);
      
      // Redirect after a short delay
      const timer = setTimeout(() => {
        router.push(`/login?redirect=${router.pathname}`);
      }, 2500);
      
      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [isProtected, isLoggedIn, router]);

  // If user account is Suspended or On Hold, show authoritative blocking screen
  if (isProtected && isLoggedIn && isRestricted) {
    const isSuspended = accountStatus === 'Suspended';
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 animate-in fade-in duration-500 font-sans">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-10 rounded-[40px] shadow-2xl max-w-lg w-full text-center flex flex-col items-center space-y-6 relative overflow-hidden">
          {/* Top colored accent */}
          <div className={`absolute top-0 left-0 right-0 h-2 ${isSuspended ? 'bg-red-600' : 'bg-amber-500'}`} />
          <div className={`absolute -top-24 -right-24 w-52 h-52 blur-[60px] rounded-full pointer-events-none ${isSuspended ? 'bg-red-500/20' : 'bg-amber-500/20'}`} />

          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-2 ${isSuspended ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20'}`}>
            <AlertTriangle size={36} className="animate-pulse" />
          </div>

          <div className="space-y-3 relative z-10">
            <span className={`inline-block text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border ${isSuspended ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'}`}>
              Account Status: {accountStatus}
            </span>
            <h2 className="text-3xl font-syne font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
              {isSuspended ? 'Access Terminated' : 'Account On Hold'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {isSuspended 
                ? 'Your CampusBuddy account access has been suspended by authorities due to policy violation or disciplinary action. All modules and services are strictly prohibited.' 
                : 'Your account access is temporarily on hold pending complete review or verification. You cannot use CampusBuddy modules until an Administrator activates your account.'}
            </p>
          </div>

          <div className="w-full p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400">
            Need assistance? Contact <span className="text-slate-900 dark:text-white">helpdesk@campus.edu</span> or visit Admin HQ.
          </div>

          <button 
            onClick={() => {
              if (logout) logout();
              router.push('/login');
            }}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95"
          >
            Sign Out & Return to Login
          </button>
        </div>
      </div>
    );
  }

  // If it's a protected route and user is NOT logged in, show the popup instead of the page content
  if (isProtected && !isLoggedIn) {
    if (showPopup) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 animate-in fade-in duration-500 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-red-100 dark:border-red-500/20 p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center flex flex-col items-center space-y-6 relative overflow-hidden">
            {/* Background red glow */}
            <div className="absolute top-0 w-full h-1 bg-red-500" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[50px] rounded-full" />
            
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
              <Lock size={32} />
            </div>
            
            <div className="space-y-2 relative z-10">
              <h2 className="text-3xl font-syne font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                Access Denied
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                You must be logged in to view this module.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-full mt-4">
              <Loader2 size={14} className="animate-spin text-blue-500" />
              Redirecting to Login...
            </div>
          </div>
        </div>
      );
    }
    // Return null while waiting for the effect to set showPopup (prevents flash of content)
    return <div className="min-h-screen bg-slate-50 dark:bg-[#020617]" />;
  }

  // Otherwise, render the protected content (or public content)
  return children;
}
