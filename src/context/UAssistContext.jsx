import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeContext } from '@/pages/_app';
import { uassistChat } from '@/routes/user';
import { useInbox } from './InboxContext';
import { INITIAL_USER_DB } from '@/data/userData';

const UAssistContext = createContext();

// Initial Knowledge Base dataset entries for campus intelligence
const INITIAL_FAQS = [
  { id: 'kb-001', q: 'What are the library timings and reading rules?', a: 'KU Central Library & Archives is open 24/7 during exam season and 8:00 AM to 10:00 PM on regular weekdays. Quiet study zones are on floors 2 and 3.', tags: 'LIBRARY, TIMING, ACADEMIC' },
  { id: 'kb-002', q: 'Where and how do I register for athletics and university sports?', a: 'KU Athletics club membership is complimentary for all enrolled students. Visit the Student Union Sports Arena or register digitally via the arena portal.', tags: 'SPORTS, MEMBERSHIP, ARENA' },
  { id: 'kb-003', q: 'How do I access the high-speed campus Wi-Fi net?', a: 'Use your official university Roll/ID number and admission portal credential to authenticate on the "CAMPUS_SECURE" or "EDUROAM" SSID networks.', tags: 'WIFI, INTERNET, IT_HELP' },
  { id: 'kb-004', q: 'How do I submit an urgent campus maintenance or facilities complaint?', a: 'Navigate directly to the ProblemBox module in your app menu to file tickets for electrical, plumbing, network, or cleanliness issues with live tracking.', tags: 'PROBLEM_BOX, COMPLAINTS, FACILITY' },
  { id: 'kb-005', q: 'What is Caffinity and how can I preorder cafeteria food without waiting?', a: 'Caffinity is our campus food order hub! You can browse menus from Main Cafe, Library Cafe, and Food Court, complete pre-payment, and pick up using your digital OTP.', tags: 'CAFFINITY, DINING, FOOD' }
];

// Initial real-time telemetry records from student interactions
const INITIAL_TELEMETRY_LOGS = [
  {
    id: 1718001,
    student: 'Rohan Sharma',
    email: 'rohan.s@campus.edu',
    identifier: '24BCE10023',
    query: 'Is the central library open late tonight for midterm prep?',
    intent: 'LIBRARY, TIMING',
    accuracy: '99.4%',
    time: '2 mins ago',
    fullResponse: 'KU Central Library & Archives is open 24/7 during exam season and 8:00 AM to 10:00 PM on regular weekdays. Quiet study zones are on floors 2 and 3.',
    status: 'Resolved'
  },
  {
    id: 1718002,
    student: 'Ananya Singh',
    email: 'ananya.s@campus.edu',
    identifier: '24BBT10112',
    query: 'How do I get connected to CAMPUS_SECURE wifi on my iPad?',
    intent: 'WIFI, INTERNET',
    accuracy: '98.9%',
    time: '14 mins ago',
    fullResponse: 'Use your official university Roll/ID number and admission portal credential to authenticate on the "CAMPUS_SECURE" or "EDUROAM" SSID networks.',
    status: 'Resolved'
  },
  {
    id: 1718003,
    student: 'Kabir Das',
    email: 'kabir.d@campus.edu',
    identifier: '24ECE10405',
    query: 'Where can I file a report for a blown AC capacitor in ECE block?',
    intent: 'PROBLEM_BOX, COMPLAINTS',
    accuracy: '99.1%',
    time: '32 mins ago',
    fullResponse: 'Navigate directly to the ProblemBox module in your app menu to file tickets for electrical, plumbing, network, or cleanliness issues with live tracking.',
    status: 'Resolved'
  },
  {
    id: 1718004,
    student: 'Meera Reddy',
    email: 'meera.r@campus.edu',
    identifier: '24BCL10034',
    query: 'How do I book tickets for the Upcoming Hackathon in Arena?',
    intent: 'ARENA, EVENTS',
    accuracy: '97.5%',
    time: '1 hour ago',
    fullResponse: 'Head over to the Arena section in your dashboard to view active campus registrations, RSVP for hackathons, and download your entry QR ticket.',
    status: 'Resolved'
  },
  {
    id: 1718005,
    student: 'Kushal Jain',
    email: 'kushal.j@campus.edu',
    identifier: '24BCE10255',
    query: 'Can I sell my old engineering graphics drafter on Shopperz market?',
    intent: 'SHOPPERZ, P2P_MARKET',
    accuracy: '98.2%',
    time: '3 hours ago',
    fullResponse: 'Yes! Open Shopperz from your navigation bar and select Student Market to publish second-hand textbooks, drafting tools, and electronics to peers.',
    status: 'Resolved'
  }
];

