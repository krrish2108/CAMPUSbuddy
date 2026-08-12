import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminInboxContext = createContext();


  // ==========================================
  // 🗄️ DATABASE INTEGRATION POINT (ADMIN)
  // -> Hook up high-privilege queries, mutations, and analytics here.
  // ==========================================
  export function useAdminInbox() {
  return useContext(AdminInboxContext);
}


  // ==========================================
  // 🗄️ DATABASE INTEGRATION POINT (ADMIN)
  // -> Hook up high-privilege queries, mutations, and analytics here.
  // ==========================================
  export function AdminInboxProvider({ children }) {
  const [messages, setMessages] = useState([]);
  
  // Load messages from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusbuddy_inbox');
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse inbox');
        }
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('campusbuddy_inbox', JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (message) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      ...message
    };
    setMessages(prev => [newMessage, ...prev]);
    return newMessage;
  };

  const markAsRead = (id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  const clearAll = () => {
    setMessages([]);
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <AdminInboxContext.Provider value={{ messages, unreadCount, addMessage, markAsRead, clearAll }}>
      {children}
    </AdminInboxContext.Provider>
  );
}
