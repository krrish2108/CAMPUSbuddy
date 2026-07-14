/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Smartphone, ExternalLink, X, Clock, Wallet, ChevronRight, Minus, Plus } from 'lucide-react';

export default function CartModal({
  isCartOpen,
  setIsCartOpen,
  isUPIRedirecting,
  cart,
  cartTotal,
  updateQuantity,
  scheduledTime,
  setScheduledTime,
  paymentMethod,
  setPaymentMethod,
  handleCheckout,
  isCheckoutProcessing,
  selectedCanteen
}) {
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end md:justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-0 md:p-6">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
      <div className="relative bg-white rounded-t-[50px] md:rounded-[40px] w-full max-w-lg max-h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 shadow-2xl border border-white/20">
        {/* COMPACT UPI REDIRECT OVERLAY */}
        {isUPIRedirecting && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-10 animate-in fade-in ease-out text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30" />
              <div className="relative w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Smartphone size={48} className="animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2 tracking-tight">Opening UPI App</h3>
            <p className="text-gray-500 font-medium max-w-xs">{selectedCanteen?.name} is requesting ₹{cartTotal}. Complete payment in your banking app.</p>
            <div className="mt-8 flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest">
              <ExternalLink size={14} /> Redirecting safely
            </div>
          </div>
        )}

        <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto my-4 md:hidden shrink-0" />

        <div className="px-10 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black font-syne text-gray-900 tracking-tight uppercase italic">{selectedCanteen?.name} Checkout</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Review & Pay</p>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200 transition shrink-0"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-2 space-y-4 scrollbar-none">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md border-2 border-white shrink-0"><img src={item.image} className="w-full h-full object-cover" alt={item.name} /></div>
              <div className="flex-1 min-w-0"><h4 className="font-black text-gray-900 text-sm truncate uppercase italic tracking-tight">{item.name}</h4><p className="text-blue-600 font-black tracking-tighter text-xs">₹{item.price}</p></div>
              <div className="flex items-center bg-gray-50 rounded-xl p-1 gap-2 border border-gray-100"><button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition"><Minus size={12} /></button><span className="w-4 text-center font-black text-xs text-gray-900">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-600 transition"><Plus size={12} /></button></div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-5 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Clock size={12} className="text-orange-500" /> Suggested Pickup</p>
              <input type="time" value={scheduledTime === 'Asap' ? '' : scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-black text-xs shadow-sm bg-white" />
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Wallet size={12} className="text-blue-500" /> Pay via</p>
              <div className="flex p-1 bg-white border-2 border-gray-100 rounded-xl gap-1">
                <button
                  onClick={() => setPaymentMethod('CAMPUS Wallet')}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${paymentMethod === 'CAMPUS Wallet' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Wallet size={10} /> Wallet
                </button>
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${paymentMethod === 'UPI' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Smartphone size={10} /> UPI
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Total Checkouts</p><p className="text-2xl font-black text-gray-900 tracking-tighter">₹{cartTotal}</p></div>
            <button
              onClick={handleCheckout}
              disabled={isCheckoutProcessing || cartTotal === 0}
              className={`px-8 py-4 rounded-[20px] font-black text-base transition-all shadow-xl relative overflow-hidden flex items-center gap-3 active:scale-95 ${isCheckoutProcessing || cartTotal === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-gray-900'
                }`}
            >
              {isCheckoutProcessing ? 'Placing...' : cartTotal === 0 ? 'Cart is Empty' : paymentMethod === 'UPI' ? 'Pay via UPI' : 'Pay via Wallet'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
