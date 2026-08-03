import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit2, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Key,
  UserCheck,
  User,
  Printer,
  FileText,
  Download,
  RefreshCw,
  Sliders,
  DollarSign,
  Send,
  PhoneCall,
  Mail,
  Award,
  Filter,
  ShieldCheck,
  Check,
  AlertCircle,
  BarChart2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopperz } from '@/context/ShopperzContext';

const SEARCH_INSIGHTS = [
  { term: 'A3 Chart Paper', count: 142, trend: '+24%', status: 'High Demand' },
  { term: 'Arduino Uno Base Kit', count: 89, trend: '+12%', status: 'Urgent Stock Req.' },
  { term: 'Casio FX-991EX Calculator', count: 320, trend: '+45%', status: 'Critical Shortage' },
  { term: 'Engineering Drawing Sheet Roll', count: 65, trend: '+18%', status: 'Medium Demand' }
];

const CATEGORIES = ['All', 'Stationery', 'Apparel', 'Lab Equipment', 'Electronics'];

export default function ShopperzAdminPage() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    adjustStock,
    resupplyAllLowStock,
    marketListings, 
    deleteMarketListing,
    updateMarketListingStatus, 
    storeOrders, 
    markStoreOrderCompleted, 
    cancelStoreOrder,
    printJobs, 
    updateJobStatus,
    getStudentDetails 
  } = useShopperz();

  const [activeTab, setActiveTab] = useState('Inventory Matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);

  // Trigger quick screen toast notice
  const showToast = (message) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Filter store inventory by search query and category
  const filteredInventory = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Filter orders by search
  const filteredOrders = storeOrders.filter(order => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return order.id.toLowerCase().includes(q) || (order.user?.name || '').toLowerCase().includes(q) || order.otp.includes(q);
  });

  // Filter print jobs by search
  const filteredPrintJobs = (printJobs || []).filter(job => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return job.name.toLowerCase().includes(q) || (job.user?.name || '').toLowerCase().includes(q) || job.id.toLowerCase().includes(q);
  });

  // Filter student marketplace listings
  const filteredMarket = (marketListings || []).filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.title.toLowerCase().includes(q) || (typeof m.seller === 'string' ? m.seller : m.seller?.name || '').toLowerCase().includes(q);
  });

  const toggleAvailability = (id) => {
    const item = products.find(p => p.id === id);
    if (item) {
      updateProduct(id, { isAvailable: !item.isAvailable });
      showToast(`Updated listing status for ${item.name}`);
    }
  };

  const handleOpenStudentProfile = (studentObjOrName) => {
    const profile = getStudentDetails(studentObjOrName);
    if (profile) setSelectedStudent(profile);
  };

  // Executive KPI stats calculation
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * (p.stockCount || 0)), 0);
  const lowStockCount = products.filter(p => (p.stockCount || 0) <= 5).length;
  const pendingOrdersRevenue = storeOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <AdminLayout 
      title="Shopperz HQ" 
      subtitle="Retail Inventory, Store Orders, Print Studio & P2P Governance"
    >
      <div className="space-y-8 pb-20 animate-in fade-in duration-500 relative">
        
        {/* Floating Success Toast */}
        <AnimatePresence>
          {notificationToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 right-8 z-[200] bg-slate-900 text-white border border-slate-700/80 rounded-2xl px-6 py-3.5 shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest"
            >
              <Sparkles size={16} className="text-orange-500 animate-pulse" />
              <span>{notificationToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP EXECUTIVE COMMAND KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-orange-500/50 transition-all">
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Inventory Value</p>
              <h4 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white truncate">₹{totalInventoryValue.toLocaleString()}</h4>
              <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={12} /> {products.length} Products Listed
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <Package size={26} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Orders Queue</p>
              <h4 className="text-3xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400 truncate">{storeOrders.length} Pending</h4>
              <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 truncate">₹{pendingOrdersRevenue.toLocaleString()} to verify</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <ShoppingBag size={26} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Print Studio Hub</p>
              <h4 className="text-3xl font-black italic tracking-tighter text-purple-600 dark:text-purple-400 truncate">{(printJobs || []).length} Documents</h4>
              <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">Campus Print Queues</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <Printer size={26} />
            </div>
          </div>

          <div 
            onClick={() => {
              if (lowStockCount > 0) {
                resupplyAllLowStock();
                showToast("Automated restock completed! All items below 5 units restored to 50 units.");
              } else {
                showToast("All inventory items currently well-stocked!");
              }
            }}
            className={`rounded-[30px] p-6 shadow-xl flex items-center justify-between relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-all group ${
              lowStockCount > 0 
                ? 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-rose-600/30 border border-rose-500/30' 
                : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-white/10'
            }`}
          >
            <div className="space-y-1 min-w-0 pr-2">
              <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest flex items-center gap-1">
                <AlertTriangle size={13} className="animate-bounce" /> Stock Alert Status
              </p>
              <h4 className="text-3xl font-black italic tracking-tighter text-white truncate">{lowStockCount} Low Stock</h4>
              <p className="text-[10px] font-black text-yellow-300 underline underline-offset-4 flex items-center gap-1 group-hover:text-white transition-colors">
                ⚡ Automate Restock →
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-black shadow-lg shrink-0">
              <RefreshCw size={26} className={lowStockCount > 0 ? 'animate-spin' : ''} />
            </div>
          </div>
        </div>

        {/* MODULE TABS NAVIGATION */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-4 sm:p-6 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5 w-full lg:w-auto overflow-x-auto">
            {[
              { id: 'Inventory Matrix', label: 'Retail Inventory', icon: Package },
              { id: 'Store Orders', label: `Store Orders (${storeOrders.length})`, icon: ShoppingBag },
              { id: 'Print Studio Queues', label: `Print Queues (${(printJobs||[]).length})`, icon: Printer },
              { id: 'Student Market', label: 'Student P2P Market', icon: Sliders },
              { id: 'Demand Insights', label: 'Demand & AI Insights', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar & quick action */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab.toLowerCase()}...`} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-orange-500 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold placeholder:text-slate-400 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {activeTab === 'Inventory Matrix' && (
              <button 
                onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/25 flex items-center gap-2 whitespace-nowrap active:scale-95 transition-all shrink-0"
              >
                <Plus size={16} /> Add Retail Item
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: INVENTORY MATRIX */}
        <AnimatePresence mode="wait">
          {activeTab === 'Inventory Matrix' && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Category selector pills */}
              <div className="flex items-center gap-2 flex-wrap px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1">
                  <Filter size={12} /> Category:
                </span>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all border ${
                      activeCategory === cat 
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Inventory table */}
              <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] shadow-xl">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                      <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-7">Product Details & Image</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Store Location</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Price Tag</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Quick Stock Modifiers</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Listing Status</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-7">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredInventory.map(item => {
                      const isLow = (item.stockCount || 0) <= 5;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                          <td className="p-5 pl-7">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md shrink-0 bg-slate-100 dark:bg-slate-800">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                              <div>
                                <p className="font-black text-slate-900 dark:text-white text-base group-hover:text-orange-500 transition-colors uppercase italic">{item.name}</p>
                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-1 inline-block border border-slate-200 dark:border-white/5">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <select 
                              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl px-3.5 py-2 outline-none focus:border-orange-500 cursor-pointer"
                              defaultValue={item.location || 'Campus Store - Main'}
                            >
                              <option>Campus Store - Main</option>
                              <option>Campus Store - East</option>
                              <option>Library Block Retail</option>
                            </select>
                          </td>
                          <td className="p-5">
                            <p className="text-xl font-black italic uppercase text-orange-600 dark:text-orange-500 tracking-tighter">₹{item.price}</p>
                            <p className="text-[10px] font-extrabold text-slate-400">Sold: {item.totalSold || 45} units</p>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-white/10 w-fit">
                              <button
                                type="button"
                                onClick={() => adjustStock(item.id, -1)}
                                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 font-black flex items-center justify-center transition-colors shadow-sm"
                                title="Remove 1 unit"
                              >
                                -
                              </button>
                              <div className="px-3.5 text-center min-w-[5.5rem]">
                                <span className={`text-sm font-mono font-black ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {item.stockCount} Units
                                </span>
                                {isLow && (
                                  <span className="block text-[9px] font-black uppercase tracking-wider text-rose-500">⚠️ Low Stock</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => adjustStock(item.id, 1)}
                                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-slate-300 font-black flex items-center justify-center transition-colors shadow-sm"
                                title="Add 1 unit"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={() => adjustStock(item.id, 10)}
                                className="px-2.5 h-8 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-600 dark:text-orange-400 hover:text-white font-black text-[10px] uppercase transition-all"
                                title="Quick restock +10 units"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                          <td className="p-5">
                            <button 
                              onClick={() => toggleAvailability(item.id)}
                              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all ${
                                item.isAvailable ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {item.isAvailable ? <><CheckCircle2 size={13}/> Listed</> : <><AlertTriangle size={13}/> Delisted</>}
                            </button>
                          </td>
                          <td className="p-5 text-right pr-7">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => { setEditingProduct(item); setIsProductModalOpen(true); }}
                                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors shadow-sm"
                                title="Edit Product details"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => { if (window.confirm(`Delete item ${item.name}?`)) deleteProduct(item.id); }} 
                                className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredInventory.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-slate-400 font-bold text-sm">
                          No products matching criteria in retail registry.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 2: STORE ORDERS */}
          {activeTab === 'Store Orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[30px] border border-slate-200/80 dark:border-white/10 shadow-lg">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Campus Store Pickup Queue</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    Verify student identity and OTP before releasing package. Click **"👤 View Student Profile"** to inspect campus student credentials!
                  </p>
                </div>
                <span className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-2xl text-xs font-black uppercase tracking-wider h-fit">
                  {storeOrders.length} Ready for Pickup
                </span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-20 text-center opacity-50 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[35px]">
                  <ShoppingBag size={48} className="mx-auto mb-3 text-slate-400" />
                  <p className="font-black uppercase tracking-widest text-sm text-slate-500">No pending store orders found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-7 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-orange-500/50 transition-all">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-white/5">
                            #{order.id}
                          </span>
                          <span className="text-2xl font-black italic tracking-tight text-orange-600 dark:text-orange-500">
                            ₹{order.total}
                          </span>
                        </div>

                        {/* Student Details Inspection Box */}
                        <div 
                          onClick={() => handleOpenStudentProfile(order.user)}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between group/user"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-md shrink-0">
                              {(order.user?.name || 'S')[0]}
                            </div>
                            <div className="min-w-0 pr-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Customer</p>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover/user:text-blue-500 transition-colors">
                                {order.user?.name || 'Demo Student'}
                              </h4>
                              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <span>{order.user?.identifier || '24BCE10023'}</span>
                                <span className="underline decoration-dotted">View Details →</span>
                              </p>
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/user:text-blue-500 shrink-0 shadow-inner">
                            <UserCheck size={18} />
                          </div>
                        </div>

                        {/* Items listed */}
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Ordered Products:</p>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-extrabold bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                              <span className="text-slate-800 dark:text-slate-200">{item.quantity}x {item.name}</span>
                              <span className="text-orange-600 dark:text-orange-400 font-mono">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
                        <div className="flex items-center justify-between p-3.5 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                          <div className="flex items-center gap-2.5 text-orange-600 dark:text-orange-400 font-black">
                            <Key size={18} />
                            <span className="text-xs uppercase tracking-widest">Pickup OTP:</span>
                          </div>
                          <span className="text-xl font-mono font-black tracking-widest text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-3 py-1 rounded-xl shadow-inner border border-orange-500/30">
                            {order.otp}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              markStoreOrderCompleted(order.id);
                              showToast(`Order #${order.id} verified and marked Picked Up!`);
                            }}
                            className="flex-1 py-3.5 bg-slate-900 dark:bg-white hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white dark:text-slate-900 hover:text-white font-black text-xs rounded-2xl uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 size={15} className="text-emerald-400" />
                            <span>Verify & Release</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Cancel order #${order.id}?`)) {
                                cancelStoreOrder(order.id);
                                showToast(`Order #${order.id} cancelled.`);
                              }
                            }}
                            className="p-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 hover:text-rose-500 text-slate-400 rounded-2xl transition-colors shrink-0"
                            title="Cancel / Refund Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: PRINT STUDIO QUEUES (NEW & ENHANCED) */}
          {activeTab === 'Print Studio Queues' && (
            <motion.div 
              key="print_studio"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[30px] border border-slate-200/80 dark:border-white/10 shadow-lg">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Printer className="text-purple-500" size={26} />
                    <span>Campus Print Hub & Document Queues</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    Manage student thesis, assignments, and record book print requests. Click any student to fetch user details!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-2xl text-xs font-black uppercase tracking-wider">
                    {(printJobs || []).length} Total Print Jobs
                  </span>
                </div>
              </div>

              {filteredPrintJobs.length === 0 ? (
                <div className="py-20 text-center opacity-50 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[35px]">
                  <Printer size={48} className="mx-auto mb-3 text-slate-400" />
                  <p className="font-black uppercase tracking-widest text-sm text-slate-500">No Print studio requests in queue</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrintJobs.map(job => (
                    <div key={job.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-7 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-white/5">
                            #{job.id}
                          </span>
                          <span className="text-xl font-black italic tracking-tight text-purple-600 dark:text-purple-400">
                            ₹{job.cost}
                          </span>
                        </div>

                        {/* Student customer inspection box */}
                        <div 
                          onClick={() => handleOpenStudentProfile(job.user)}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between group/user"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                              {(job.user?.name || 'U')[0]}
                            </div>
                            <div className="min-w-0 pr-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted By</p>
                              <h4 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover/user:text-purple-500 transition-colors">
                                {job.user?.name || 'Demo Student'}
                              </h4>
                              <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 underline decoration-dotted">
                                View User Profile →
                              </p>
                            </div>
                          </div>
                          <UserCheck size={18} className="text-slate-400 group-hover/user:text-purple-500 shrink-0" />
                        </div>

                        {/* Document specification details */}
                        <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-black text-xs truncate">
                            <FileText size={16} className="text-purple-500 shrink-0" />
                            <span className="truncate">{job.name}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1 border-t border-purple-500/10">
                            <span>Pages: {job.pages} ({job.copies || 1} copies)</span>
                            <span className="uppercase font-black px-2 py-0.5 bg-white dark:bg-slate-900 rounded-lg text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-white/10">
                              {job.type === 'color' ? '🎨 Color Print' : '⚫ B&W Print'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Queue Status:</span>
                          <select
                            value={job.status || 'Pending'}
                            onChange={(e) => {
                              updateJobStatus(job.id, e.target.value);
                              showToast(`Print job #${job.id} marked as ${e.target.value}!`);
                            }}
                            className="bg-slate-100 dark:bg-slate-800 font-black text-xs text-slate-900 dark:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none cursor-pointer uppercase"
                          >
                            <option value="Pending">🕒 Pending Review</option>
                            <option value="Printing">🖨️ Currently Printing</option>
                            <option value="Ready for Pickup">✔️ Ready for Pickup</option>
                            <option value="Completed">✅ Completed & Collected</option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => showToast(`Downloading simulated file: ${job.name}...`)}
                            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <Download size={14} />
                            <span>Download File</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: STUDENT MARKET */}
          {activeTab === 'Student Market' && (
            <motion.div 
              key="student_market"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[30px] border border-slate-200/80 dark:border-white/10 shadow-lg">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="text-orange-500" size={24} />
                    <span>Student P2P Market Governance</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    Moderate peer-to-peer textbook and lab equipment sales. Verify seller student credentials or flag non-compliant posts.
                  </p>
                </div>
                <span className="px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-2xl text-xs font-black uppercase tracking-wider">
                  {(marketListings || []).length} Active Listings
                </span>
              </div>

              {filteredMarket.length === 0 ? (
                <div className="py-20 text-center opacity-50 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[35px]">
                  <Sliders size={48} className="mx-auto mb-3 text-slate-400" />
                  <p className="font-black uppercase tracking-widest text-sm text-slate-500">No Student listings available in database</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMarket.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-6 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-orange-500/50 transition-all">
                      <div className="space-y-4">
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative border border-slate-200 dark:border-white/5">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                            {item.condition || 'Used'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase italic truncate group-hover:text-orange-500 transition-colors">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xl font-black italic tracking-tight text-orange-600 dark:text-orange-500">₹{item.price}</span>
                            {item.originalPrice && <span className="text-xs text-slate-400 font-bold line-through">₹{item.originalPrice}</span>}
                          </div>
                        </div>

                        {/* Seller profile inspection trigger */}
                        <div 
                          onClick={() => handleOpenStudentProfile(item.seller)}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 hover:border-orange-500/50 cursor-pointer transition-all flex items-center justify-between group/sel"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-xs shrink-0">
                              {(typeof item.seller === 'string' ? item.seller : item.seller?.name || 'S')[0]}
                            </div>
                            <div className="min-w-0 pr-2">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seller Student</p>
                              <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover/sel:text-orange-500 transition-colors">
                                {typeof item.seller === 'string' ? item.seller : item.seller?.name || 'Campus Student'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-blue-500 underline decoration-dotted whitespace-nowrap">Profile →</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            const next = item.status === 'Verified' ? 'Available' : 'Verified';
                            updateMarketListingStatus(item.id, next);
                            showToast(`Listing ${item.title} marked as ${next}!`);
                          }}
                          className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                            item.status === 'Verified' 
                              ? 'bg-emerald-600 text-white shadow-md' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <ShieldCheck size={16} className={item.status === 'Verified' ? 'text-white' : 'text-emerald-500'} />
                          <span>{item.status === 'Verified' ? 'Verified ✓' : 'Verify Post'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Remove student listing ${item.title}?`)) {
                              deleteMarketListing(item.id);
                              showToast("Listing removed from public market.");
                            }
                          }}
                          className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                          title="Delete / Remove Listing"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: DEMAND INSIGHTS & AUTOMATED RESUPPLY */}
          {activeTab === 'Demand Insights' && (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[45px] p-8 sm:p-10 shadow-xl space-y-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campus Demand Matrix</span>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                    <Search className="text-orange-500" size={26} /> 
                    <span>High-Frequency Searches</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    Top student searched terms this week that require proactive inventory expansion.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {SEARCH_INSIGHTS.map((insight, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200/80 dark:border-white/5 group hover:border-orange-500/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900 dark:text-white text-base uppercase italic">{insight.term}</p>
                          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                            insight.status === 'Critical Shortage' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                            insight.status === 'Urgent Stock Req.' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>
                            {insight.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">{insight.count} student searches in last 7 days</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-xs font-black tracking-widest border border-orange-500/20 flex items-center gap-1.5">
                          <TrendingUp size={14} /> {insight.trend}
                        </div>
                        <button 
                          onClick={() => {
                            setEditingProduct({ name: insight.term, price: 350, category: 'Stationery', stockCount: 50, image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=1000' });
                            setIsProductModalOpen(true);
                          }}
                          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95"
                        >
                          + List Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 rounded-[45px] p-8 sm:p-10 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-72 h-72 bg-white/20 rounded-full blur-[70px] group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-xl">
                    <RefreshCw size={30} className="animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-black text-[10px] rounded-full uppercase tracking-widest inline-block border border-white/20">
                      Automated Supply Protocol
                    </span>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                      Instant Campus Resupply Order
                    </h3>
                  </div>
                  <p className="text-white/90 font-bold text-sm leading-relaxed">
                    Our AI stock monitoring detected **{lowStockCount} retail items** running at critical stock (&le; 5 units). Clicking execute will generate supplier vouchers and instantly restore inventory to **50 units** per listing!
                  </p>

                  <div className="p-5 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-yellow-300 flex items-center gap-1.5">
                      <Sparkles size={15} /> Targeted Items For Restock:
                    </p>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {products.filter(p => (p.stockCount || 0) <= 5).map(item => (
                        <div key={item.id} className="flex justify-between text-xs font-extrabold text-white/90">
                          <span>• {item.name}</span>
                          <span className="text-yellow-300 font-mono">Current: {item.stockCount}</span>
                        </div>
                      ))}
                      {lowStockCount === 0 && (
                        <p className="text-xs font-extrabold text-emerald-200">✔️ All products currently maintain healthy stock levels (&gt; 5 units).</p>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    resupplyAllLowStock();
                    showToast("🚀 Automated campus resupply executed! All depleted stocks reset to 50 units.");
                  }}
                  className="relative z-10 mt-8 py-5 w-full bg-white hover:bg-slate-100 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  <span>Execute Resupply Protocol</span>
                </button>
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
                <div className="h-2.5 bg-gradient-to-r from-orange-500 via-blue-500 to-indigo-600" />
                
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campus Identity & Records</span>
                      <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                        <span>👤 Student Customer Profile</span>
                      </h3>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Top user badge */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
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
                      <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-1">{selectedStudent.department || 'Computer Science Engineering'}</p>
                      <p className="text-[11px] font-mono font-bold text-slate-400">Roll / ID: {selectedStudent.identifier || '24BCE10023'}</p>
                    </div>
                  </div>

                  {/* User Contact & Activity Breakdown */}
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

                  {/* Shopperz specific analytics for student */}
                  <div className="space-y-2 bg-orange-500/5 dark:bg-orange-500/10 p-5 rounded-3xl border border-orange-500/20">
                    <p className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Award size={16} /> Shopperz Engagement Metrics
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Orders</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{storeOrders.filter(o => o.user?.name === selectedStudent.name || o.user?.email === selectedStudent.email).length || 2}</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Print Jobs</p>
                        <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">{(printJobs||[]).filter(j => j.user?.name === selectedStudent.name).length || 1}</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase">P2P Posts</p>
                        <p className="text-lg font-black text-orange-600 dark:text-orange-400 mt-0.5">{(marketListings||[]).filter(m => m.seller?.name === selectedStudent.name || m.seller === selectedStudent.name).length || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action controls */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Official update dispatched to ${selectedStudent.email}`);
                        setSelectedStudent(null);
                      }}
                      className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Send size={15} />
                      <span>Email Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Connecting voice call to ${selectedStudent.phone}...`);
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

        {/* MODAL 2: PRODUCT EDITOR MODAL */}
        <ProductEditorModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          editingProduct={editingProduct}
          onSave={(productData) => {
            if (editingProduct && editingProduct.id) {
              updateProduct(editingProduct.id, productData);
              showToast(`Saved updates for ${productData.name}`);
            } else {
              addProduct(productData);
              showToast(`Added new retail item: ${productData.name}`);
            }
            setIsProductModalOpen(false);
          }}
        />
      </div>
    </AdminLayout>
  );
}

function ProductEditorModal({ isOpen, onClose, editingProduct, onSave }) {
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Stationery', stockCount: 20, location: 'Campus Store - Main', image: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({ name: '', price: '', category: 'Stationery', stockCount: 25, location: 'Campus Store - Main', image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=1000' });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-[45px] w-full max-w-lg p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-white/10 relative my-auto space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retail Registry</span>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mt-0.5">
              {editingProduct && editingProduct.id ? '✏️ Modify Retail Item' : '➕ Add Retail Item'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave({...formData, price: Number(formData.price), stockCount: Number(formData.stockCount)}); }} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Product Name & Title</label>
            <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500 transition-all" placeholder="e.g. Graphing Calculator TI-84" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Price (₹)</label>
              <input required type="number" min="0" value={formData.price || 0} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-mono font-black text-slate-900 dark:text-white outline-none focus:border-orange-500 transition-all" placeholder="e.g. 250" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Stock Count</label>
              <input required type="number" min="0" value={formData.stockCount || 0} onChange={e => setFormData({...formData, stockCount: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-mono font-black text-slate-900 dark:text-white outline-none focus:border-orange-500 transition-all" placeholder="e.g. 20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Category</label>
              <select value={formData.category || 'Stationery'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-black text-slate-900 dark:text-white outline-none focus:border-orange-500 cursor-pointer uppercase">
                <option>Stationery</option><option>Apparel</option><option>Lab Equipment</option><option>Electronics</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Store Location</label>
              <select value={formData.location || 'Campus Store - Main'} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-black text-slate-900 dark:text-white outline-none focus:border-orange-500 cursor-pointer uppercase">
                <option>Campus Store - Main</option><option>Campus Store - East</option><option>Library Block Retail</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 pl-1">Image URL</label>
            <input required type="url" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-orange-500 transition-all" placeholder="https://..." />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">Cancel</button>
            <button type="submit" className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/25 hover:scale-[1.02] active:scale-95 transition-all">
              {editingProduct && editingProduct.id ? 'Save Changes' : 'Confirm & List Item'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
