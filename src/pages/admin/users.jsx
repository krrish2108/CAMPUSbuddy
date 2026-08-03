import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Search, 
  UserX, 
  MapPin, 
  Plus, 
  Shield, 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  X, 
  Clock, 
  Building2, 
  Smartphone, 
  Key, 
  RefreshCw, 
  UserPlus,
  Filter,
  Layers,
  ShieldCheck,
  Ban,
  ArrowUpRight,
  PauseCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserDb, syncUserDb, createUserIdentity, fetchLocationsDb, syncLocationsDb } from '@/routes/admin';

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NAME');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Drilldowns
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeKpiBox, setActiveKpiBox] = useState(null); // 'ALL' | 'STUDENTS' | 'STAFF' | 'ACTION'
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    identifier: '',
    phone: '',
    status: 'Active'
  });

  // Locations Form
  const [locInput, setLocInput] = useState('');
  const [locCategory, setLocCategory] = useState('Academic & Labs');
  const [locCapacity, setLocCapacity] = useState('');

  // Load Initial Database from Service API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const userRes = await fetchUserDb();
      const locRes = await fetchLocationsDb();
      if (userRes.success) {
        // Convert any 'Under Review' to 'On Hold' for consistency if needed, or maintain both
        const processed = userRes.data.map(u => ({
          ...u,
          status: u.status === 'Under Review' ? 'On Hold' : u.status
        }));
        setUsers(processed);
      }
      if (locRes.success) setLocations(locRes.data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, sortOrder]);

  // Sync users whenever modified
  const handleRoleChange = async (id, newRole) => {
    const updated = users.map(u => u.id === id ? { ...u, role: newRole } : u);
    setUsers(updated);
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
    await syncUserDb(updated);
  };

  const handleStatusChange = async (id, newStatus) => {
    const updated = users.map(u => u.id === id ? { ...u, status: newStatus } : u);
    setUsers(updated);
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
    await syncUserDb(updated);
  };

  const handleDeleteUser = async (id, e) => {
    if (e) e.stopPropagation();
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(null);
    }
    await syncUserDb(updated);
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;
    const res = await createUserIdentity(newUserForm);
    if (res.success) {
      setUsers(prev => [res.data, ...prev]);
      setShowAddModal(false);
      setNewUserForm({
        name: '',
        email: '',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        identifier: '',
        phone: '',
        status: 'Active'
      });
    }
  };

  const addLocation = async (e) => {
    e.preventDefault();
    if (locInput.trim()) {
      const newLoc = {
        id: `loc-${Date.now()}`,
        name: locInput.trim(),
        category: locCategory,
        capacity: locCapacity || '250',
        status: 'Active'
      };
      const updated = [...locations, newLoc];
      setLocations(updated);
      setLocInput('');
      setLocCapacity('');
      await syncLocationsDb(updated);
    }
  };

  const removeLocation = async (id) => {
    const updated = locations.filter(l => l.id !== id);
    setLocations(updated);
    await syncLocationsDb(updated);
  };

  // Filtered & Sorted Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.identifier && u.identifier.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'STUDENTS') return u.role === 'STUDENT';
    if (activeTab === 'FACULTY_ADMIN') return u.role === 'FACULTY' || u.role === 'ADMIN';
    if (activeTab === 'VENDORS') return u.role === 'VENDOR';
    if (activeTab === 'FLAGGED') return u.status !== 'Active';
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'NAME') return a.name.localeCompare(b.name);
    if (sortOrder === 'STATUS') return a.status.localeCompare(b.status);
    if (sortOrder === 'ROLE') return a.role.localeCompare(b.role);
    return 0;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // KPI Calculations
  const totalUsers = users.length;
  const activeStudents = users.filter(u => u.role === 'STUDENT' && u.status === 'Active').length;
  const facultyStaff = users.filter(u => u.role === 'FACULTY' || u.role === 'ADMIN' || u.role === 'VENDOR').length;
  const flaggedAccounts = users.filter(u => u.status !== 'Active').length;

  // KPI Drilldown Content Resolver
  const getKpiModalContent = () => {
    if (activeKpiBox === 'ALL') {
      return {
        title: 'Live DB: Total Campus Identities',
        subtitle: 'Complete registry of all registered students, faculty, administrators, and vendors.',
        accent: 'from-blue-500 to-indigo-600',
        badge: 'All Accounts',
        list: users
      };
    }
    if (activeKpiBox === 'STUDENTS') {
      return {
        title: 'Verified Active Students',
        subtitle: 'Currently enrolled students with full access rights to CampusBuddy modules.',
        accent: 'from-emerald-500 to-teal-600',
        badge: 'Active Students',
        list: users.filter(u => u.role === 'STUDENT' && u.status === 'Active')
      };
    }
    if (activeKpiBox === 'STAFF') {
      return {
        title: 'Staff, Faculty & Vendor Directory',
        subtitle: 'Administrative personnel, faculty advisors, and verified campus commercial vendors.',
        accent: 'from-purple-500 to-pink-600',
        badge: 'Command Staff',
        list: users.filter(u => u.role === 'FACULTY' || u.role === 'ADMIN' || u.role === 'VENDOR')
      };
    }
    if (activeKpiBox === 'ACTION') {
      return {
        title: 'Action Required: Suspended & On Hold',
        subtitle: 'Accounts currently restricted from using CampusBuddy. Review or resolve status below.',
        accent: 'from-rose-500 to-red-600',
        badge: 'Action Required',
        list: users.filter(u => u.status !== 'Active'),
        isUrgent: true
      };
    }
    return null;
  };

  const kpiContent = getKpiModalContent();

  return (
    <AdminLayout 
      title="Global Access & Role Management" 
      subtitle="Campus Identity Registry & Governance Database"
    >
      <div className="space-y-10 pb-24 text-slate-900 dark:text-slate-100">
        
        {/* EXECUTIVE KPI OVERVIEW BANNER (CLICKABLE DRILLDOWN BOXES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            onClick={() => setActiveKpiBox('ALL')}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[32px] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:border-blue-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            <div>
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Users size={26} />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-500/20 uppercase tracking-widest flex items-center gap-1">
                  <span>Live DB</span>
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="mt-5">
                <h4 className="text-4xl font-black italic tracking-tight">{totalUsers}</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400 mt-1">Total Identities</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
              <span>View Total Registry</span>
              <span>→</span>
            </div>
          </motion.div>

          <motion.div 
            onClick={() => setActiveKpiBox('STUDENTS')}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[32px] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:border-emerald-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            <div>
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <UserCheck size={26} />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-widest flex items-center gap-1">
                  <span>Verified</span>
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="mt-5">
                <h4 className="text-4xl font-black italic tracking-tight">{activeStudents}</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Active Students</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
              <span>View Student Roster</span>
              <span>→</span>
            </div>
          </motion.div>

          <motion.div 
            onClick={() => setActiveKpiBox('STAFF')}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[32px] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:border-purple-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
            <div>
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                  <Shield size={26} />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-500/20 uppercase tracking-widest flex items-center gap-1">
                  <span>Staff & Stores</span>
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="mt-5">
                <h4 className="text-4xl font-black italic tracking-tight">{facultyStaff}</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Admin / Faculty / Vendor</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-extrabold text-purple-600 dark:text-purple-400">
              <span>View Staff Directory</span>
              <span>→</span>
            </div>
          </motion.div>

          <motion.div 
            onClick={() => setActiveKpiBox('ACTION')}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[32px] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:border-rose-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/20 transition-all" />
            <div>
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 animate-pulse">
                  <AlertTriangle size={26} />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full border border-rose-200 dark:border-rose-500/20 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Action Req.</span>
                </span>
              </div>
              <div className="mt-5">
                <h4 className="text-4xl font-black italic tracking-tight">{flaggedAccounts}</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Suspended / On Hold</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-extrabold text-rose-600 dark:text-rose-400">
              <span>Inspect Restricted Users</span>
              <span>→</span>
            </div>
          </motion.div>
        </div>

        {/* COMMAND CONTROLS & TAB FILTER BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-4 md:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col xl:flex-row items-center justify-between gap-6">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 w-full xl:w-auto p-1.5 bg-slate-100 dark:bg-slate-950 rounded-3xl border border-slate-200/50 dark:border-white/5">
            {[
              { id: 'ALL', label: 'All Accounts' },
              { id: 'STUDENTS', label: 'Students' },
              { id: 'FACULTY_ADMIN', label: 'Faculty & Admin' },
              { id: 'VENDORS', label: 'Vendors' },
              { id: 'FLAGGED', label: 'Suspended / On Hold', alert: flaggedAccounts > 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                {tab.label}
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            ))}
          </div>

          {/* Search, Sort & Action Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-end">
            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search name, ID, department..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold placeholder:text-slate-400 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Filter size={14} className="mr-2 text-slate-400" />
                <span className="uppercase tracking-widest text-[10px] text-slate-400 mr-2">Sort:</span>
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent font-extrabold outline-none cursor-pointer appearance-none pr-3"
                >
                  <option value="NAME">Name</option>
                  <option value="ROLE">Role</option>
                  <option value="STATUS">Status</option>
                </select>
              </div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <UserPlus size={18} />
                <span>Authorize Identity</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN REGISTRY & LOCATIONS MASTER GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* USER REGISTRY TABLE (8 cols on XL) */}
          <div className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-2xl rounded-[40px] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6 mb-6">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                    <span>Identity Registry</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 not-italic tracking-normal">
                      {filteredUsers.length} Found
                    </span>
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Click on any account row to launch full governance profile</p>
                </div>
                
                {loading && (
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-xs animate-pulse">
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Syncing DB...</span>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/60 dark:border-white/5">
                      <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">User Profile</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Department & ID</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Access Role</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Account Status</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-16 text-center text-slate-400 font-bold">
                          <Users size={48} className="mx-auto mb-3 opacity-20" />
                          No identities match your active search or filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr 
                          key={user.id} 
                          onClick={() => setSelectedUser(user)}
                          className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        >
                          {/* Profile Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3.5">
                              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${user.avatarGradient || 'from-blue-500 to-purple-600'} flex items-center justify-center font-black text-white shadow-md text-sm shrink-0`}>
                                {user.name.charAt(0)}
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Dept & Identifier */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="inline-block text-[11px] font-bold text-slate-700 dark:text-slate-300 max-w-[180px] truncate">
                                {user.department || 'Campus Operations'}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                <Key size={10} />
                                <span>{user.identifier || user.id}</span>
                              </div>
                            </div>
                          </td>

                          {/* Access Role */}
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <select 
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className={`text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border appearance-none outline-none cursor-pointer shadow-sm transition-all ${
                                user.role === 'ADMIN' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 hover:bg-purple-100' :
                                user.role === 'VENDOR' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100' :
                                user.role === 'FACULTY' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100' :
                                'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100'
                              }`}
                            >
                              <option value="STUDENT">Student</option>
                              <option value="FACULTY">Faculty</option>
                              <option value="VENDOR">Vendor</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>

                          {/* Account Status & Last Active */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-start gap-1">
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                user.status === 'Active' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' :
                                user.status === 'Suspended' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
                                'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : user.status === 'Suspended' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                {user.status}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400 ml-1">
                                Active {user.lastActive || 'Today'}
                              </span>
                            </div>
                          </td>

                          {/* Action Tools */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => setSelectedUser(user)}
                                title="Inspect Governance Profile"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteUser(user.id, e)}
                                title="Revoke & Delete Account"
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
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

            {/* PAGINATION TABS (1 - 2 - 3) */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-white/5">
                <p className="text-xs font-bold text-slate-400">
                  Showing <span className="text-slate-900 dark:text-white font-black">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="text-slate-900 dark:text-white font-black">{filteredUsers.length}</span> entries
                </p>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center ${
                        currentPage === page 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LOCATIONS & INFRASTRUCTURE MASTER LIST (4 cols on XL) - WHITE IN LIGHT MODE */}
          <div className="xl:col-span-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 shadow-2xl rounded-[40px] p-6 sm:p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-6 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">Campus Locations</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset & Facility DB</p>
              </div>
            </div>

            {/* Quick Add Location Form */}
            <form onSubmit={addLocation} className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-200/60 dark:border-white/5 mb-6">
              <p className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest pl-1">Register New Facility</p>
              
              <input 
                type="text"
                placeholder="Building or Room Name..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-amber-500 transition-colors shadow-sm dark:shadow-none"
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={locCategory}
                  onChange={(e) => setLocCategory(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-[11px] font-extrabold text-slate-900 dark:text-white outline-none shadow-sm dark:shadow-none cursor-pointer"
                >
                  <option value="Academic & Labs">Academic</option>
                  <option value="Events & Gathering">Auditorium</option>
                  <option value="Hospitality & Dining">Dining / Cafe</option>
                  <option value="Athletics & Recreation">Sports & Gym</option>
                </select>

                <input 
                  type="number"
                  placeholder="Cap (e.g. 500)"
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-amber-500 shadow-sm dark:shadow-none"
                  value={locCapacity}
                  onChange={(e) => setLocCapacity(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95">
                + Register Location Asset
              </button>
            </form>

            {/* Locations List */}
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] pr-1">
              {locations.map((loc) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={loc.id} 
                  className="p-4 bg-slate-50/80 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl border border-slate-200/60 dark:border-white/5 flex items-center justify-between group transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900 dark:text-white">{loc.name}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <span className="text-amber-600 dark:text-amber-400">{loc.category}</span>
                      <span>•</span>
                      <span>Cap: {loc.capacity}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeLocation(loc.id)} 
                    title="Remove asset"
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* DEDICATED KPI STAT BOX DRILLDOWN MODAL                       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activeKpiBox && kpiContent && (
          <div className="fixed inset-0 z-[105] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[40px] overflow-hidden my-auto max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className={`p-8 bg-gradient-to-r ${kpiContent.accent} text-white flex items-center justify-between relative shrink-0`}>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-black/20 text-white uppercase tracking-widest border border-white/20">
                    {kpiContent.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">{kpiContent.title}</h3>
                  <p className="text-xs text-white/80 max-w-xl font-medium">{kpiContent.subtitle}</p>
                </div>
                <button 
                  onClick={() => setActiveKpiBox(null)}
                  className="w-11 h-11 bg-black/30 hover:bg-black/50 rounded-2xl flex items-center justify-center text-white transition-all shrink-0"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Roster & Action List */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
                {kpiContent.list.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 font-bold">
                    <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-500 opacity-50" />
                    <p className="text-lg">No accounts currently fall under this filter group.</p>
                    {activeKpiBox === 'ACTION' && <p className="text-xs text-slate-500 mt-1">All campus identities are active and operating normally.</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kpiContent.list.map((user) => (
                      <div 
                        key={user.id}
                        className="p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/10 rounded-3xl flex flex-col justify-between gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${user.avatarGradient || 'from-blue-500 to-indigo-600'} flex items-center justify-center font-black text-white shadow-md text-base shrink-0`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 dark:text-white text-sm">{user.name}</p>
                              <p className="text-xs font-medium text-slate-400">{user.email}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Role: <span className="text-indigo-600 dark:text-indigo-400">{user.role}</span> | Dept: {user.department || 'N/A'}</p>
                            </div>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                            user.status === 'Active' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                            user.status === 'Suspended' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                            'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>
                            {user.status}
                          </span>
                        </div>

                        {/* Quick Action Control for this User */}
                        <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Quick Override:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStatusChange(user.id, 'Active')}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase transition-all ${user.status === 'Active' ? 'bg-green-500 text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-green-500 hover:text-white'}`}
                            >
                              Active
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, 'On Hold')}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase transition-all ${user.status === 'On Hold' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-white'}`}
                            >
                              Hold
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, 'Suspended')}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase transition-all ${user.status === 'Suspended' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-rose-600 hover:text-white'}`}
                            >
                              Suspend
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between shrink-0">
                <p className="text-xs text-slate-500 font-bold">
                  All state changes are automatically saved to the campus user database and enforced in real-time across user applications.
                </p>
                <button
                  onClick={() => setActiveKpiBox(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* IDENTITY DEEP-DIVE MODAL (GOVERNANCE PROFILE)                 */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[45px] overflow-hidden my-auto"
            >
              {/* Top Banner */}
              <div className={`h-32 bg-gradient-to-r ${selectedUser.avatarGradient || 'from-blue-600 via-indigo-600 to-purple-600'} p-6 relative flex items-end justify-between`}>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="absolute top-6 right-6 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Profile Main Header */}
              <div className="px-8 pb-8 pt-0 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-6">
                  <div className="flex items-end gap-5">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${selectedUser.avatarGradient || 'from-blue-600 to-indigo-600'} border-4 border-white dark:border-slate-900 flex items-center justify-center font-black text-white text-3xl shadow-2xl`}>
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedUser.name}</h3>
                      <p className="text-xs font-bold text-slate-400">{selectedUser.email}</p>
                    </div>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                    selectedUser.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    selectedUser.status === 'Suspended' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    Status: {selectedUser.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-white/5 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Department</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{selectedUser.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Roll / Staff ID</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">{selectedUser.identifier || selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Contact Phone</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{selectedUser.phone || '+91 90000 00000'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Joined Date</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{selectedUser.joined}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Last Active</p>
                    <p className="text-xs font-extrabold text-green-600 dark:text-green-400">{selectedUser.lastActive || 'Just now'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Assigned Role</p>
                    <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">{selectedUser.role}</p>
                  </div>
                </div>

                {/* Security Permissions Tokens */}
                <div className="space-y-3 mb-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span>Authorized Campus Module Permissions</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedUser.permissions || ['Standard Access', 'Portal View']).map((perm, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Governance Status Action Control Bar */}
                <div className="border-t border-slate-100 dark:border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-extrabold text-slate-400 mr-1">Modify State:</span>
                    <button 
                      onClick={() => handleStatusChange(selectedUser.id, 'Active')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${selectedUser.status === 'Active' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-green-500/20'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedUser.id, 'On Hold')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${selectedUser.status === 'On Hold' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-amber-500/20'}`}
                    >
                      On Hold
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedUser.id, 'Suspended')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${selectedUser.status === 'Suspended' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-rose-500/20'}`}
                    >
                      Suspend
                    </button>
                  </div>

                  <button 
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all border border-rose-500/20 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Trash2 size={15} />
                    <span>Revoke Identity</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* AUTHORIZE NEW IDENTITY (ADD USER) MODAL                      */}
      {/* ============================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[40px] overflow-hidden my-auto"
            >
              <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600" />
              
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">Authorize New Identity</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">Enroll user into CampusBuddy verification database</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddUserSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Full Legal Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Aditya Verma" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-purple-500 text-slate-900 dark:text-white transition-all"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Campus Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="aditya.v@campus.edu" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-purple-500 text-slate-900 dark:text-white transition-all"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Role Type</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-purple-500 text-slate-900 dark:text-white cursor-pointer"
                        value={newUserForm.role}
                        onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                      >
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="VENDOR">Vendor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Roll / Staff ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 24BCE10999" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-purple-500 text-slate-900 dark:text-white transition-all"
                        value={newUserForm.identifier}
                        onChange={(e) => setNewUserForm({...newUserForm, identifier: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Department / Division</label>
                      <input 
                        type="text" 
                        placeholder="Computer Science" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-purple-500 text-slate-900 dark:text-white transition-all"
                        value={newUserForm.department}
                        onChange={(e) => setNewUserForm({...newUserForm, department: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 pl-1">Phone Number</label>
                      <input 
                        type="text" 
                        placeholder="+91 98765 43210" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-purple-500 text-slate-900 dark:text-white transition-all"
                        value={newUserForm.phone}
                        onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-500/25 transition-all active:scale-95"
                    >
                      Authorize & Add User to Registry
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
}
