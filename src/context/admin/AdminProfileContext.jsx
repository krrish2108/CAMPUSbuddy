import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminProfileContext = createContext();

// ==========================================
// 🗄️ DATABASE INTEGRATION POINT (ADMIN)
// -> Hook up Supabase/Firebase realtime subscriptions or API fetches here.
// -> Fetch the aggregated student profiles for admin dashboard view, or admin's own profile.
// ==========================================
export function AdminProfileProvider({ children }) {
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campus_admin_profile');
      if (saved) {
        setAdminProfile(JSON.parse(saved));
      } else {
        setAdminProfile({
          name: 'Campus Admin',
          role: 'Administrator',
          avatar: null
        });
      }
    }
  }, []);

  const updateAdminProfile = (data) => {
    const newProfile = { ...adminProfile, ...data };
    setAdminProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campus_admin_profile', JSON.stringify(newProfile));
    }
  };

  return (
    <AdminProfileContext.Provider value={{ adminProfile, updateAdminProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
}

export const useAdminProfile = () => useContext(AdminProfileContext);
