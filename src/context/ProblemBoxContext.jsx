import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTickets } from '@/routes/user';
import { DEPARTMENTS } from '@/data/problemData';

const ProblemBoxContext = createContext();

export function ProblemBoxProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [hasNewCriticalAlert, setHasNewCriticalAlert] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Load storage and auto-clean resolved tickets older than 24h
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load specialists directory
      const savedSpecs = localStorage.getItem('campus_problembox_specialists');
      if (savedSpecs) {
        try { setSpecialists(JSON.parse(savedSpecs)); } catch (e) { setSpecialists(DEPARTMENTS); }
      } else {
        setSpecialists(DEPARTMENTS);
      }

      // Load tickets and run 24-hour expiration check
      const savedTickets = localStorage.getItem('campus_problembox_tickets');
      let loadedTickets = [];
      if (savedTickets) {
        try { loadedTickets = JSON.parse(savedTickets); } catch (e) {}
      }
      if (!loadedTickets || loadedTickets.length === 0) {
        const res = await getTickets();
        if (res.success) loadedTickets = res.data;
      }

      // Filter out resolved tickets older than 24 hours
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const activeTickets = loadedTickets.filter(t => {
        if (t.status === 'Resolved' && t.resolvedAt) {
          return (now - new Date(t.resolvedAt).getTime()) <= oneDayMs;
        }
        return true;
      });

      setTickets(activeTickets);
    } catch (e) {
      console.error('Failed loading problem data:', e);
      setSpecialists(DEPARTMENTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Persist tickets state changes
  useEffect(() => {
    if (!isLoading && tickets.length > 0) {
      localStorage.setItem('campus_problembox_tickets', JSON.stringify(tickets));
    }
  }, [tickets, isLoading]);

  // Persist specialists directory changes
  useEffect(() => {
    if (!isLoading && specialists.length > 0) {
      localStorage.setItem('campus_problembox_specialists', JSON.stringify(specialists));
    }
  }, [specialists, isLoading]);

  // Score specialist keywords against problem report text
  const matchProblemToSpecialist = (title = '', description = '', location = '', category = '') => {
    const text = `${title} ${description} ${location} ${category}`.toLowerCase();
    const specs = specialists.length > 0 ? specialists : DEPARTMENTS;
    let bestMatch = specs[0];
    let maxScore = -1;
    let hitWords = [];

    specs.forEach(spec => {
      let score = category === spec.category ? 5 : 0;
      let matched = [];
      (spec.keywords || []).forEach(kw => {
        if (text.includes(kw.toLowerCase())) {
          score += 3;
          matched.push(kw);
        }
      });
      if (text.includes(spec.name.toLowerCase())) score += 4;
      if (score > maxScore) {
        maxScore = score;
        bestMatch = spec;
        hitWords = matched;
      }
    });

    const confidenceNum = Math.min(99, Math.max(88, 85 + (maxScore * 3)));
    return { specialist: bestMatch, confidence: `${confidenceNum}%`, matchedKeywords: hitWords };
  };

  // Create new ticket with AI matching
  const addTicket = async (ticketData) => {
    try {
      const match = matchProblemToSpecialist(ticketData.title, ticketData.description, ticketData.location, ticketData.category);
      const autoSummary = match.matchedKeywords.length > 0
        ? `🤖 UAssist matched to ${match.specialist.name} (${match.specialist.lead}) via tags: [${match.matchedKeywords.slice(0,3).join(', ')}].`
        : `🤖 UAssist assigned to ${match.specialist.name} (${match.specialist.lead}).`;

      const newTicket = {
        id: `PBX-0${Math.floor(100 + Math.random() * 900)}`,
        ...ticketData,
        status: 'Raised',
        progress: 15,
        upvotes: 1,
        assignedTo: match.specialist.id,
        aiConfidence: match.confidence,
        aiSummary: autoSummary,
        timeline: [
          { step: 'Raised', time: 'Just now', completed: true, active: true },
          { step: 'Triaged', time: 'Pending', completed: false },
          { step: 'Assigned', time: `Auto-assigned to ${match.specialist.lead}`, completed: true, active: false },
          { step: 'In Progress', time: 'Pending', completed: false },
          { step: 'Resolved', time: 'Pending', completed: false }
        ],
        resolution: null,
        createdAt: new Date().toISOString()
      };
      setTickets(prev => [newTicket, ...prev]);
      playPing();
      return newTicket;
    } catch (e) {
      console.error('Ticket creation error:', e);
    }
  };

  // Delete a ticket from system
  const deleteTicket = (id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    playPing();
  };

  // Revert a finished ticket back to working status
  const undoFinish = (id) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const resetTimeline = (t.timeline || []).map((step, idx) => ({
          ...step,
          completed: step.step !== 'Resolved',
          active: step.step === 'In Progress',
          time: step.step === 'Resolved' ? 'Pending' : step.time
        }));
        return {
          ...t,
          status: 'InProgress',
          progress: 75,
          resolvedAt: null,
          timeline: resetTimeline,
          officialResponse: 'Resolution undone by Admin. Ticket reopened for inspection.'
        };
      }
      return t;
    }));
    playPing();
  };

  // Purge all solved tickets immediately
  const purgeResolvedTickets = () => {
    setTickets(prev => prev.filter(t => t.status !== 'Resolved'));
    playPing();
  };

  // Specialist directory operations
  const addSpecialist = (specData) => {
    const newSpec = {
      id: specData.id || `sp_${Date.now()}`,
      name: specData.name || 'New Dept',
      lead: specData.lead || 'Assigned Officer',
      role: specData.role || 'Specialist',
      phone: specData.phone || '+91 90000 00000',
      ext: specData.ext || 'Ext. 0000',
      email: specData.email || 'specialist@campus.edu',
      category: specData.category || 'others',
      keywords: Array.isArray(specData.keywords) ? specData.keywords : (specData.keywords || '').split(',').map(k => k.trim()).filter(Boolean)
    };
    setSpecialists(prev => [...prev, newSpec]);
    playPing();
  };

  const updateSpecialist = (id, updatedData) => {
    setSpecialists(prev => prev.map(s => {
      if (s.id === id) {
        const kw = Array.isArray(updatedData.keywords) ? updatedData.keywords : (updatedData.keywords || '').split(',').map(k => k.trim()).filter(Boolean);
        return { ...s, ...updatedData, keywords: kw };
      }
      return s;
    }));
    playPing();
  };

  const deleteSpecialist = (id) => {
    setSpecialists(prev => prev.filter(s => s.id !== id));
  };

  // Audio feedback
  const playPing = () => {
    try {
      const audio = new Audio('/sounds/status_ping.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  const upvoteTicket = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, upvotes: (t.upvotes || 0) + 1, hasUpvoted: true } : t));
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const reopenTicket = (id) => {
    undoFinish(id);
  };

  const updateTicketStatus = (id, newStatus, extraData = {}) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        let newProgress = t.progress || 10;
        if (newStatus === 'Raised') newProgress = 15;
        if (newStatus === 'Triaged') newProgress = 40;
        if (newStatus === 'InProgress') newProgress = 70;
        if (newStatus === 'Resolved') newProgress = 100;

        const updatedTimeline = (t.timeline || []).map(step => {
          if (step.step === newStatus || (newStatus === 'InProgress' && step.step === 'In Progress')) {
            return { ...step, completed: true, active: true, time: 'Just now' };
          }
          if (newStatus === 'Resolved' || step.completed) {
            return { ...step, completed: true, active: false };
          }
          return step;
        });

        const isNowResolved = newStatus === 'Resolved';
        return { 
          ...t, 
          status: newStatus, 
          progress: newProgress,
          resolvedAt: isNowResolved ? new Date().toISOString() : t.resolvedAt,
          timeline: updatedTimeline, 
          ...extraData 
        };
      }
      return t;
    }));
    playPing();
  };

  // Adjust resolution percentage slider
  const updateTicketProgress = (id, newProgress, resolutionDetails = null) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const progressVal = Number(newProgress);
        let updatedStatus = t.status;
        let resData = t.resolution;
        let updatedTimeline = [...(t.timeline || [])];
        let resTime = t.resolvedAt;

        if (progressVal === 100 && t.status !== 'Resolved') {
          updatedStatus = 'Resolved';
          resTime = new Date().toISOString();
          resData = resolutionDetails || {
            solvedBy: 'Campus Emergency Maintenance Team',
            desc: 'Issue verified solved after field intervention and multi-point inspection.',
            duration: 'Completed via Live Command'
          };
          updatedTimeline = updatedTimeline.map(s => ({
            ...s, 
            completed: true, 
            active: s.step === 'Resolved', 
            time: s.step === 'Resolved' ? 'Just now' : s.time
          }));
        } else if (progressVal < 100 && t.status === 'Resolved') {
          updatedStatus = 'InProgress';
          resTime = null;
          updatedTimeline = updatedTimeline.map(s => ({
            ...s,
            completed: s.step !== 'Resolved',
            active: s.step === 'In Progress'
          }));
        } else if (progressVal < 100 && progressVal >= 50 && t.status === 'Raised') {
          updatedStatus = 'InProgress';
        }

        return {
          ...t,
          progress: progressVal,
          status: updatedStatus,
          resolvedAt: resTime,
          resolution: resData,
          timeline: updatedTimeline
        };
      }
      return t;
    }));
  };

  const addAdminResponse = (id, response) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, aiSummary: response, officialResponse: response } : t));
  };

  const assignTicket = (id, deptId) => {
    const targetSpec = specialists.find(s => s.id === deptId) || specialists[0];
    setTickets(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        assignedTo: deptId, 
        status: 'InProgress', 
        progress: Math.max(t.progress || 20, 50),
        aiSummary: `Officer re-assigned to ${targetSpec ? targetSpec.lead : 'Maintainer'} via Admin Command.`
      } : t
    ));
  };

  const toggleAdmin = () => setIsAdminView(prev => !prev);
  const dismissAlert = () => setHasNewCriticalAlert(false);
  const addSuggestion = (text) => setSuggestions(prev => [{ id: Date.now(), text, upvotes: 0, time: 'Just now' }, ...prev]);
  const upvoteSuggestion = (id) => setSuggestions(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));

  return (
    <ProblemBoxContext.Provider value={{
      tickets,
      specialists,
      isLoading,
      isAdminView,
      hasNewCriticalAlert,
      toggleAdmin,
      dismissAlert,
      addTicket,
      deleteTicket,
      undoFinish,
      purgeResolvedTickets,
      upvoteTicket,
      updateTicketStatus,
      updateTicketProgress,
      addAdminResponse,
      assignTicket,
      addSpecialist,
      updateSpecialist,
      deleteSpecialist,
      matchProblemToSpecialist,
      suggestions,
      addSuggestion,
      upvoteSuggestion,
      reopenTicket
    }}>
      {children}
    </ProblemBoxContext.Provider>
  );
}

export function useProblemBox() {
  const context = useContext(ProblemBoxContext);
  if (!context) throw new Error('useProblemBox must be used inside ProblemBoxProvider');
  return context;
}
