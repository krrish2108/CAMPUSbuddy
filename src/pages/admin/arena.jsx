import { useState } from 'react';
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
  MonitorPlay
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArena } from '@/context/ArenaContext';
import { EVENT_CATEGORIES } from '@/data/arenaData';

const INITIAL_EVENTS = [
  { id: 'ev-001', title: 'CodePulse Hackathon', category: 'Tech Fest', date: '15 Apr 2026', location: 'Main Auditorium', status: 'Active', participants: 450, capacity: 500, type: 'Offline' },
  { id: 'ev-002', title: 'Inter-College Dance Off', category: 'Cultural', date: '21 Apr 2026', location: 'Open Air Theatre', status: 'Upcoming', participants: 120, capacity: 800, type: 'Offline' },
  { id: 'ev-003', title: 'Google Cloud Workshop', category: 'Seminar', date: '12 May 2026', location: 'Lab 4', status: 'Completed', participants: 60, capacity: 60, type: 'Hybrid' },
];

function ArenaAdminContent() {
  const { events, updateEvent, deleteEvent, addEvent } = useArena();
  const [activeTab, setActiveTab] = useState('Event Directory');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Hackathon',
    date: '',
    capacity: 500,
    registrationLink: '',
    photos: [] // { url: '', order: 0 }
  });

  const [photoUrl, setPhotoUrl] = useState('');

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
      photos: ev.photos || []
    });
    setShowCreateModal(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setNewEvent({ title: '', category: 'Hackathon', date: '', capacity: 500, registrationLink: '', photos: [] });
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
        coverImage: newEvent.photos[0]?.url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        tags: [newEvent.category],
        timeline: { startsIn: 'Upcoming', duration: 'TBD' }
      };
      addEvent(eventToDeploy);
    }
    setShowCreateModal(false);
    setEditingId(null);
    setNewEvent({ title: '', category: 'Hackathon', date: '', capacity: 500, registrationLink: '', photos: [] });
  };

  return (
    <AdminLayout 
      title="Arena Control" 
      subtitle="Event & Capacity Management"
    >
      <div className="space-y-10 pb-20">
        
        {/* TABS */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-2">
          {['Event Directory', 'Registration Hub'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                 activeTab === tab ? 'text-pink-600 dark:text-pink-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
               }`}
             >
               {tab}
               {activeTab === tab && <motion.div layoutId="arena-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-t-full shadow-[0_0_10px_#ec4899]" />}
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
                   <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Govern campus life operations</p>
                 </div>
                 <button 
                   onClick={openCreateModal}
                   className="px-6 py-4 bg-pink-500 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20 hover:scale-105 transition-all flex items-center gap-3"
                 >
                   <Plus size={18} /> Launch Event
                 </button>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {events.map((ev, i) => (
                    <motion.div 
                      key={ev.id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-[40px] p-8 shadow-md dark:shadow-2xl relative overflow-hidden group hover:border-pink-500/30 transition-colors"
                    >
                       <div className="flex items-start justify-between mb-8">
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                   ev.status === 'Live' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500' :
                                   ev.status === 'Completed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' :
                                   ev.status === 'On Hold' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500' :
                                   'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500'
                                }`}>{ev.status}</span>
                                <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 border border-slate-200 dark:border-white/10 rounded-lg">{ev.category || (ev.tags && ev.tags[0])}</span>
                             </div>
                             <h4 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter truncate max-w-[280px]">{ev.title}</h4>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5">
                               <CalendarDays size={14} className="text-pink-500" /> {ev.date}
                             </div>
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5">
                               <MapPin size={14} className="text-pink-500" /> {ev.location}
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-white/5 mb-6">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance Limit</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white italic mt-1">
                               {ev.capacity?.filled ?? ev.participants ?? 0} <span className="text-slate-400 dark:text-slate-500">/ {ev.capacity?.total ?? ev.capacity ?? 0}</span>
                            </p>
                          </div>
                          <div className="w-[120px] h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${(ev.capacity?.filled ?? ev.participants ?? 0) >= (ev.capacity?.total ?? ev.capacity ?? 0) * 0.9 ? 'bg-red-500' : 'bg-pink-500'}`} 
                                style={{ width: `${((ev.capacity?.filled ?? ev.participants ?? 0) / (ev.capacity?.total ?? ev.capacity ?? 1)) * 100}%` }}
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-4 gap-3">
                          <button onClick={() => changeStatus(ev.id, 'On Hold')} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                            <Pause size={16} className="mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Hold</span>
                          </button>
                          <button onClick={() => changeStatus(ev.id, 'Live')} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-500/10 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-500 transition-colors">
                            <Play size={16} className="mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Activate</span>
                          </button>
                          <button onClick={() => startEdit(ev)} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                            <Edit2 size={16} className="mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Edit</span>
                          </button>
                          <button onClick={() => deleteEvent(ev.id)} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 text-red-600 dark:text-red-500 transition-colors border border-red-100 dark:border-red-500/10">
                            <Trash2 size={16} className="mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Delete</span>
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
               <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[45px] p-10 shadow-xl dark:shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:bg-white">Live Registrations</h3>
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Select an event to view roll call</p>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                     {events.map((ev, i) => (
                        <button key={i} className={`px-6 py-4 rounded-2xl border-2 whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${
                          i === 0 ? 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-500 border-pink-200 dark:border-pink-500/30' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                        }`}>
                          {ev.title}
                        </button>
                     ))}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-[30px] overflow-hidden">
                     <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="border-b border-slate-200 dark:border-white/5">
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5">Ticket ID</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5">Attendee</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5">College ID</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5">Mode</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                         {[
                           { t: 'TK-849', name: 'Rohan Sharma', id: '24BCE10023', m: 'Solo' },
                           { t: 'TK-850', name: 'Priya Patel', id: '24BCE10105', m: 'Duo Sync' },
                           { t: 'TK-851', name: 'Amit Kumar', id: '24BME20044', m: 'Trio' },
                         ].map(row => (
                           <tr key={row.t} className="hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                              <td className="p-6 font-bold text-slate-500 dark:text-slate-400 text-sm">{row.t}</td>
                              <td className="p-6 font-bold text-slate-900 dark:text-white text-sm">{row.name}</td>
                              <td className="p-6 font-bold text-slate-500 dark:text-slate-400 text-sm">{row.id}</td>
                              <td className="p-6">
                                <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                  {row.m}
                                </span>
                              </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CREATE MODAL */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                 className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl rounded-[50px] overflow-hidden"
               >
                 <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-500" />
                 <div className="p-10 space-y-8">
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
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-pink-500 outline-none appearance-none"
                            value={newEvent.category}
                            onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                          >
                             {EVENT_CATEGORIES.filter(c => c !== 'All').map(cat => (
                               <option key={cat}>{cat}</option>
                             ))}
                          </select>
                        </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Date & Time</label>
                         <input 
                           type="datetime-local" 
                           className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-pink-500 outline-none" 
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
                        onClick={handleDeploy}
                        className="w-full py-5 bg-pink-500 text-white rounded-[25px] font-black text-sm uppercase tracking-widest hover:bg-pink-600 shadow-xl shadow-pink-500/20 transition-colors"
                      >
                        {editingId ? 'Save Changes' : 'Deploy Event'}
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
