import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModuleLayout from '@/components/ModuleLayout';
import { useShopperz } from '@/context/ShopperzContext';
import { 
  Store, 
  Printer, 
  Users, 
  Search, 
  ShoppingCart,
  Zap,
  Trash2,
  Wallet,
  X,
  CheckCircle,
  MapPin
} from 'lucide-react';

import StoreSection from '@/components/shopperz/StoreSection';
import PrintSection from '@/components/shopperz/PrintSection';
import MarketSection from '@/components/shopperz/MarketSection';

export default function ShopperzPage() {
  const { activeSection, setActiveSection, cart, removeFromCart, checkout, isExamSeason } = useShopperz();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const sections = [
    { id: 'store', label: 'Campus Store', icon: <Store size={18} /> },
    { id: 'print', label: 'Cloud Print', icon: <Printer size={18} /> },
    { id: 'market', label: 'Student Market', icon: <Users size={18} /> },
  ];

  const totalAmount = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <ModuleLayout 
      title="Shopperz" 
      subtitle="Campus store, print & student market" 
      color="#EA580C"
    >
      <div className="space-y-8 min-h-[800px]">
        
        {/* EXAM SEASON BANNER */}
        {isExamSeason && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-orange-500/20"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                  <Zap size={24} />
               </div>
               <div>
                  <h4 className="font-black italic uppercase tracking-tighter text-xl leading-none">Exam Season Specials</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Priority printing + Stationery bundles active</p>
               </div>
            </div>
            <button className="px-6 py-2 bg-white text-orange-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all">
              Shop Bundles
            </button>
          </motion.div>
        )}

        {/* SEARCH & CART HEADER */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
           {/* Segmented Control */}
           <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[30px] border border-slate-200 dark:border-white/10 w-full md:w-auto">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-[25px] transition-all relative font-black uppercase tracking-widest text-[9px] ${
                    activeSection === section.id 
                    ? 'text-white' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {activeSection === section.id && (
                    <motion.div 
                      layoutId="segment-pill"
                      className="absolute inset-0 bg-orange-600 rounded-[25px] shadow-lg shadow-orange-500/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10">{section.icon}</div>
                  <span className="relative z-10">{section.label}</span>
                </button>
              ))}
           </div>

           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative group flex-1 md:w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                 <input 
                    type="text" 
                    placeholder={`Search ${activeSection}...`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[30px] font-bold text-sm focus:border-orange-600 transition-all outline-none"
                 />
              </div>
              <button 
                onClick={() => setShowCart(true)}
                className="relative w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 shadow-xl"
              >
                 <ShoppingCart size={20} />
                 {cart.length > 0 && (
                   <span className="absolute -top-2 -right-2 bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-slate-900">
                     {cart.length}
                   </span>
                 )}
              </button>
           </div>
        </div>

        {/* SECTION CONTENT WITH ANIMATED TRANSITIONS */}
        <div className="relative min-h-[600px]">
           <AnimatePresence mode="wait">
              {activeSection === 'store' && (
                <motion.div
                  key="store"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <StoreSection searchQuery={searchQuery} />
                </motion.div>
              )}
              {activeSection === 'print' && (
                <motion.div
                  key="print"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PrintSection />
                </motion.div>
              )}
              {activeSection === 'market' && (
                <motion.div
                  key="market"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <MarketSection searchQuery={searchQuery} />
                </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>

      {/* CART DRAWER */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[3000] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full"
            >
              <div className="p-8 border-b dark:border-white/10 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white">
                      <ShoppingCart size={24} />
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Your Cart</h3>
                 </div>
                 <button onClick={() => setShowCart(false)} className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group hover:bg-red-500 hover:text-white transition-all">
                   <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 {cart.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                      <ShoppingCart size={48} />
                      <p className="font-black italic uppercase tracking-widest text-xs">Cart is Empty</p>
                   </div>
                 ) : (
                   cart.map(item => (
                     <div key={item.id} className="flex items-center gap-4 group">
                        <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                           <h6 className="font-bold text-sm leading-tight text-slate-900 dark:text-white">{item.name}</h6>
                           <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">₹{item.price} × {item.quantity}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   ))
                 )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-slate-50 dark:bg-white/5 space-y-6 shrink-0">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</span>
                      <span className="text-2xl font-black italic tracking-tighter italic text-slate-900 dark:text-white">₹{totalAmount}</span>
                   </div>
                   <button 
                     disabled={isProcessing}
                     onClick={async () => {
                       setIsProcessing(true);
                       const result = await checkout(totalAmount);
                       if (result.success) {
                         setShowCart(false);
                         setPlacedOrder(result.order);
                       } else {
                         alert("Checkout failed. Check your wallet balance.");
                       }
                       setIsProcessing(false);
                     }}
                     className="w-full py-5 bg-orange-600 text-white rounded-[25px] font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                   >
                      <Wallet size={18} /> {isProcessing ? "Processing..." : "Pay via Wallet"}
                   </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OTP SUCCESS MODAL */}
      <AnimatePresence>
        {placedOrder && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={() => setPlacedOrder(null)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl max-w-md w-full text-center border border-slate-100 dark:border-white/5"
             >
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Order Confirmed!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                  Your payment was successful. Please show the OTP below to the admin to collect your items.
                </p>

                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 mb-8 border border-slate-100 dark:border-white/5 shadow-inner">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Verification OTP</p>
                   <p className="text-4xl font-black tracking-widest text-orange-600 dark:text-orange-500">{placedOrder.otp}</p>
                </div>

                <div className="flex items-center gap-4 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 p-4 rounded-2xl text-left mb-8 border border-orange-100 dark:border-orange-500/20">
                   <MapPin size={24} className="shrink-0" />
                   <p className="text-xs font-bold leading-tight">Pick up your items from the Campus Store Counter (Block 3).</p>
                </div>

                <button 
                  onClick={() => setPlacedOrder(null)}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Done
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </ModuleLayout>
  );
}