export function UAssistProvider({ children }) {
  const router = useRouter();
  const { userProfile } = useContext(ThemeContext);
  const { addMessage } = useInbox();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: `👋 Hey ${userProfile?.name?.split(' ')[0] || 'there'}! I am your UAssist neural companion. I can guide you through library hours, Wi-Fi credentials, Caffinity dining, ProblemBox ticketing, or campus events. How can I assist you today?`, time: 'Just now' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  
  // Admin governance and live telemetry state
  const [globalLogs, setGlobalLogs] = useState(INITIAL_TELEMETRY_LOGS);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [modelConfig, setModelConfig] = useState({
    engine: 'Gemini 2.5 Pro (Deep Reasoning & Multi-Modal)',
    temperature: 0.3,
    escalationThreshold: 75,
    status: 'Online & Tensor Accelerated'
  });
  
  const [queryCount, setQueryCount] = useState(0);
  const queryLimit = 15;
  const [isPremium, setIsPremium] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [prefillText, setPrefillText] = useState('');
  const [globalBroadcast, setGlobalBroadcast] = useState(null);

  // Broadcast emergency or announcement message to all student user sessions and inbox
  const sendGlobalBroadcast = (message) => {
    const bObj = { id: Date.now(), message, timestamp: 'Just now' };
    setGlobalBroadcast(bObj);
    
    // Concurrently push to universal inbox for lasting visibility
    addMessage({
      sender: 'UAssist Intelligence Hub',
      avatar: 'AI',
      title: '🚨 Official Campus AI Broadcast',
      preview: message,
      type: 'system_alert',
      link: '/user/dashboard'
    });
  };

  const dismissBroadcast = () => {
    setGlobalBroadcast(null);
  };

  // Add new FAQ dataset to neural memory
  const addFAQ = (faq) => {
    const newEntry = {
      id: `kb-${Math.floor(Math.random() * 9000) + 1000}`,
      ...faq
    };
    setFaqs(prev => [newEntry, ...prev]);
    return newEntry;
  };

  // Update existing FAQ dataset entry
  const updateFAQ = (id, updates) => {
    setFaqs(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // Remove FAQ dataset entry from knowledge base
  const deleteFAQ = (id) => {
    setFaqs(prev => prev.filter(item => item.id !== id));
  };

  // Simulate AI intent matching against live knowledge base for admin diagnostics
  const simulateKnowledgeMatch = (testQuery) => {
    if (!testQuery) return null;
    const qLower = testQuery.toLowerCase();
    
    // Check keywords in FAQ questions or tags
    let bestMatch = null;
    let highestScore = 0;

    faqs.forEach(faq => {
      const qWords = faq.q.toLowerCase().split(/\s+/);
      const tagWords = faq.tags.toLowerCase().split(/[,\s]+/);
      const combined = [...qWords, ...tagWords];
      
      let matchCount = 0;
      combined.forEach(w => {
        if (w.length > 3 && qLower.includes(w)) matchCount++;
      });
      
      if (matchCount > highestScore) {
        highestScore = matchCount;
        bestMatch = faq;
      }
    });

    if (bestMatch && highestScore > 0) {
      return {
        matched: true,
        faq: bestMatch,
        confidence: '99.4%',
        intent: bestMatch.tags,
        response: bestMatch.a
      };
    }

    return {
      matched: false,
      confidence: '64.2%',
      intent: 'GENERAL_CHAT / FALLBACK',
      response: "I couldn't locate an exact match in my training datasets. Would you like me to connect you to campus administration or file a ProblemBox ticket?"
    };
  };

  // Simulate an incoming student query in real time for admin test demonstrations
  const triggerSimulatedStudentQuery = () => {
    const sampleStudents = [
      { name: 'Siddharth Rao', email: 'siddharth.r@campus.edu', identifier: '24BCE10502' },
      { name: 'Neha Gupta', email: 'neha.g@campus.edu', identifier: '24BIT10098' },
      { name: 'Raju Canteen', email: 'maincafe@campus.edu', identifier: 'VND-4421' },
      { name: 'Rohan Sharma', email: 'rohan.s@campus.edu', identifier: '24BCE10023' }
    ];
    const sampleQuestions = [
      { q: 'Where can I find the semester examination schedule for CSE department?', intent: 'ACADEMIC, EXAM_SCHEDULE', a: 'Check the Academic Hub under your profile menu for downloadable date sheets and hall ticket status.' },
      { q: 'Can I extend my borrowed library literature by an extra 3 days?', intent: 'LIBRARY, BOOK_EXTENSION', a: 'Yes! Open the Library Services tab and click renew before the due date to enjoy a complimentary 7-day renewal.' },
      { q: 'What is the procedure to book the innovation & incubation lab for robotics?', intent: 'LAB_RESERVATION, FACILITY', a: 'Innovation & Incubation Lab booking requests require faculty supervisor endorsement via the Arena facilities portal.' }
    ];

    const randomStudent = sampleStudents[Math.floor(Math.random() * sampleStudents.length)];
    const randomQ = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];

    const newLog = {
      id: Date.now(),
      student: randomStudent.name,
      email: randomStudent.email,
      identifier: randomStudent.identifier,
      query: randomQ.q,
      intent: randomQ.intent,
      accuracy: '99.2%',
      time: 'Just now',
      fullResponse: randomQ.a,
      status: 'Resolved'
    };

    setGlobalLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // Retrieve full campus user record for admin inspection modal
  const getStudentDetails = (studentNameOrObj) => {
    if (!studentNameOrObj) return null;
    const searchStr = typeof studentNameOrObj === 'object' ? (studentNameOrObj.email || studentNameOrObj.name || '') : studentNameOrObj.toString();
    const clean = searchStr.toLowerCase().trim();

    let db = INITIAL_USER_DB;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campus_user_db');
      if (saved) {
        try { db = JSON.parse(saved); } catch(e){}
      }
    }

    const match = db.find(u => 
      u.email.toLowerCase().includes(clean) || 
      u.name.toLowerCase().includes(clean) || 
      (u.identifier && u.identifier.toLowerCase().includes(clean))
    );

    if (match) return match;

    // Synthesize realistic default profile if exact db entry not found
    return {
      id: 'usr-synth',
      name: typeof studentNameOrObj === 'object' ? studentNameOrObj.name : studentNameOrObj,
      email: typeof studentNameOrObj === 'object' ? (studentNameOrObj.email || 'student@campus.edu') : `${studentNameOrObj.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      role: 'STUDENT',
      department: 'School of Computing & Engineering',
      identifier: typeof studentNameOrObj === 'object' && studentNameOrObj.identifier ? studentNameOrObj.identifier : '24BCE10999',
      status: 'Active',
      phone: '+91 98000 12345',
      joined: 'August 2024',
      permissions: ['UAssist Unlimited Query', 'ProblemBox Filing', 'Library Access', 'Caffinity Order']
    };
  };

  // Detect current dashboard context for contextual guidance
  const getActiveContext = () => {
    const path = router.pathname;
    if (path === '/user/map') return { type: 'map', label: 'Viewing Campus Map', icon: '🗺' };
    if (path.includes('caffinity')) return { type: 'food', label: 'Browsing Caffinity Menu', icon: '🍔' };
    if (path === '/user/arena') return { type: 'events', label: 'Viewing Arena Events', icon: '🎫' };
    if (path === '/user/problembox') return { type: 'report', label: 'ProblemBox Command Center', icon: '🔧' };
    return { type: 'general', label: 'Campus Dashboard', icon: '🤖' };
  };

  // Process live user queries with FAQ matching fallback & backend routing
  const processMessage = async (text) => {
    if (queryCount >= queryLimit && !isPremium) return 'LIMIT_REACHED';

    setIsThinking(true);
    setThinkingText('Consulting Neural Brain...');
    setQueryCount(prev => prev + 1);

    try {
      // First verify against dynamic admin knowledge base FAQs
      const kbMatch = simulateKnowledgeMatch(text);
      let aiResponseContent = null;
      let intentTag = 'GENERAL_QUERY';

      if (kbMatch && kbMatch.matched) {
        aiResponseContent = kbMatch.response;
        intentTag = kbMatch.intent;
      } else {
        // Call backend API if no exact local KB match
        const res = await uassistChat(text, userProfile?.id);
        aiResponseContent = res.message || "I couldn't process that. Try rephrasing your request?";
        intentTag = res.type || 'GENERAL_QUERY';
      }

      const aiResponse = {
        id: Date.now(),
        role: 'ai',
        content: aiResponseContent,
        type: 'text',
        time: 'Just now'
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Push live log to telemetry matrix
      setGlobalLogs(prev => [{
        id: Date.now(),
        student: userProfile?.name || 'Current Student',
        email: userProfile?.email || 'student@campus.edu',
        identifier: userProfile?.identifier || '24BCE10000',
        query: text,
        intent: intentTag,
        accuracy: '99.1%',
        time: 'Just now',
        fullResponse: aiResponse.content,
        status: 'Resolved'
      }, ...prev]);

    } catch (e) {
      console.error('UAssist API Error:', e);
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: "My connection to the campus neural network experienced a momentary interruption! 🧠🔌", time: 'Just now' }]);
    } finally {
       setIsThinking(false);
       setThinkingText('');
    }
  };

  const sendMessage = (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    processMessage(text);
  };

  return (
    <UAssistContext.Provider value={{
      isOpen, setIsOpen,
      messages, sendMessage,
      isThinking, thinkingText,
      activeContext: getActiveContext(),
      queryCount, queryLimit,
      isPremium, setIsPremium,
      conversationHistory,
      prefillText, setPrefillText,
      globalBroadcast, sendGlobalBroadcast, dismissBroadcast,
      globalLogs, faqs, addFAQ, updateFAQ, deleteFAQ, simulateKnowledgeMatch,
      triggerSimulatedStudentQuery, getStudentDetails, modelConfig, setModelConfig
    }}>
      {children}
    </UAssistContext.Provider>
  );
}

export function useUAssist() {
  return useContext(UAssistContext);
}
