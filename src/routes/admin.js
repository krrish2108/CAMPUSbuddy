import { INITIAL_USER_DB, INITIAL_LOCATIONS_DB } from '@/data/userData';

// Delay helper to simulate network request
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AUTHENTICATION
 */
export const logoutAdmin = async () => {
  await delay();
  return { success: true };
};

/**
 * ARENA (EVENT MANAGEMENT)
 */
export const addArenaEvent = async (eventData) => {
  await delay();
  return { success: true, data: { id: `EVT-${Math.floor(Math.random() * 1000)}`, ...eventData } };
};

export const updateArenaEvent = async (id, eventData) => {
  await delay();
  return { success: true, data: { id, ...eventData } };
};

export const deleteArenaEvent = async (id) => {
  await delay();
  return { success: true };
};

/**
 * PROBLEM BOX (MANAGEMENT)
 */
export const updateTicketStatusAdmin = async (id, status, officialResponse) => {
  await delay();
  return { success: true, data: { id, status, officialResponse } };
};

export const assignTicketAdmin = async (id, departmentId) => {
  await delay();
  return { success: true, data: { id, assignedTo: departmentId } };
};

/**
 * USER IDENTITY & ROLE GOVERNANCE DATABASE (USER_DB)
 */
export const fetchUserDb = async () => {
  await delay(200);
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('campus_user_db');
    if (saved) {
      return { success: true, data: JSON.parse(saved) };
    }
    localStorage.setItem('campus_user_db', JSON.stringify(INITIAL_USER_DB));
  }
  return { success: true, data: INITIAL_USER_DB };
};

export const syncUserDb = async (users) => {
  await delay(100);
  if (typeof window !== 'undefined') {
    localStorage.setItem('campus_user_db', JSON.stringify(users));
  }
  return { success: true };
};

export const createUserIdentity = async (userData) => {
  await delay(300);
  const newId = `usr-${Math.floor(Math.random() * 900) + 100}`;
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-pink-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-violet-600 to-indigo-700'
  ];
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
  const newUser = {
    id: newId,
    name: userData.name || 'New Identity',
    email: userData.email || 'user@campus.edu',
    role: userData.role || 'STUDENT',
    department: userData.department || 'General Studies',
    identifier: userData.identifier || `ID-${Math.floor(Math.random() * 10000)}`,
    joined: userData.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: userData.status || 'Active',
    phone: userData.phone || '+91 90000 00000',
    lastActive: 'Just now',
    avatarGradient: randomGradient,
    permissions: userData.permissions || ['Standard Campus Access']
  };

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('campus_user_db');
    const list = saved ? JSON.parse(saved) : [...INITIAL_USER_DB];
    list.unshift(newUser);
    localStorage.setItem('campus_user_db', JSON.stringify(list));
  }
  return { success: true, data: newUser };
};

/**
 * GLOBAL MASTER LOCATIONS DATABASE
 */
export const fetchLocationsDb = async () => {
  await delay(100);
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('campus_locations_db');
    if (saved) {
      return { success: true, data: JSON.parse(saved) };
    }
    localStorage.setItem('campus_locations_db', JSON.stringify(INITIAL_LOCATIONS_DB));
  }
  return { success: true, data: INITIAL_LOCATIONS_DB };
};

export const syncLocationsDb = async (locations) => {
  await delay(100);
  if (typeof window !== 'undefined') {
    localStorage.setItem('campus_locations_db', JSON.stringify(locations));
  }
  return { success: true };
};
