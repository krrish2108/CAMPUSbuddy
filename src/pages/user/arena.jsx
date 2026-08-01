import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import ModuleLayout from '@/components/ModuleLayout';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Zap,
  LayoutDashboard,
  Ticket,
  QrCode,
  ArrowLeft,
  Share2,
  Bell,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  MessageSquare,
  Users2,
  UserPlus,
  ChevronLeft,
  Smartphone
} from 'lucide-react';
import { EVENTS, EVENT_CATEGORIES, DASHBOARD_STATS, FRIENDS, TEAM_TIERS, SUGGESTED_TEAMMATES, NETWORK_ACTIVITY } from '@/data/arenaData';
import { useArena } from '@/context/ArenaContext';

function ArenaContent() {
  const {
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
    addEvent,
    updateEvent,
    deleteEvent,
    events,
    searchResults,
    isSearching,
    findTeammates
  } = useArena();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showTicket, setShowTicket] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [removedFriends, setRemovedFriends] = useState([]);

  const TABS = ['Events', 'Network', 'My Tickets'];

  const friendScrollRef = useRef(null);

  const featuredEvents = useMemo(() => events.filter(e => e.isFeatured), [events]);

  // Auto-carousel logic
  useEffect(() => {
    if (activeTab !== 'Events') return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredEvents.length, activeTab]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = activeCategory === 'All' || (event.tags && event.tags.includes(activeCategory)) || event.status === activeCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, events]);

  useEffect(() => {
    if (activeTab === 'Network') {
      const timer = setTimeout(() => {
        findTeammates(searchQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, activeTab]);

  const networkStudents = searchQuery ? searchResults : SUGGESTED_TEAMMATES;

  const scrollFriends = (direction) => {
    if (friendScrollRef.current) {
      const scrollAmount = 200;
      friendScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredTeammates = useMemo(() => {
    return SUGGESTED_TEAMMATES.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredActivity = useMemo(() => {
    return NETWORK_ACTIVITY.filter(act => {
      const friend = FRIENDS.find(f => f.id === act.friendId);
      return friend?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.text.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return (
    <ModuleLayout title="Arena" subtitle="Campus Connections, Events & Activity Booking" color="#1e293b">
      <div className="pb-32">
        {/* DASHBOARD HEADER STATS */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm hover:border-amber-500/30 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">My Events</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{registrations.length}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm hover:border-blue-500/30 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Network</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{connections.length + FRIENDS.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm hover:border-pink-500/30 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Syncs</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{pendingNetworkRequests.length + (incomingSyncRequest ? 1 : 0)}</h3>
            </div>
            <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-2xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
          </div>
        </div>

        {/* TAB SWITCHER - MOVED TO TOP AND STICKY */}
        <div className="flex justify-center -mx-4 px-4 sticky top-[64px] z-[40] bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl py-4 transition-all border-b border-gray-100 dark:border-white/5">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[25px] relative w-full max-w-lg shadow-inner">
            <div
              className="absolute h-[calc(100%-12px)] top-1.5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-amber-500 rounded-[20px] shadow-lg shadow-amber-500/30"
              style={{
                left: `${(TABS.indexOf(activeTab) * 33.33) + 0.5}%`,
                width: '32.33%'
              }}
            />
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors duration-300 ${activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
              >
                {tab}
                {tab === 'Network' && pendingNetworkRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white border-2 border-slate-100 dark:border-slate-800 animate-pulse">
                    {pendingNetworkRequests.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden min-h-[60vh]">
          {/* EVENTS VIEW */}
          {activeTab === 'Events' && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              {/* SEARCH BAR (EVENT SPECIFIC) */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search hackathons, workshops..."
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent rounded-[25px] focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-base shadow-sm dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* HERO CAROUSEL */}
              <div className="relative h-[400px] rounded-[50px] overflow-hidden group shadow-2xl border-4 border-white dark:border-slate-800">
                {featuredEvents.map((event, idx) => (
                  <div
                    key={event.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === carouselIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
                  >
                    <img src={event.coverImage} className="w-full h-full object-cover" alt={event.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-12">
                      <div className="space-y-4 max-w-2xl animate-in slide-in-from-bottom-8 duration-700">
                        <div className="flex gap-2">
                          <span className="bg-amber-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">Featured Event</span>
                          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest border border-white/30">{event.mode}</span>
                        </div>
                        <h2 className="text-5xl font-black text-white font-syne tracking-tighter leading-none italic uppercase">{event.title}</h2>
                        <p className="text-white/80 font-medium text-lg max-w-lg line-clamp-2">{event.description}</p>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all active:scale-95 shadow-xl flex items-center gap-3"
                        >
                          View details <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-10 right-12 flex gap-3">
                  {featuredEvents.map((_, i) => (
                    <button key={i} onClick={() => setCarouselIndex(i)} className={`h-2 rounded-full transition-all duration-500 ${i === carouselIndex ? 'w-10 bg-amber-500' : 'w-2 bg-white/40'}`} />
                  ))}
                </div>
              </div>

              {/* FILTERS */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none sticky top-[88px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-20 py-4 -mx-4 px-4 transition-all">
                {EVENT_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all duration-300 border-2 uppercase tracking-widest ${activeCategory === cat ? 'bg-amber-500 border-amber-500 text-white shadow-xl scale-105' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400 hover:border-amber-500 hover:text-amber-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* EVENT FEED */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredEvents.map(event => {
                  const isLive = event.status === 'Live';
                  const capacityPercent = (event.capacity.filled / event.capacity.total) * 100;
                  const isFull = capacityPercent > 85;
                  const isRegistered = registrations.some(r => r.eventId === event.id);

                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`group relative bg-white dark:bg-slate-900 rounded-[40px] border-2 ${isLive ? 'border-amber-500/50 shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]' : 'border-slate-100 dark:border-white/5 shadow-xl'} overflow-hidden hover:shadow-2xl hover:border-amber-500/30 transition-all duration-500 h-[400px] cursor-pointer flex flex-col`}
                    >
                      {/* Image Top Half */}
                      <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image 
                          src={event.coverImage} 
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 dark:opacity-100" />
                        
                        {/* Badges */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                          <div className="flex gap-2">
                            {isLive && (
                              <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> Live
                              </div>
                            )}
                            {event.status === 'On Hold' && (
                              <div className="flex items-center gap-2 bg-amber-500 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                On Hold
                              </div>
                            )}
                            <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                              {event.tags[0]}
                            </div>
                          </div>
                          {isRegistered && (
                            <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                              <CheckCircle2 size={12} /> RSVP&apos;d
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Bottom Half */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase group-hover:text-amber-500 transition-colors line-clamp-1">{event.title}</h3>
                            <span className="shrink-0 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-bold ml-2">
                              {event.isPaid ? `₹${event.fee}` : 'Free'}
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{event.description}</p>
                        </div>
                        
                        <div className="mt-4 space-y-4">
                          <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 gap-y-2">
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-amber-500" /> {event.timeline.startsIn === 'Now' ? 'Ongoing' : event.timeline.startsIn}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-500" /> {event.location.split(',')[0]}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                Capacity: {event.capacity.filled}/{event.capacity.total}
                              </span>
                              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                {Math.round(capacityPercent)}% Filled
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${isFull ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${capacityPercent}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NETWORK VIEW */}
          {activeTab === 'Network' && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500 pb-20">
              {/* NETWORK SEARCH */}
              <div className="relative group max-w-2xl mx-auto pt-6">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={22} />
                  <input
                    type="text"
                    placeholder="Search students by name, skill, branch..."
                    className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-[30px] focus:outline-none focus:border-amber-500 transition-all font-bold text-lg shadow-2xl dark:text-white placeholder:text-gray-600"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* SUGGESTED TEAMMATES */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Suggested Teammates</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isSearching ? (
                    <div className="col-span-full py-16 text-center text-amber-500 font-bold animate-pulse">Searching Campus...</div>
                  ) : networkStudents.length > 0 ? (
                    networkStudents.map(student => (
                      <div key={student.id} className="bg-white dark:bg-[#1a1a2e] border-2 border-slate-100 dark:border-white/5 rounded-[30px] p-6 shadow-xl hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all group relative overflow-hidden flex flex-col h-full hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="relative w-16 h-16 rounded-[20px] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-md">
                            <Image 
                              src={student.avatar} 
                              alt={student.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <button className="bg-slate-50 dark:bg-slate-800 text-amber-500 hover:bg-amber-500 hover:text-white p-2 rounded-xl transition-all active:scale-95 shadow-sm border border-slate-100 dark:border-white/5">
                            <UserPlus size={18} />
                          </button>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-amber-500 transition-colors">{student.name}</h4>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{student.branch} · Sem {student.semester}</p>
                        </div>
                        
                        <div className="mt-auto space-y-3">
                          <div className="flex flex-wrap gap-1.5">
                            {student.skills?.slice(0, 3).map(skill => (
                              <span key={skill} className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase rounded-lg border border-amber-200/50 dark:border-amber-500/20">
                                {skill}
                              </span>
                            ))}
                          </div>
                          {student.matchTag && (
                            <p className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 px-3 py-2 rounded-xl">
                              <Zap size={10} fill="currentColor" /> {student.matchTag}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No teammates found</div>
                  )}
                </div>
              </div>

              {/* MY NETWORK */}
              <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Users size={20} fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">My Network</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FRIENDS.concat(connections).filter(f => !removedFriends.includes(f.id)).length > 0 ? (
                    FRIENDS.concat(connections).filter(f => !removedFriends.includes(f.id)).map(friend => (
                      <div key={friend.id} className="bg-white dark:bg-[#1a1a2e] border-2 border-slate-100 dark:border-white/5 rounded-[30px] p-6 shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden flex flex-col h-full hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="relative w-16 h-16 rounded-[20px] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-md">
                            <Image 
                              src={friend.avatar} 
                              alt={friend.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {friend.isOnline && (
                               <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
                            )}
                          </div>
                          <button 
                            onClick={() => setRemovedFriends(prev => [...prev, friend.id])}
                            className="bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white p-2 rounded-xl transition-all active:scale-95 shadow-sm border border-slate-100 dark:border-white/5 text-xs font-black uppercase"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-500 transition-colors">{friend.name}</h4>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{friend.branch} · Sem {friend.semester}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No connections yet</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6 border-t border-slate-100 dark:border-white/5">
                {/* FRIENDS ACTIVITY */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Users2 size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Activity</h3>
                  </div>
                  <div className="bg-white dark:bg-[#1a1a2e]/50 rounded-[45px] border-4 border-slate-100 dark:border-white/5 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden shadow-2xl">
                    {filteredActivity.length > 0 ? (
                      filteredActivity.map(act => (
                        <div key={act.id} className="p-6 flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <img src={FRIENDS.find(f => f.id === act.friendId)?.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 dark:border-white/10" alt="Friend Activity" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white/90 leading-snug">{act.text}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-widest">{act.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No activity found</div>
                    )}
                  </div>
                </div>

                {/* FRIEND REQUESTS */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <UserPlus size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Requests</h3>
                  </div>
                  <div className="space-y-4">
                    {pendingNetworkRequests.map(req => (
                      <div key={req.id} className="bg-white dark:bg-[#1a1a2e] rounded-[40px] p-6 border-2 border-slate-100 dark:border-white/5 flex items-center gap-6 shadow-xl">
                        <img src={req.avatar} className="w-16 h-16 rounded-3xl object-cover border-4 border-slate-100 dark:border-slate-900 shadow-lg" alt={req.name} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{req.name}</h4>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mt-1">{req.branch}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => acceptNetworkRequest(req.id)} className="px-6 py-3 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Accept</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'My Tickets' && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500 pb-20">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Ticket size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">My Tickets</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {registrations.map(reg => {
                  const event = EVENTS.find(e => e.id === reg.eventId);
                  if (!event) return null;
                  return (
                    <div 
                      key={reg.id} 
                      onClick={() => { setSelectedEvent(event); setShowTicket(true); }}
                      className="group relative bg-white dark:bg-[#1a1a2e] rounded-3xl overflow-hidden shadow-2xl cursor-pointer active:scale-95 transition-all duration-500 flex flex-col md:flex-row hover:shadow-amber-500/10 border-2 border-slate-100 dark:border-white/5 hover:border-amber-500/50"
                    >
                      {/* Left Side: Event Details */}
                      <div className="flex-1 p-6 md:p-8 relative">
                        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-50 dark:from-[#0f172a] to-transparent opacity-50" />
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between items-start">
                            <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-200/50 dark:border-amber-500/20">
                              {event.tags[0]}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              ID: {reg.id.split('-')[1] || reg.id}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase italic group-hover:text-amber-500 transition-colors line-clamp-1">{event.title}</h4>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                              <MapPin size={12} className="text-amber-500" /> {event.location.split(',')[0]}
                            </p>
                          </div>

                          <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Starts In</p>
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{event.timeline.startsIn}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gate</p>
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase">A4</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                              <p className="text-sm font-black text-green-500 uppercase">Confirmed</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: QR Code (Tear off style) */}
                      <div className="w-full md:w-48 bg-slate-50 dark:bg-[#0f172a] p-6 flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-l-2 border-dashed border-slate-200 dark:border-white/10 relative">
                        {/* Perforation Cutouts */}
                        <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-gray-50 dark:bg-[#020617] rounded-full" />
                        <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 bg-gray-50 dark:bg-[#020617] rounded-full" />
                        
                        <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-inner border border-slate-200 mb-3">
                          <QrCode className="text-slate-900 w-full h-full" />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Admit One</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NOTIFICATION OVERLAY SIMULATION */}
      <div className="fixed top-24 right-10 z-[200] space-y-3 pointer-events-none">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-4 rounded-3xl shadow-2xl border-4 ${notif.type === 'outgoing' ? 'bg-slate-900 border-amber-500/30' : 'bg-amber-500 border-white/20'} animate-in slide-in-from-right-8 duration-500 flex items-center gap-4 max-w-sm`}>
            <div className="p-3 bg-white/10 rounded-2xl text-white">
              {notif.type === 'outgoing' ? <Smartphone size={24} /> : <Bell size={24} />}
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">{notif.type === 'outgoing' ? 'System Request' : 'Incoming Sync'}</p>
              <p className="text-xs font-bold text-white leading-tight">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* EVENT DETAIL OVERLAY */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => { setSelectedEvent(null); setSentRequests([]); }} />
          <div className="relative w-full max-w-[95vw] md:max-w-4xl h-full md:h-[90vh] bg-white dark:bg-slate-900 rounded-none md:rounded-[50px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500 mx-auto border border-white/5">
            <button
              onClick={() => { setSelectedEvent(null); setSentRequests([]); }}
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all active:scale-90"
            >
              <ArrowLeft className="md:rotate-90" size={24} />
            </button>

            {/* Banner Side */}
            <div className="relative w-full md:w-2/5 h-64 md:h-full shrink-0">
              <img src={selectedEvent.coverImage} className="w-full h-full object-cover" alt={selectedEvent.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent md:bg-gradient-to-r p-10 flex flex-col justify-end">
                <div className="space-y-2">
                  <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest">{selectedEvent.tags[0]}</span>
                  <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">{selectedEvent.title}</h3>
                </div>
              </div>
            </div>

              {/* Content Side */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 relative overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-none">
                
                {/* About & Quick Stats */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">About The Event</h4>
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{selectedEvent.description}</p>
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-3">Organized by {selectedEvent.organizer}</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 p-6 bg-slate-50 dark:bg-white/5 rounded-[30px] border-2 border-slate-100 dark:border-white/10 flex flex-col items-center text-center space-y-2 group hover:border-amber-500 transition-all">
                      <Clock className="text-amber-500" size={24} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starts in</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{selectedEvent.timeline.startsIn}</p>
                    </div>
                    <div className="flex-1 p-6 bg-slate-50 dark:bg-white/5 rounded-[30px] border-2 border-slate-100 dark:border-white/10 flex flex-col items-center text-center space-y-2 group hover:border-amber-500 transition-all">
                      <Trophy className="text-amber-500" size={24} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prize Pot</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{selectedEvent.prizePot}</p>
                    </div>
                  </div>
                </div>

                {/* TEAM SYNC MODIFIED WITH VISIBLE SCROLLBAR */}
                <div className="p-4 md:p-8 bg-slate-900 rounded-[35px] text-white space-y-6 relative group/arena overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black tracking-tight italic uppercase leading-none mb-1">Team Sync Request</p>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Suggesting from My Network</p>
                    </div>
                    <Users size={20} className="text-amber-500" />
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {TEAM_TIERS.map(tier => (
                      <button
                        key={tier}
                        onClick={() => setActiveTeamTier(tier)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTeamTier === tier ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>

                  {/* FRIEND CAROUSEL CONTAINER */}
                  <div className="relative -mx-2 bg-slate-800/80 backdrop-blur-md rounded-[30px] p-2 border border-white/5 shadow-2xl overflow-hidden">
                    {/* Left Button */}
                    <button
                      onClick={() => scrollFriends('left')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-2xl active:scale-75 transition-all border-2 border-slate-900"
                    >
                      <ChevronLeft size={20} strokeWidth={3} />
                    </button>

                    {/* Friend List - CUSTOM SCROLLBAR ENABLED */}
                    <div
                      ref={friendScrollRef}
                      className="flex gap-4 overflow-x-auto py-8 px-12 snap-x snap-mandatory scroll-smooth"
                      style={{
                        scrollbarWidth: 'auto',
                        scrollbarColor: '#f59e0b #1e293b'
                      }}
                    >
                      {FRIENDS.map(friend => (
                        <div key={friend.id} className="flex flex-col items-center gap-3 transition-all active:scale-95 group min-w-[90px] snap-center shrink-0">
                          <div className="relative">
                            <img src={friend.avatar} className="w-16 h-16 rounded-2xl object-cover border-4 border-transparent group-hover:border-amber-500 transition-all shadow-2xl scale-95 group-hover:scale-100" alt={friend.name} />
                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-2xl transition-all ${sentRequests.includes(friend.id) ? 'bg-green-500 text-white scale-110' : 'bg-white text-slate-900 hover:bg-amber-500 hover:text-white'}`}>
                              <button onClick={() => sendTeamRequest(friend, selectedEvent.id, selectedEvent.title)}>
                                {sentRequests.includes(friend.id) ? <CheckCircle2 size={16} /> : <UserPlus size={16} />}
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tight text-white/50 group-hover:text-amber-500 transition-colors">{friend.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Right Button */}
                    <button
                      onClick={() => scrollFriends('right')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-2xl active:scale-75 transition-all border-2 border-slate-900"
                    >
                      <ChevronRight size={20} strokeWidth={3} />
                    </button>
                  </div>

                  {sentRequests.length > 0 && (
                    <div className="animate-in slide-in-from-top-2 duration-300 text-center">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle2 size={12} /> Requests Sent ({sentRequests.length}/{activeTeamTier === 'Duo' ? 1 : activeTeamTier === 'Trio' ? 2 : activeTeamTier === 'Quad' ? 3 : '4+'}) ⚡
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">You might also like</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                    {events.filter(e => e.id !== selectedEvent.id).map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="flex-shrink-0 w-32 space-y-2 group cursor-pointer"
                      >
                        <div className="h-32 rounded-3xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                          <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={event.title} />
                        </div>
                        {/* FONT SIZE INCREASED */}
                        <p className="text-xs font-black text-slate-700 dark:text-white/80 uppercase tracking-tight line-clamp-2">{event.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* STICKY BOTTOM RSVP */}
              <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/10 mt-auto">
                {registrations.some(r => r.eventId === selectedEvent.id) ? (
                  <button
                    onClick={() => setShowTicket(true)}
                    className="w-full py-5 bg-green-500 text-white rounded-[25px] font-black text-lg shadow-xl shadow-green-500/20 flex items-center justify-center gap-4 italic uppercase tracking-tight transition-all active:scale-95 animate-in zoom-in-95"
                  >
                    <CheckCircle2 size={24} className="text-white" /> View My Ticket
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Entry Fee</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{selectedEvent.isPaid ? `₹${selectedEvent.fee}` : 'Free'}</p>
                    </div>
                    {selectedEvent.status === 'On Hold' ? (
                      <button
                        disabled
                        className="flex-[2] py-5 bg-amber-500/20 text-amber-500 rounded-[25px] font-black text-lg cursor-not-allowed flex items-center justify-center gap-4 italic uppercase tracking-tight"
                      >
                        Temporarily On Hold
                      </button>
                    ) : (
                      <button
                        onClick={() => { rsvpToEvent(selectedEvent); }}
                        className="flex-[2] py-5 bg-slate-900 text-white rounded-[25px] font-black text-lg shadow-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-4 italic uppercase tracking-tight active:scale-95 group"
                      >
                        Reserve My Spot <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TICKET QR OVERLAY */}
      {showTicket && selectedEvent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowTicket(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[50px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border-[12px] border-slate-900 dark:border-slate-950">
            <div className="bg-slate-900 p-10 text-center space-y-6">
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Entry Pass</p>
                  <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase leading-tight">{selectedEvent.title}</h3>
                </div>
                <div className="bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                  Confirmed
                </div>
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] shadow-inner space-y-6 border border-white/5">
                <div className="flex justify-center p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-slate-100 dark:border-white/10">
                  <QrCode size={180} className="text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration ID</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-widest font-mono uppercase">
                    {registrations.find(r => r.eventId === selectedEvent.id)?.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Student</p>
                  <p className="text-xs font-black text-white uppercase tracking-tight">Rohan Sharma</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-xs font-black text-white uppercase tracking-tight">{selectedEvent.location.split(',')[0]}</p>
                </div>
              </div>

              <button className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2">
                <Calendar size={16} /> Add to Google Calendar
              </button>
            </div>
            <button
              onClick={() => setShowTicket(false)}
              className="w-full py-5 bg-slate-50 dark:bg-slate-900 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 dark:hover:text-white transition-colors border-t border-white/5"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATION HUB / HUB FLYOUT */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-3 translate-y-2">
        {/* Notification Panel (Flyout) */}
        {showNotifPanel && (
          <div className="w-[300px] mb-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-[#1A56DB]/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#1A56DB] p-4 text-white">
              <h4 className="text-xs font-black uppercase tracking-widest flex items-center justify-between">
                Notifications
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px]">{notifications.length} New</span>
              </h4>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                    <Bell size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbox is empty</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className={`p-4 rounded-2xl flex gap-3 transition-colors ${notif.type === 'outgoing' ? 'bg-slate-50 dark:bg-white/5' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
                    <div className={`p-2 rounded-xl h-fit ${notif.type === 'outgoing' ? 'bg-slate-900 text-white' : 'bg-amber-500 text-white'}`}>
                      {notif.type === 'outgoing' ? <Smartphone size={16} /> : <Bell size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{notif.type === 'outgoing' ? 'Outbound' : 'Inbound Sync'}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{notif.message}</p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => clearNotifications()}
              className="w-full py-3 bg-slate-50 dark:bg-white/5 text-[10px] font-black text-slate-500 hover:text-[#1A56DB] transition-colors border-t border-slate-100 dark:border-white/5 uppercase tracking-widest"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Bell Trigger */}
        <button
          onClick={() => setShowNotifPanel(!showNotifPanel)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all relative border-4 ${showNotifPanel ? 'bg-[#1A56DB] border-blue-200 text-white scale-110' : 'bg-white border-slate-50 text-slate-900 hover:scale-110 active:scale-90'}`}
        >
          <Bell size={28} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 border-4 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>
      </div>
      {/* INCOMING SYNC BOTTOM SHEET */}
      {incomingSyncRequest && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center px-4 pb-10 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
          <div
            className="absolute inset-0"
            onClick={declineSyncRequest}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-full duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-500" />

            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                    <Smartphone size={28} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] leading-none mb-1">Incoming Sync</h4>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase italic leading-none">{incomingSyncRequest.type} Invitation</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center animate-pulse">
                  <Users size={22} />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-[40px] p-2 flex items-center gap-6 pr-8">
                <div className="w-24 h-24 rounded-[35px] overflow-hidden shrink-0 shadow-xl border-4 border-white dark:border-slate-800">
                  <img src={incomingSyncRequest.event.banner} className="w-full h-full object-cover" alt={incomingSyncRequest.event.title} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest leading-none mb-2">Event</p>
                  <h5 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase italic">{incomingSyncRequest.event.title}</h5>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-amber-500/10 rounded-[35px] border-2 border-amber-500/20">
                <img src={incomingSyncRequest.requester.avatar} className="w-16 h-16 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg" alt={incomingSyncRequest.requester.name} />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    <span className="text-amber-500 font-extrabold">{incomingSyncRequest.requester.name}</span> wants you to join this event together.
                  </p>
                  <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mt-1">Sent from Lab B-402</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={acceptSyncRequest}
                  className="py-5 bg-amber-500 text-white rounded-[25px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3"
                >
                  Join Together <CheckCircle2 size={18} />
                </button>
                <button
                  onClick={declineSyncRequest}
                  className="py-5 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white rounded-[25px] font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 border-2 border-transparent hover:border-white/10"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

export default function ArenaPage() {
  return <ArenaContent />;
}

