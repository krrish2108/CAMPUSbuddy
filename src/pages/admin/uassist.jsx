import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Bot, 
  MessageSquare, 
  BrainCircuit, 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit2,
  Send,
  Zap,
  Activity,
  Globe,
  Search,
  UserCheck,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Sparkles,
  Mail,
  PhoneCall,
  Award,
  Filter,
  X,
  Play,
  Terminal,
  Cpu,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUAssist } from '@/context/UAssistContext';

export default function UAssistAdminPage() {
  const { 
    globalLogs, 
    faqs, 
    addFAQ, 
    updateFAQ, 
    deleteFAQ, 
    simulateKnowledgeMatch, 
    triggerSimulatedStudentQuery,
    sendGlobalBroadcast, 
    getStudentDetails,
    modelConfig, 
    setModelConfig 
  } = useUAssist();

  const [activeTab, setActiveTab] = useState('Brain Config & KB');
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  
  // Modal states
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);

  // AI Simulator States
  const [simulatorInput, setSimulatorInput] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);

  // Trigger brief floating toast notification
  const showToast = (message) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) {
      showToast('⚠️ Please enter a message before broadcasting.');
      return;
    }
    sendGlobalBroadcast(broadcastMsg);
    setBroadcastMsg('');
    showToast('🚀 AI Broadcast successfully transmitted to all student sessions and inboxes!');
  };

  const handleSimulateQuery = () => {
    if (!simulatorInput.trim()) return;
    const result = simulateKnowledgeMatch(simulatorInput);
    setSimulationResult(result);
    showToast('🤖 AI intent recognition completed!');
  };

  // Filter telemetry logs by search text
  const filteredLogs = (globalLogs || []).filter(log => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (log.student || '').toLowerCase().includes(q) || 
           (log.query || '').toLowerCase().includes(q) || 
           (log.intent || '').toLowerCase().includes(q) ||
           (log.identifier || '').toLowerCase().includes(q);
  });

  // Filter FAQs by search
  const filteredFaqs = (faqs || []).filter(faq => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (faq.q || '').toLowerCase().includes(q) || (faq.tags || '').toLowerCase().includes(q) || (faq.a || '').toLowerCase().includes(q);
  });

  const handleOpenStudentProfile = (studentInfo) => {
    const profile = getStudentDetails(studentInfo);
    if (profile) setSelectedStudent(profile);
  };

  return (
    <AdminLayout 
      title="UAssist Intelligence Hub" 
      subtitle="Neural Brain Config, Live User Telemetry, AI Broadcast & GPU Governance"
    >
      <div className="space-y-8 pb-20 animate-in fade-in duration-500 relative">
        
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

        {/* EXECUTIVE KPI COMMAND CARDS (Clean White Theme Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Neural GPU Load */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={13} className="text-purple-500 animate-pulse" /> Neural GPU Load
              </p>
              <h4 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white truncate">64.2%</h4>
              <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={12} /> Tensor Cores Online
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <Cpu size={26} />
            </div>
          </div>

          {/* Card 2: Live User Connections */}
          <div 
            onClick={() => {
              const newLog = triggerSimulatedStudentQuery();
              showToast(`🔄 Simulated new query from student ${newLog.student}!`);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-blue-500/50 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Radio size={13} className="text-blue-500 animate-ping" /> User Connections
              </p>
              <h4 className="text-3xl font-black tracking-tight text-blue-600 dark:text-blue-400 truncate">{(globalLogs || []).length} Active</h4>
              <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 underline underline-offset-2 flex items-center gap-1">
                ⚡ + Simulate Student Query →
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-lg shrink-0 group-hover:rotate-12 transition-transform">
              <MessageSquare size={26} />
            </div>
          </div>

          {/* Card 3: Intent Accuracy */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap size={13} className="text-emerald-500" /> Intent Recognition
              </p>
              <h4 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white truncate">98.9%</h4>
              <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 truncate">High Precision Parsing</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck size={26} />
            </div>
          </div>

          {/* Card 4: Capacitive Knowledge Base (Clean white theme) */}
          <div 
            onClick={() => {
              setActiveTab('Brain Config & KB');
              showToast("Jumped to Knowledge Base Editor & AI Simulator");
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden group cursor-pointer hover:border-purple-500/50 hover:scale-[1.02] transition-all"
          >
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <BrainCircuit size={13} className="text-purple-500" /> Knowledge Datasets
              </p>
              <h4 className="text-3xl font-black tracking-tight text-purple-600 dark:text-purple-400 truncate">{(faqs || []).length} KB Entries</h4>
              <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 underline underline-offset-4 flex items-center gap-1">
                🤖 Open AI Simulator →
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <BrainCircuit size={26} />
            </div>
          </div>
        </div>

        {/* MODULE TABS NAVIGATION */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-4 sm:p-6 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5 w-full lg:w-auto overflow-x-auto">
            {[
              { id: 'Brain Config & KB', label: 'Brain Config & KB', icon: BrainCircuit },
              { id: 'Live User Telemetry', label: `User Connections (${(globalLogs||[]).length})`, icon: Radio },
              { id: 'Broadcast Engine', label: 'AI Broadcast Engine', icon: Megaphone },
              { id: 'Neural GPU & Governance', label: 'Neural GPU Governance', icon: Sliders }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'animate-bounce' : ''} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Quick actions */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            {(activeTab === 'Brain Config & KB' || activeTab === 'Live User Telemetry') && (
              <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab.split(' ')[0].toLowerCase()} records...`} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold placeholder:text-slate-400 outline-none transition-all text-slate-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {activeTab === 'Brain Config & KB' && (
              <button 
                onClick={() => { setEditingFaq(null); setIsFaqModalOpen(true); }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/25 flex items-center gap-2 whitespace-nowrap active:scale-95 transition-all shrink-0"
              >
                <Plus size={16} /> Add FAQ Dataset
              </button>
            )}

            {activeTab === 'Live User Telemetry' && (
              <button 
                onClick={() => {
                  const created = triggerSimulatedStudentQuery();
                  showToast(`⚡ New simulated telemetry log added for ${created.student}`);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/25 flex items-center gap-2 whitespace-nowrap active:scale-95 transition-all shrink-0"
              >
                <RefreshCw size={15} className="animate-spin" /> Simulate Live Student Query
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: BRAIN CONFIG & KB EDITOR */}
        <AnimatePresence mode="wait">
          {activeTab === 'Brain Config & KB' && (
            <motion.div 
              key="brain_config"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* TOP INTERACTIVE AI RESPONSE SIMULATOR (STRICT WHITE THEME IN LIGHT MODE) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[40px] p-8 sm:p-10 shadow-xl text-slate-900 dark:text-white space-y-6 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Terminal size={14} /> Neural Inference Diagnostic Console
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <span>🤖 Interactive AI Response & Intent Simulator</span>
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      Type any student question below to test how UAssist matches it against your active Knowledge Base datasets!
                    </p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 w-fit">
                    Model: {modelConfig?.engine || 'Gemini 2.5 Pro'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g. When is the central library open for exams? OR How do I use Caffinity?"
                        value={simulatorInput}
                        onChange={(e) => setSimulatorInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSimulateQuery(); }}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 focus:border-purple-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleSimulateQuery}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/25 flex items-center gap-2 active:scale-95 transition-all shrink-0"
                      >
                        <Play size={16} fill="currentColor" />
                        <span>Test Query</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 pt-1">
                      <span>💡 Sample prompts to click:</span>
                      {[
                        "What are library timings?", 
                        "How do I join sports athletics?", 
                        "How to connect to wifi?"
                      ].map((prompt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSimulatorInput(prompt);
                            const res = simulateKnowledgeMatch(prompt);
                            setSimulationResult(res);
                            showToast(`Simulated test: "${prompt}"`);
                          }}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-all text-xs font-extrabold shadow-sm"
                        >
                          &quot;{prompt}&quot;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diagnostic output box */}
                  <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col justify-center min-h-[9rem] shadow-inner">
                    {simulationResult ? (
                      <div className="space-y-3 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/25">
                            Intent: {simulationResult.intent}
                          </span>
                          <span className="text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400">
                            Confidence: {simulationResult.confidence}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 leading-relaxed italic shadow-sm">
                          &quot;{simulationResult.response}&quot;
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest opacity-70">
                        <Bot size={28} className="mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                        <span>Awaiting simulation prompt...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* KNOWLEDGE BASE CARDS GRID */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <BrainCircuit className="text-purple-500" size={22} />
                    <span>Active Knowledge Datasets ({filteredFaqs.length})</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Admins can edit or append FAQ rules to train UAssist responses immediately.</p>
                </div>

                {filteredFaqs.length === 0 ? (
                  <div className="py-20 text-center opacity-50 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[35px]">
                    <BrainCircuit size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="font-black uppercase tracking-widest text-sm text-slate-500">No matching Knowledge Base FAQ entries found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFaqs.map(faq => (
                      <div key={faq.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-7 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-mono font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-500/20">
                              #{faq.id}
                            </span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => { setEditingFaq(faq); setIsFaqModalOpen(true); }}
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                title="Edit dataset entry"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => { if (window.confirm('Remove this FAQ dataset from neural memory?')) { deleteFAQ(faq.id); showToast('Removed dataset entry.'); } }} 
                                className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"
                                title="Delete dataset entry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <h5 className="font-black text-base text-slate-900 dark:text-white leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {faq.q}
                          </h5>

                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                            {faq.a}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider truncate max-w-[14rem]">
                            🏷️ Tags: <span className="text-purple-600 dark:text-purple-400 font-extrabold">{faq.tags}</span>
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Trained ✓
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: LIVE USER TELEMETRY & CONNECTION MATRIX */}
          {activeTab === 'Live User Telemetry' && (
            <motion.div 
              key="telemetry"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[35px] border border-slate-200/80 dark:border-white/10 shadow-lg">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                    <Radio className="text-blue-500 animate-pulse" size={26} />
                    <span>Live Student Connections & Chat Monitor</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                    Real-time neural telemetry across campus user accounts. Click any student row or **&quot;👤 Inspect Student&quot;** button to examine student credentials and contact lines!
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Signal Streaming</span>
                </div>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="py-20 text-center opacity-50 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[35px]">
                  <MessageSquare size={48} className="mx-auto mb-3 text-slate-400" />
                  <p className="font-black uppercase tracking-widest text-sm text-slate-500">No student telemetry matching criteria in current log</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] shadow-xl">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-8">Timestamp</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Customer & ID</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Query & AI Response</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Intent Classification</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Accuracy</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                          <td className="p-5 pl-8 text-xs font-mono font-black text-slate-500 whitespace-nowrap">
                            {log.time || 'Just now'}
                          </td>

                          {/* Student identity card */}
                          <td className="p-5">
                            <div 
                              onClick={() => handleOpenStudentProfile({ name: log.student, email: log.email, identifier: log.identifier })}
                              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 hover:border-blue-500/50 cursor-pointer transition-all flex items-center gap-3 group/user w-fit min-w-[12rem]"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                                {(log.student || 'S')[0]}
                              </div>
                              <div className="min-w-0 pr-1">
                                <h5 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover/user:text-blue-500 transition-colors">
                                  {log.student}
                                </h5>
                                <p className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                  <span>{log.identifier || '24BCE10023'}</span>
                                  <span className="underline decoration-dotted">Profile →</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Query & AI Response */}
                          <td className="p-5 max-w-sm">
                            <p className="text-xs font-black text-slate-900 dark:text-white italic">
                              &quot;{log.query}&quot;
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-bold line-clamp-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200/40 dark:border-white/5">
                              🤖 AI: {log.fullResponse || "Resolved via neural routing."}
                            </p>
                          </td>

                          {/* Intent Tag */}
                          <td className="p-5 whitespace-nowrap">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 inline-block shadow-sm">
                              {log.intent || 'GENERAL_QUERY'}
                            </span>
                          </td>

                          {/* Accuracy Score */}
                          <td className="p-5">
                            <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                              {log.accuracy || '99.2%'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-5 text-right pr-8">
                            <button
                              type="button"
                              onClick={() => handleOpenStudentProfile({ name: log.student, email: log.email, identifier: log.identifier })}
                              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 hover:text-white rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto shadow-sm"
                            >
                              <UserCheck size={14} />
                              <span>Inspect Student</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: BROADCAST ENGINE (STRICT WHITE THEME IN LIGHT MODE) */}
          {activeTab === 'Broadcast Engine' && (
            <motion.div 
              key="broadcast_engine"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[45px] p-8 sm:p-12 shadow-xl text-slate-900 dark:text-white relative overflow-hidden border border-slate-200/80 dark:border-white/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center border border-purple-500/20 shadow-lg text-purple-600 dark:text-purple-400 shrink-0">
                        <Megaphone size={30} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">Campus Wide Transmitter</span>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">AI Broadcast Engine</h3>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ready to transmit
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">Broadcast Emergency Alert or Announcements</h4>
                    <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Submitting a broadcast will instantaneously push an alert card to all active UAssist neural chat sessions AND deposit an official high-priority notice into every student customer&apos;s campus inbox!
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400">Pre-fill Templates:</span>
                      {[
                        "⚠️ Weather Notice: All outdoor events moved indoors.",
                        "🍕 Caffinity Flash Offer: 20% off all dining orders before 2 PM!",
                        "📚 Exam Prep: Central library is now open 24/7."
                      ].map((tmpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setBroadcastMsg(tmpl)}
                          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-xl font-extrabold text-xs border border-slate-200/80 dark:border-slate-700 transition-all shadow-sm"
                        >
                          {tmpl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <textarea 
                      rows={4}
                      placeholder="Type emergency blast or announcement text here..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-3xl p-6 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none shadow-inner transition-all"
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                    />
                    
                    <button 
                      type="button"
                      onClick={handleBroadcast}
                      className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-600/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <Send size={18} />
                      <span>Broadcast to All Student Accounts & Inboxes</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: NEURAL GPU & AI GOVERNANCE (STRICT WHITE THEME IN LIGHT MODE) */}
          {activeTab === 'Neural GPU & Governance' && (
            <motion.div 
              key="ai_governance"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[45px] p-8 sm:p-10 shadow-xl space-y-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Model Hyperparameters & Hardware</span>
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                    <Sliders className="text-purple-500" size={26} />
                    <span>Neural AI Engine & Governance</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                    Fine-tune Large Language Model parameters, escalation thresholds, and tensor memory allocation.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* AI Model Selection */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-3">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                      Primary Inference Reasoning Engine
                    </label>
                    <select
                      value={modelConfig.engine}
                      onChange={(e) => {
                        setModelConfig({...modelConfig, engine: e.target.value});
                        showToast(`Switched active AI engine to ${e.target.value}!`);
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-sm rounded-2xl px-5 py-3.5 outline-none focus:border-purple-500 cursor-pointer shadow-sm"
                    >
                      <option>Gemini 2.5 Pro (Deep Reasoning & Multi-Modal)</option>
                      <option>Gemini Flash Lite 2.0 (Ultra-Fast Intent Recognition)</option>
                      <option>Claude 3.5 Sonnet (Campus Academic Specialist)</option>
                      <option>Custom Fine-Tuned Campus Llama-3-70B</option>
                    </select>
                    <p className="text-[11px] font-bold text-slate-500">
                      Recommended: **Gemini 2.5 Pro** offers highest fidelity for complex library rules and ProblemBox dispatch logic.
                    </p>
                  </div>

                  {/* Temperature slider */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                        Response Creativity & Temperature: <span className="text-purple-600 dark:text-purple-400 font-mono text-base">{modelConfig.temperature}</span>
                      </label>
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                        {modelConfig.temperature < 0.4 ? 'Strict & Factual' : 'Creative Companion'}
                      </span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.1" 
                      value={modelConfig.temperature} 
                      onChange={(e) => {
                        setModelConfig({...modelConfig, temperature: parseFloat(e.target.value)});
                        showToast(`Temperature tuned to ${e.target.value}`);
                      }}
                      className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                      <span>0.0 (Deterministic / FAQ exact matching)</span>
                      <span>1.0 (Freely conversational)</span>
                    </div>
                  </div>

                  {/* Cache Controls */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h5 className="font-black text-sm text-slate-900 dark:text-white">Neural Conversation Cache & Session Storage</h5>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">Flush temporary student conversation vectors to reclaim GPU RAM without erasing knowledge bases.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("⚡ Tensor context cache purged! Reclaimed 1.4 GB VRAM.")}
                      className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25 shrink-0 active:scale-95"
                    >
                      Purge Neural Cache
                    </button>
                  </div>
                </div>
              </div>

              {/* Right status panel (Clean white theme responsive in light mode) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[45px] p-8 text-slate-900 dark:text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-3xl flex items-center justify-center shadow-lg">
                    <Cpu size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Hardware Status
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">8x NVIDIA Tensor H100</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Dedicated campus inference clusters with latency &lt; 45ms.</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                    <div className="flex justify-between text-xs font-extrabold">
                      <span className="text-slate-500 dark:text-slate-400">VRAM Allocation:</span>
                      <span className="text-purple-600 dark:text-purple-400 font-mono">38.4 GB / 80 GB</span>
                    </div>
                    <div className="flex justify-between text-xs font-extrabold">
                      <span className="text-slate-500 dark:text-slate-400">Token Throughput:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono">142 tokens/sec</span>
                    </div>
                    <div className="flex justify-between text-xs font-extrabold">
                      <span className="text-slate-500 dark:text-slate-400">Uptime Reliability:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">99.998%</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-800 dark:text-purple-300 mt-8">
                  🛡️ **Security Protocol**: All student neural sessions are fully encrypted via zero-knowledge transport layers.
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        
        {/* MODAL 1: STUDENT USER PROFILE INSPECTION */}
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
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">UAssist Neural Connection</span>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                        <span>👤 Student Telemetry Profile</span>
                      </h3>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Top user badge */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                      {(selectedStudent.name || 'S')[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">{selectedStudent.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          selectedStudent.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}>
                          {selectedStudent.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-purple-600 dark:text-purple-400 mt-1">{selectedStudent.department || 'Computer Science Engineering'}</p>
                      <p className="text-[11px] font-mono font-bold text-slate-400">Roll / ID: {selectedStudent.identifier || '24BCE10023'}</p>
                    </div>
                  </div>

                  {/* Contact info coordinates */}
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

                  {/* UAssist Neural History breakdown */}
                  <div className="space-y-2 bg-purple-500/5 dark:bg-purple-500/10 p-5 rounded-3xl border border-purple-500/20">
                    <p className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Radio size={15} /> Student Neural Query History
                    </p>
                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1 pt-2">
                      {globalLogs.filter(log => log.student === selectedStudent.name || log.email === selectedStudent.email).map((l, idx) => (
                        <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-extrabold space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>Intent: {l.intent}</span>
                            <span>{l.time}</span>
                          </div>
                          <p className="text-slate-900 dark:text-white italic">&quot;{l.query}&quot;</p>
                        </div>
                      ))}
                      {globalLogs.filter(log => log.student === selectedStudent.name || log.email === selectedStudent.email).length === 0 && (
                        <p className="text-xs font-bold text-slate-400 italic">No historical queries in active telemetry buffer.</p>
                      )}
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
                        showToast(`Connecting voice relay to ${selectedStudent.phone}...`);
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

        {/* MODAL 2: FAQ DATASET EDITOR MODAL */}
        <FaqEditorModal
          isOpen={isFaqModalOpen}
          onClose={() => setIsFaqModalOpen(false)}
          editingFaq={editingFaq}
          onSave={(faqData) => {
            if (editingFaq && editingFaq.id) {
              updateFAQ(editingFaq.id, faqData);
              showToast("Saved updates to Knowledge Base dataset!");
            } else {
              addFAQ(faqData);
              showToast("Added new FAQ dataset entry to neural memory!");
            }
            setIsFaqModalOpen(false);
          }}
        />

      </div>
    </AdminLayout>
  );
}

function FaqEditorModal({ isOpen, onClose, editingFaq, onSave }) {
  const [formData, setFormData] = useState({ q: '', a: '', tags: '' });

  useEffect(() => {
    if (editingFaq) {
      setFormData(editingFaq);
    } else {
      setFormData({ q: '', a: '', tags: 'GENERAL, CAMPUS' });
    }
  }, [editingFaq, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-[45px] w-full max-w-lg p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-white/10 relative my-auto space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Dataset Training</span>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
              {editingFaq && editingFaq.id ? '✏️ Edit Knowledge Entry' : '➕ Add FAQ Dataset'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Student Question / Prompt Trigger</label>
            <input 
              required 
              type="text" 
              value={formData.q || ''} 
              onChange={e => setFormData({...formData, q: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-all" 
              placeholder="e.g. What are the rules for innovation lab?" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">AI Trained Response & Guidance</label>
            <textarea 
              required 
              rows={4} 
              value={formData.a || ''} 
              onChange={e => setFormData({...formData, a: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500 resize-none transition-all" 
              placeholder="Provide clear instructions that UAssist will present to students..." 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Intent Keywords & Tags (Comma separated)</label>
            <input 
              required 
              type="text" 
              value={formData.tags || ''} 
              onChange={e => setFormData({...formData, tags: e.target.value.toUpperCase()})} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-mono font-black text-purple-600 dark:text-purple-400 outline-none focus:border-purple-500 transition-all uppercase" 
              placeholder="e.g. LAB, BOOKING, INNOVATION" 
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">Cancel</button>
            <button type="submit" className="flex-[2] py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/25 hover:scale-[1.02] active:scale-95 transition-all">
              {editingFaq && editingFaq.id ? 'Save Changes' : 'Confirm & Train Brain'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
