import { Syne, Inter } from 'next/font/google';
import { useEffect, useState, createContext } from 'react';
import '../styles/globals.css';
import { CaffinityProvider } from '@/context/CaffinityContext';
import { ArenaProvider } from '@/context/ArenaContext';
import { ProblemBoxProvider } from '@/context/ProblemBoxContext';
import { UAssistProvider } from '@/context/UAssistContext';
import { ShopperzProvider } from '@/context/ShopperzContext';
import UAssistFab from '@/components/uassist/UAssistFab';
import UAssistOverlay from '@/components/uassist/UAssistOverlay';
import GlobalBroadcast from '@/components/uassist/GlobalBroadcast';
import AuthGuard from '@/components/AuthGuard';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

import { getUserProfile, logoutUser } from '@/routes/user';
import { logoutAdmin } from '@/routes/admin';

export const ThemeContext = createContext();

// Initial state helper (to prevent hydration mismatch/flicker)
const getInitialState = (key, fallback) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (key === 'isLoggedIn') {
      // With the new Bearer token flow, access_token is the ultimate source of truth
      return !!localStorage.getItem('access_token');
    }
    if (key === 'userProfile' && saved) {
      try { return JSON.parse(saved); } catch (e) { return fallback; }
    }
    return saved || fallback;
  }
  return fallback;
};

export default function App({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialState('isLoggedIn', false));
  const [userProfile, setUserProfile] = useState(getInitialState('userProfile', null));
  const [userRole, setUserRole] = useState(getInitialState('userRole', 'user'));
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial Load & Theme Check
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }

    // Check backend session to sync profile, but don't force logout immediately if we have a hint
    checkSession();
    setIsMounted(true);
  }, []);

  const checkSession = async () => {
    try {
      const data = await getUserProfile();
      if (data) {
        setIsLoggedIn(true);
        setUserProfile(data);
        setUserRole(data.role || 'user');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userProfile', JSON.stringify(data));
        localStorage.setItem('userRole', data.role || 'user');
      }
    } catch (err) {
      console.log('Sync session failed:', err);
      // Only force logout if it's a clear 401 and we aren't just in the middle of a login
      if (err.status === 401) {
        // If we have a hint, maybe the cookie is just slow? 
        // We'll only logout if the hint is also false
        if (localStorage.getItem('isLoggedIn') !== 'true') {
          setIsLoggedIn(false);
          localStorage.setItem('isLoggedIn', 'false');
        }
      }
    }
  };

  // 2. Reactive Class Management (Theme)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // 3. Auth & Profile Handlers
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  
  const login = (userData, accessToken, refreshToken) => {
    console.log('Executing login sequence for:', userData?.name);
    
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    
    setIsLoggedIn(true);
    if (userData) {
      setUserProfile(userData);
      const role = userData.role || 'user';
      setUserRole(role);
      localStorage.setItem('userProfile', JSON.stringify(userData));
      localStorage.setItem('userRole', role);
      localStorage.setItem('role', role); // Matching guide
    }
    localStorage.setItem('isLoggedIn', 'true');
    // Give the browser a moment to register state before syncing
    setTimeout(() => checkSession(), 500);
  };

  const logout = async () => {
    try {
      await (userRole === 'admin' ? logoutAdmin() : logoutUser());
    } catch (e) {}
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserRole('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('isLoggedIn', 'false');
  };

  const updateProfile = (data) => {
    const newProfile = { ...userProfile, ...data };
    setUserProfile(newProfile);
  };

  if (!isMounted) return <div className="bg-white dark:bg-[#020617] min-h-screen" />;

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, toggleTheme, 
      isLoggedIn, login, logout,
      userProfile, updateProfile 
    }}>
      <CaffinityProvider>
        <ArenaProvider>
          <ProblemBoxProvider>
            <ShopperzProvider>
              <UAssistProvider>
                <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                </Head>
                <div className={`${syne.variable} ${inter.variable} font-inter antialiased transition-colors duration-500 min-h-screen bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white`}>
                  <AuthGuard>
                    <GlobalBroadcast />
                    <Component {...pageProps} />
                    <UAssistFab />
                    <AnimatePresence>
                      <UAssistOverlay />
                    </AnimatePresence>
                  </AuthGuard>
                </div>
              </UAssistProvider>
            </ShopperzProvider>
          </ProblemBoxProvider>
        </ArenaProvider>
      </CaffinityProvider>
    </ThemeContext.Provider>
  );
}
