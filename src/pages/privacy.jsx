import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  UserCheck, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Server, 
  Key,
  Mail,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const sections = [
    { id: 'overview', title: '1. Executive Privacy Overview', icon: ShieldCheck },
    { id: 'data-collection', title: '2. Student Telemetry & Data', icon: Database },
    { id: 'ai-privacy', title: '3. UAssist AI & Neural Privacy', icon: EyeOff },
    { id: 'payment-sec', title: '4. Caffinity Dining Security', icon: Lock },
    { id: 'your-rights', title: '5. Student Data Governance & Rights', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 flex flex-col">
      <Navbar />

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-[200] bg-slate-900 text-white border border-slate-700 rounded-2xl px-6 py-3.5 shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest"
          >
            <ShieldCheck size={16} className="text-emerald-400 shrink-0 animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-28 sm:pt-36 pb-24">
        
        {/* Header */}
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-10 mb-12 space-y-4">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity mb-2"
          >
            <ArrowLeft size={14} /> <span>Back to Campus Home</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Lock size={24} />
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-syne">
              Student Privacy Policy & Data Governance
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Effective Date: Academic Year 2026–2027. CAMPUSbuddy is engineered with a strict zero-surveillance philosophy, guaranteeing that your university lifecycle remains secure, confidential, and fully within your control.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-4 sticky top-28">
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 rounded-3xl p-5 space-y-2 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1">Policy Sections</p>
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-left transition-all ${
                      activeSection === sec.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{sec.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Data Control Widget */}
            <div className="bg-blue-600 dark:bg-slate-900 text-white border border-blue-500/30 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <h4 className="font-black text-base flex items-center gap-2">
                <FileText size={18} className="text-emerald-300" />
                <span>Student Telemetry Export</span>
              </h4>
              <p className="text-xs font-semibold text-blue-100 dark:text-slate-300 leading-relaxed">
                In compliance with educational privacy regulations, any enrolled student can request a cryptographic dump of their recorded campus activities.
              </p>
              <button
                onClick={() => showToast('📥 Your encrypted account telemetry archive is being compiled and will be emailed to your student ID.')}
                className="w-full py-3 bg-white text-slate-900 hover:bg-blue-50 rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span>Request Telemetry Export</span>
              </button>
            </div>
          </div>

          {/* Content Area (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 min-h-[500px]">
            
            {activeSection === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <ShieldCheck className="text-blue-500" />
                  <span>1. Executive Privacy Overview</span>
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  At <strong>CAMPUSbuddy</strong>, we recognize that a university platform handles sensitive academic, financial, and personal location data. Our core architectural design rule is simple: <em>we only retain what is absolutely essential to operate campus services, and we delete or anonymize everything else immediately.</em>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-2">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Zero Ad-Tracking
                    </span>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      We never monetize, share, or broker student identification data to external advertising networks or commercial entities.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-2">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={14} /> End-to-End Cryptography
                    </span>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      All communications between the mobile client and campus servers utilize TLS 1.3 encryption with modern cipher suites.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'data-collection' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <Database className="text-blue-500" />
                  <span>2. Student Telemetry & Data Collection</span>
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  We categorize user telemetry into three strictly segmented governance classes to ensure maximum isolation between academic identity and daily dining or event records.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1">
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">Class A: Institutional Verification (Roll ID & Email)</h5>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">Required exclusively during initial campus login via institutional OAuth or authenticated OTP. Stored in encrypted vaults with strict administrative auditing.</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1">
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">Class B: Transaction & Queue Metadata</h5>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">Includes Caffinity order pick-up timestamps and Arena RSVP tokens. Automatically purged 30 days after course completion or meal pickup.</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1">
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">Class C: Ephemeral Mapping & GPS Coordinates</h5>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">Used solely when actively viewing the Campus Map or locating an emergency ProblemBox dispatch. Location coordinates are never persisted to persistent hard drives.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'ai-privacy' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <EyeOff className="text-purple-500" />
                  <span>3. UAssist AI & Neural Privacy Protocols</span>
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our customized conversational copilot, <strong>UAssist AI</strong>, utilizes localized vector embeddings and real-time knowledge base lookups without compromising student confidentiality.
                </p>
                <ul className="space-y-3 font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
                  <li><strong>Zero Training on Student Inquiries:</strong> Your chat messages, academic questions, and personal schedule lookups are explicitly excluded from being used to train third-party foundation models.</li>
                  <li><strong>Session Anonymization:</strong> Prompts dispatched to neural processing layers are stripped of individual student names, roll numbers, and personal identifiers prior to inference.</li>
                  <li><strong>Instant Chat Erasure:</strong> Clicking "Clear Conversation" in the UAssist console instantly terminates all cached memory tokens for that active session across all clusters.</li>
                </ul>
              </motion.div>
            )}

            {activeSection === 'payment-sec' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <Lock className="text-amber-500" />
                  <span>4. Caffinity Dining Security & Payment Processing</span>
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  Caffinity kitchen ordering utilizes tokenized verification to eliminate queue bottlenecks without exposing student payment instruments.
                </p>
                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-2">
                  <h5 className="font-black text-sm flex items-center gap-2">
                    <Key size={16} /> <span>Cryptographic Meal Verification (OTP)</span>
                  </h5>
                  <p className="text-xs font-semibold leading-relaxed opacity-90">
                    Each Caffinity order generates a dynamic, time-sensitive 4-digit verification token (e.g. #9142). Canteen vendors verify meal delivery solely against this secure hash—ensuring zero exposure of your credit cards, wallet balances, or student ID numbers during physical handover.
                  </p>
                </div>
              </motion.div>
            )}

            {activeSection === 'your-rights' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <UserCheck className="text-emerald-500" />
                  <span>5. Student Data Governance & Rights</span>
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every campus user maintains full unilateral rights over their personal digital footprint within the CAMPUSbuddy superapp ecosystem.
                </p>
                <div className="space-y-4 border-t border-slate-100 dark:border-white/5 pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h6 className="font-black text-sm text-slate-900 dark:text-white">Right to Permanent Deletion (Right to be Forgotten)</h6>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Upon graduation or account deregistration, all student identity tags, problem tickets, and dining histories can be wiped irreversibly within 24 hours upon formal submission.</p>
                    </div>
                    <button
                      onClick={() => showToast('ℹ️ Account deletion requests must be verified via your registered university email address.')}
                      className="px-4 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl font-black text-[11px] uppercase shrink-0 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Purge Data
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      </main>

      {/* Mini Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-8 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
          <p>© 2026 CAMPUSbuddy Inc. Engineered for secure student digital life.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/security')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">View Security Protocol</button>
            <button onClick={() => router.push('/')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Return to Home</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
