import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, 
  Coffee, 
  Ticket, 
  AlertTriangle,
  TrendingUp,
  Megaphone,
  ArrowRight,
  Activity,
  Zap,
  ShieldCheck,
  Search,
  Radio,
  ShoppingBag,
  Bot,
  UserCheck,
  X,
  Mail,
  PhoneCall,
  Sparkles,
  Sliders,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Send,
  SlidersHorizontal,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useProblemBox } from '@/context/ProblemBoxContext';
import { useCaffinity } from '@/context/CaffinityContext';
import { useArena } from '@/context/ArenaContext';
import { useUAssist } from '@/context/UAssistContext';
import { useShopperz } from '@/context/ShopperzContext';
import { useInbox } from '@/context/InboxContext';
import { INITIAL_USER_DB } from '@/data/userData';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState('All');
  
  // Modal states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);
  const [simulatedEvents, setSimulatedEvents] = useState([]);

  // Campus Governance Switch States
  const [governanceSwitches, setGovernanceSwitches] = useState({
    securityMode: 'Standard Authentication',
    dispatchPriority: 'Standard Queuing',
    kitchenFlow: 'Accepting Preorders',
    neuralCopilot: 'Online & Accelerated'
  });
  
  // Pull real state from all campus modules
  const { tickets = [] } = useProblemBox();
  const { orders = [] } = useCaffinity();
  const { registrations = [] } = useArena();
  const { globalLogs = [], sendGlobalBroadcast } = useUAssist();
  const { storeOrders = [], printJobs = [] } = useShopperz();
  const { addMessage } = useInbox();

  const showToast = (message) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3800);
  };

  const handleBroadcast = () => {
    if (!announcement.trim()) {
      showToast('⚠️ Please enter an announcement before broadcasting.');
      return;
    }
    
    // 1. Send via UAssist AI Neural network
    sendGlobalBroadcast(announcement);
    
    // 2. Push directly into universal user student inbox
    addMessage({
      sender: 'Campus Admin HQ',
      avatar: 'HQ',
      title: '📢 Official Campus-Wide Broadcast',
      preview: announcement,
      type: 'announcement',
      link: '/user/dashboard'
    });

    setAnnouncement('');
    showToast('🚀 Global Broadcast successfully transmitted to all student sessions and inboxes!');
  };

  // Lookup student details from user DB for admin inspection
  const handleInspectStudent = (nameOrId) => {
    if (!nameOrId) return;
    const searchStr = nameOrId.toString().toLowerCase().trim();
    
    let db = INITIAL_USER_DB;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campus_user_db');
      if (saved) {
        try { db = JSON.parse(saved); } catch(e){}
      }
    }

    const match = db.find(u => 
      u.email?.toLowerCase().includes(searchStr) || 
      u.name?.toLowerCase().includes(searchStr) || 
      (u.identifier && u.identifier.toLowerCase().includes(searchStr))
    );

    if (match) {
      setSelectedStudent(match);
    } else {
      // Synthesize fallback student record if exact db entry not found
      setSelectedStudent({
        id: 'usr-synth',
        name: typeof nameOrId === 'string' ? nameOrId : 'Student Telemetry User',
        email: `${nameOrId.toString().toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
        role: 'STUDENT',
        department: 'School of Computing & Engineering',
        identifier: '24BCE10488',
        status: 'Active',
        phone: '+91 98000 12345',
        joined: 'August 2024',
        permissions: ['ProblemBox Ticket Filing', 'Caffinity Dining Order', 'UAssist Query', 'Shopperz Access']
      });
    }
  };

  // Toggle campus governance switches
  const handleToggleGovernance = (key, val1, val2, label) => {
    const newVal = governanceSwitches[key] === val1 ? val2 : val1;
    setGovernanceSwitches(prev => ({ ...prev, [key]: newVal }));
    showToast(`⚙️ Protocol Updated: ${label} is now set to "${newVal}"!`);
  };

  // Trigger simulated live event across any module
  const handleSimulateLiveEvent = () => {
    const mockStudents = [
      { name: 'Siddharth Rao', id: '24BCE10502', dept: 'Computer Science' },
      { name: 'Neha Gupta', id: '24BIT10098', dept: 'Biotech' },
      { name: 'Meera Reddy', id: '24BCL10034', dept: 'Civil Engineering' },
      { name: 'Aditya Varma', id: '24ECE10811', dept: 'Electronics' }
    ];
    const mockActionTypes = [
      { module: 'ProblemBox', text: 'Submitted urgent electrical ticket #4812 in Library Hall 2', tag: 'ProblemBox', color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20', icon: AlertTriangle },
      { module: 'Caffinity', text: 'Prepaid ₹160 for Paneer Wrap & Cold Coffee via UPI', tag: 'Caffinity', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Coffee },
      { module: 'Shopperz', text: 'Queued 18-page lab manual print job in Campus Print Studio', tag: 'Shopperz', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20', icon: ShoppingBag },
      { module: 'UAssist AI', text: 'Consulted neural copilot for innovation lab reservation guidelines', tag: 'UAssist', color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20', icon: Bot },
      { module: 'Arena', text: 'Registered for upcoming Campus Coding Hackathon championship', tag: 'Arena', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: Ticket }
    ];

    const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    const randomAction = mockActionTypes[Math.floor(Math.random() * mockActionTypes.length)];

    const newEv = {
      id: Date.now(),
      module: randomAction.module,
      text: `${randomAction.text}`,
      studentName: randomStudent.name,
      studentId: randomStudent.id,
      time: 'Just now',
      tag: randomAction.tag,
      color: randomAction.color,
      icon: randomAction.icon
    };

    setSimulatedEvents(prev => [newEv, ...prev]);
    showToast(`⚡ Live Pulse: New ${randomAction.module} activity detected from ${randomStudent.name}!`);
  };

  // Build aggregated cross-module activity feed
  const aggregatedFeed = useMemo(() => {
    const list = [...simulatedEvents];

    // Add ProblemBox tickets
    tickets.slice(0, 4).forEach(t => {
      list.push({
        id: `t-${t.id}`,
        module: 'ProblemBox',
        text: `Issue #${t.id || 'N/A'}: ${t.title || 'Maintenance request'} (${t.status || 'Pending'})`,
        studentName: t.author?.name || 'Kabir Das',
        studentId: '24ECE10405',
        time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '15 mins ago',
        tag: 'ProblemBox',
        color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
        icon: AlertTriangle
      });
    });

    // Add Caffinity orders
    orders.slice(0, 4).forEach(o => {
      const itemsText = Array.isArray(o.items) ? o.items.map(i => `${i.quantity || 1}x ${i.name}`).join(', ') : 'Campus Meal Order';
      list.push({
        id: `o-${o.id}`,
        module: 'Caffinity',
        text: `Order #${o.id || '8421'}: ${itemsText} - ₹${o.totalAmount || 150} (${o.status || 'Preparing'})`,
        studentName: o.studentName || 'Ananya Singh',
        studentId: o.studentId || '24BBT10112',
        time: o.timestamp ? new Date(o.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '25 mins ago',
        tag: 'Caffinity',
        color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
        icon: Coffee
      });
    });

    // Add Shopperz orders / print jobs
    storeOrders.slice(0, 3).forEach(so => {
      list.push({
        id: `so-${so.id}`,
        module: 'Shopperz',
        text: `Campus Store Pickup #${so.id}: ${so.itemName || 'Engineering Supplies'} (${so.status || 'Ready'})`,
        studentName: so.studentName || 'Rohan Sharma',
        studentId: so.studentId || '24BCE10023',
        time: '40 mins ago',
        tag: 'Shopperz',
        color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
        icon: ShoppingBag
      });
    });
    printJobs.slice(0, 2).forEach(pj => {
      list.push({
        id: `pj-${pj.id}`,
        module: 'Shopperz',
        text: `Print Studio Job #${pj.id}: "${pj.fileName}" (${pj.copies} copies - ₹${pj.cost})`,
        studentName: pj.studentName || 'Priya Patel',
        studentId: pj.studentId || '24BME10322',
        time: '50 mins ago',
        tag: 'Shopperz',
        color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
        icon: ShoppingBag
      });
    });

    // Add UAssist logs
    globalLogs.slice(0, 3).forEach(l => {
      list.push({
        id: `u-${l.id}`,
        module: 'UAssist AI',
        text: `Neural Query: "${l.query || 'Campus inquiry'}" [Intent: ${l.intent || 'GENERAL'}]`,
        studentName: l.student || 'Kushal Jain',
        studentId: l.identifier || '24BCE10255',
        time: l.time || '1 hour ago',
        tag: 'UAssist',
        color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
        icon: Bot
      });
    });

    // Filter by module tag
    return list.filter(item => {
      if (feedFilter === 'All') return true;
      return item.tag === feedFilter;
    }).filter(item => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (item.text || '').toLowerCase().includes(q) || 
             (item.studentName || '').toLowerCase().includes(q) || 
             (item.studentId || '').toLowerCase().includes(q) || 
             (item.module || '').toLowerCase().includes(q);
    });
  }, [simulatedEvents, tickets, orders, storeOrders, printJobs, globalLogs, feedFilter, searchQuery]);

  // Executive KPI stats cards
  const STATS_CARDS = [
    { 
      label: 'ProblemBox Issues', 
      value: tickets.filter(t => t.status !== 'Resolved').length || 3, 
      sublabel: 'Active Open Tickets', 
      icon: AlertTriangle, 
      color: 'text-rose-600 dark:text-rose-400', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/20', 
      actionLabel: '⚡ ProblemBox HQ →', 
      actionRoute: '/admin/problembox' 
    },
    { 
      label: 'Caffinity Orders', 
      value: orders.length || 12, 
      sublabel: 'Kitchen Dining Queue', 
      icon: Coffee, 
      color: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20', 
      actionLabel: '🍔 Kitchen Queue →', 
      actionRoute: '/vendor/caffinity' 
    },
    { 
      label: 'Shopperz & Print', 
      value: (storeOrders.length || 0) + (printJobs.length || 0) + 5, 
      sublabel: 'Retail & Print Studio', 
      icon: ShoppingBag, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20', 
      actionLabel: '🛍️ Shopperz HQ →', 
      actionRoute: '/admin/shopperz' 
    },
    { 
      label: 'UAssist AI Queries', 
      value: globalLogs.length || 8, 
      sublabel: 'Neural Intent Telemetry', 
      icon: Bot, 
      color: 'text-purple-600 dark:text-purple-400', 
      bg: 'bg-purple-500/10', 
      border: 'border-purple-500/20', 
      actionLabel: '🧠 AI Intelligence →', 
      actionRoute: '/admin/uassist' 
    },
    { 
      label: 'Arena Events', 
      value: registrations.length || 14, 
      sublabel: 'Student Event RSVPs', 
      icon: Ticket, 
      color: 'text-emerald-600 dark:text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20', 
      actionLabel: '🏆 Arena HQ →', 
      actionRoute: '/admin/arena' 
    },
    { 
      label: 'Student Directory', 
      value: INITIAL_USER_DB.length ? `${INITIAL_USER_DB.length} Registered` : '10.4k Active', 
      sublabel: 'Verified User Credentials', 
      icon: Users, 
      color: 'text-indigo-600 dark:text-indigo-400', 
      bg: 'bg-indigo-500/10', 
      border: 'border-indigo-500/20', 
      actionLabel: '👥 Manage Users →', 
      actionRoute: '/admin/users' 
    },
  ];

  return (
    <AdminLayout 
      title="Campus HQ Command & Control" 
      subtitle="Master System Intelligence, Module Synchronization & Real-Time User Operations"
    >
      <div className="space-y-10 pb-20 animate-in fade-in duration-500 relative">
        
        {/* Floating Success Toast Notification */}
        <AnimatePresence>
          {notificationToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 right-8 z-[200] bg-slate-900 text-white border border-slate-700/80 rounded-2xl px-6 py-3.5 shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest"
            >
              <Sparkles size={16} className="text-purple-400 animate-pulse" />
              <span>{notificationToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP TOOLBAR: QUICK SEARCH & LIVE SIMULATOR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Activity size={20} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Universal Operations Hub</h4>
              <p className="text-[11px] font-bold text-slate-400">All student user connections & administration modules synchronized.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search student names, Roll ID or tickets..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleSimulateLiveEvent}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0 whitespace-nowrap"
            >
              <RefreshCw size={14} className="animate-spin" />
              <span>+ Simulate Live Campus Activity</span>
            </button>
          </div>
        </div>

        {/* EXECUTIVE MULTI-MODULE KPI NETWORK (Strict Clean White Theme Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
          {STATS_CARDS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                onClick={() => {
                  if (stat.actionRoute) {
                    showToast(`Navigating to ${stat.label}...`);
                    router.push(stat.actionRoute);
                  }
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                      Online ✓
                    </span>
                  </div>

                  <div>
                    <h4 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white truncate">{stat.value}</h4>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-0.5">{stat.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate">{stat.sublabel}</p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 group-hover:underline">
                  <span>{stat.actionLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MIDDLE SECTION: OPERATIONS GOVERNANCE & GLOBAL BROADCAST TRANSMITTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CAMPUS SYSTEMS GOVERNANCE & OPERATIONS MATRIX (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[40px] p-7 sm:p-9 shadow-xl flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <SlidersHorizontal size={13} className="text-purple-500" /> Administrative Command Deck
                </span>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
                  Campus Systems Governance
                </h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Real-time policy overrides connecting admin protocols directly to user experience.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 w-fit shrink-0">
                ⚡ All Engines Reactive
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Switch 1: Wi-Fi Security */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black"><ShieldCheck size={18} /></span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${governanceSwitches.securityMode.includes('Standard') ? 'bg-slate-200 dark:bg-slate-800 text-slate-600' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                      {governanceSwitches.securityMode}
                    </span>
                  </div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">Campus Wi-Fi & OTP Security</h5>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Enforce mandatory student OTP credentials during exams.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleGovernance('securityMode', 'Standard Authentication', 'High Security (OTP Enforced)', 'Campus Wi-Fi Security')}
                  className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 font-black text-[11px] uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
                >
                  Toggle Security Mode
                </button>
              </div>

              {/* Switch 2: ProblemBox Dispatch */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black"><AlertTriangle size={18} /></span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${governanceSwitches.dispatchPriority.includes('Standard') ? 'bg-slate-200 dark:bg-slate-800 text-slate-600' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                      {governanceSwitches.dispatchPriority}
                    </span>
                  </div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">ProblemBox Dispatch Priority</h5>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Activate emergency electrician & IT specialist alerts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleGovernance('dispatchPriority', 'Standard Queuing', 'Rapid Emergency Dispatch', 'ProblemBox Priority')}
                  className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-300 font-black text-[11px] uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
                >
                  Toggle Rapid Dispatch
                </button>
              </div>

              {/* Switch 3: Caffinity Kitchen Intake */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black"><Coffee size={18} /></span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${governanceSwitches.kitchenFlow.includes('Accepting') ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                      {governanceSwitches.kitchenFlow}
                    </span>
                  </div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">Caffinity Kitchen Order Flow</h5>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Manage meal preorder intake during severe lunch hour rush.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleGovernance('kitchenFlow', 'Accepting Preorders', 'Kitchen Overload Pause', 'Caffinity Intake Flow')}
                  className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 font-black text-[11px] uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
                >
                  Toggle Intake Flow
                </button>
              </div>

              {/* Switch 4: UAssist Neural Copilot */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black"><Bot size={18} /></span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
                      {governanceSwitches.neuralCopilot}
                    </span>
                  </div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">UAssist AI Neural Copilot</h5>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Oversee real-time generative responses and intent routing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleGovernance('neuralCopilot', 'Online & Accelerated', 'Maintenance Diagnostic Mode', 'UAssist Copilot Status')}
                  className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 font-black text-[11px] uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
                >
                  Toggle Copilot Engine
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT: MASTER GLOBAL BROADCAST TRANSMITTER (Strict Clean White Theme in Light Mode) (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[40px] p-7 sm:p-9 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Global Broadcast Tower</h3>
                    <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">Direct transmission to all student inboxes & AI interfaces.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Quick Broadcast Templates:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "🌧️ Weather Notice: Afternoon campus lectures moved to online stream.",
                    "🚀 Arena Hackathon: Final 2 hours to complete student registrations!",
                    "🍕 Caffinity Alert: Fresh evening snacks menu now open for orders."
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAnnouncement(tmpl)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-extrabold transition-all text-left border border-slate-200/60 dark:border-slate-700 shadow-sm"
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Custom Announcement Content:
                </label>
                <textarea 
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleBroadcast();
                    }
                  }}
                  placeholder="Type urgent campus announcement here..." 
                  className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-3xl font-bold text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all resize-none shadow-inner"
                  rows={4}
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={handleBroadcast}
              className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5"
            >
              <Send size={16} />
              <span>Broadcast to 10.4k Active Students</span>
            </button>
          </div>

        </div>

        {/* BOTTOM SECTION: UNIVERSAL LIVE PULSE FEED & USER TELEMETRY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[40px] p-7 sm:p-10 shadow-xl space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <Radio className="text-emerald-500 animate-pulse" size={24} />
                <span>Universal Campus Pulse & Activity Feed</span>
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                Real-time synchronized events from ProblemBox, Caffinity, Shopperz, Arena, and UAssist AI. Click **&quot;👤 Inspect Student&quot;** to examine student credentials!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5">
              {['All', 'ProblemBox', 'Caffinity', 'Shopperz', 'UAssist'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setFeedFilter(tag)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                    feedFilter === tag 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {aggregatedFeed.length === 0 ? (
            <div className="py-16 text-center opacity-50 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[35px]">
              <Activity size={44} className="mx-auto mb-3 text-slate-400" />
              <p className="font-black uppercase tracking-widest text-xs text-slate-500">No recent campus activity matching criteria in feed</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[36rem] overflow-y-auto pr-2 custom-scrollbar">
              {aggregatedFeed.map(act => {
                const Icon = act.icon || Activity;
                return (
                  <div 
                    key={act.id} 
                    className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/5 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl ${act.color} border flex items-center justify-center shadow-sm shrink-0 font-black`}>
                        <Icon size={22} />
                      </div>
                      
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-2xs">
                            {act.module}
                          </span>
                          <span className="text-[11px] font-mono font-black text-slate-400">
                            🕒 {act.time}
                          </span>
                        </div>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug break-words">
                          {act.text}
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <span>Initiated by: <strong className="text-purple-600 dark:text-purple-400">{act.studentName}</strong> ({act.studentId})</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleInspectStudent(act.studentName || act.studentId)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm transition-all flex items-center gap-1.5 group-hover:border-purple-500/50"
                      >
                        <UserCheck size={14} />
                        <span>Inspect Student</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL: STUDENT USER TELEMETRY & PROFILE INSPECTION */}
        <AnimatePresence>
          {selectedStudent && (
            <div className="fixed inset-0 z-[190] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[45px] overflow-hidden my-auto relative"
              >
                <div className="h-2.5 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500" />
                
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Master User Directory Record</span>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                        <span>👤 Student Customer Profile</span>
                      </h3>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Top student identity badge */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                      {(selectedStudent.name || 'S')[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">{selectedStudent.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {selectedStudent.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-purple-600 dark:text-purple-400 mt-1">{selectedStudent.department || 'Computer Science Engineering'}</p>
                      <p className="text-[11px] font-mono font-bold text-slate-400">Roll / ID: {selectedStudent.identifier || '24BCE10023'}</p>
                    </div>
                  </div>

                  {/* Contact & credentials */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5 space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Mail size={12}/> Email Address</span>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{selectedStudent.email}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5 space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><PhoneCall size={12}/> Contact Line</span>
                      <p className="text-xs font-mono font-black text-slate-800 dark:text-slate-200 truncate">{selectedStudent.phone || '+91 98765 43210'}</p>
                    </div>
                  </div>

                  {/* Permissions & Module access */}
                  <div className="p-5 bg-purple-500/5 dark:bg-purple-500/10 rounded-3xl border border-purple-500/20 space-y-2">
                    <p className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={15} /> Verified Campus Module Permissions
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(selectedStudent.permissions || ['ProblemBox Filing', 'Caffinity Dining', 'UAssist Query', 'Shopperz Retail']).map((perm, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs font-extrabold shadow-2xs">
                          ✓ {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action controls */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Email advisory dispatched to ${selectedStudent.email}`);
                        setSelectedStudent(null);
                      }}
                      className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Mail size={15} />
                      <span>Email Student Advice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Initiating voice relay call to ${selectedStudent.phone || 'student mobile'}...`);
                        setSelectedStudent(null);
                      }}
                      className="flex-1 py-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <PhoneCall size={15} />
                      <span>Call Mobile</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
