import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  UploadCloud, 
  Minus, 
  Plus, 
  CheckCircle2, 
  QrCode,
  Clock,
  History,
  Printer,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { useUserShopperz } from '@/context/user/UserShopperzContext';
import { PRINT_PRICING } from '@/data/shopperzData';

export default function PrintSection() {
  const { addPrintJob, printJobs } = useUserShopperz();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Settings
  const [colorMode, setColorMode] = useState('blackAndWhite');
  const [isDoubleSided, setIsDoubleSided] = useState(true);
  const [paperSize, setPaperSize] = useState('A4');
  const [copies, setCopies] = useState(1);
  const [priority, setPriority] = useState(false);

  // Estimation
  const pages = 14; // Mock page count detected from file
  const baseCost = pages * PRINT_PRICING[colorMode] * (isDoubleSided ? PRINT_PRICING.doubleSidedFactor : 1);
  const totalCost = (baseCost * copies) + (priority ? PRINT_PRICING.priorityFee : 0);

  const fileInputRef = React.useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
       setFile(uploadedFile);
    }
  };

  const submitJob = async () => {
    if (!file) return;
    const success = await addPrintJob({
      name: file.name,
      settings: { colorMode, isDoubleSided, paperSize, copies, priority },
      cost: totalCost,
      pages: pages,
      type: colorMode === 'color' ? 'color' : 'bw'
    });
    if (success) {
      setFile(null);
      alert("Print job submitted to queue! 🖨️");
    } else {
      alert("Failed to submit print job. Check your wallet balance.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
      
      {/* Upload & Settings */}
      <div className="lg:col-span-8 space-y-8">
        
        <div className="space-y-4">
           <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Cloud Print Queue</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Upload your PDFs and pick them up instantly at any campus print shop.</p>
        </div>

        {!file ? (
          <motion.div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f && f.type === 'application/pdf') setFile(f); }}
            animate={{ scale: isDragging ? 1.02 : 1, borderColor: isDragging ? '#EA580C' : '#CBD5E1' }}
            className={`h-80 rounded-[40px] border-4 border-dashed bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center text-center p-10 transition-all cursor-pointer group dark:border-white/10`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileUpload} 
            />
            <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mb-6">
               <UploadCloud size={32} className="text-orange-600" />
            </div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">Drag & drop your PDF here</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-10">Supported: PDF • Max 50MB • assignment_final.pdf</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[40px] border border-orange-600 shadow-2xl overflow-hidden"
          >
             <div className="bg-orange-600 p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <FileText size={24} />
                   </div>
                   <div>
                      <h4 className="font-black italic uppercase tracking-tighter text-lg leading-none truncate max-w-[200px]">{file.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">{pages} Pages detected</p>
                   </div>
                </div>
                <button onClick={() => setFile(null)} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20">Change</button>
             </div>

             <div className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"><Printer size={12} /> Color Mode</p>
                      <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                         <button onClick={() => setColorMode('blackAndWhite')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${colorMode === 'blackAndWhite' ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400'}`}>B&W</button>
                         <button onClick={() => setColorMode('color')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${colorMode === 'color' ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400'}`}>Color</button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"><Info size={12} /> Sides</p>
                      <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                         <button onClick={() => setIsDoubleSided(false)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isDoubleSided ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400'}`}>Single</button>
                         <button onClick={() => setIsDoubleSided(true)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDoubleSided ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400'}`}>Double</button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"><History size={12} /> Copies</p>
                      <div className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-1 rounded-2xl h-[54px] px-3">
                         <button onClick={() => setCopies(Math.max(1, copies - 1))} className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-500 shadow-sm"><Minus size={16} /></button>
                         <span className="font-syne font-black text-slate-900 dark:text-white">{copies}</span>
                         <button onClick={() => setCopies(copies + 1)} className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-500 shadow-sm"><Plus size={16} /></button>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 gap-6">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-orange-600/10 rounded-2xl flex items-center justify-center font-syne font-black text-orange-600">₹</div>
                      <div>
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Cost</h5>
                         <p className="text-2xl font-syne font-black text-slate-900 dark:text-white">₹{totalCost.toFixed(2)}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPriority(!priority)}>
                         <div className={`w-8 h-4 rounded-full p-1 transition-colors ${priority ? 'bg-orange-600' : 'bg-slate-300 dark:bg-white/10'}`}>
                            <motion.div animate={{ x: priority ? 16 : 0 }} className="w-2 h-2 bg-white rounded-full" />
                         </div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Zap size={10} className={priority ? 'text-orange-500' : ''} /> Priority Print (₹50)</p>
                      </div>
                      <button 
                        onClick={submitJob}
                        className="w-full md:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-all transform hover:-translate-y-1"
                      >
                         Send to Print Queue →
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

      </div>

      {/* Queue Sidebar */}
      <div className="lg:col-span-4 space-y-8">
         <div className="flex items-center justify-between px-2">
            <h4 className="text-[12px] font-black italic uppercase tracking-widest text-slate-900 dark:text-white">Current Queue</h4>
            <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">{printJobs.length} Jobs</div>
         </div>

         <div className="space-y-4">
            <AnimatePresence>
               {printJobs.map((job, i) => (
                 <motion.div 
                   key={job.id}
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[30px] p-6 shadow-xl space-y-4"
                 >
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1">{job.id}</p>
                          <h6 className="font-bold text-[11px] text-slate-900 dark:text-white line-clamp-1">{job.fileName}</h6>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                         job.status === 'Ready for Pickup' || job.status === 'Ready' ? 'bg-green-100 text-green-600 dark:bg-green-600/20' : 
                         job.status === 'Printing' ? 'bg-blue-100 text-blue-600 animate-pulse' : 
                         job.status === 'Completed' || job.status === 'Settled' ? 'bg-slate-100 text-slate-500 dark:bg-white/5 opacity-70' :
                         'bg-orange-100 text-orange-600 dark:bg-orange-600/20'
                       }`}>
                          {job.status === 'Completed' || job.status === 'Settled' ? 'Collected & Settled' : job.status}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-400" />
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             {job.status === 'Completed' || job.status === 'Settled' ? 'Done' :
                              job.status === 'Ready for Pickup' || job.status === 'Ready' ? 'NOW' : '3 mins'}
                          </p>
                       </div>
                       {job.status === 'Ready' || job.status === 'Ready for Pickup' ? (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-500/20"
                          >
                             <QrCode size={12} /> Scan QR
                          </motion.button>
                       ) : job.status === 'Completed' || job.status === 'Settled' ? (
                          <div className="flex items-center gap-2 opacity-50">
                             <CheckCircle2 size={12} className="text-slate-400" />
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
                          </div>
                       ) : (
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                             <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Processing</p>
                          </div>
                       )}
                    </div>
                 </motion.div>
               ))}
               
               {printJobs.length === 0 && (
                 <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[40px] space-y-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                       <Printer size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your queue is empty.</p>
                 </div>
               )}
            </AnimatePresence>
         </div>

         {/* Location Info */}
         <div className="p-6 bg-slate-900 text-white rounded-[35px] space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Collection Point</p>
                  <h6 className="font-syne font-black text-xs uppercase tracking-tight">Main Library • Floor G</h6>
               </div>
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">Present your pickup QR at the desk for zero-wait collection.</p>
         </div>
      </div>

    </div>
  );
}
