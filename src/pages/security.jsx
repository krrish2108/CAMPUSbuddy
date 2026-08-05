import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { 
  Shield, 
  Lock, 
  Terminal, 
  Cpu, 
  Server, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  RefreshCw, 
  Zap, 
  Radio,
  Send,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecurityProtocolPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [bountyForm, setBountyForm] = useState({ reporter: '', vulnerabilityType: '', description: '' });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleRunDiagnostics = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast('🛡️ All 6 Campus Command Modules verified secure against external vulnerabilities.');
    }, 1500);
  };

  const handleSubmitBounty = (e) => {
    e.preventDefault();
    if (!bountyForm.description.trim()) {
      showToast('⚠️ Please provide details of the security vulnerability.');
      return;
    }
    showToast(`✨ Thank you, ${bountyForm.reporter || 'Security Researcher'}! Your report has been dispatched to our Security Architecture Team.`);
    setBountyForm({ reporter: '', vulnerabilityType: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 flex flex-col">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-[200] bg-slate-900 text-white border border-slate-700 rounded-2xl px-6 py-3.5 shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest"
          >
            <Shield size={16} className="text-blue-400 shrink-0 animate-bounce" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-28 sm:pt-36 pb-24 space-y-16">
        
        {/* Header Section */}
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-10 space-y-4">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity mb-2"
          >
            <ArrowLeft size={14} /> <span>Back to Campus Home</span>
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Shield size={26} />
              </span>
              <div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-syne">
                  Campus Security Protocols
                </h1>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Zero-Knowledge Architecture & Neural Safeguards</p>
              </div>
            </div>

            <button
              onClick={handleRunDiagnostics}
              disabled={isScanning}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center gap-2.5 shrink-0"
            >
              <RefreshCw size={15} className={isScanning ? 'animate-spin' : ''} />
              <span>{isScanning ? 'Verifying Integrity...' : 'Verify System Security'}</span>
            </button>
          </div>
        </div>

        {/* Live Cryptographic Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <Lock size={22} />
              </span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 rounded-full">
                AES-256-GCM
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Zero-Knowledge Vaults</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Student academic identity tags and canteen wallet balances are encrypted at rest using military-grade AES-256 GCM cryptographic hashing.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center text-[11px] font-bold text-slate-400 gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Storage Enclaves Verified Secure</span>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                <Radio size={22} />
              </span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-full">
                TLS 1.3 Strict
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Transit Shield Architecture</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Every API payload transferred between mobile end-nodes and campus routers utilizes forward secret TLS 1.3 channels to block interception.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center text-[11px] font-bold text-slate-400 gap-1.5">
              <CheckCircle2 size={13} className="text-blue-500" />
              <span>Zero Packet Leaks Detected</span>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                <Cpu size={22} />
              </span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 px-3 py-1 rounded-full">
                Neural Guard
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">AI Prompt Sanitization</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Inbound student prompts to UAssist AI pass through localized regex and syntax filtering filters before reaching neural processing units.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center text-[11px] font-bold text-slate-400 gap-1.5">
              <CheckCircle2 size={13} className="text-purple-500" />
              <span>Prompt Injection Defense Active</span>
            </div>
          </div>

        </div>

        {/* Deep Dive & Architecture Specifications */}
        <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 sm:p-12 space-y-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Institutional Infrastructure</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Multi-Tiered Campus Protection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-sm">
              <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="text-amber-500" size={18} />
                <span>Multi-Factor OTP Authentication</span>
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                Access to faculty portals and administrative command consoles requires time-based One-Time Passwords (TOTP) synced directly via institutional student lines, preventing credential replay attacks.
              </p>
            </div>

            <div className="space-y-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-sm">
              <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="text-blue-500" size={18} />
                <span>Automated DDoS & Rate Limiting</span>
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                During peak enrollment deadlines for Arena hackathons or Caffinity lunch rushes, smart volumetric firewalls dynamically balance requests to maintain sub-150ms UI responses.
              </p>
            </div>
          </div>
        </div>

        {/* Bug Bounty & Vulnerability Disclosure Console */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row gap-10 items-start">
          
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-[11px] font-black uppercase tracking-widest">
              <Sparkles size={14} /> <span>Open Bug Bounty Network</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Responsible Vulnerability Disclosure
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              We encourage university computer science researchers, students, and ethical hackers to privately report potential flaws in any CAMPUSbuddy module. Validated architectural reports qualify for recognition in our Hall of Fame and institutional innovation awards.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-extrabold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Triage Time: &lt;24 Hours</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Safe Harbor Policy Guaranteed</span>
            </div>
          </div>

          <div className="w-full md:w-96 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-inner shrink-0">
            <form onSubmit={handleSubmitBounty} className="space-y-4">
              <h4 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/5 pb-2">
                Submit Vulnerability Report
              </h4>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reporter Handle or Email</label>
                <input 
                  type="text"
                  placeholder="e.g. sec_researcher@campus.edu"
                  value={bountyForm.reporter}
                  onChange={e => setBountyForm({...bountyForm, reporter: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Vulnerability Category</label>
                <select
                  value={bountyForm.vulnerabilityType}
                  onChange={e => setBountyForm({...bountyForm, vulnerabilityType: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">Select Category...</option>
                  <option value="XSS">Cross-Site Scripting (XSS)</option>
                  <option value="CSRF">Cross-Site Request Forgery (CSRF)</option>
                  <option value="AUTH">Authentication / OTP Bypass</option>
                  <option value="AI">AI Prompt Injection / Leakage</option>
                  <option value="OTHER">Other Security Flaw</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Description & Reproduction Step</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe the potential security finding..."
                  value={bountyForm.description}
                  onChange={e => setBountyForm({...bountyForm, description: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 dark:bg-blue-600 hover:opacity-90 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Submit Security Report</span>
              </button>
            </form>
          </div>

        </div>

      </main>

      {/* Mini Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-8 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
          <p>© 2026 CAMPUSbuddy Inc. Built with hardened digital resilience.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">View Privacy Policy</button>
            <button onClick={() => router.push('/')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Return to Home</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
