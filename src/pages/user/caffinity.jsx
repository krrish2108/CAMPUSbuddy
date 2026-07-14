/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ModuleLayout from '@/components/ModuleLayout';

const CartModal = dynamic(() => import('@/components/caffinity/CartModal'), { ssr: false });
const HistoryModal = dynamic(() => import('@/components/caffinity/HistoryModal'), { ssr: false });
import {
  Search,
  ShoppingCart,
  Clock,
  Star,
  ChevronRight,
  Minus,
  Plus,
  X,
  CheckCircle2,
  MapPin,
  Store,
  ArrowLeft,
  Timer,
  Wallet,
  Smartphone,
  ExternalLink,
  History,
  RotateCcw
} from 'lucide-react';
import { MENU_CATEGORIES, CANTEENS } from '@/data/caffinityData';
import { useCaffinity } from '@/context/CaffinityContext';

// Helper: Get Time Ago
const getTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return 'Just now';
  const mins = Math.floor(seconds / 60);
  return `${mins}m ago`;
};

export default function CaffinityPage() {
  const {
    selectedCanteen,
    selectCanteen,
    resetCanteen,
    isCanteenSelecting,
    cart,
    addToCart,
    updateQuantity,
    orders,
    placeOrder,
    menuItems
  } = useCaffinity();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const [isUPIRedirecting, setIsUPIRedirecting] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CAMPUS Wallet');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('All');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setActiveCategory('All');
  }, [selectedCanteen]);

  // Helper: Estimate Remaining Prep Time
  const getRemainingPrep = (order) => {
    if (order.status === 'Ready' || order.status === 'Done') return 'Now';

    const maxPrepStr = order.items.reduce((max, item) => {
      const itm = menuItems.find(mi => mi.id === item.id);
      const pTime = parseInt(itm?.prepTime || '5');
      return pTime > max ? pTime : max;
    }, 0);

    const elapsedMins = Math.floor((new Date() - new Date(order.timestamp)) / 60000);
    const remaining = Math.max(1, maxPrepStr - elapsedMins);
    return `${remaining}m`;
  };

  const activeOrders = useMemo(() => {
    if (!selectedCanteen) return [];
    return orders.filter(o =>
      o.canteenId === selectedCanteen.id &&
      o.status !== 'Done' &&
      o.status !== 'Completed' &&
      o.status !== 'Cancelled'
    );
  }, [orders, selectedCanteen]);

  const pastOrders = useMemo(() => {
    let filtered = orders.filter(o =>
      o.status === 'Completed' || o.status === 'Done' || o.status === 'Cancelled'
    );
    if (historyFilter !== 'All') {
      filtered = filtered.filter(o => o.canteenId === historyFilter);
    }
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [orders, historyFilter]);

  const handleReorder = (order) => {
    order.items.forEach(orderItem => {
      const fullItem = menuItems.find(mi => mi.id === orderItem.id);
      if (fullItem) {
        for (let i = 0; i < orderItem.quantity; i++) {
          addToCart(fullItem);
        }
      }
    });
    setIsHistoryOpen(false);
    if (selectedCanteen?.id !== order.canteenId) {
      const c = CANTEENS.find(c => c.id === order.canteenId);
      if (c) selectCanteen(c);
    }
    setTimeout(() => setIsCartOpen(true), 100);
  };

  const specialItem = useMemo(() => menuItems.find(item => item.isSpecial), [menuItems]);

  const availableCategories = useMemo(() => {
    if (!selectedCanteen) return ['All'];
    const itemsForCanteen = menuItems.filter(item => item.canteenId === selectedCanteen.id);
    const cats = new Set(itemsForCanteen.map(item => item.category));
    return ['All', ...Array.from(cats)];
  }, [menuItems, selectedCanteen]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCanteen = !selectedCanteen || item.canteenId === selectedCanteen.id;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesCanteen && matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, menuItems, selectedCanteen]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (cartTotal === 0) return;

    // UPI Redirect Simulation
    if (paymentMethod === 'UPI') {
      setIsUPIRedirecting(true);
      setTimeout(() => {
        setIsUPIRedirecting(false);
        processFinalOrder();
      }, 2500);
    } else {
      processFinalOrder();
    }
  };

  const processFinalOrder = async () => {
    setIsCheckoutProcessing(true);
    try {
      const order = await placeOrder(scheduledTime, paymentMethod);
      if (order) {
        setTrackingOrderId(order.id);
        setIsCartOpen(false);
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      // You could add an error state here to show a toast/notification
    } finally {
      setIsCheckoutProcessing(false);
    }
  };

  const currentOrder = orders.find(o => o.id === trackingOrderId);
  const trackingStep = currentOrder ? (
    currentOrder.status === 'Placed' ? 0 :
      currentOrder.status === 'Preparing' ? 1 :
        currentOrder.status === 'Ready' ? 2 : 3
  ) : 0;

  if (isCanteenSelecting) {
    return (
      <ModuleLayout title="Caffinity" subtitle="Pick your location" color="#1A56DB">
        <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900 font-syne tracking-tighter uppercase italic">Where are you hungry?</h2>
            <p className="text-gray-500 font-medium">Select a canteen to browse the menu and pre-order.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {CANTEENS.map(canteen => (
              <div
                key={canteen.id}
                onClick={() => selectCanteen(canteen)}
                className="group relative h-72 rounded-[40px] overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 border-4 border-white"
              >
                <img src={canteen.image} className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt={canteen.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <div className="space-y-1 transform transition duration-500 group-hover:translate-y--2">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{canteen.name}</h3>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1"><MapPin size={10} /> {canteen.location}</p>
                  </div>
                  <div className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 group-hover:bg-blue-600 transition-all duration-500">
                    <ChevronRight size={28} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModuleLayout>
    );
  }

  if (trackingOrderId && currentOrder) {
    return (
      <ModuleLayout title="Caffinity" subtitle="Order Tracking" color="#1A56DB">
        <div className="max-w-2xl mx-auto py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
          <button onClick={() => setTrackingOrderId(null)} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Menu
          </button>

          <div className="text-center space-y-4">
            <div className="relative inline-flex mb-4">
              {trackingStep === 3 ? (
                <>
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full text-green-600 shadow-xl border-4 border-white">
                    <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full text-blue-600 shadow-xl border-4 border-white">
                    <Timer size={48} className="animate-spin-slow" />
                  </div>
                </>
              )}
            </div>
            <h2 className="text-4xl font-black text-gray-900 font-syne tracking-tighter uppercase italic">{trackingStep === 3 ? 'Order Success!' : 'Order Status'}</h2>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-500 font-semibold text-base">ID: <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-xl font-black tracking-widest uppercase">{trackingOrderId}</span></p>
              <div className="flex gap-2">
                <p className="text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg uppercase tracking-widest">{trackingStep === 3 ? "Picked Up" : `Ready by ${currentOrder.scheduledTime}`}</p>
                <p className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest">{getTimeAgo(currentOrder.timestamp)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 border-2 border-gray-50 shadow-2xl space-y-12 relative overflow-hidden">
            <div className="relative flex justify-between px-2">
              {['Placed', 'Preparing', 'Ready', 'Done'].map((step, idx) => (
                <div key={step} className="flex flex-col items-center z-10 space-y-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${idx <= trackingStep ? 'bg-blue-600 border-white text-white shadow-xl scale-110' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                    {idx < trackingStep ? <CheckCircle2 size={24} /> : idx === trackingStep && idx < 3 ? <Timer size={24} className="animate-pulse" /> : <span className="text-xl font-black">{idx + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${idx <= trackingStep ? 'text-blue-600' : 'text-gray-300'}`}>{step}</span>
                </div>
              ))}
              <div className="absolute top-7 left-0 w-full h-1.5 bg-gray-50 rounded-full -z-0"></div>
              <div className="absolute top-7 left-0 h-1.5 bg-blue-600 rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${Math.min(100, (trackingStep / 3) * 100)}%` }}></div>
            </div>

            <div className={`text-center p-8 rounded-[35px] transition-all duration-700 ${trackingStep === 3 ? 'bg-green-600 text-white shadow-lg' : trackingStep === 2 ? 'bg-green-50 border-2 border-green-100' : 'bg-blue-50/50'}`}>
              <h4 className={`font-black text-2xl tracking-tight italic uppercase ${trackingStep === 3 ? 'text-white' : 'text-gray-900'}`}>
                {trackingStep === 0 && "Receiving Order..."}
                {trackingStep === 1 && "Your food is being crafted ☕️"}
                {trackingStep === 2 && "Order is Ready! 🎉"}
                {trackingStep === 3 && "Deliciously Done!"}
              </h4>
              <p className={`text-sm mt-2 font-bold uppercase tracking-widest opacity-80 ${trackingStep === 3 ? 'text-white' : 'text-gray-500'}`}>
                {trackingStep === 0 && "We'll notify you when it's ready."}
                {trackingStep === 1 && "The chef is working magic."}
                {trackingStep === 2 && "Collect from the counter."}
                {trackingStep === 3 && "Hope you enjoy your meal!"}
              </p>
            </div>
          </div>
          <button onClick={() => setTrackingOrderId(null)} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition shadow-2xl active:scale-95">Go Back to Menu</button>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title={`Caffinity: ${selectedCanteen?.name}`} subtitle={selectedCanteen?.location} color="#1A56DB">
      <div className="space-y-8 pb-32">
        <div className="flex items-center justify-between">
          <button onClick={resetCanteen} className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest"><ArrowLeft size={16} /> Change Canteen</button>
          <div className="flex gap-2">
            <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 text-xs font-black text-gray-600 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-all shadow-sm"><History size={14} /> Past Orders</button>
            {activeOrders.length > 0 && <button onClick={() => setTrackingOrderId(activeOrders[0].id)} className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all animate-pulse"><Timer size={14} /> Tracking {activeOrders.length} {activeOrders.length > 1 ? 'Orders' : 'Order'}</button>}
          </div>
        </div>

        {activeOrders.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none animate-in fade-in slide-in-from-top-4 duration-500">
            {activeOrders.map(order => (
              <div key={order.id} onClick={() => setTrackingOrderId(order.id)} className="flex-shrink-0 relative group bg-white border-2 border-gray-100 p-4 rounded-[30px] flex items-center gap-4 cursor-pointer hover:border-blue-500 hover:shadow-xl transition-all w-64 h-20 overflow-hidden">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0"><Clock size={20} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5"><p className="font-black text-blue-600 text-[9px] uppercase">Preparing</p><p className="text-gray-400 font-bold text-[8px] uppercase">{getTimeAgo(order.timestamp)}</p></div>
                  <h4 className="font-black text-gray-900 text-xs truncate italic">#{order.id} @ {CANTEENS.find(c => c.id === order.canteenId)?.name}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {specialItem && (
          <div className={`relative h-60 rounded-[40px] overflow-hidden group shadow-2xl border-4 border-white transition-transform duration-500 ${isCartOpen ? 'scale-100 pointer-events-none' : ''}`}>
            <img src={specialItem.image} className={`w-full h-full object-cover transition duration-1000 ${isCartOpen ? '' : 'group-hover:scale-105'}`} alt={specialItem.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-8">
              <div className="space-y-2">
                <span className="bg-yellow-400 text-gray-900 text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">Chef&apos;s Recommendation</span>
                <h2 className="text-3xl md:text-4xl font-black text-white font-syne tracking-tighter leading-none">{specialItem.name} 🔥</h2>
                <button onClick={() => addToCart(specialItem)} className="mt-3 px-6 py-2.5 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl">Add to Cart — ₹{specialItem.price}</button>
              </div>
            </div>
          </div>
        )}

        <div className="sticky top-0 z-30 py-4 bg-white/80 backdrop-blur-xl -mx-4 px-4 space-y-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input type="text" placeholder={`Search in ${selectedCanteen?.name}...`} className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[25px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-base shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableCategories.map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{cat}</button>)}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-24 h-24 bg-gray-50 rounded-[30px] flex items-center justify-center mb-6 border-4 border-white shadow-xl">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No items found</h3>
            <p className="text-gray-500 font-bold max-w-sm mb-8 text-sm">We couldn&apos;t find any items matching your search or category filter in this canteen.</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const isItemAvail = item.isAvailable !== false && item.inStock !== false;
              return (
                <div key={item.id} className={`group flex flex-col bg-white rounded-[35px] border-2 border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-500 ${!isItemAvail ? 'grayscale opacity-70' : ''}`}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={item.name} />
                    <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-100 shadow-sm"><Clock size={12} className="text-blue-600" /><span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{item.prepTime}</span></div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${item.isVeg ? 'text-green-600' : 'text-red-600'}`}><div className={`w-2.5 h-2.5 rounded-full border-2 ${item.isVeg ? 'bg-green-500 border-green-100' : 'bg-red-500 border-red-100'}`} />{item.isVeg ? 'Veg' : 'Non-Veg'}</div>
                      <div className="flex items-center text-[10px] font-black text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg"><Star size={10} className="mr-1 fill-yellow-600" />{item.rating}</div>
                    </div>
                    <h3 className="font-black text-gray-900 text-lg leading-tight mb-2 uppercase tracking-tight">{item.name}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4"><span className="font-black text-gray-900 text-xl tracking-tighter">₹{item.price}</span><button disabled={!isItemAvail} onClick={() => addToCart(item)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isItemAvail ? 'bg-blue-600 text-white shadow-xl hover:bg-gray-900 active:scale-90' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}><Plus size={24} /></button></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-8 left-0 right-0 z-40 px-8 flex justify-center">
          <button onClick={() => setIsCartOpen(true)} className="bg-gray-900 text-white px-10 py-5 rounded-[30px] shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom duration-500 hover:bg-blue-600 transition-all group active:scale-95">
            <div className="relative"><ShoppingCart size={28} /><span className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-[11px] w-7 h-7 rounded-full flex items-center justify-center font-black border-4 border-gray-900 group-hover:border-blue-600">{cartCount}</span></div>
            <div className="flex flex-col items-start leading-none"><span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Total Checkout</span><span className="text-xl font-black tracking-tighter">₹{cartTotal}</span></div>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      <CartModal 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        isUPIRedirecting={isUPIRedirecting}
        cart={cart}
        cartTotal={cartTotal}
        updateQuantity={updateQuantity}
        scheduledTime={scheduledTime}
        setScheduledTime={setScheduledTime}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        handleCheckout={handleCheckout}
        isCheckoutProcessing={isCheckoutProcessing}
        selectedCanteen={selectedCanteen}
      />

      <HistoryModal 
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
        historyFilter={historyFilter}
        setHistoryFilter={setHistoryFilter}
        pastOrders={pastOrders}
        handleReorder={handleReorder}
      />
    </ModuleLayout>
  );
}
