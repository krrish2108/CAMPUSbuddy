/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { History, X, RotateCcw } from 'lucide-react';
import { CANTEENS } from '@/data/caffinityData';

export default function HistoryModal({
  isHistoryOpen,
  setIsHistoryOpen,
  historyFilter,
  setHistoryFilter,
  pastOrders,
  handleReorder
}) {
  if (!isHistoryOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end md:justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-0 md:p-6">
      <div className="absolute inset-0" onClick={() => setIsHistoryOpen(false)} />
      <div className="relative bg-white rounded-t-[50px] md:rounded-[40px] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-white z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-black font-syne text-gray-900 tracking-tight uppercase italic flex items-center gap-2"><History className="text-blue-600" /> Past Orders</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">Your order history</p>
          </div>
          <button onClick={() => setIsHistoryOpen(false)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200 transition shrink-0"><X size={20} /></button>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button onClick={() => setHistoryFilter('All')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${historyFilter === 'All' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-200 border-2 border-gray-100'}`}>All Canteens</button>
          {CANTEENS.map(c => (
            <button key={c.id} onClick={() => setHistoryFilter(c.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${historyFilter === c.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-200 border-2 border-gray-100'}`}>{c.name}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-none bg-gray-50/50">
          {pastOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <History size={48} className="text-gray-300 mb-4" />
              <p className="font-black text-gray-900">No past orders found.</p>
            </div>
          ) : (
            pastOrders.map(order => {
              const canteen = CANTEENS.find(c => c.id === order.canteenId);
              const isCompleted = order.status === 'Completed' || order.status === 'Done';
              return (
                <div key={order.id} className="bg-white border-2 border-gray-100 rounded-[30px] p-6 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{order.status}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(order.timestamp).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{canteen?.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl tracking-tighter text-gray-900">₹{order.total}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-600 truncate"><span className="text-gray-400 mr-2">{item.quantity}x</span>{item.name}</p>
                        <p className="text-xs font-black text-gray-900 shrink-0">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => handleReorder(order)} className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all group"><RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" /> Reorder Items</button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
