import { useRouter } from 'next/router';
import { Syne, Inter } from 'next/font/google';
import { useEffect, useState, createContext } from 'react';
import '../styles/globals.css';
import { CaffinityProvider } from '@/context/CaffinityContext';
import { ArenaProvider } from '@/context/ArenaContext';
import { ProblemBoxProvider } from '@/context/ProblemBoxContext';
import { UAssistProvider } from '@/context/UAssistContext';
import { ShopperzProvider } from '@/context/ShopperzContext';
import { InboxProvider } from '@/context/InboxContext';
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

// Storage helpers to support "Remember Me"
export const setStorageItem = (key, value, remember = false) => {
  if (typeof window === 'undefined') return;
  if (remember) {
    localStorage.setItem(key, value);
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, value);
    localStorage.removeItem(key);
  }
};

export const getStorageItem = (key) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

export const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

// Initial state helper
const getInitialState = (key, fallback) => {
  if (typeof window !== 'undefined') {
    const saved = getStorageItem(key);
    if (key === 'isLoggedIn') {
      return !!getStorageItem('access_token');
    }
    if (key === 'userProfile' && saved) {
      try { return JSON.parse(saved); } catch (e) { return fallback; }
    }
    return saved || fallback;
  }
  return fallback;
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
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
        
        // Preserve their storage preference (if they had access_token in localStorage, keep it there)
        const isPersistent = !!localStorage.getItem('access_token');
        setStorageItem('isLoggedIn', 'true', isPersistent);
        setStorageItem('userProfile', JSON.stringify(data), isPersistent);
        setStorageItem('userRole', data.role || 'user', isPersistent);
      }
    } catch (err) {
      console.log('Sync session failed:', err);
      if (err.status === 401) {
        if (getStorageItem('isLoggedIn') !== 'true') {
          setIsLoggedIn(false);
          setStorageItem('isLoggedIn', 'false');
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
  
  const login = (userData, accessToken, refreshToken, rememberMe = false) => {
    console.log('Executing login sequence for:', userData?.name);
    
    if (accessToken) {
      setStorageItem('access_token', accessToken, rememberMe);
    }
    if (refreshToken) {
      setStorageItem('refresh_token', refreshToken, rememberMe);
    }
    
    setIsLoggedIn(true);
    if (userData) {
      setUserProfile(userData);
      const role = userData.role || 'user';
      setUserRole(role);
      setStorageItem('userProfile', JSON.stringify(userData), rememberMe);
      setStorageItem('userRole', role, rememberMe);
      setStorageItem('role', role, rememberMe);
    }
    setStorageItem('isLoggedIn', 'true', rememberMe);
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
    removeStorageItem('userProfile');
    removeStorageItem('userRole');
    removeStorageItem('role');
    removeStorageItem('access_token');
    removeStorageItem('refresh_token');
    removeStorageItem('isLoggedIn');
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
            <InboxProvider>
              <ShopperzProvider>
                <UAssistProvider>
                  <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                  </Head>
                <div className={`${syne.variable} ${inter.variable} font-inter antialiased transition-colors duration-500 min-h-screen bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white`}>
                  <AuthGuard>
                    <GlobalBroadcast />
                    <Component {...pageProps} />
                    {isLoggedIn && router.pathname !== '/' && router.pathname !== '/login' && (
                      <>
                        <UAssistFab />
                        <AnimatePresence>
                          <UAssistOverlay />
                        </AnimatePresence>
                      </>
                    )}
                  </AuthGuard>
                </div>
                </UAssistProvider>
              </ShopperzProvider>
            </InboxProvider>
          </ProblemBoxProvider>
        </ArenaProvider>
      </CaffinityProvider>
    </ThemeContext.Provider>
  );
}
