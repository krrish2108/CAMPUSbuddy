import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ThumbsUp, 
  MessageSquare, 
  ShieldAlert,
  ChevronRight,
  Maximize2,
  RefreshCcw,
  Star,
  Wrench,
  Activity,
  Check
} from 'lucide-react';
import { useProblemBox } from '@/context/ProblemBoxContext';

export default function StudentTicketTracker({ ticket }) {
  const { upvoteTicket, reopenTicket } = useProblemBox();

  if (!ticket) return null;

  const progressVal = ticket.progress ?? (ticket.status === 'Resolved' ? 100 : ticket.status === 'InProgress' ? 60 : 15);
  const isSolved = ticket.status === 'Resolved' || progressVal === 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div className="space-y-1">
           <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">{ticket.title}</h3>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Clock size={14} className="text-red-500" /> {ticket.location} • #{ticket.id}
           </p>
         </div>
         <div className="flex items-center gap-3">
           {isSolved ? (
             <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-md">
               <CheckCircle2 size={15} /> Verified Solved
             </span>
           ) : (
             <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 flex items-center gap-1.5 ${
               ticket.priority === 'Critical' ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse' :
               ticket.priority === 'High' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
               'bg-blue-500/10 border-blue-500 text-blue-500'
             }`}>
               <ShieldAlert size={14} /> Priority: {ticket.priority}
             </span>
           )}
         </div>
      </div>

      {/* ============================================================== */}
      {/* LIVE RESOLUTION PROGRESS Meter (Updated by Admin)             */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[35px] p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              isSolved ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-red-600 shadow-red-500/30'
            }`}>
              {isSolved ? <Check size={26} /> : <Activity size={26} className="animate-pulse" />}
            </div>
            <div>
              <h4 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
                {isSolved ? 'Issue Verified & Solved by Admin' : 'Live Resolution Progress'}
              </h4>
              <p className="text-xs font-extrabold text-slate-400 mt-0.5">
                {isSolved ? 'Field maintainer reported 100% resolution completion.' : `Status synced with Administrative Triage Command: ${progressVal}% Completed`}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-2xl font-mono font-black text-sm border shadow-sm ${
            isSolved ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10'
          }`}>
            {progressVal}% SOLVED
          </span>
        </div>

        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden p-0.5 border border-slate-200/80 dark:border-white/5 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressVal}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-xl transition-all ${
              isSolved 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50' 
                : 'bg-gradient-to-r from-red-500 via-orange-500 to-amber-500'
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 pt-1 px-1">
          <span>0% Ticket Raised</span>
          <span>40% Specialist Dispatched</span>
          <span>75% Field Repair</span>
          <span className={isSolved ? 'text-emerald-500 font-extrabold' : ''}>100% Solved ✓</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        {/* TIMELINE SECTION */}
        <div className="lg:col-span-1 space-y-6">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-3 pl-1">Tracking Timeline</h4>
           <div className="relative pl-8 space-y-8 pt-2">
             {/* Vertical Line */}
             <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-white/10" />
             
             {(ticket.timeline || []).map((step, idx) => (
               <div key={idx} className="relative">
                 <div className={`absolute -left-8 top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                   step.completed || isSolved
                    ? 'bg-red-600 border-white dark:border-slate-900 text-white shadow-lg shadow-red-500/20' 
                    : step.active 
                    ? 'bg-white dark:bg-slate-900 border-red-600 text-red-600 animate-pulse'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-300'
                 }`}>
                   {(step.completed || isSolved) ? <CheckCircle2 size={15} /> : <Circle size={8} fill="currentColor" />}
                 </div>
                 <div className="space-y-0.5">
                   <p className={`text-xs font-black uppercase tracking-widest ${step.active || isSolved ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'}`}>{step.step}</p>
                   <p className="text-[10px] font-bold text-slate-400">{isSolved && step.step === 'Resolved' ? 'Verified Today' : step.time}</p>
                 </div>
               </div>
             ))}
           </div>

           {ticket.status === 'Assigned' && !isSolved && (
             <div className="mt-8 p-6 bg-slate-900 dark:bg-slate-800 rounded-[30px] text-white shadow-xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70 flex items-center gap-1.5"><Clock size={13}/> Live ETA Projection</p>
                <h4 className="text-3xl font-black italic uppercase tracking-tight text-red-500">{ticket.eta || '2 Hours'}</h4>
             </div>
           )}
        </div>

        {/* DETAILS SECTION */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200/80 dark:border-white/10 border-l-8 border-l-red-600 shadow-xl space-y-4">
             <div className="flex items-center gap-3">
               <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${ticket.officialResponse ? 'bg-amber-500 shadow-amber-500/25' : 'bg-red-600 shadow-red-600/25'}`}>
                 <MessageSquare size={20} />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                 {ticket.officialResponse ? '📣 Official Admin Reply' : '🤖 UAssist AI Triage Report'}
               </h3>
             </div>
             <p className="text-sm font-bold leading-relaxed italic text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
               &quot;{ticket.officialResponse || ticket.aiSummary || 'Your report has been logged and queued for facility maintenance review.'}&quot;
             </p>
           </div>

           {/* MEDIA SECTION */}
           <div className="space-y-3">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Attached Photographic Evidence</h4>
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
               {ticket.media && ticket.media.length > 0 ? ticket.media.map((img, i) => (
                 <div key={i} className="flex-shrink-0 w-64 h-44 rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-white/10 group cursor-pointer shadow-md">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Evidence" />
                 </div>
               )) : (
                 <div className="w-full h-28 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 text-xs font-black uppercase tracking-widest">
                   No Media Attached by Reporter
                 </div>
               )}
             </div>
           </div>

           {/* UPVOTE SECTION */}
           <div className="p-8 bg-slate-900 dark:bg-slate-950 rounded-[40px] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl border border-white/5">
             <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                 <ThumbsUp size={26} fill="currentColor" />
               </div>
               <div>
                 <p className="text-2xl font-black tracking-tight italic uppercase">{ticket.upvotes || 1} Campus Students</p>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-0.5">Have confirmed this issue</p>
               </div>
             </div>
             <button 
               onClick={() => upvoteTicket(ticket.id)}
               className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                 ticket.hasUpvoted 
                 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                 : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/30 active:scale-95'
               }`}
             >
               {ticket.hasUpvoted ? '✓ Upvoted by You' : '+ I Have This Too'}
             </button>
           </div>

           {/* RESOLUTION VERIFIED BOX */}
           {isSolved && (
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-emerald-500/10 dark:bg-emerald-500/[0.07] p-8 sm:p-10 rounded-[45px] border-2 border-emerald-500/30 text-center space-y-6 shadow-xl"
             >
               <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/40 rotate-3">
                 <CheckCircle2 size={42} />
               </div>
               <div className="space-y-2 max-w-lg mx-auto">
                 <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">Official Triage Closure</span>
                 <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight pt-1">
                   Resolved by {ticket.resolution?.solvedBy || 'Campus Maintenance Team'}
                 </h4>
                 <p className="text-sm font-extrabold text-slate-600 dark:text-slate-300 italic leading-relaxed pt-1">
                   &quot;{ticket.resolution?.desc || 'Issue inspected on field and permanently repaired after multi-point verification.'}&quot;
                 </p>
                 <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest pt-2">
                   ⏱ Total Turnaround: {ticket.resolution?.duration || '1 Hour 30 Mins'}
                 </p>
               </div>
               
               <div className="flex flex-col items-center gap-2 pt-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate maintainer speed & quality</p>
                 <div className="flex gap-2 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill="currentColor" className="cursor-pointer hover:scale-125 transition-transform" />)}
                 </div>
               </div>

               <div className="pt-6 border-t border-emerald-500/20">
                 <button 
                   onClick={() => reopenTicket(ticket.id)}
                   className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                 >
                   <RefreshCcw size={15} /> Issue Persisting? Reopen Complaint
                 </button>
               </div>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
