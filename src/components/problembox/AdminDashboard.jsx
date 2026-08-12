import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Users, 
  ArrowRight,
  Filter,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Image as ImageIcon,
  MessageSquare,
  X,
  PhoneCall,
  Phone,
  Mail,
  UserCheck,
  Wrench,
  Layers,
  Activity,
  Check,
  RefreshCw,
  Sliders,
  MapPin,
  Send,
  AlertCircle,
  Plus,
  Edit,
  Edit3,
  UserPlus,
  Sparkles,
  Cpu,
  Tag,
  RotateCcw
} from 'lucide-react';
import { useAdminProblemBox } from '@/context/admin/AdminProblemBoxContext';

export default function AdminDashboard() {
  const { 
    tickets, 
    specialists, 
    updateTicketStatus, 
    updateTicketProgress, 
    deleteTicket,
    undoFinish,
    purgeResolvedTickets,
    addAdminResponse, 
    assignTicket, 
    addSpecialist, 
    updateSpecialist, 
    deleteSpecialist, 
    matchProblemToSpecialist, 
    hasNewCriticalAlert, 
    dismissAlert 
  } = useAdminProblemBox();

  const [activePriorityFilter, setActivePriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Urgent'); // 'Urgent', 'Newest', 'Upvotes'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('KANBAN'); // 'KANBAN' | 'TABLE' | 'SPECIALISTS'

  // Modal state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolvingTicketId, setResolvingTicketId] = useState(null);

  // Specialist management state
  const [showSpecialistModal, setShowSpecialistModal] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState(null);

  // Specialist dispatch simulator state
  const [callTarget, setCallTarget] = useState(null);
  const [callingState, setCallingState] = useState(null); // 'RINGING' | 'CONNECTED' | 'SMS_SENT'

  // Always derive live ticket object so updates reflect inside modals immediately
  const currentTicket = selectedTicket ? (tickets.find(t => t.id === selectedTicket.id) || selectedTicket) : null;

  const COLUMNS = [
    { id: 'Raised', label: 'New Reports', color: 'blue', desc: 'Awaiting initial review' },
    { id: 'Triaged', label: 'Triaged & Assigned', color: 'purple', desc: 'Assigned to maintainer' },
    { id: 'InProgress', label: 'Under Active Repair', color: 'amber', desc: 'Field resolution ongoing' },
    { id: 'Resolved', label: 'Verified Solved', color: 'emerald', desc: 'Auto-deletes after 24 hrs' }
  ];

  // Resolve target maintainer using directory and AI match
  const getAssignedSpecialist = (ticket) => {
    if (!ticket) return specialists[0] || {};
    if (ticket.assignedTo) {
      const found = specialists.find(d => d.id === ticket.assignedTo);
      if (found) return found;
    }
    const match = matchProblemToSpecialist(ticket.title, ticket.description, ticket.location, ticket.category);
    return match.specialist || specialists[0] || {};
  };

  // Filter and sort ticket list
  const getTicketsByStatus = (status) => {
    let filtered = tickets.filter(t => {
      if (status === 'InProgress' && t.status === 'InProgress') return true;
      return t.status === status;
    });
    
    if (activePriorityFilter !== 'All') {
      filtered = filtered.filter(t => t.priority === activePriorityFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.location && t.location.toLowerCase().includes(q)) ||
        (t.id && t.id.toLowerCase().includes(q))
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'Urgent') {
        const pOrder = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      if (sortBy === 'Upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
      return 0;
    });
  };

  const handleSaveNote = () => {
    if (adminNote.trim() && currentTicket) {
      addAdminResponse(currentTicket.id, adminNote);
    }
    setAdminNote('');
  };

  const handleAdvance = (ticket, nextStatus) => {
    if (nextStatus === 'Resolved') {
      setResolvingTicketId(ticket.id);
      setShowResolveModal(true);
    } else {
      updateTicketStatus(ticket.id, nextStatus);
    }
  };

  const submitResolution = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const resolutionData = {
      solvedBy: formData.get('solvedBy') || 'Campus Emergency Command',
      desc: formData.get('desc') || 'Issue inspected and permanently resolved by maintenance team.',
      duration: formData.get('duration') || '1 Hour 30 Mins'
    };
    updateTicketProgress(resolvingTicketId, 100, resolutionData);
    setShowResolveModal(false);
    setResolvingTicketId(null);
  };

  const handleSaveSpecialist = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const specData = {
      name: formData.get('name'),
      lead: formData.get('lead'),
      role: formData.get('role'),
      phone: formData.get('phone'),
      ext: formData.get('ext'),
      email: formData.get('email'),
      category: formData.get('category'),
      keywords: formData.get('keywords')
    };
    if (editingSpecialist) {
      updateSpecialist(editingSpecialist.id, specData);
    } else {
      addSpecialist(specData);
    }
    setShowSpecialistModal(false);
    setEditingSpecialist(null);
  };

  const openAddSpecialist = () => {
    setEditingSpecialist(null);
    setShowSpecialistModal(true);
  };

  const openEditSpecialist = (spec) => {
    setEditingSpecialist(spec);
    setShowSpecialistModal(true);
  };

  // Dispatch phone simulator trigger
  const triggerCallSpecialist = (ticket, e) => {
    if (e) e.stopPropagation();
    const specialist = getAssignedSpecialist(ticket);
    setCallTarget({ ticket, specialist });
    setCallingState(null);
  };

  const handleStartCall = () => {
    setCallingState('RINGING');
    setTimeout(() => {
      setCallingState('CONNECTED');
      if (callTarget && callTarget.ticket && callTarget.ticket.status === 'Raised') {
        assignTicket(callTarget.ticket.id, callTarget.specialist.id);
      }
    }, 2200);
  };

  const handleSendSMSOrder = () => {
    setCallingState('SMS_SENT');
    if (callTarget && callTarget.ticket) {
      assignTicket(callTarget.ticket.id, callTarget.specialist.id);
      addAdminResponse(callTarget.ticket.id, `Emergency SMS Work Order dispatched to ${callTarget.specialist.lead} (${callTarget.specialist.name}).`);
    }
    setTimeout(() => {
      setCallTarget(null);
      setCallingState(null);
    }, 1800);
  };

  // KPI counters
  const totalIssues = tickets.length;
  const criticalCount = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length;
  const inProgressCount = tickets.filter(t => t.status === 'InProgress' || t.status === 'Triaged').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative pb-16">
      
      {/* Top executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Campus Issues</p>
            <h4 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">{totalIssues} Reported</h4>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-500 pt-1">
              <RefreshCw size={12} className="animate-spin" />
              <span>Synced with User DB</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-lg">
            <Layers size={26} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Critical Alert Queue</p>
            <h4 className="text-3xl font-black italic tracking-tighter text-rose-600 dark:text-rose-400">{criticalCount} Urgent</h4>
            <p className="text-[11px] font-extrabold text-rose-500/80">Requires emergency triage</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black shadow-lg animate-pulse">
            <ShieldAlert size={26} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Repair Works</p>
            <h4 className="text-3xl font-black italic tracking-tighter text-amber-600 dark:text-amber-400">{inProgressCount} In Progress</h4>
            <p className="text-[11px] font-extrabold text-slate-400">Maintainers deployed on field</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black shadow-lg">
            <Wrench size={26} />
          </div>
        </div>

        <div 
          onClick={() => setViewMode('SPECIALISTS')}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border border-blue-500/30 rounded-[30px] p-6 shadow-xl shadow-blue-600/30 flex items-center justify-between relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-all group"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-black text-blue-200 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={13} /> AI Dispatch Command
            </p>
            <h4 className="text-3xl font-black italic tracking-tighter text-white">{specialists.length} Maintainers</h4>
            <p className="text-xs font-black text-yellow-300 underline underline-offset-4 group-hover:text-white transition-colors">
              📞 Manage Directory & AI Keywords →
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-black shadow-lg">
            <PhoneCall size={26} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter and navigation controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-4 sm:p-6 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {viewMode !== 'SPECIALISTS' && (
            <>
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5">
                {[
                  { id: 'All', label: 'All Issues' },
                  { id: 'Critical', label: 'Critical', color: 'bg-rose-500' },
                  { id: 'High', label: 'High', color: 'bg-amber-500' },
                  { id: 'Medium', label: 'Medium', color: 'bg-blue-500' },
                  { id: 'Low', label: 'Low', color: 'bg-slate-500' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePriorityFilter(p.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activePriorityFilter === p.id 
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {p.color && <span className={`w-2 h-2 rounded-full ${p.color}`} />}
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search title, block..." 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-red-500 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold placeholder:text-slate-400 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={15} />
                  </button>
                )}
              </div>
            </>
          )}

          {viewMode === 'SPECIALISTS' && (
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-xs rounded-2xl flex items-center gap-2 border border-blue-500/20">
                <Cpu size={16} /> AI Auto-Match Engine Active
              </span>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Configure maintainer lines and keyword routing for live problem submissions.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
          {viewMode !== 'SPECIALISTS' && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-extrabold text-slate-600 dark:text-slate-300">
              <Filter size={14} className="text-slate-400" />
              <span className="uppercase text-[10px] text-slate-400 tracking-widest">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-black outline-none cursor-pointer text-slate-900 dark:text-white pr-2"
              >
                <option value="Urgent">Most Urgent</option>
                <option value="Upvotes">Most Upvoted</option>
                <option value="Newest">Newest First</option>
              </select>
            </div>
          )}

          <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                viewMode === 'KANBAN' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 size={15} />
              <span>Triage Board</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                viewMode === 'TABLE' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={15} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('SPECIALISTS')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                viewMode === 'SPECIALISTS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PhoneCall size={15} />
              <span>📞 Specialists Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Maintainer Specialist Directory */}
      {viewMode === 'SPECIALISTS' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Maintainer Dispatch & AI Routing Directory</span>
              </h3>
              <p className="text-xs font-bold text-slate-400 max-w-2xl">
                Manage department leads and SIP numbers. The **UAssist AI Engine** compares incoming issue words against trigger keywords to bind maintainer identities to UI!
              </p>
            </div>
            <button 
              onClick={openAddSpecialist}
              className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/25 flex items-center gap-2 transition-all shrink-0 active:scale-95"
            >
              <UserPlus size={18} />
              <span>+ Register New Specialist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((spec) => (
              <div key={spec.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-7 shadow-lg hover:shadow-2xl transition-all space-y-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-black text-[10px] rounded-full uppercase tracking-widest inline-flex items-center gap-1">
                        <Tag size={12} /> Category: {spec.category || 'general'}
                      </span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2.5 group-hover:text-blue-600 transition-colors">
                        {spec.lead}
                      </h4>
                      <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400">{spec.role} • {spec.name}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 font-black shadow-inner">
                      <PhoneCall size={22} className="text-blue-500" />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-black text-slate-800 dark:text-slate-200">
                      <span>📞 {spec.phone}</span>
                      <span className="text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/10">{spec.ext}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 truncate">✉ {spec.email || 'No email set'}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={12} className="text-yellow-500" /> AI Auto-Assign Trigger Keywords:
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {(spec.keywords || []).map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] rounded-xl border border-slate-200 dark:border-white/5">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => openEditSpecialist(spec)}
                    className="flex-1 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Edit3 size={14} /> Edit & Keywords
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete specialist ${spec.lead}?`)) deleteSpecialist(spec.id);
                    }}
                    className="w-12 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 rounded-2xl flex items-center justify-center transition-all shrink-0"
                    title="Delete Specialist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Board View */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {COLUMNS.map(col => {
            const colTickets = getTicketsByStatus(col.id);
            return (
              <div key={col.id} className="space-y-4 flex flex-col h-full">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-sm">
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                      <span className="truncate">{col.label}</span>
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5">{colTickets.length}</span>
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      {col.id === 'Resolved' && <Clock size={11} className="text-emerald-500" />}
                      <span>{col.desc}</span>
                    </p>
                  </div>
                  {col.id === 'Resolved' && colTickets.length > 0 ? (
                    <button 
                      onClick={() => { if (window.confirm('Delete all resolved tickets?')) purgeResolvedTickets(); }}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all"
                      title="Purge all resolved tickets"
                    >
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <div className={`w-3 h-3 rounded-full bg-${col.color}-500 shadow-lg shrink-0`} />
                  )}
                </div>

                <div className="space-y-4 min-h-[500px] bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-[35px] border-2 border-dashed border-slate-200 dark:border-white/5 flex-1">
                  {colTickets.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 opacity-60">
                      <CheckCircle2 size={36} strokeWidth={1.5} className="mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Queue Clean & Empty</p>
                    </div>
                  ) : (
                    colTickets.map(ticket => {
                      const specialist = getAssignedSpecialist(ticket);
                      const progressVal = ticket.progress ?? (ticket.status === 'Resolved' ? 100 : ticket.status === 'InProgress' ? 60 : 15);
                      const aiConf = ticket.aiConfidence || '96%';

                      return (
                        <motion.div 
                          key={ticket.id}
                          layoutId={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className="bg-white dark:bg-slate-900 p-6 rounded-[30px] shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-white/10 hover:border-red-500/50 cursor-pointer transition-all space-y-4 group relative overflow-hidden"
                        >
                          {/* Top ID tag and actions */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/5">
                              #{ticket.id}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 ${
                                ticket.priority === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 
                                ticket.priority === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 
                                'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              }`}>
                                <ShieldAlert size={11} />
                                <span>{ticket.priority}</span>
                              </div>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete problem #${ticket.id}?`)) deleteTicket(ticket.id);
                                }}
                                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                                title="Delete Query"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Issue title and location */}
                          <div className="space-y-1">
                            <h5 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-tight italic leading-snug group-hover:text-red-500 transition-colors">
                              {ticket.title}
                            </h5>
                            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                              <MapPin size={13} className="text-red-500 shrink-0" />
                              <span className="truncate">{ticket.location}</span>
                            </p>
                          </div>

                          {/* AI matched maintainer box */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-1">
                              <span className="flex items-center gap-1"><Sparkles size={11} className="text-yellow-500" /> AI Auto-Connected</span>
                              <span className="bg-emerald-500/10 px-2 py-0.5 rounded-md">Match: {aiConf}</span>
                            </div>
                            <div 
                              onClick={(e) => triggerCallSpecialist(ticket, e)}
                              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 hover:border-blue-500/50 transition-all flex items-center justify-between group/sp"
                            >
                              <div className="min-w-0 pr-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Specialist</p>
                                <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate mt-0.5">{specialist.lead}</p>
                                <p className="text-[10px] font-medium text-blue-500 dark:text-blue-400 flex items-center gap-1">
                                  <span>{specialist.role}</span>
                                  <span className="text-slate-400 font-mono">({specialist.ext})</span>
                                </p>
                              </div>
                              <button 
                                type="button"
                                className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 transition-transform active:scale-95 group-hover/sp:scale-105"
                                title={`Call ${specialist.lead} (${specialist.phone})`}
                              >
                                <PhoneCall size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Live resolution progress */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-slate-700 dark:text-slate-300">Resolution Progress</span>
                              <span className={`font-mono font-black px-2 py-0.5 rounded-md ${
                                progressVal === 100 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                              }`}>
                                {progressVal}% {progressVal === 100 ? '✔ Solved' : 'In Work'}
                              </span>
                            </div>

                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              step="5"
                              value={progressVal}
                              onChange={(e) => updateTicketProgress(ticket.id, e.target.value)}
                              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600 transition-all"
                            />
                          </div>

                          {/* Footer actions: Advance or Undo Finish */}
                          <div className="flex items-center justify-between pt-2 gap-2 border-t border-slate-100 dark:border-white/5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1 text-[11px] font-black text-slate-500">
                              <span>👍 {ticket.upvotes || 1} Upvotes</span>
                              {col.id === 'Resolved' && (
                                <span className="ml-1 text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">⏳ 24h Auto-Del</span>
                              )}
                            </div>
                            
                            {col.id !== 'Resolved' && progressVal < 100 ? (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (col.id === 'Raised') updateTicketStatus(ticket.id, 'Triaged');
                                  else if (col.id === 'Triaged') updateTicketStatus(ticket.id, 'InProgress');
                                  else updateTicketProgress(ticket.id, 100);
                                }}
                                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1"
                              >
                                {col.id === 'InProgress' ? 'Mark Solved ✓' : 'Advance →'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  undoFinish(ticket.id);
                                }}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-md"
                                title="Undo solution and reopen issue"
                              >
                                <RotateCcw size={11} />
                                <span>Undo Finish</span>
                              </button>
                            )}
                          </div>

                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Master Table View */}
      {viewMode === 'TABLE' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-6">Ticket ID</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue & Location</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Connected Maintainer</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Resolution Bar</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-6">Actions & Undo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {tickets.map(ticket => {
                  const specialist = getAssignedSpecialist(ticket);
                  const progressVal = ticket.progress ?? (ticket.status === 'Resolved' ? 100 : 35);
                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 pl-6 font-mono font-black text-xs text-slate-700 dark:text-slate-300">
                        #{ticket.id}
                      </td>
                      <td className="p-5">
                        <p className="font-black text-sm text-slate-900 dark:text-white uppercase italic">{ticket.title}</p>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-red-500" /> {ticket.location}
                        </p>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-flex items-center gap-1 ${
                          ticket.priority === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 
                          ticket.priority === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <span>{specialist.lead}</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold rounded">AI Match</span>
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">{specialist.ext} ({specialist.phone})</p>
                          </div>
                          <button 
                            onClick={() => triggerCallSpecialist(ticket)}
                            className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-transform active:scale-95"
                            title={`Call ${specialist.phone}`}
                          >
                            <PhoneCall size={15} />
                          </button>
                        </div>
                      </td>
                      <td className="p-5 w-56">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-extrabold">
                            <span>{progressVal === 100 ? '✔ Solved (24h Del)' : `${progressVal}% Solved`}</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5"
                            value={progressVal}
                            onChange={(e) => updateTicketProgress(ticket.id, e.target.value)}
                            className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                          />
                        </div>
                      </td>
                      <td className="p-5 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedTicket(ticket)}
                            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs rounded-xl uppercase tracking-wider transition-all"
                          >
                            Examine
                          </button>
                          {progressVal < 100 ? (
                            <button 
                              onClick={() => updateTicketProgress(ticket.id, 100)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition-all whitespace-nowrap"
                            >
                              Solve ✓
                            </button>
                          ) : (
                            <button 
                              onClick={() => undoFinish(ticket.id)}
                              className="px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition-all whitespace-nowrap flex items-center gap-1"
                            >
                              <RotateCcw size={12} /> Undo
                            </button>
                          )}
                          <button
                            onClick={() => { if (window.confirm('Delete query?')) deleteTicket(ticket.id); }}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-colors"
                            title="Delete query"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Specialist registration / edit modal */}
      <AnimatePresence>
        {showSpecialistModal && (
          <div className="fixed inset-0 z-[180] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[45px] overflow-hidden my-auto relative"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600" />
              
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Maintainer Directory Management</span>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white mt-0.5">
                      {editingSpecialist ? '✏️ Edit Specialist Details & Keywords' : '➕ Register New Emergency Specialist'}
                    </h3>
                  </div>
                  <button onClick={() => setShowSpecialistModal(false)} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveSpecialist} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Department / Division Name</label>
                      <input 
                        name="name" 
                        required 
                        defaultValue={editingSpecialist?.name || ''} 
                        placeholder="e.g. HVAC & Solar Power Unit"
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Lead Officer / Specialist Name</label>
                      <input 
                        name="lead" 
                        required 
                        defaultValue={editingSpecialist?.lead || ''} 
                        placeholder="e.g. Er. Sunita Verma"
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Official Role & Title</label>
                      <input 
                        name="role" 
                        required 
                        defaultValue={editingSpecialist?.role || ''} 
                        placeholder="e.g. Lead Power Engineer"
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Problem Category</label>
                      <select 
                        name="category" 
                        defaultValue={editingSpecialist?.category || 'facilities'}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-black text-slate-900 dark:text-white outline-none cursor-pointer transition-all uppercase"
                      >
                        <option value="network">Network & WiFi</option>
                        <option value="facilities">Facilities & Maintenance</option>
                        <option value="ac">AC & Cooling</option>
                        <option value="security">Security & Safety</option>
                        <option value="hostel">Hostel Issues</option>
                        <option value="others">Others / General</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Direct Mobile (for SMS/Call)</label>
                      <input 
                        name="phone" 
                        required 
                        defaultValue={editingSpecialist?.phone || '+91 '} 
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-mono font-black text-slate-900 dark:text-white outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Desk Ext. Line</label>
                      <input 
                        name="ext" 
                        required 
                        defaultValue={editingSpecialist?.ext || 'Ext. '} 
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-mono font-black text-slate-900 dark:text-white outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Department Email</label>
                      <input 
                        name="email" 
                        type="email"
                        required 
                        defaultValue={editingSpecialist?.email || ''} 
                        placeholder="officer@campus.edu"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 bg-blue-500/5 dark:bg-blue-500/10 p-5 rounded-3xl border border-blue-500/20">
                    <label className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={16} className="text-yellow-500" /> AI Auto-Match Trigger Keywords (Comma Separated):
                    </label>
                    <textarea 
                      name="keywords" 
                      rows={3}
                      required
                      placeholder="e.g. solar, wiring, circuit, blackout, transformer, generator, volt, electric"
                      defaultValue={Array.isArray(editingSpecialist?.keywords) ? editingSpecialist.keywords.join(', ') : (editingSpecialist?.keywords || '')}
                      className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none resize-none transition-all" 
                    />
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-snug">
                      When a student submits a problem containing these words in the title, description, or location, our UAssist Intelligence engine will automatically bind this specialist&apos;s name, phone, and SIP line in the UI!
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <button type="button" onClick={() => setShowSpecialistModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-2">
                      <Sparkles size={16} />
                      <span>Save Specialist & AI Rules</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Maintainer dispatch phone simulator modal */}
      <AnimatePresence>
        {callTarget && (
          <div className="fixed inset-0 z-[160] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[45px] overflow-hidden my-auto relative"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-600 to-red-600" />
              
              <div className="p-8 space-y-6 text-center">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 text-left">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campus Command Voice Relay</span>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">Maintainer Dispatch</h3>
                  </div>
                  <button 
                    onClick={() => { setCallTarget(null); setCallingState(null); }} 
                    className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[35px] border border-slate-200 dark:border-white/5 space-y-4">
                  <div className="w-24 h-24 rounded-3xl bg-blue-500/10 border-2 border-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-3xl flex items-center justify-center mx-auto shadow-inner">
                    <PhoneCall size={38} className={callingState === 'RINGING' ? 'animate-bounce' : ''} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{callTarget.specialist.lead}</h4>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{callTarget.specialist.role} • {callTarget.specialist.name}</p>
                    <p className="text-sm font-mono font-black text-slate-700 dark:text-slate-300 mt-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-white/10 inline-block px-4">
                      {callTarget.specialist.phone} ({callTarget.specialist.ext})
                    </p>
                  </div>
                </div>

                <div className="text-left bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                  <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-yellow-500"/> AI Auto-Assigned Issue:</span>
                    <span>Confidence: 97%</span>
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    #{callTarget.ticket.id} — {callTarget.ticket.title} ({callTarget.ticket.location})
                  </p>
                </div>

                {callingState === 'RINGING' ? (
                  <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 font-extrabold text-sm space-y-2 animate-pulse">
                    <RefreshCw size={24} className="mx-auto animate-spin" />
                    <p className="text-base font-black">Connecting to SIP Trunk ({callTarget.specialist.ext})...</p>
                    <p className="text-xs opacity-80">Please keep phone receiver ready</p>
                  </div>
                ) : callingState === 'CONNECTED' ? (
                  <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-extrabold text-sm space-y-2 animate-in zoom-in-95">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 animate-bounce" />
                    <p className="text-lg font-black italic">Voice Link Established & Work Order Dispatched!</p>
                    <p className="text-xs opacity-90">{callTarget.specialist.lead} has acknowledged the emergency triage ticket. Status updated to Active Repair.</p>
                  </div>
                ) : callingState === 'SMS_SENT' ? (
                  <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 font-extrabold text-sm space-y-2 animate-in zoom-in-95">
                    <Send size={32} className="mx-auto text-purple-500 animate-bounce" />
                    <p className="text-lg font-black italic">Emergency SMS Work Order Sent!</p>
                    <p className="text-xs opacity-90">An instant priority text notification was routed to {callTarget.specialist.phone}.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleStartCall}
                      className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <PhoneCall size={16} />
                      <span>Connect Voice Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSendSMSOrder}
                      className="py-4 px-6 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                    >
                      <Send size={16} />
                      <span>Dispatch SMS Order</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket examination & resolution modal */}
      <AnimatePresence>
        {currentTicket && (
          <div className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[45px] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
             >
                <div className={`h-2.5 ${
                  currentTicket.priority === 'Critical' ? 'bg-rose-500' : 
                  currentTicket.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                
                <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                   <div>
                     <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[11px] font-mono font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">#{currentTicket.id}</span>
                        <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Reported by: {currentTicket.reporter?.name || 'Student'}</span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={13} className="text-red-500"/>{currentTicket.location}</span>
                     </div>
                     <h3 className="text-3xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white mt-2">{currentTicket.title}</h3>
                   </div>
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => {
                         if (window.confirm('Delete query?')) { deleteTicket(currentTicket.id); setSelectedTicket(null); }
                       }}
                       className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-colors flex items-center gap-1.5"
                     >
                       <Trash2 size={15} /> Delete Query
                     </button>
                     <button onClick={() => setSelectedTicket(null)} className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0">
                       <X size={22} />
                     </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-8 custom-scrollbar">
                   <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Detailed Description</p>
                        <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/80 dark:border-white/5">
                          {currentTicket.description}
                        </p>
                      </div>

                      {/* Interactive resolution progress in modal */}
                      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Wrench size={16} className="text-red-500" />
                            <span>Update Resolution Progress</span>
                          </p>
                          <span className={`px-3 py-1 font-mono font-black text-xs rounded-xl ${
                            currentTicket.progress === 100 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}>
                            {currentTicket.progress === 100 ? '✔ Verified Solved' : `${currentTicket.progress || 20}% Solved`}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={currentTicket.progress || 20}
                          onChange={(e) => updateTicketProgress(currentTicket.id, e.target.value)}
                          className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-xl appearance-none cursor-pointer accent-red-600"
                        />
                        <div className="grid grid-cols-4 gap-2 pt-2">
                          {[
                            { label: '25% Inspected', val: 25 },
                            { label: '50% Repairing', val: 50 },
                            { label: '80% Testing', val: 80 },
                            { label: '100% Solved ✓', val: 100 }
                          ].map(btn => (
                            <button
                              type="button"
                              key={btn.val}
                              onClick={() => updateTicketProgress(currentTicket.id, btn.val)}
                              className={`py-2.5 px-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                                currentTicket.progress === btn.val
                                  ? btn.val === 100 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                  : btn.val === 100 
                                  ? 'bg-emerald-600/15 text-emerald-600 hover:bg-emerald-600 hover:text-white' 
                                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                        {currentTicket.status === 'Resolved' && (
                          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">⏳ Will auto-delete in 24 hours.</span>
                            <button
                              type="button"
                              onClick={() => { undoFinish(currentTicket.id); }}
                              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:scale-[1.02] transition-all active:scale-95"
                            >
                              <RotateCcw size={13} /> Undo Finish & Reopen
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {currentTicket.media && currentTicket.media.length > 0 && (
                        <div className="space-y-2">
                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Attached Evidence Media</p>
                           <div className="w-full h-56 rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-inner">
                              <img src={currentTicket.media[0]} className="w-full h-full object-cover" alt="Evidence" />
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="w-full lg:w-80 flex flex-col space-y-6">
                      {/* Maintainer details in modal */}
                      <div className="p-6 rounded-3xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 space-y-4">
                        <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                          <div className="flex items-center gap-2">
                            <PhoneCall size={18} />
                            <h4 className="text-xs font-black uppercase tracking-widest">Call Maintainer</h4>
                          </div>
                          <span className="text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full">AI Matched</span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{getAssignedSpecialist(currentTicket).lead}</p>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{getAssignedSpecialist(currentTicket).role}</p>
                          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-1">📞 {getAssignedSpecialist(currentTicket).phone}</p>
                        </div>

                        {/* Specialist re-assignment selector */}
                        <div className="pt-2 border-t border-blue-500/20">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Override Assigned Specialist:</p>
                          <select
                            value={getAssignedSpecialist(currentTicket).id || ''}
                            onChange={(e) => assignTicket(currentTicket.id, e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-black text-slate-900 dark:text-white outline-none cursor-pointer"
                          >
                            {specialists.map(s => (
                              <option key={s.id} value={s.id}>{s.lead} ({s.name})</option>
                            ))}
                          </select>
                        </div>

                        <button 
                          onClick={() => triggerCallSpecialist(currentTicket)}
                          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
                        >
                          <PhoneCall size={16} />
                          <span>Launch Dispatcher →</span>
                        </button>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 space-y-4 flex-1 flex flex-col justify-between">
                         <div className="space-y-3">
                           <div className="flex items-center gap-2 text-red-600 dark:text-red-500 pb-3 border-b border-slate-200 dark:border-white/5">
                             <MessageSquare size={16} />
                             <h4 className="text-[11px] font-black uppercase tracking-widest">Official Reply & Note</h4>
                           </div>
                           <textarea 
                             placeholder="Type public status reply for student or internal note..." 
                             className="w-full h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs font-extrabold text-slate-900 dark:text-white outline-none focus:border-red-500 resize-none placeholder:text-slate-400"
                             value={adminNote}
                             onChange={(e) => setAdminNote(e.target.value)}
                           />
                         </div>
                         <button onClick={handleSaveNote} className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                           Transmit Reply To Student
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Final resolution closure modal */}
      <AnimatePresence>
        {showResolveModal && (
          <div className="fixed inset-0 z-[170] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[45px] border border-slate-200 dark:border-white/10 p-8 sm:p-10 shadow-2xl space-y-6 my-auto"
            >
              <div className="space-y-1 border-b border-slate-100 dark:border-white/5 pb-4">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">Complete Ticket Triage</h3>
                <p className="text-xs font-bold text-slate-400">This verifies repair completion. Solved issues auto-delete in 24 hours.</p>
              </div>

              <form onSubmit={submitResolution} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Resolved By Maintainer Group</label>
                  <input name="solvedBy" required defaultValue="Campus Facilities & Maintenance HQ" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Technical Resolution Details</label>
                  <textarea name="desc" required rows={3} defaultValue="Parts replaced and safety inspection conducted on location. Verified functional." className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none resize-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Total Repair Duration</label>
                  <input name="duration" required defaultValue="1 Hour 45 Mins" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none transition-all" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button type="button" onClick={() => setShowResolveModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">Cancel</button>
                  <button type="submit" className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Verify & Close Ticket</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
