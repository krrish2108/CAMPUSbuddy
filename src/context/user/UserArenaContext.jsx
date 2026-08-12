import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getArenaEvents, 
  getArenaRegistrations, 
  rsvpArenaEvent, 
  getArenaTeamSyncs, 
  sendArenaTeamSync, 
  updateArenaTeamSync,
  searchStudents,
  getUserProfile
} from '@/routes/user';
import { addArenaEvent } from '@/routes/admin';

const UserArenaContext = createContext();


  // ==========================================
  // 🗄️ DATABASE INTEGRATION POINT (USER)
  // -> Hook up Supabase/Firebase realtime subscriptions or API fetches here.
  // ==========================================
  export function UserArenaProvider({ children }) {
  const [registrations, setRegistrations] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTeamTier, setActiveTeamTier] = useState('Duo');
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('Events');
  const [pendingNetworkRequests, setPendingNetworkRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [incomingSyncRequest, setIncomingSyncRequest] = useState(null);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // 1. Initial Data Fetch
  useEffect(() => {
    loadProfile();
    loadEvents();
    loadRegistrations();
  }, []);

  useEffect(() => {
    if (user && events.length > 0) {
      loadTeamSyncs();
    }
  }, [user, events]);

  const loadProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res) setUser(res);
    } catch (e) { console.error('Error loading profile'); }
  };

  const loadRegistrations = async () => {
    try {
      const res = await getArenaRegistrations();
      if (res.success) setRegistrations(res.data);
    } catch (e) { console.error('Error loading registrations'); }
  };

  const loadTeamSyncs = async () => {
    if (!user) return;
    try {
      const res = await getArenaTeamSyncs();
      if (res.success) {
        // filter for pending requests where I am the recipient
        const incoming = res.data.find(s => s.recipientId === user.id && s.status === 'Pending'); 
        if (incoming) {
          const event = events.find(e => e.id === incoming.eventId);
          if (event) {
            setIncomingSyncRequest({
              ...incoming,
              event: { title: event.title, banner: event.coverImage, id: event.id },
              type: incoming.tier
            });
          }
        }
      }
    } catch (e) { console.error('Error loading syncs'); }
  };

  const saveEventsToStorage = (updatedEvents) => {
    setEvents(updatedEvents);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campus_arena_events', JSON.stringify(updatedEvents));
    }
  };

  const loadEvents = async () => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('campus_arena_events');
        if (saved) {
          try {
            setEvents(JSON.parse(saved));
            setIsLoading(false);
            return;
          } catch (err) {
            console.error('Failed to parse saved arena events', err);
          }
        }
      }
      const res = await getArenaEvents();
      if (res.success) {
        setEvents(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('campus_arena_events', JSON.stringify(res.data));
        }
      }
    } catch (e) {
      console.error('Error loading events');
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (newEvent) => {
    try {
      const res = await addArenaEvent(newEvent);
      if (res.success && res.data) {
        saveEventsToStorage([res.data, ...events]);
      }
    } catch (e) {
      console.error('Error adding event');
    }
  };

  const updateEvent = (id, updatedEvent) => {
    const nextEvents = events.map(ev => ev.id === id ? { ...ev, ...updatedEvent } : ev);
    saveEventsToStorage(nextEvents);
  };

  const deleteEvent = (id) => {
    const nextEvents = events.filter(ev => ev.id !== id);
    saveEventsToStorage(nextEvents);
  };

  // Removed mock sync simulation

  const rsvpToEvent = async (event) => {
    if (registrations.some(r => r.eventId === event.id)) return;
    
    try {
      const res = await rsvpArenaEvent({ eventId: event.id });
      if (res) {
        setRegistrations(prev => [...prev, res]);
        return res;
      }
    } catch (e) {
      console.error('RSVP Failed:', e);
    }
  };

  const acceptSyncRequest = async () => {
    if (incomingSyncRequest) {
      try {
        await updateArenaTeamSync(incomingSyncRequest.id, 'Accepted');
        await rsvpToEvent(incomingSyncRequest.event);
        setIncomingSyncRequest(null);
        
        const notif = {
          id: Date.now(),
          type: 'incoming',
          message: `Sync confirmed! You are now joined for the event. 🚀`,
          time: 'Just now'
        };
        setNotifications(prev => [notif, ...prev]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notif.id)), 5000);
      } catch (e) { console.error('Accept Failed'); }
    }
  };

  const declineSyncRequest = async () => {
    if (incomingSyncRequest) {
      try {
        await updateArenaTeamSync(incomingSyncRequest.id, 'Declined');
        setIncomingSyncRequest(null);
      } catch (e) { console.error('Decline Failed'); }
    }
  };

  const sendTeamRequest = async (friend, eventId, eventTitle) => {
    if (sentRequests.includes(friend.id)) return;
    
    try {
      const res = await sendArenaTeamSync({
        eventId: eventId,
        recipientId: friend.id,
        tier: activeTeamTier
      });

      if (res) {
        setSentRequests(prev => [...prev, friend.id]);
        
        const outgoingId = Date.now();
        const outgoingNotif = {
          id: outgoingId,
          type: 'outgoing',
          message: `Sync request sent to ${friend.name}! 📱`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications(prev => [outgoingNotif, ...prev]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== outgoingId)), 5000);
      }
    } catch (e) {
      console.error('Sync Request Failed');
    }
  };

  const acceptNetworkRequest = (requestId) => {
    const request = pendingNetworkRequests.find(r => r.id === requestId);
    if (request) {
      setConnections(prev => [...prev, request]);
      setPendingNetworkRequests(prev => prev.filter(r => r.id !== requestId));
      
      const notif = {
        id: Date.now(),
        type: 'incoming',
        message: `You are now connected with ${request.name}! 🤝`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications(prev => [notif, ...prev]);
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notif.id)), 5000);
    }
  };

  const declineNetworkRequest = (requestId) => {
    setPendingNetworkRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const clearNotifications = () => setNotifications([]);

  const findTeammates = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await searchStudents(query);
      if (res.success) setSearchResults(res.data);
    } catch (e) {
      console.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <UserArenaContext.Provider value={{
      registrations,
      sentRequests,
      activeTeamTier,
      setActiveTeamTier,
      notifications,
      activeTab,
      setActiveTab,
      pendingNetworkRequests,
      connections,
      incomingSyncRequest,
      rsvpToEvent,
      sendTeamRequest,
      acceptNetworkRequest,
      declineNetworkRequest,
      acceptSyncRequest,
      declineSyncRequest,
      clearNotifications,
      setSentRequests,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      isLoading,
      searchResults,
      isSearching,
      findTeammates
    }}>
      {children}
    </UserArenaContext.Provider>
  );
}


  // ==========================================
  // 🗄️ DATABASE INTEGRATION POINT (USER)
  // -> Hook up Supabase/Firebase realtime subscriptions or API fetches here.
  // ==========================================
  export function useUserArena() {
  const context = useContext(UserArenaContext);
  if (!context) {
    throw new Error('useUserArena must be used within an UserArenaProvider');
  }
  return context;
}
