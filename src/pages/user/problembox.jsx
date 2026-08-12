import { useState } from 'react';
import ModuleLayout from '@/components/ModuleLayout';
import { 
  Plus, 
  LayoutGrid, 
  User, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Settings,
  ChevronRight,
  PartyPopper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProblemBox } from '@/context/user/UserProblemBoxContext';
import StudentTicketTracker from '@/components/problembox/StudentTicketTracker';
import AdminDashboard from '@/components/problembox/AdminDashboard';
import { TICKET_CATEGORIES } from '@/data/problemData';

export default function ProblemBoxPage() {
  const { tickets, isAdminView, toggleAdmin, addTicket, upvoteTicket, suggestions, addSuggestion, upvoteSuggestion } = useUserProblemBox();
  const [activeTab, setActiveTab] = useState('My Tickets');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');

  // 1. DUPLICATE DETECTOR LOGIC
  const suggestedDuplicates = searchQuery.length > 3 
    ? tickets.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.location.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTicket = {
      title: formData.get('title'),
      location: formData.get('location'),
      description: formData.get('description'),
      category: formData.get('category'),
      priority: formData.get('priority') || 'Medium',
      media: previewImage ? [previewImage] : [],
      reporter: { name: 'Rohan Sharma', anonymous: false }
    };
    addTicket(newTicket);
    setShowReportModal(false);
    setPreviewImage(null);
    setSearchQuery('');
  };

  if (isAdminView) {
    return (
      <ModuleLayout 
        title="Command Center" 
        subtitle="Live Operations & Triage" 
        color="#DC2626"
        headerExtra={
          <button onClick={toggleAdmin} className="px-6 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            Exit Admin View
          </button>
        }
      >
        <AdminDashboard />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout 
      title="ProblemBox" 
      subtitle="Report campus issues & track fixes" 
      color="#DC2626"
      headerExtra={
        <div className="flex gap-4">
          <button onClick={toggleAdmin} className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
            <ShieldCheck size={20} />
          </button>
          <button 
            onClick={() => setShowReportModal(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-red-600/20 hover:scale-105 transition-all"
          >
            <Plus size={16} /> New Report
          </button>
        </div>
      }
    >
      <div className="space-y-12 pb-20">
        {/* TABS */}
        <div className="flex items-center gap-8 border-b border-slate-100 dark:border-white/5">
          {['My Tickets', 'Recent Issues', 'Suggestions'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedTicket(null); }}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-red-600' : 'text-slate-400'
              }`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="grid grid-cols-12 gap-10">
          {/* MAIN TICKET FEED */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {selectedTicket ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="mb-8 flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest"
                  >
                    &larr; Back to Issues
                  </button>
                  <StudentTicketTracker ticket={selectedTicket} />
                </motion.div>
              ) : activeTab === 'My Tickets' ? (
                <div className="space-y-8">
                  {/* BIG REPORT CARD */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setShowReportModal(true)}
                    className="p-10 bg-gradient-to-br from-red-600 to-red-900 rounded-[50px] text-white flex items-center justify-between cursor-pointer group hover:scale-[1.02] transition-all shadow-2xl shadow-red-600/30"
                  >
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black italic uppercase tracking-tighter">Spot a problem?</h3>
                       <p className="text-xs font-black opacity-60 uppercase tracking-widest leading-none">Report it instantly to the campus authorities</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-[28px] flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-red-600 transition-all">
                       <Plus size={32} />
                    </div>
                  </motion.div>
                  {tickets.filter(t => !t.hasResolvedViewed).map(ticket => ( // Show current/active tickets here
                    <motion.div 
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="group bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 border-transparent hover:border-red-600 transition-all cursor-pointer flex items-center gap-8 shadow-2xl"
                    >
                      <div className={`w-20 h-20 rounded-[35px] shrink-0 flex items-center justify-center border-4 border-slate-50 dark:border-white/5 ${
                        ticket.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {ticket.category === 'network' ? <Globe size={32} /> : 
                         ticket.category === 'ac' ? <Zap size={32} /> : <AlertTriangle size={32} />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-1">
                           <span className="text-[10px] font-black text-slate-400 tracking-widest">#{ticket.id}</span>
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${
                             ticket.priority === 'Critical' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                           }`}>{ticket.priority}</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic group-hover:translate-x-2 transition-transform duration-500 truncate">{ticket.title}</h4>
                        <div className="flex items-center gap-4 mt-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} /> {ticket.location}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {ticket.timeline[ticket.timeline.findIndex(s => s.active) || 0]?.step || 'Open'}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                         <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : activeTab === 'Recent Issues' ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Resolved Archive</h3>
                     <span className="px-4 py-1.5 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Victory Log</span>
                  </div>
                  {tickets.filter(t => t.status === 'Resolved').map(ticket => (
                    // ... (rest of resolved ticket card remains same)
                    <motion.div 
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="group bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[40px] border-2 border-transparent hover:border-green-600 transition-all cursor-pointer flex flex-col gap-6 shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                            <CheckCircle2 size={32} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">#{ticket.id} • {ticket.category}</span>
                              <span className="text-[8px] font-black px-2 py-0.5 bg-green-500 text-white rounded-lg">RESOLVED</span>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{ticket.title}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reported By</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{ticket.reporter.name}</p>
                        </div>
                      </div>
                      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 space-y-3">
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Authority Resolution</p>
                         </div>
                         <p className="text-sm font-bold text-slate-500 leading-relaxed italic">
                           &quot;{ticket.resolution?.desc || ticket.description}&quot;
                         </p>
                         <div className="pt-4 flex items-center justify-between border-t border-slate-50 dark:border-white/5">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Solved By: {ticket.resolution?.solvedBy}</p>
                            <p className="text-[9px] font-black text-green-600 uppercase tracking-widest font-syne">In {ticket.resolution?.duration}</p>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* SUGGESTION BOX VIEW */
                <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl space-y-8 border border-slate-100 dark:border-white/5">
                     <div className="space-y-1">
                       <h3 className="text-3xl font-black italic uppercase tracking-tighter">Improve Campus</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share ideas for a better student life</p>
                     </div>
                     
                     <div className="space-y-4">
                       <textarea 
                         value={suggestionText}
                         onChange={(e) => setSuggestionText(e.target.value)}
                         placeholder="I wish our campus had..." 
                         className="w-full px-8 py-6 bg-slate-50 dark:bg-white/5 rounded-3xl text-sm font-bold outline-none border-2 border-transparent focus:border-red-600/30 transition-all resize-none"
                         rows={3}
                       />
                       <button 
                         onClick={() => { if(suggestionText) { addSuggestion(suggestionText); setSuggestionText(''); } }}
                         className="w-full py-5 bg-red-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-red-600/20 hover:bg-slate-900 transition-all"
                       >
                         Post Suggestion
                       </button>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                       <LayoutGrid size={14} className="text-red-600" /> Recent Suggestions
                     </h4>
                     {suggestions.map(s => (
                       <motion.div 
                         key={s.id}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-lg border border-slate-100 dark:border-white/5 flex items-center justify-between"
                       >
                         <div className="space-y-1">
                           <p className="text-sm font-bold text-slate-700 dark:text-white leading-tight">&quot;{s.text}&quot;</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.time} • Anonymous</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-red-600">{s.upvotes}</span>
                            <button 
                               onClick={() => upvoteSuggestion(s.id)}
                               className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                             >
                                ▲
                             </button>
                         </div>
                       </motion.div>
                     ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDEBAR: STATS & GAMIFICATION */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             {/* ACTIVE OPERATIONS (White Themed) */}
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[45px] space-y-8 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Active Ops</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ProblemBox Live Metrics</p>
                  </div>
                  <div className="h-12 w-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 border border-red-600/20">
                    <TrendingUp size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-1 hover:border-red-600/30 border border-transparent transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Raised</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white italic">{tickets.filter(t => t.status === 'Raised').length}</p>
                   </div>
                   <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-1 border border-transparent">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Working</p>
                      <p className="text-2xl font-black text-blue-600 italic">{tickets.filter(t => t.status === 'InProgress').length}</p>
                   </div>
                </div>

                <div className="p-6 bg-red-600 rounded-[30px] text-white flex items-center justify-between shadow-xl shadow-red-600/20">
                   <div className="space-y-0.5">
                     <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Team Performance</p>
                     <p className="text-lg font-black italic uppercase tracking-tighter">Fast Triage</p>
                   </div>
                   <Zap size={24} fill="currentColor" />
                </div>
             </div>

             {/* STATS */}
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[45px] border border-white/5 shadow-2xl space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-white/5 pb-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-red-600" /> Campus Pulse
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg. Triage</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">18 MINS</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fixed Today</p>
                    <p className="text-2xl font-black text-blue-600 tracking-tighter italic">04</p>
                  </div>
                </div>
             </div>

             {/* ANONYMOUS MODE PREVIEW */}
             <div className="bg-slate-100 dark:bg-white/5 p-8 rounded-[40px] flex items-center gap-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isAnonymous ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 shadow-inner' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                }`}>
                  <User size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Ghost Mode</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAnonymous ? 'Your identity is hidden' : 'Reporting as Rohan Sharma'}</p>
                </div>
                <button 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-7 rounded-full relative transition-all ${isAnonymous ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <motion.div 
                    animate={{ x: isAnonymous ? 20 : 4 }}
                    className="absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-md" 
                  />
                </button>
             </div>

             {/* REPORTING POLICY ALERT */}
             <div className="bg-amber-500/10 border-2 border-amber-500/20 rounded-[40px] p-8 space-y-4 relative overflow-hidden group">
                <div className="flex items-center gap-3 text-amber-500">
                  <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 animate-pulse">
                    <AlertTriangle size={18} />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Reporting Policy</h4>
                </div>
                
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                  &quot;Unwanted or self-created problems will be considered <span className="text-red-500 underline decoration-2 underline-offset-4">acts of violation</span>. Strict disciplinary action will be taken. Report safely.&quot;
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-amber-500/10">
                   <div className="space-y-0.5">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Report Integrity</p>
                     <p className="text-xl font-black text-amber-500 italic tracking-tighter uppercase">98.4% Accuracy</p>
                   </div>
                   <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-amber-500 opacity-50" />
                   </div>
                </div>
             </div>

             {/* QUICK CONTACTS (Added by AI) */}
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-white/5 pb-2">Emergency Hub</h4>
                <div className="grid grid-cols-2 gap-3">
                   {[
                     { label: 'Security', tel: '101' },
                     { label: 'Medical', tel: '102' }
                   ].map(c => (
                     <a key={c.label} href={`tel:${c.tel}`} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl flex flex-col items-center hover:bg-slate-900 hover:text-white transition-all">
                       <p className="text-[8px] font-black text-slate-400 uppercase">{c.label}</p>
                       <p className="font-bold text-xs">{c.tel}</p>
                     </a>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 50 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 50 }}
               className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
             >
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
               <div className="p-10 space-y-8">
                 <div className="flex items-center justify-between">
                   <div className="space-y-1">
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none">New Report</h3>
                     {isAnonymous && <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">✓ Reporting Anonymously</p>}
                   </div>
                   <button onClick={() => setShowReportModal(false)} className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                     <Plus size={24} className="rotate-45" />
                   </button>
                 </div>

                 <form onSubmit={(e) => {
                   e.preventDefault();
                   const formData = new FormData(e.target);
                   const newTicket = {
                     title: formData.get('title'),
                     location: formData.get('location'),
                     description: formData.get('description'),
                     category: formData.get('category'),
                     priority: formData.get('priority') || 'Medium',
                     media: previewImage ? [previewImage] : [],
                     reporter: { 
                       name: isAnonymous ? 'Anonymous Student' : 'Rohan Sharma', 
                       anonymous: isAnonymous 
                     }
                   };
                   addTicket(newTicket);
                   setShowReportModal(false);
                   setPreviewImage(null);
                   setSearchQuery('');
                 }} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Issue Title</label>
                       <input 
                         name="title" 
                         required 
                         placeholder="e.g. WiFi down in I-Block" 
                         className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-red-600/30 rounded-3xl text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                         onChange={(e) => setSearchQuery(e.target.value)}
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Exact Location</label>
                       <input name="location" required placeholder="Building, Floor, Room #" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-red-600/30 rounded-3xl text-sm font-bold text-slate-900 dark:text-white outline-none transition-all" />
                     </div>
                   </div>

                   {/* DUPLICATE DETECTOR DRAWER */}
                   <AnimatePresence>
                     {suggestedDuplicates.length > 0 && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                         <div className="bg-amber-500/10 border-2 border-amber-500/20 rounded-3xl p-6 space-y-4">
                           <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck size={14} /> Duplicate Alert: {suggestedDuplicates.length} students reported this
                           </p>
                           <div className="space-y-2">
                             {suggestedDuplicates.slice(0, 1).map(dup => (
                               <div key={dup.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-amber-500/20">
                                 <div>
                                   <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{dup.title}</p>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{dup.location}</p>
                                 </div>
                                 <button 
                                   type="button"
                                   onClick={() => { upvoteTicket(dup.id); setShowReportModal(false); }}
                                   className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
                                 >
                                   Upvote instead
                                 </button>
                               </div>
                             ))}
                           </div>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Description</label>
                     <textarea name="description" required rows={3} placeholder="Please provide details to help us triage faster..." className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-red-600/30 rounded-[35px] text-sm font-bold text-slate-900 dark:text-white outline-none transition-all resize-none" />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                       <select name="category" className="w-full h-[66px] px-8 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-red-600/30 rounded-3xl text-sm font-black text-slate-900 dark:text-white outline-none transition-all appearance-none cursor-pointer">
                         {TICKET_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                     </div>
                     <div className="flex gap-4 pt-6">
                       <div className="relative group">
                         <input 
                           type="file" 
                           id="ticket-upload" 
                           className="hidden" 
                           onChange={handleFileUpload}
                           accept="image/*"
                         />
                         <label 
                           htmlFor="ticket-upload"
                           className={`flex-1 w-20 h-[66px] rounded-3xl flex items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
                             previewImage ? 'border-green-500 bg-green-500/10 text-green-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-white/10 hover:border-red-600/30'
                           }`}
                         >
                           {previewImage ? <CheckCircle2 size={24} /> : <Camera size={24} />}
                         </label>
                         {previewImage && (
                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-10 rounded-lg overflow-hidden border-2 border-white shadow-xl">
                              <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                           </div>
                         )}
                       </div>
                       <button type="submit" className="flex-1 bg-red-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-red-600/30 hover:bg-slate-900 transition-all">Submit Report</button>
                     </div>
                   </div>
                 </form>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModuleLayout>
  );
}
