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
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { useUserUAssist } from '@/context/user/UserUAssistContext';
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
  } = useUserUAssist();

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
    <div className="fixed inset-0 z-[1100] flex flex-col items-center justify-center p-4 md:p-8 perspective-1000">
      {/* Heavy Backdrop */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#020617]/80"
      />

      {/* Main Holographic Island */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10, y: 40 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: -10, y: 40 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, mass: 0.8 }}
        className="relative w-full max-w-4xl mx-auto h-[90vh] max-h-[900px] flex flex-col z-10"
      >
         {/* Animated Border Wrapper (Conic Gradient illusion) */}
         <div className="absolute inset-0 rounded-[44px] bg-gradient-to-br from-indigo-500/40 via-purple-500/10 to-pink-500/40 opacity-70 animate-[pulse_3s_ease-in-out_infinite]" />
         <div className="absolute inset-[-2px] rounded-[46px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-[pulse_4s_ease-in-out_infinite]" />

         {/* Inner Glass Container */}
         <div className="relative flex-1 m-[2px] rounded-[42px] bg-white/70 dark:bg-[#0a0a14]/80 backdrop-blur-[40px] backdrop-saturate-200 border border-white/40 dark:border-white/10 flex flex-col overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.15)] dark:shadow-[0_0_120px_rgba(99,102,241,0.3)]">
            
            {/* Massive Ambient Orbs */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
            />
            <motion.div 
              animate={{ rotate: -360, scale: [1, 1.3, 1] }} 
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
            />

            {/* HEADER - THE AI CORE */}
            <div className="p-6 md:p-8 border-b border-white/20 dark:border-white/5 relative z-20 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  {/* The AI Core Orb */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                     <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-indigo-500 rounded-full blur-md"
                     />
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-4px] rounded-full border border-indigo-400/30 border-dashed"
                     />
                     <div className="relative w-12 h-12 bg-gradient-to-br from-white to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-full border border-white dark:border-slate-700 shadow-inner flex items-center justify-center z-10 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400 relative z-10" />
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 leading-none">UAssist Core</h3>
                     <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                           <span className="text-indigo-600 dark:text-indigo-400">{activeContext.icon}</span>
                           <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{activeContext.label}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sys_Ready</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  {!isPremium && (
                    <div className="hidden md:flex flex-col items-end mr-4">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Compute Limit</span>
                       <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(queryCount/queryLimit)*100}%` }}
                               className={`h-full ${queryCount >= queryLimit ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]'}`}
                             />
                          </div>
                          <span className={`text-[10px] font-black ${queryCount >= queryLimit ? 'text-red-500' : 'text-indigo-500'}`}>{queryCount}/{queryLimit}</span>
                       </div>
                    </div>
                  )}
                  <button className="w-12 h-12 bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-white/60 dark:border-white/10 hover:scale-105 active:scale-95"><History size={20} /></button>
                  <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white transition-all shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-white/60 dark:border-white/10 hover:scale-105 active:scale-95"><X size={20} /></button>
               </div>
            </div>

            {/* CHAT MESSAGES AREA */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth relative z-10 scrollbar-none">
               {messages.map((msg, i) => {
                 const isAi = msg.role === 'ai';
                 const hasStructuredCards = isAi && ['food_cards', 'event_cards', 'stationery_cards', 'product_cards', 'REPORT', 'NAVIGATE'].includes(msg.type);
     
                 if (hasStructuredCards) {
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        key={msg.id}
                      >
                        <UAssistMessage message={msg} />
                      </motion.div>
                    );
                 }

                 return (
                   <motion.div 
                     key={msg.id} 
                     initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: msg.role === 'user' ? 'bottom right' : 'bottom left' }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                     className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                   >
                      <div className="max-w-[85%] space-y-2">
                         <div className={`p-6 text-sm font-bold shadow-2xl relative group ${
                             msg.role === 'user' 
                             ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-[30px] rounded-br-md shadow-indigo-500/30' 
                             : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-white/10 text-slate-900 dark:text-white rounded-[30px] rounded-bl-md shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none'
                           }`}
                         >
                           {/* AI Accent Glow */}
                           {isAi && (
                             <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-full opacity-50" />
                           )}
                           <span className="relative z-10">{msg.content}</span>
                         </div>
                         
                         {msg.actionCard && !hasStructuredCards && <ActionCard card={msg.actionCard} />}
                         
                         <p className={`text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                      </div>
                   </motion.div>
                 );
               })}

               {isThinking && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="flex justify-start items-start gap-4"
                 >
                    <div className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[30px] rounded-bl-md shadow-xl space-y-4 relative overflow-hidden">
                       <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-500 animate-pulse" />
                       <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map(d => (
                               <motion.div 
                                 key={d}
                                 animate={{ height: [6, 16, 6], backgroundColor: ["#6366f1", "#a855f7", "#6366f1"] }}
                                 transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2, ease: "easeInOut" }}
                                 className="w-1.5 rounded-full"
                               />
                            ))}
                          </div>
                          <span className="text-xs font-black italic uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Processing...</span>
                       </div>
                       <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                         {thinkingText}
                       </p>
                    </div>
                 </motion.div>
               )}
            </div>

            {/* FLOATING COMMAND DECK */}
            <div className="p-4 md:p-8 relative z-20">
               <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-[50px] backdrop-saturate-200 border border-white/50 dark:border-white/10 rounded-[40px] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                 
                 {/* QUICK ACTIONS ROW (Floating inside the deck) */}
                 <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none px-2">
                    {QUICK_ACTIONS.map((action, i) => (
                      <motion.button 
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setInputValue(action.prefill)}
                        className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-colors duration-500" />
                        <span className="text-sm group-hover:scale-110 transition-transform text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 relative z-10">{action.icon}</span>
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white relative z-10">{action.label}</span>
                      </motion.button>
                    ))}
                 </div>

                 {/* MASSIVE INPUT FIELD */}
                 <div className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-0 group-focus-within/input:opacity-30 transition-opacity duration-700 rounded-[32px]" />
                    <div className="relative flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 rounded-[32px] p-2 pr-4 focus-within:border-indigo-500 focus-within:shadow-[0_10px_40px_rgba(99,102,241,0.2)] transition-all duration-500">
                       <button 
                         onMouseDown={() => setIsVoiceActive(true)}
                         onMouseUp={() => setIsVoiceActive(false)}
                         className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all duration-300 ${
                           isVoiceActive ? 'bg-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-indigo-500/20'
                         }`}
                       >
                         <Mic size={22} />
                       </button>
                       
                       <div className="flex-1 flex items-center h-14">
                          {isVoiceActive ? (
                            <div className="flex items-center gap-1.5 w-full px-4 overflow-hidden h-full">
                              {[...Array(20)].map((_, i) => (
                                 <motion.div 
                                   key={i}
                                   animate={{ height: [8, Math.random() * 40 + 8, 8] }}
                                   transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.03 }}
                                   className="w-1.5 bg-gradient-to-t from-red-600 to-red-400 rounded-full"
                                 />
                              ))}
                            </div>
                          ) : (
                            <input 
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                              placeholder="Command UAssist..." 
                              className="w-full h-full bg-transparent outline-none px-4 font-black text-base md:text-lg text-slate-900 dark:text-white placeholder:text-slate-400/70 transition-colors duration-500"
                            />
                          )}
                       </div>

                       <button 
                         onClick={handleSend}
                         disabled={!inputValue.trim()}
                         className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all duration-500 ${
                           inputValue.trim() 
                           ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.5)] active:scale-90 hover:shadow-[0_10px_40px_rgba(99,102,241,0.7)] hover:scale-105' 
                           : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600'
                         }`}
                       >
                         <Send size={20} className={inputValue.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                       </button>
                    </div>
                 </div>
               </div>
            </div>
            
            {/* PAYWALL */}
            <AnimatePresence>
              {queryCount >= queryLimit && !isPremium && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 rounded-[40px] transition-colors duration-500"
                >
                  <motion.div 
                    initial={{ y: 40, scale: 0.9, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="bg-white/90 dark:bg-[#0a0a14]/90 backdrop-blur-xl text-slate-900 dark:text-white p-10 rounded-[40px] space-y-8 text-center shadow-[0_20px_100px_rgba(0,0,0,0.2)] border border-white/50 dark:border-white/10 w-full max-w-md relative overflow-hidden"
                  >
                     <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                     <div className="space-y-3">
                       <h4 className="text-2xl font-black italic uppercase tracking-tighter">Compute Limit Reached</h4>
                       <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">KU Free users are allocated 10 high-speed neural queries per day to conserve server bandwidth.</p>
                     </div>
                     <div className="grid gap-4">
                        <button className="w-full py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl text-[11px] text-white font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-95">Upgrade to KU Prime (₹49/mo)</button>
                        <button onClick={() => setIsOpen(false)} className="w-full py-5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 text-slate-600 dark:text-slate-300 hover:scale-[1.02] active:scale-95 border border-transparent dark:hover:border-white/10">Return to Dashboard</button>
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
