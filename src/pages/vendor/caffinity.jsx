import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  LayoutGrid,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { DASHBOARD_STATS, CANTEENS } from '@/data/caffinityData';
import { useCaffinity } from '@/context/CaffinityContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const INITIAL_MENU = [
  { id: 'm1', name: 'Cold Brew Coffee', price: 80, isAvailable: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=200' },
  { id: 'm2', name: 'Paneer Tikka Sandwich', price: 120, isAvailable: true, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=200' },
  { id: 'm3', name: 'Masala Fries', price: 60, isAvailable: false, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=200' }
];

export default function CaffinityVendorDashboard() {
  const { 
    orders, 
    updateOrderStatus, 
    selectedCanteen, 
    selectCanteen, 
    resetCanteen,
    isCanteenSelecting,
    menuItems,
    toggleMenuItemAvailability,
    deleteMenuItem,
    addMenuItem,
    editMenuItem
  } = useCaffinity();

  const [activeTab, setActiveTab] = useState('Live Orders');
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // Filter orders by selected canteen
  const canteenOrders = useMemo(() => {
    return orders.filter(o => o.canteenId === selectedCanteen?.id);
  }, [orders, selectedCanteen]);

  const getOrdersByStatus = (status) => canteenOrders.filter(o => o.status === status);

  // Live Stats calculations
  const dailyRevenue = useMemo(() => canteenOrders.reduce((sum, order) => sum + (order.total || 0), 0), [canteenOrders]);
  const activeQueue = useMemo(() => canteenOrders.filter(o => ['Placed', 'Preparing', 'Ready'].includes(o.status)).length, [canteenOrders]);
  const cancelledOrders = useMemo(() => canteenOrders.filter(o => o.status === 'Cancelled').length, [canteenOrders]);

  // 1. CANTEEN SELECTION FOR VENDOR
  if (isCanteenSelecting) {
    return (
      <AdminLayout title="Vendor Access" subtitle="Select your operational unit">
        <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white font-syne tracking-tighter uppercase italic">Manage Canteen</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Which canteen are you managing today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CANTEENS.map(canteen => (
              <div 
                key={canteen.id}
                onClick={() => selectCanteen(canteen)}
                className="group relative h-48 rounded-[40px] overflow-hidden cursor-pointer shadow-xl dark:shadow-2xl transition-all duration-500 border-4 border-slate-200 dark:border-slate-900 hover:border-amber-500"
              >
                <div className="absolute inset-0 w-full h-full transition duration-1000 group-hover:scale-110 opacity-40 dark:opacity-60 group-hover:opacity-100">
                  <Image src={canteen.image} alt={canteen.name} fill className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 dark:from-[#020617] dark:via-[#020617]/80 to-transparent flex items-center p-10">
                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{canteen.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{canteen.location}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-xl">
                    <LayoutGrid size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // 2. VENDOR DASHBOARD
  return (
    <AdminLayout 
      title={`Canteen HQ: ${selectedCanteen?.name}`} 
      subtitle={`Operational Hub · ${selectedCanteen?.location}`}
      extraHeader={
        <button 
          onClick={resetCanteen}
          className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em] bg-white dark:bg-slate-900 px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg"
        >
          <RotateCcw size={14} /> Switch Unit
        </button>
      }
    >
      <div className="space-y-10 pb-20">
        
        {/* TAB SWITCHER */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-2">
          {['Live Orders', 'Menu Config', 'Settings & Slots'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="caff-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full shadow-[0_0_10px_#f59e0b]" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Live Orders' && (
            <motion.div 
              key="live"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* STATS OVERVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<DollarSign size={20} />} label="Daily Revenue" value={`₹${dailyRevenue.toLocaleString()}`} trend="Live" color="green" />
                <StatCard icon={<ShoppingBag size={20} />} label="Today's Orders" value={canteenOrders.length} trend="Live" color="blue" />
                <StatCard icon={<Users size={20} />} label="Active Queue" value={`${activeQueue}/${DASHBOARD_STATS.activeQueueLimit}`} alert={activeQueue > 20} color="amber" />
                <StatCard icon={<AlertTriangle size={20} />} label="Cancelled" value={cancelledOrders} color="red" />
              </div>

              {/* CONTROLS */}
              <div className={`p-8 rounded-[40px] flex items-center justify-between border-2 transition-all shadow-xl dark:shadow-2xl relative overflow-hidden ${
                isAcceptingOrders ? 'bg-white dark:bg-slate-900 border-green-500/30' : 'bg-red-50 dark:bg-red-500/10 border-red-500/30'
              }`}>
                {isAcceptingOrders && <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />}
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`w-6 h-6 rounded-full border-4 border-slate-50 dark:border-[#020617] ${isAcceptingOrders ? 'bg-green-500 shadow-[0_0_15px_#22c55e] animate-pulse' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`} />
                  <div>
                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic text-2xl">
                      {isAcceptingOrders ? 'Canteen Online' : 'Store Offline'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Visibility on student app</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all relative z-10 ${
                    isAcceptingOrders ? 'bg-slate-100 dark:bg-white text-slate-900 hover:bg-red-500 hover:text-white dark:hover:bg-red-500' : 'bg-green-500 text-white hover:scale-105'
                  }`}
                >
                  {isAcceptingOrders ? 'Enter Offline Mode' : 'Go Online Now'}
                </button>
              </div>

              {/* KANBAN BOARD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <KanbanColumn 
                  title="New Orders" count={getOrdersByStatus('Placed').length} orders={getOrdersByStatus('Placed')} 
                  onAction={(id) => updateOrderStatus(id, 'Preparing')} btnText="Accept & Cook" color="blue"
                />
                <KanbanColumn 
                  title="Preparing" count={getOrdersByStatus('Preparing').length} orders={getOrdersByStatus('Preparing')} 
                  onAction={(id) => updateOrderStatus(id, 'Ready')} btnText="Mark Ready" color="amber"
                />
                <KanbanColumn 
                  title="Ready for Pickup" count={getOrdersByStatus('Ready').length} orders={getOrdersByStatus('Ready')} 
                  onAction={(id) => updateOrderStatus(id, 'Completed')} btnText="Handover" color="green"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'Menu Config' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Menu Editor</h3>
                   <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Add or modify food items instantly</p>
                 </div>
                 <button 
                   onClick={() => { setEditingMenuItem(null); setIsMenuModalOpen(true); }}
                   className="px-6 py-3 bg-amber-500 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform flex items-center gap-2"
                 >
                   <Plus size={16} /> New Item
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[40px] p-6 shadow-xl dark:shadow-2xl border border-slate-100 dark:border-white/5 space-y-6 group hover:border-amber-500/30 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-md shrink-0">
                         <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-slate-900 dark:text-white leading-tight truncate">{item.name}</h4>
                         <p className="text-lg font-black text-amber-600 dark:text-amber-500 italic uppercase mt-1">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-[25px] border border-slate-200 dark:border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Available</span>
                      <button 
                         onClick={() => toggleMenuItemAvailability(item.id)}
                         className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${item.isAvailable ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-800'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.isAvailable ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => { setEditingMenuItem(item); setIsMenuModalOpen(true); }}
                        className="py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => deleteMenuItem(item.id)} className="py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Settings & Slots' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-2xl"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[45px] p-10 border border-slate-100 dark:border-white/5 shadow-xl dark:shadow-2xl space-y-8">
                 <div>
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Time Slot Configuration</h3>
                   <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Manage order flow density</p>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-white/5">
                     <div>
                       <p className="text-slate-900 dark:text-white font-bold">Max Orders Per Slot</p>
                       <p className="text-xs text-slate-500 mt-1">Automatically closes slots when limit is reached</p>
                     </div>
                     <input type="number" defaultValue={20} className="w-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-black text-center outline-none focus:border-amber-500" />
                   </div>
                   
                   <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-white/5">
                     <div>
                       <p className="text-slate-900 dark:text-white font-bold">Slot Duration</p>
                       <p className="text-xs text-slate-500 mt-1">Time interval for pre-orders</p>
                     </div>
                     <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-black text-sm outline-none focus:border-amber-500 appearance-none">
                       <option>15 mins</option>
                       <option>30 mins</option>
                       <option>60 mins</option>
                     </select>
                   </div>
                 </div>

                 <button className="w-full py-5 bg-amber-500 text-white rounded-[25px] font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                   Save Configuration
                 </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        
        <MenuEditorModal 
          isOpen={isMenuModalOpen} 
          onClose={() => setIsMenuModalOpen(false)} 
          editingItem={editingMenuItem} 
          onSave={(itemData) => {
            if (editingMenuItem) {
              editMenuItem(editingMenuItem.id, itemData);
            } else {
              addMenuItem(itemData);
            }
            setIsMenuModalOpen(false);
          }}
        />
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, label, value, trend, alert, color }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-100 dark:border-blue-500/20',
    green: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-100 dark:border-green-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-500/20',
    red: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-100 dark:border-red-500/20'
  };
  return (
    <div className={`bg-white dark:bg-slate-900 p-8 rounded-[35px] border-2 shadow-sm dark:shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 ${colors[color]}`}>
      <div className="absolute -top-4 -right-4 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-slate-900 dark:text-white">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-4 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-lg`}>
          {icon}
        </div>
        {trend && <span className="text-[10px] font-black text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 border border-green-200 dark:border-green-400/20 px-3 py-1 rounded-full">{trend}</span>}
        {alert && <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />}
      </div>
      <div className="relative z-10">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{value}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1 break-words">{label}</p>
      </div>
    </div>
  );
}

function KanbanColumn({ title, count, orders, onAction, btnText, color }) {
  const colorMap = {
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    green: 'text-green-500'
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
          {title} <span className={`px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 ${colorMap[color]}`}>{count}</span>
        </h4>
      </div>
      <div className="space-y-4 min-h-[500px] bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/5">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onAction={onAction} btnText={btnText} color={color} />
        ))}
        {orders.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
            <CheckCircle2 size={48} strokeWidth={1} className="mb-4 opacity-50" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Queue Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onAction, btnText, color }) {
  const isPriority = order.scheduledTime && order.scheduledTime !== 'As Soon As Possible';
  const colorStyles = {
    blue: 'bg-blue-600 text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900',
    amber: 'bg-amber-500 text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900',
    green: 'bg-green-600 text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900'
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[30px] shadow-sm dark:shadow-2xl border border-slate-100 dark:border-white/5 space-y-5 hover:shadow-xl dark:hover:border-white/20 transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">#{order.id}</span>
        {isPriority && (
          <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 px-3 py-1.5 rounded-xl border border-orange-100 dark:border-orange-500/20 shadow-inner">
            <Clock size={12} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">{order.scheduledTime}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h5 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight italic">{order.studentName}</h5>
        <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
          {order.items.map((item, i) => (
            <p key={i} className="text-[11px] text-slate-600 dark:text-slate-300 font-black uppercase tracking-wider flex items-center justify-between">
              <span>{item.name}</span>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 rounded-lg ml-2">x{item.quantity}</span>
            </p>
          ))}
        </div>
      </div>

      {order.specialNote && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
            <p className="text-[9px] font-black text-red-600 dark:text-red-500 uppercase tracking-[0.2em] mb-1">Note:</p>
            <p className="text-xs text-red-700 dark:text-red-200 font-bold italic">&quot;{order.specialNote}&quot;</p>
          </div>
      )}

      <button 
        onClick={() => onAction(order.id)}
        className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-md dark:shadow-xl flex items-center justify-center gap-2 ${colorStyles[color]}`}
      >
        {btnText} <ChevronRight size={14} />
      </button>
    </div>
  );
}

function MenuEditorModal({ isOpen, onClose, editingItem, onSave }) {
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Quick Bites', prepTime: '5 min', isVeg: true, image: ''
  });

  useEffect(() => {
    if (editingItem) setFormData(editingItem);
    else setFormData({ name: '', price: '', category: 'Quick Bites', prepTime: '5 min', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200' });
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[30px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={16} /></button>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-6">{editingItem ? 'Edit Menu Item' : 'New Menu Item'}</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSave({...formData, price: Number(formData.price)}); }} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Item Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500" placeholder="e.g. Masala Dosa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Price (₹)</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500" placeholder="e.g. 50" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Prep Time</label>
              <input required type="text" value={formData.prepTime} onChange={e => setFormData({...formData, prepTime: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500" placeholder="e.g. 10 min" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500 appearance-none">
                <option>Beverages</option><option>Quick Bites</option><option>Meals</option><option>Combos</option><option>Healthy</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Diet Type</label>
              <button type="button" onClick={() => setFormData({...formData, isVeg: !formData.isVeg})} className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest border transition-all ${formData.isVeg ? 'bg-green-50 dark:bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20'}`}>{formData.isVeg ? 'Veg' : 'Non-Veg'}</button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
            <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500" placeholder="https://..." />
          </div>
          <button type="submit" className="w-full mt-4 py-4 bg-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            {editingItem ? 'Save Changes' : 'Create Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
