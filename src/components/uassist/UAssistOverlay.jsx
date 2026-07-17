import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MoreVertical, 
  Mic, 
  Send, 
  History, 
  ChevronRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { useUAssist } from '@/context/UAssistContext';
import { QUICK_ACTIONS } from '@/data/uassistData';
import ActionCard from './ActionCards';
import { UAssistMessage } from './UAssistResponse';

export default function UAssistOverlay() {
  const { 
    isOpen, setIsOpen, 
    messages, sendMessage, 
    isThinking, thinkingText,
    activeContext,
    queryCount, queryLimit,
    isPremium,
    prefillText, setPrefillText
  } = useUAssist();

  const [inputValue, setInputValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && prefillText) {
      setInputValue(prefillText);
      setPrefillText('');
    }
  }, [isOpen, prefillText, setPrefillText]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-[1100] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-md"
      />

      {/* Main Floating Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[40px] shadow-[0_20px_100px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10 h-[85vh] max-h-[800px] flex flex-col overflow-hidden group"
      >
        {/* Animated Ambient Meshes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000" />

        {/* HEADER */}
        <div className="p-8 border-b border-slate-200/50 dark:border-white/5 space-y-4 relative z-10 bg-white/40 dark:bg-slate-900/40">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse mix-blend-overlay" />
                    <span className="font-black italic relative z-10">UA</span>
                 </div>
                 <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">UAssist AI</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Your Campus Copilot</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="w-10 h-10 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm border border-slate-200/50 dark:border-white/5"><History size={18} /></button>
                 <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white transition-all shadow-sm border border-slate-200/50 dark:border-white/5"><X size={18} /></button>
              </div>
           </div>

           {/* CONTEXT PILL */}
           <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full flex items-center gap-2">
                 <span>{activeContext.icon}</span>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Context: {activeContext.label}</p>
              </div>
              {!isPremium && (
                <div className="flex-1 flex flex-col gap-1">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                      <span>Daily Queries</span>
                      <span className={queryCount >= queryLimit ? 'text-red-500' : 'text-blue-500'}>{queryCount}/{queryLimit}</span>
                   </div>
                   <div className="w-full h-1 bg-slate-200/50 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(queryCount/queryLimit)*100}%` }}
                        className={`h-full ${queryCount >= queryLimit ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                      />
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* CHAT MESSAGES */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth relative z-10">
           {messages.map((msg, i) => {
             const isAi = msg.role === 'ai';
             const hasStructuredCards = isAi && ['food_cards', 'event_cards', 'stationery_cards', 'product_cards', 'REPORT', 'NAVIGATE'].includes(msg.type);
 
             if (hasStructuredCards) {
                return (
                  <UAssistMessage 
                    key={msg.id} 
                    message={msg} 
                  />
                );
             }

             return (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%] space-y-2">
                     <motion.div 
                       initial={{ scale: 0.9, opacity: 0, y: 10 }}
                       animate={{ scale: 1, opacity: 1, y: 0 }}
                       className={`p-6 rounded-[35px] text-sm font-bold shadow-xl border ${
                         msg.role === 'user' 
                         ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent shadow-blue-500/20 text-white rounded-tr-none' 
                         : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-white/50 dark:border-white/5 text-slate-900 dark:text-white rounded-tl-none'
                       }`}
                     >
                       {msg.content}
                     </motion.div>
                     
                     {msg.actionCard && !hasStructuredCards && <ActionCard card={msg.actionCard} />}
                     
                     <p className={`text-[8px] font-black text-slate-400 uppercase tracking-widest px-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                  </div>
               </div>
             );
           })}

           {isThinking && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex justify-start items-start gap-4"
             >
                <div className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-white/5 rounded-[35px] rounded-tl-none shadow-xl space-y-3">
                   <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(d => (
                           <motion.div 
                             key={d}
                             animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                             transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                             className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                           />
                        ))}
                      </div>
                      <span className="text-[10px] font-black italic uppercase tracking-widest text-blue-600">UAssist is thinking...</span>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest animate-pulse transition-all">
                     {thinkingText}
                   </p>
                </div>
             </motion.div>
           )}
        </div>

        {/* QUICK ACTIONS & INPUT */}
        <div className="p-8 space-y-6 border-t border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl relative z-10">
           {/* QUICK ACTIONS ROW */}
           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {QUICK_ACTIONS.map(action => (
                <button 
                  key={action.id}
                  onClick={() => setInputValue(action.prefill)}
                  className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md active:scale-95 group"
                >
                  <span className="text-sm group-hover:scale-125 transition-transform text-slate-400 group-hover:text-blue-600">{action.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                </button>
              ))}
           </div>

           {/* INPUT BAR */}
           <div className="relative group/input">
              <div className="absolute inset-0 bg-blue-600/10 blur-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-[30px]" />
              <div className="relative flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-2 border-slate-200/50 dark:border-white/5 rounded-[30px] p-2 pr-4 focus-within:border-blue-500 focus-within:shadow-lg transition-all shadow-sm">
                 <button 
                   onMouseDown={() => setIsVoiceActive(true)}
                   onMouseUp={() => setIsVoiceActive(false)}
                   className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                     isVoiceActive ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-blue-600'
                   }`}
                 >
                   <Mic size={20} />
                 </button>
                 
                 <div className="flex-1 flex items-center">
                    {isVoiceActive ? (
                      <div className="flex items-center gap-1.5 h-12 w-full px-4 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                           <motion.div 
                             key={i}
                             animate={{ height: [10, Math.random() * 30 + 10, 10] }}
                             transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                             className="w-1 bg-red-500 rounded-full"
                           />
                        ))}
                      </div>
                    ) : (
                      <input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask UAssist anything..." 
                        className="w-full bg-transparent outline-none px-4 font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                    )}
                 </div>

                 <button 
                   onClick={handleSend}
                   disabled={!inputValue.trim()}
                   className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                     inputValue.trim() ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 active:scale-95' : 'bg-slate-100 dark:bg-white/5 text-slate-300'
                   }`}
                 >
                   <Send size={20} className={inputValue.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                 </button>
              </div>
           </div>
           
           {/* SOFT PAYWALL (Now an absolute overlay) */}
           <AnimatePresence>
             {queryCount >= queryLimit && !isPremium && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/60 rounded-[40px]"
               >
                 <motion.div 
                   initial={{ y: 20, scale: 0.9, opacity: 0 }}
                   animate={{ y: 0, scale: 1, opacity: 1 }}
                   className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-[30px] space-y-6 text-center shadow-2xl border-2 border-blue-500/30 w-full max-w-sm"
                 >
                    <div className="space-y-2">
                      <h4 className="text-xl font-black italic uppercase tracking-tighter">Query Limit Reached 😔</h4>
                      <p className="text-[10px] font-bold text-slate-400">KU Free users get 10 high-speed AI queries per day.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">Go KU Prime ₹49</button>
                       <button onClick={() => setIsOpen(false)} className="py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Maybe Tomorrow</button>
                    </div>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
