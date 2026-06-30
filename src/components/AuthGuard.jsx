import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeContext } from '@/pages/_app';
import { Lock, Loader2 } from 'lucide-react';

const PROTECTED_ROUTES = ['/user', '/admin', '/vendor'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isLoggedIn } = useContext(ThemeContext);
  const [showPopup, setShowPopup] = useState(false);

  // Check if current route is protected
  const isProtected = PROTECTED_ROUTES.some(route => router.pathname.startsWith(route));

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
