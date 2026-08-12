import React, { createContext, useContext, useState, useEffect } from 'react';

const UserProfileContext = createContext();

// ==========================================
// 🗄️ DATABASE INTEGRATION POINT (USER)
// -> Hook up Supabase/Firebase realtime subscriptions or API fetches here.
// -> Fetch the currently logged-in student's profile (name, skills, certificates).
// ==========================================
export function UserProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);

  // Fallback / Initial Mock Load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campus_user_profile');
      if (saved) {
        setUserProfile(JSON.parse(saved));
      } else {
        setUserProfile({
          name: 'Demo User',
          dept: 'Computer Science',
          semester: '1st Semester',
          collegeId: '24BCE10023',
          phone: '',
          skills: [],
          certificates: [],
          avatar: null
        });
      }
    }
  }, []);

  const updateProfile = (data) => {
    const newProfile = { ...userProfile, ...data };
    setUserProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campus_user_profile', JSON.stringify(newProfile));
    }
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => useContext(UserProfileContext);
