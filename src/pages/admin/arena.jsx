import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Plus, 
  Trash2, 
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  MonitorPlay,
  Mail,
  Send,
  Check,
  Search,
  Filter,
  QrCode,
  UserCheck,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Share2,
  FileText,
  X,
  Phone,
  Building,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminArena } from '@/context/admin/AdminArenaContext';
import { EVENT_CATEGORIES } from '@/data/arenaData';

function ArenaAdminContent() {
  const { events, updateEvent, deleteEvent, addEvent } = useAdminArena();
  const [activeTab, setActiveTab] = useState('Registration Hub');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Hackathon',
    date: '',
    capacity: 500,
    registrationLink: '',
    description: '',
    photos: [] // { url: '', order: 0 }
  });

  const [photoUrl, setPhotoUrl] = useState('');

  // =========================================================
  // REGISTRATION HUB & STUDENT DATA SYSTEM STATE
  // =========================================================
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState('ALL'); // 'ALL' | 'CHECKED_IN' | 'PENDING'
  
  const [registrants, setRegistrants] = useState([
    { ticketId: 'TK-849', name: 'Rohan Sharma', email: 'rohan.s@campus.edu', collegeId: '24BCE10023', department: 'Computer Science & Eng.', mode: 'SOLO', checkIn: true, registeredAt: 'Yesterday, 4:15 PM', phone: '+91 98765 12345', eventIndex: 0, avatarGradient: 'from-blue-500 to-indigo-600' },
    { ticketId: 'TK-850', name: 'Priya Patel', email: 'priya.p@campus.edu', collegeId: '24BCE10105', department: 'Information Technology', mode: 'DUO SYNC', checkIn: false, registeredAt: 'Today, 9:30 AM', phone: '+91 91234 56789', eventIndex: 0, avatarGradient: 'from-pink-500 to-purple-600' },
    { ticketId: 'TK-851', name: 'Amit Kumar', email: 'amit.k@campus.edu', collegeId: '24BME20044', department: 'Mechanical Engineering', mode: 'TRIO', checkIn: true, registeredAt: '2 days ago', phone: '+91 99887 76655', eventIndex: 0, avatarGradient: 'from-emerald-500 to-teal-600' },
    { ticketId: 'TK-852', name: 'Ananya Singh', email: 'ananya.s@campus.edu', collegeId: '24BBT10112', department: 'Biotechnology & Bio', mode: 'SOLO', checkIn: false, registeredAt: 'Today, 11:10 AM', phone: '+91 94567 89012', eventIndex: 0, avatarGradient: 'from-amber-500 to-orange-600' },
    { ticketId: 'TK-853', name: 'Kabir Das', email: 'kabir.d@campus.edu', collegeId: '24ECE10405', department: 'Electronics & Comm.', mode: 'DUO SYNC', checkIn: true, registeredAt: '3 days ago', phone: '+91 93456 78901', eventIndex: 0, avatarGradient: 'from-cyan-500 to-blue-600' },
    { ticketId: 'TK-854', name: 'Meera Reddy', email: 'meera.r@campus.edu', collegeId: '24BCL10034', department: 'Civil Engineering', mode: 'SOLO', checkIn: true, registeredAt: 'Apr 10, 2026', phone: '+91 90123 45678', eventIndex: 1, avatarGradient: 'from-purple-500 to-pink-600' },
    { ticketId: 'TK-855', name: 'Siddharth Rao', email: 'siddharth.r@campus.edu', collegeId: '23BCS10892', department: 'Computer Science', mode: 'SOLO', checkIn: false, registeredAt: 'Apr 11, 2026', phone: '+91 98900 11223', eventIndex: 1, avatarGradient: 'from-indigo-500 to-purple-600' },
    { ticketId: 'TK-856', name: 'Kushal Jain', email: 'kushal.j@campus.edu', collegeId: '24BCE10255', department: 'Computer Science', mode: 'TEAM QUAD', checkIn: true, registeredAt: 'Apr 12, 2026', phone: '+91 97788 99001', eventIndex: 2, avatarGradient: 'from-teal-500 to-emerald-600' },
    { ticketId: 'TK-857', name: 'Neha Gupta', email: 'neha.g@campus.edu', collegeId: '24BIT10098', department: 'Information Technology', mode: 'SOLO', checkIn: false, registeredAt: 'Apr 14, 2026', phone: '+91 89012 34567', eventIndex: 2, avatarGradient: 'from-yellow-500 to-amber-600' },
  ]);

  // Modals for Registration Hub
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTargetUser, setEmailTargetUser] = useState(null); // null = broadcast, object = individual student
  const [emailForm, setEmailForm] = useState({
    recipientGroup: 'ALL', // 'ALL' | 'PENDING' | 'CHECKED_IN'
    template: 'REMINDER',
    subject: 'Important Reminder: Check-in & Event Timeline',
    body: 'Hello Attendee,\n\nWe look forward to hosting you for our upcoming campus event! Please ensure you bring your college student ID card and have your CampusBuddy digital ticket ready upon arrival for seamless barcode verification at the entrance desk.\n\nBest Regards,\nCampusBuddy Arena Headquarters'
  });
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [sentLogs, setSentLogs] = useState([]);

  // Active Event Object
  const currentEvent = events[selectedEventIndex] || events[0];

  // Filtered Attendees for current event and search query
  const eventAttendees = registrants.filter(r => (r.eventIndex === selectedEventIndex || selectedEventIndex >= 3)).filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.ticketId.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.collegeId.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.department.toLowerCase().includes(attendeeSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (attendeeStatusFilter === 'CHECKED_IN') return r.checkIn === true;
    if (attendeeStatusFilter === 'PENDING') return r.checkIn === false;
    return true;
  });

  // KPI calculations for current selected event
  const totalInEvent = registrants.filter(r => (r.eventIndex === selectedEventIndex || selectedEventIndex >= 3)).length;
  const checkedInCount = registrants.filter(r => (r.eventIndex === selectedEventIndex || selectedEventIndex >= 3) && r.checkIn).length;
  const pendingCount = totalInEvent - checkedInCount;

  // Toggle Check-in status
  const toggleCheckIn = (ticketId, e) => {
    if (e) e.stopPropagation();
    setRegistrants(prev => prev.map(r => r.ticketId === ticketId ? { ...r, checkIn: !r.checkIn } : r));
    if (selectedTicket && selectedTicket.ticketId === ticketId) {
      setSelectedTicket(prev => ({ ...prev, checkIn: !prev.checkIn }));
    }
  };

  // Open email modal for broadcast
  const launchBroadcastModal = () => {
    setEmailTargetUser(null);
    handleTemplateChange('REMINDER', currentEvent?.title);
    setShowEmailModal(true);
  };

  // Open email modal for single student
  const launchSingleEmailModal = (student, e) => {
    if (e) e.stopPropagation();
    setEmailTargetUser(student);
    setEmailForm({
      recipientGroup: 'SINGLE',
      template: 'DIRECT',
      subject: `Direct Communication: Regarding your registration for ${currentEvent?.title || 'Arena Event'}`,
      body: `Hello ${student.name},\n\nWe are reaching out regarding your ticket (${student.ticketId}) for ${currentEvent?.title || 'the upcoming campus event'}. Please review your attendance verification details below.\n\nBest Regards,\nArena Event Operations`
    });
    setShowEmailModal(true);
  };

  const handleTemplateChange = (template, eventName) => {
    let subject = '';
    let body = '';
    if (template === 'REMINDER') {
      subject = `Important Reminder: Check-in & Timeline for ${eventName || 'Event'}`;
      body = `Hello Attendee,\n\nWe look forward to hosting you for ${eventName || 'our upcoming event'}! Please arrive 30 minutes prior to scheduled start time at ${currentEvent?.location || 'the designated venue'}. Have your college ID and digital ticket QR ready for check-in scan.\n\nRegards,\nArena Event Operations`;
    } else if (template === 'VENUE_CHANGE') {
      subject = `Urgent Update: Venue & Room Re-allocation for ${eventName || 'Event'}`;
      body = `Hello Attendee,\n\nPlease take note of an important venue update regarding ${eventName || 'our upcoming event'}. Due to increased student participation and seating capacity adjustments, check-in operations have been relocated to ${currentEvent?.location || 'Engineering Block Hall'}. Please proceed directly to the new venue.\n\nRegards,\nArena Event Operations`;
    } else if (template === 'PREREQ') {
      subject = `Rulebook & Prerequisite Instructions: ${eventName || 'Event'}`;
      body = `Hello Attendee,\n\nTo ensure a seamless experience during ${eventName || 'our event'}, please verify that your laptop chargers, software requirements, and student ID verification are ready prior to arrival. Review the full rulebook on your CampusBuddy student dashboard.\n\nRegards,\nArena Event Operations`;
    } else {
      subject = `Announcement regarding ${eventName || 'Event'}`;
      body = `Hello Attendee,\n\nWrite your custom announcement, timeline schedule, or special instruction here...\n\nRegards,\nArena Event Operations`;
    }
    setEmailForm(prev => ({ ...prev, template, subject, body }));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSuccess(true);
      const targetLabel = emailTargetUser ? `${emailTargetUser.name} (${emailTargetUser.email})` : `Broadcast (${emailForm.recipientGroup === 'ALL' ? 'All Registrants' : emailForm.recipientGroup === 'CHECKED_IN' ? 'Checked-In Students' : emailForm.recipientGroup === 'ALL_CAMPUS' ? 'All Campus Students' : 'Pending Check-In Students'})`;
      setSentLogs(prev => [{
        id: Date.now(),
        target: targetLabel,
        subject: emailForm.subject,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventTitle: currentEvent?.title || 'General'
      }, ...prev]);
      setTimeout(() => {
        setEmailSuccess(false);
        setShowEmailModal(false);
        setEmailTargetUser(null);
      }, 1800);
    }, 1500);
  };

  // =========================================================
  // EVENT DIRECTORY HANDLERS
  // =========================================================
  const changeStatus = (id, newStatus) => {
    updateEvent(id, { status: newStatus });
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setNewEvent({
      title: ev.title || '',
      category: ev.category || (ev.tags && ev.tags[0]) || 'Hackathon',
      date: ev.date || '',
      capacity: ev.capacity?.total ?? ev.capacity ?? 500,
      registrationLink: ev.registrationLink || '',
      description: ev.description || '',
      photos: ev.photos || []
    });
    setShowCreateModal(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setNewEvent({ title: '', category: 'Hackathon', date: '', capacity: 500, registrationLink: '', description: '', photos: [] });
    setShowCreateModal(true);
  };

  const addPhoto = () => {
    if (!photoUrl) return;
    setNewEvent(prev => ({
      ...prev,
      photos: [...prev.photos, { url: photoUrl, order: prev.photos.length }]
    }));
    setPhotoUrl('');
  };

  const removePhoto = (index) => {
    setNewEvent(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i }))
    }));
  };

  const handleDeploy = () => {
    if (editingId) {
      const existing = events.find(e => e.id === editingId);
      const updatedEvent = {
        ...existing,
        title: newEvent.title,
        category: newEvent.category,
        date: newEvent.date,
        capacity: typeof existing?.capacity === 'object' 
          ? { ...existing.capacity, total: parseInt(newEvent.capacity) || 500 }
          : parseInt(newEvent.capacity) || 500,
        registrationLink: newEvent.registrationLink,
        description: newEvent.description || '',
        photos: newEvent.photos,
        coverImage: newEvent.photos[0]?.url || existing?.coverImage,
        tags: [newEvent.category, ...(existing?.tags?.slice(1) || [])]
      };
      updateEvent(editingId, updatedEvent);
    } else {
      const eventToDeploy = {
        ...newEvent,
        organizer: 'Campus Admin',
        status: 'Live',
        capacity: { total: parseInt(newEvent.capacity) || 500, filled: 0 },
        location: 'To be announced',
        description: newEvent.description || 'No detailed description provided.',
        coverImage: newEvent.photos[0]?.url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        tags: [newEvent.category],
        timeline: { startsIn: 'Upcoming', duration: 'TBD' }
      };
      addEvent(eventToDeploy);
    }
    setShowCreateModal(false);
    setEditingId(null);
    setNewEvent({ title: '', category: 'Hackathon', date: '', capacity: 500, registrationLink: '', description: '', photos: [] });
  };

  return (
    <AdminLayout 
      title="Arena Control" 
      subtitle="Event & Capacity Management"
    >
      <div className="space-y-10 pb-20 text-slate-900 dark:text-slate-100">
        
        {/* TABS */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-2">
          {['Event Directory', 'Registration Hub'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                 activeTab === tab ? 'text-pink-600 dark:text-pink-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
               }`}
             >
               {tab}
               {activeTab === tab && <motion.div layoutId="arena-tab" className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-full shadow-[0_0_12px_#ec4899]" />}
             </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Event Directory' && (
            <motion.div 
              key="dir"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Event Editor</h3>
                   <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Govern campus life operations & hackathon capacities</p>
                 </div>
                 <button 
                   onClick={openCreateModal}
                   className="px-7 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                 >
                   <Plus size={18} /> Launch New Event
                 </button>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {events.map((ev, i) => (
                    <motion.div 
                      key={ev.id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[40px] p-8 shadow-xl dark:shadow-2xl relative overflow-hidden group hover:border-pink-500/40 transition-all flex flex-col justify-between"
                    >
                       <div>
                         <div className="flex items-start justify-between mb-6">
                            <div className="space-y-2">
                               <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                     ev.status === 'Live' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' :
                                     ev.status === 'Completed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10' :
                                     ev.status === 'On Hold' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                     'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  }`}>
                                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${ev.status === 'Live' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                                    {ev.status}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-extrabold px-2.5 py-1 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950">{ev.category || (ev.tags && ev.tags[0])}</span>
                               </div>
                               <h4 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight truncate max-w-[280px]">{ev.title}</h4>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                               <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm">
                                 <CalendarDays size={14} className="text-pink-500 shrink-0" /> {ev.date}
                               </div>
                               <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm">
                                 <MapPin size={14} className="text-purple-500 shrink-0" /> {ev.location}
                               </div>
                            </div>
                         </div>

                         <div className="bg-slate-50 dark:bg-slate-950/80 p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 mb-6 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance & Registrations</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white italic mt-0.5">
                                   {ev.capacity?.filled ?? ev.participants ?? 0} <span className="text-slate-400 text-base">/ {ev.capacity?.total ?? ev.capacity ?? 0} Cap</span>
                                </p>
                              </div>
                              <button 
                                onClick={() => { setSelectedEventIndex(i); setActiveTab('Registration Hub'); }}
                                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-black text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-purple-200 dark:border-purple-500/20"
                              >
                                <Users size={14} />
                                <span>Manage Roster →</span>
                              </button>
                            </div>
                            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div 
                                  className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                                    ((ev.capacity?.filled ?? ev.participants ?? 0) >= (ev.capacity?.total ?? ev.capacity ?? 1) * 0.9) ? 'from-rose-500 to-red-600' : 'from-pink-500 to-purple-600'
                                  }`} 
                                  style={{ width: `${Math.min(100, ((ev.capacity?.filled ?? ev.participants ?? 0) / (ev.capacity?.total ?? ev.capacity ?? 1)) * 100)}%` }}
                               />
                            </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-4 gap-3 pt-2">
                          <button onClick={() => changeStatus(ev.id, 'On Hold')} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
                            <Pause size={17} className="mb-1" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Hold</span>
                          </button>
                          <button onClick={() => changeStatus(ev.id, 'Live')} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 hover:bg-green-50 dark:hover:bg-green-500/10 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-all">
                            <Play size={17} className="mb-1" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Activate</span>
                          </button>
                          <button onClick={() => startEdit(ev)} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                            <Edit2 size={17} className="mb-1" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Edit</span>
                          </button>
                          <button onClick={() => deleteEvent(ev.id)} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all border border-rose-200/60 dark:border-rose-500/20">
                            <Trash2 size={17} className="mb-1" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Delete</span>
                          </button>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'Registration Hub' && (
            <motion.div 
               key="reg"
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               className="space-y-8"
            >
               {/* REGISTRATION HUB COMMAND CONSOLE */}
               <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[45px] p-6 sm:p-10 shadow-2xl space-y-8">
                  
                  {/* Header with Broadcast Action */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="px-3 py-1 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-pink-200 dark:border-pink-500/20">
                          Live Roll Call DB
                        </span>
                        <span className="text-xs font-bold text-slate-400">|</span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Venue: {currentEvent?.location || 'Main Campus'}</span>
                      </div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Registrations & Student Attendance</h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Manage attendee roster, verify tickets, toggle check-ins, and broadcast important notifications</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button 
                        onClick={launchBroadcastModal}
                        className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5"
                      >
                        <Mail size={18} className="animate-bounce" />
                        <span>Broadcast Email / SMS Update</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* EVENT SELECTOR PILLS */}
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 pl-1">Select Event To Govern Roster:</p>
                     <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                        {events.map((ev, i) => (
                           <button 
                             key={ev.id || i}
                             onClick={() => setSelectedEventIndex(i)} 
                             className={`px-6 py-4 rounded-2xl border-2 whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5 ${
                               i === selectedEventIndex 
                                 ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-xl shadow-purple-500/20 scale-[1.02]' 
                                 : 'bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                             }`}
                           >
                             <Radio size={15} className={i === selectedEventIndex ? 'animate-pulse text-white' : 'text-slate-400'} />
                             <span>{ev.title}</span>
                             <span className={`px-2 py-0.5 rounded-lg text-[10px] ml-1 ${i === selectedEventIndex ? 'bg-white/20 text-white font-black' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                               {i === 0 ? 5 : i === 1 ? 2 : 2} Registered
                             </span>
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* ACTIVE EVENT KPI SUMMARY BAR & FILTER CONTROLS */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[32px] border border-slate-200/80 dark:border-white/5 flex flex-col xl:flex-row items-center justify-between gap-6">
                    
                    {/* Live KPI mini tags */}
                    <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                      <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Registrants</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">{totalInEvent} Students</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checked In</p>
                          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">{checkedInCount} Verified</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Check-In</p>
                          <p className="text-lg font-black text-amber-600 dark:text-amber-400 leading-none mt-0.5">{pendingCount} Awaiting</p>
                        </div>
                      </div>
                    </div>

                    {/* Search & Filter pills */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto justify-end">
                      <div className="relative w-full sm:w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={17} />
                        <input 
                          type="text" 
                          placeholder="Search attendee, ticket ID..." 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-pink-500 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold placeholder:text-slate-400 outline-none transition-all"
                          value={attendeeSearch}
                          onChange={(e) => setAttendeeSearch(e.target.value)}
                        />
                        {attendeeSearch && (
                          <button onClick={() => setAttendeeSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X size={15} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full sm:w-auto justify-center">
                        {[
                          { id: 'ALL', label: 'All' },
                          { id: 'CHECKED_IN', label: 'Verified' },
                          { id: 'PENDING', label: 'Pending' }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setAttendeeStatusFilter(f.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                              attendeeStatusFilter === f.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* HIGH-END STUDENT ATTENDANCE TABLE */}
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 rounded-[35px] overflow-hidden shadow-sm">
                     <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-6">Ticket & QR</th>
                              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Attendee</th>
                              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department & Roll ID</th>
                              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg Mode</th>
                              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-In Status (Click to toggle)</th>
                              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-6">Quick Actions</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                           {eventAttendees.length === 0 ? (
                             <tr>
                               <td colSpan="6" className="py-16 text-center text-slate-400 font-bold">
                                 <Users size={48} className="mx-auto mb-3 opacity-20" />
                                 No registrants found matching your current search or status filter for this event.
                               </td>
                             </tr>
                           ) : (
                             eventAttendees.map((row) => (
                               <tr 
                                 key={row.ticketId} 
                                 onClick={() => setSelectedTicket(row)}
                                 className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-all cursor-pointer group"
                               >
                                  {/* Ticket Badge */}
                                  <td className="p-5 pl-6">
                                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs font-black shadow-sm group-hover:border-pink-500/30 transition-colors">
                                       <QrCode size={14} className="text-pink-500 shrink-0" />
                                       <span>{row.ticketId}</span>
                                     </div>
                                  </td>

                                  {/* Attendee Info */}
                                  <td className="p-5">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${row.avatarGradient || 'from-pink-500 to-purple-600'} flex items-center justify-center font-black text-white text-sm shrink-0 shadow-md`}>
                                        {row.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-pink-500 transition-colors">{row.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{row.email}</p>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Department & Roll */}
                                  <td className="p-5">
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{row.department}</p>
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">{row.collegeId}</span>
                                    </div>
                                  </td>

                                  {/* Mode Badge */}
                                  <td className="p-5">
                                    <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block shadow-sm">
                                      {row.mode}
                                    </span>
                                  </td>

                                  {/* Interactive Check-In Toggle */}
                                  <td className="p-5" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      onClick={(e) => toggleCheckIn(row.ticketId, e)}
                                      className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border shadow-sm ${
                                        row.checkIn 
                                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                      }`}
                                    >
                                      <span className={`w-2 h-2 rounded-full ${row.checkIn ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                      <span>{row.checkIn ? 'Checked In' : 'Pending Scan'}</span>
                                    </button>
                                  </td>

                                  {/* Quick Actions */}
                                  <td className="p-5 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={(e) => launchSingleEmailModal(row, e)}
                                        title={`Send Direct Email Update to ${row.name}`}
                                        className="p-2.5 bg-slate-100 hover:bg-pink-50 dark:bg-slate-900 dark:hover:bg-pink-500/10 text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-all border border-slate-200/60 dark:border-white/5"
                                      >
                                        <Mail size={16} />
                                      </button>
                                      <button
                                        onClick={() => setSelectedTicket(row)}
                                        title="Inspect Ticket Verification Card"
                                        className="p-2.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-500/10 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all border border-slate-200/60 dark:border-white/5"
                                      >
                                        <QrCode size={16} />
                                      </button>
                                    </div>
                                  </td>
                               </tr>
                             ))
                           )}
                         </tbody>
                       </table>
                     </div>
                  </div>

                  {/* RECENT NOTIFICATION BROADCAST LOG */}
                  {sentLogs.length > 0 && (
                    <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-[35px] border border-white/10 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black">
                            <Send size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-wider">Sent Communication Archive</h4>
                            <p className="text-[10px] text-slate-400 font-medium">Recent email broadcasts dispatched during this session</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold px-3 py-1 bg-white/10 rounded-full">{sentLogs.length} Dispatched</span>
                      </div>

                      <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                        {sentLogs.map(log => (
                          <div key={log.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-lg border border-pink-500/20">{log.target}</span>
                                <span className="text-[10px] font-bold text-slate-400">Event: {log.eventTitle}</span>
                              </div>
                              <p className="text-xs font-black text-white mt-1">{log.subject}</p>
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 shrink-0">Sent at {log.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* EMAIL & NOTIFICATION BROADCAST CONSOLE MODAL              */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showEmailModal && (
            <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[45px] overflow-hidden my-auto relative"
              >
                <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600" />

                {emailSuccess ? (
                  <div className="p-14 text-center space-y-5 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center shadow-xl border border-emerald-500/20">
                      <Check size={40} className="animate-bounce" />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Broadcast Dispatched!</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Your update notification has been successfully transmitted via campus mail servers to {emailTargetUser ? emailTargetUser.name : 'the selected attendee group'}.
                    </p>
                    <div className="text-[11px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 py-2.5 px-6 rounded-full inline-block mt-2">
                      ✓ Archived in Sent Communications Log
                    </div>
                  </div>
                ) : (
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 shrink-0">
                          <Mail size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
                            {emailTargetUser ? `Email Student: ${emailTargetUser.name}` : 'Attendee Broadcast Console'}
                          </h3>
                          <p className="text-xs font-medium text-slate-400 mt-0.5">
                            {emailTargetUser ? `Direct notification regarding ${currentEvent?.title}` : `Transmit schedule updates & instructions for ${currentEvent?.title}`}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => { setShowEmailModal(false); setEmailTargetUser(null); }} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSendEmail} className="space-y-5">
                      
                      {/* Recipient Target */}
                      {!emailTargetUser && (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Target Recipient Group</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'ALL', label: `Event Registrants (${totalInEvent})`, desc: 'All signed up for event' },
                              { id: 'ALL_CAMPUS', label: 'All Campus Students (DB)', desc: 'Broadcast to entire campus' },
                              { id: 'CHECKED_IN', label: `Checked-In (${checkedInCount})`, desc: 'Students verified inside' },
                              { id: 'PENDING', label: `Pending Scan (${pendingCount})`, desc: 'Awaiting arrival check' }
                            ].map(g => (
                              <button
                                type="button"
                                key={g.id}
                                onClick={() => setEmailForm({...emailForm, recipientGroup: g.id})}
                                className={`p-3.5 rounded-2xl border text-left transition-all ${
                                  emailForm.recipientGroup === g.id 
                                    ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500 text-purple-700 dark:text-purple-300 shadow-md' 
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                }`}
                              >
                                <p className="text-xs font-black">{g.label}</p>
                                <p className="text-[10px] font-medium opacity-75 mt-0.5">{g.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Preset Templates */}
                      {!emailTargetUser && (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Select Preset Update Template</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'REMINDER', label: '⚡ Check-In Reminder' },
                              { id: 'VENUE_CHANGE', label: '📍 Venue Re-allocation Notice' },
                              { id: 'PREREQ', label: '🏆 Rulebook & Prerequisite Guide' },
                              { id: 'CUSTOM', label: '📢 Custom Announcement' },
                            ].map(t => (
                              <button
                                type="button"
                                key={t.id}
                                onClick={() => handleTemplateChange(t.id, currentEvent?.title)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                                  emailForm.template === t.id 
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-md' 
                                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100'
                                }`}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Subject Line */}
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Email Subject Line *</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-purple-500 text-slate-900 dark:text-white transition-all"
                          value={emailForm.subject}
                          onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                        />
                      </div>

                      {/* Body Message */}
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Notification Message Body *</label>
                        <textarea 
                          rows={6}
                          required
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-purple-500 text-slate-900 dark:text-white transition-all leading-relaxed resize-y"
                          value={emailForm.body}
                          onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                        />
                      </div>

                      {/* Submit button */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => { setShowEmailModal(false); setEmailTargetUser(null); }}
                          className="px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={emailSending}
                          className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-500/25 transition-all flex items-center gap-2.5 active:scale-95"
                        >
                          {emailSending ? (
                            <>
                              <RefreshCw size={18} className="animate-spin" />
                              <span>Transmitting Broadcast...</span>
                            </>
                          ) : (
                            <>
                              <Send size={18} />
                              <span>Transmit Email Notification →</span>
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* STUDENT TICKET & VERIFICATION ID CARD MODAL               */}
        {/* ========================================================= */}
        <AnimatePresence>
          {selectedTicket && (
            <div className="fixed inset-0 z-[130] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[45px] overflow-hidden my-auto"
              >
                {/* ID Card Top Accent */}
                <div className={`h-28 bg-gradient-to-r ${selectedTicket.avatarGradient || 'from-pink-500 via-purple-600 to-indigo-600'} p-6 relative flex items-start justify-end`}>
                  <button 
                    onClick={() => setSelectedTicket(null)} 
                    className="w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="px-8 pb-8 pt-0 relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10 mb-6">
                    <div className="flex items-end gap-5">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${selectedTicket.avatarGradient || 'from-pink-500 to-purple-600'} border-4 border-white dark:border-slate-900 flex items-center justify-center font-black text-white text-2xl shadow-2xl shrink-0`}>
                        {selectedTicket.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedTicket.name}</h3>
                        <p className="text-xs font-bold text-slate-400">{selectedTicket.email}</p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-black border border-slate-200/80 dark:border-white/10 shrink-0 shadow-sm">
                      <QrCode size={15} className="text-pink-500 shrink-0" />
                      <span>{selectedTicket.ticketId}</span>
                    </div>
                  </div>

                  {/* QR Barcode Simulator Box */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200/80 dark:border-white/5 mb-6 text-center space-y-3">
                    <div className="w-48 h-36 mx-auto bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center gap-2 shadow-inner">
                      <QrCode size={64} className="text-slate-800 dark:text-slate-200 animate-pulse" />
                      <span className="font-mono font-black text-xs text-slate-500 tracking-widest">{selectedTicket.ticketId} • {selectedTicket.mode}</span>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Scan QR or enter Ticket ID at Check-In Desk</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200/80 dark:border-white/5 mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">College Roll ID</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">{selectedTicket.collegeId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Department</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{selectedTicket.department}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Contact Phone</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{selectedTicket.phone || '+91 98000 00000'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Registered Date</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{selectedTicket.registeredAt}</p>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="border-t border-slate-100 dark:border-white/5 pt-6 flex items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        const s = selectedTicket;
                        setSelectedTicket(null);
                        launchSingleEmailModal(s);
                      }}
                      className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <Mail size={16} />
                      <span>Email Student</span>
                    </button>
                    
                    <button
                      onClick={() => toggleCheckIn(selectedTicket.ticketId)}
                      className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-white shadow-xl ${
                        selectedTicket.checkIn 
                          ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25'
                      }`}
                    >
                      <UserCheck size={18} />
                      <span>{selectedTicket.checkIn ? 'Revoke Scan' : 'Confirm Check-In'}</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CREATE / EDIT EVENT MODAL */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                 className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl rounded-[50px] overflow-hidden"
               >
                 <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-500" />
                 <div className="p-10 space-y-8 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                       <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">{editingId ? 'Edit Event' : 'Event Creator'}</h3>
                       <button onClick={() => { setShowCreateModal(false); setEditingId(null); }} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                         <Plus size={24} className="rotate-45" />
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Event Title</label>
                         <input 
                           type="text" 
                           placeholder="e.g. CodePulse 3.0" 
                           className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-pink-500 outline-none" 
                           value={newEvent.title}
                           onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                         />
                       </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Category</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-pink-500 outline-none cursor-pointer"
                            value={newEvent.category}
                            onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                          >
                            {EVENT_CATEGORIES.filter(c => c !== 'All').map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="Workshop">Workshop</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Tech Fest">Tech Fest</option>
                            <option value="Cultural">Cultural</option>
                          </select>
                        </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Event Date</label>
                         <input 
                           type="text" 
                           placeholder="e.g. 15 Apr 2026" 
                           className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-pink-500 outline-none" 
                           value={newEvent.date}
                           onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Max Capacity</label>
                         <input 
                           type="number" 
                           placeholder="500" 
                           className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-pink-500 outline-none" 
                           value={newEvent.capacity}
                           onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                         />
                       </div>

                       <div className="space-y-3 col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Registration Link</label>
                          <input 
                            type="text" 
                            placeholder="https://..." 
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-pink-500 outline-none" 
                            value={newEvent.registrationLink}
                            onChange={(e) => setNewEvent({...newEvent, registrationLink: e.target.value})}
                          />
                       </div>

                       <div className="space-y-3 col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Event Description / Details</label>
                          <textarea 
                            rows={4}
                            placeholder="Write event overview, rules, paragraph details..." 
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-pink-500 outline-none resize-y" 
                            value={newEvent.description || ''}
                            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                          />
                       </div>

                       <div className="space-y-3 col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Event Photos (URLs)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Image URL..." 
                              className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-pink-500 outline-none" 
                              value={photoUrl}
                              onChange={(e) => setPhotoUrl(e.target.value)}
                            />
                            <button 
                              type="button"
                              onClick={addPhoto}
                              className="px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 mt-4">
                            {newEvent.photos.map((p, idx) => (
                              <div key={idx} className="relative group/photo w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-white/5">
                                <img src={p.url} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                  <span className="text-[8px] font-black text-white uppercase mb-1">Order: {p.order + 1}</span>
                                  <button 
                                    type="button"
                                    onClick={() => removePhoto(idx)}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                      <button 
                        type="button"
                        onClick={handleDeploy}
                        className="w-full py-5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-[25px] font-black text-sm uppercase tracking-widest hover:scale-[1.02] shadow-xl shadow-purple-500/25 transition-all active:scale-95"
                      >
                        {editingId ? 'Save Changes & Update' : 'Deploy Event'}
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

export default function ArenaAdminPage() {
  return <ArenaAdminContent />;
}
