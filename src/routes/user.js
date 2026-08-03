import { CANTEENS, MENU_ITEMS } from '@/data/caffinityData';
import { EVENTS, MOCK_REGISTRATIONS } from '@/data/arenaData';
import { RETAIL_PRODUCTS, MARKET_LISTINGS } from '@/data/shopperzData';
import { MOCK_TICKETS } from '@/data/problemData';

// Delay helper to simulate network request
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AUTHENTICATION & PROFILE
 */
export const login = async (email, password) => {
  await delay();
  let name = 'Demo User';
  let role = email.includes('admin') ? 'admin' : (email.includes('vendor') ? 'vendor' : 'user');
  let status = 'Active';

  if (typeof window !== 'undefined') {
    const savedDb = localStorage.getItem('campus_user_db');
    if (savedDb) {
      const db = JSON.parse(savedDb);
      const matched = db.find(u => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase());
      if (matched) {
        name = matched.name;
        role = matched.role ? matched.role.toLowerCase() : role;
        status = matched.status || 'Active';
      }
    }
  }

  return { 
    status: 'success', 
    access_token: 'mock_token',
    refresh_token: 'mock_refresh',
    user: { name, email, role, status } 
  };
};

export const register = async (data) => {
  await delay();
  return { status: 'success' };
};

export const verifyOtp = async (email, otp_code) => {
  await delay();
  let name = 'Demo User';
  let role = email.includes('admin') ? 'admin' : (email.includes('vendor') ? 'vendor' : 'user');
  let status = 'Active';

  if (typeof window !== 'undefined') {
    const savedDb = localStorage.getItem('campus_user_db');
    if (savedDb) {
      const db = JSON.parse(savedDb);
      const matched = db.find(u => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase());
      if (matched) {
        name = matched.name;
        role = matched.role ? matched.role.toLowerCase() : role;
        status = matched.status || 'Active';
      }
    }
  }

  return { status: 'success', user: { name, email, role, status } };
};

export const getUserProfile = async () => {
  await delay();
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('userProfile') || sessionStorage.getItem('userProfile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sync against latest db status
        const savedDb = localStorage.getItem('campus_user_db');
        if (savedDb && parsed.email) {
          const db = JSON.parse(savedDb);
          const matched = db.find(u => u.email.toLowerCase() === parsed.email.toLowerCase() || u.name.toLowerCase() === parsed.name?.toLowerCase());
          if (matched) {
            parsed.status = matched.status;
            parsed.role = matched.role ? matched.role.toLowerCase() : parsed.role;
          }
        }
        return parsed;
      } catch (e) {}
    }
  }
  const role = typeof window !== 'undefined' ? (localStorage.getItem('role') || sessionStorage.getItem('role') || 'user') : 'user';
  return { name: 'Demo User', role, status: 'Active' };
};

export const searchStudents = async (query) => {
  await delay();
  return { success: true, data: [] };
};

export const logoutUser = async () => {
  await delay();
  return { success: true };
};

/**
 * CAFFINITY (FOOD)
 */
export const getCanteens = async () => {
  await delay();
  return { success: true, data: CANTEENS };
};

export const getMenu = async (canteenId = null) => {
  await delay();
  return { success: true, data: MENU_ITEMS };
};

export const placeCaffinityOrder = async (orderData) => {
  await delay();
  const newOrder = {
    id: `ORD-${Math.floor(Math.random() * 1000)}`,
    ...orderData,
    status: 'Preparing',
    timestamp: new Date().toISOString()
  };
  return { success: true, data: newOrder };
};

/**
 * ARENA (EVENTS)
 */
export const getArenaEvents = async () => {
  await delay();
  return { success: true, data: EVENTS };
};

export const rsvpArenaEvent = async (data) => {
  await delay();
  return { success: true, data };
};

export const getArenaRegistrations = async () => {
  await delay();
  return { success: true, data: MOCK_REGISTRATIONS };
};

export const sendArenaTeamSync = async (data) => {
  await delay();
  return { success: true, data };
};

export const getArenaTeamSyncs = async () => {
  await delay();
  return { success: true, data: [] };
};

export const updateArenaTeamSync = async (syncId, status) => {
  await delay();
  return { success: true, data: { status } };
};

/**
 * SHOPPERZ (STORE & MARKET)
 */
export const getShopperzRetail = async () => {
  await delay();
  return { success: true, data: RETAIL_PRODUCTS };
};

export const getShopperzMarket = async () => {
  await delay();
  return { success: true, data: MARKET_LISTINGS };
};

export const placeShopperzOrder = async (data) => {
  await delay();
  return { success: true, data };
};

export const reserveMarketItem = async (id, studentId) => {
  await delay();
  return { success: true, data: { id, status: 'Reserved' } };
};

export const submitPrintJob = async (data) => {
  await delay();
  return { success: true, data };
};

export const getPrintJobs = async () => {
  await delay();
  return { success: true, data: [] };
};

/**
 * PROBLEM BOX (TICKETS)
 */
export const getTickets = async () => {
  await delay();
  return { success: true, data: MOCK_TICKETS };
};

export const createTicket = async (ticketData) => {
  await delay();
  const newTicket = {
    id: `PBX-${Math.floor(Math.random() * 1000)}`,
    ...ticketData,
    status: 'Raised',
    timeline: [
      { step: 'Raised', time: 'Just now', completed: true, active: true }
    ],
    createdAt: new Date().toISOString()
  };
  return { success: true, data: newTicket };
};

/**
 * UASSIST (AI AGENT)
 */
export const uassistChat = async (message, userId) => {
  await delay();
  return { success: true, reply: "I am a mock UAssist agent." };
};

export const uassistArena = async (message, userId) => {
  await delay();
  return { success: true, reply: "I am a mock UAssist Arena agent." };
};
