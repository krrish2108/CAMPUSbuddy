import { useState, useContext, useEffect, useRef } from 'react';
import { useUserProfile } from '@/context/user/UserProfileContext';
import { 
  X, Camera, User, School, Smartphone, Hash, 
  Check, Loader2, AlertCircle, FileText, Download, Trash2,
  Sparkles, Award, ChevronRight, Edit3
} from 'lucide-react';

const SUGGESTED_SKILLS = ['React', 'Next.js', 'Python', 'JavaScript', 'UI/UX Design', 'Tailwind CSS', 'Java', 'Data Structures', 'Machine Learning'];

export default function EditProfileModal({ isOpen, onClose }) {
  const { userProfile, updateProfile } = useUserProfile() || {};
  const [activeTab, setActiveTab] = useState('identity');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [expandedCertId, setExpandedCertId] = useState(null);
  
  // Local Form State
  const [formData, setFormData] = useState({
    name: '', dept: '', semester: '', phone: '', collegeId: '', course: '',
    skills: [], certificates: [], avatar: null
  });

  const [skillInput, setSkillInput] = useState('');
  const fileInputRef = useRef(null);
  const certInputRef = useRef(null);

  // Initialize
  useEffect(() => {
    if (isOpen && userProfile) {
      setFormData({ ...userProfile });
      setIsDirty(false);
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsLoading(false);
      setIsDirty(false);
      onClose();
    }, 1500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleInputChange('avatar', url);
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    const currentSkills = formData.skills || [];
    if (trimmed && !currentSkills.includes(trimmed)) {
      handleInputChange('skills', [...currentSkills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    const currentSkills = formData.skills || [];
    handleInputChange('skills', currentSkills.filter(s => s !== skill));
  };

  const handleCertUpload = (e) => {
    const file = e.target.files[0];
    const currentCerts = formData.certificates || [];
    if (file && currentCerts.length < 5) {
      const newCert = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString(),
        size: (file.size / 1024).toFixed(1) + ' KB',
        issuer: '',
        credentialId: ''
      };
      handleInputChange('certificates', [...currentCerts, newCert]);
      setExpandedCertId(newCert.id); // Auto-expand new cert to fill details
    }
  };

  const updateCertDetail = (id, field, value) => {
    const currentCerts = formData.certificates || [];
    const updated = currentCerts.map(c => c.id === id ? { ...c, [field]: value } : c);
    handleInputChange('certificates', updated);
  };

  const removeCert = (id) => {
    const currentCerts = formData.certificates || [];
    handleInputChange('certificates', currentCerts.filter(c => c.id !== id));
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-500">
      <div 
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
        onClick={handleClose}
      >
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-fuchsia-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        {/* Modal Card */}
        <div 
          className="relative w-full max-w-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[40px] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] border border-white/50 dark:border-white/10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        
        {/* Header Section */}
        <div className="relative pt-10 px-8 sm:px-12 pb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 overflow-hidden">
          {/* Subtle gradient banner at top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-fuchsia-500/20 opacity-50 blur-2xl" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 z-10 w-full">
            {/* Animated Avatar */}
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-[2rem] blur opacity-40 group-hover:opacity-75 transition duration-500 animate-tilt"></div>
              <div className="relative w-28 h-28 rounded-[30px] bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl overflow-hidden border-2 border-white/20">
                {formData.avatar ? (
                  <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  formData.name?.charAt(0) || 'U'
                )}
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[30px] flex items-center justify-center text-white backdrop-blur-sm"
              >
                <Camera size={28} className="animate-bounce" />
              </div>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
            
            <div className="text-center sm:text-left pt-2 flex-1">
              <h2 className="font-syne font-black text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                {formData.name || 'Edit Profile'}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Manage your campus identity & credentials
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-100/50 dark:bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:rotate-90 transition-all duration-300 z-10"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Fancy Pill Tabs */}
        <div className="px-8 sm:px-12 z-10">
          <div className="flex p-1.5 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl gap-1">
            {[
              { id: 'identity', label: 'Identity', icon: User },
              { id: 'skills', label: 'Skills', icon: Sparkles },
              { id: 'certs', label: 'Certificates', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all duration-500 ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 sm:px-12 py-8 min-h-[300px]">
           
           {/* Tab: Identity */}
           {activeTab === 'identity' && (
             <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="group relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 block ml-1">Full Name</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><User size={18} /></div>
                      <input 
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-900 dark:text-white outline-none"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Dept Input */}
                  <div className="group relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 block ml-1">Department</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><School size={18} /></div>
                      <input 
                        type="text" 
                        placeholder="e.g. Computer Science"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-900 dark:text-white outline-none"
                        value={formData.dept}
                        onChange={(e) => handleInputChange('dept', e.target.value)}
                      />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 block ml-1">College ID</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><Hash size={18} /></div>
                      <input 
                        type="text" 
                        placeholder="e.g. 24BCE10023"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono font-bold text-slate-900 dark:text-white outline-none tracking-wider"
                        value={formData.collegeId}
                        onChange={(e) => handleInputChange('collegeId', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="group relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 block ml-1">Semester</label>
                    <select 
                      value={formData.semester} 
                      onChange={(e) => handleInputChange('semester', e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900 dark:text-white outline-none cursor-pointer appearance-none"
                    >
                      {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => (
                        <option key={s} value={s}>{s} Semester</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-[34px] pointer-events-none text-slate-400">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
               </div>

               <div className="group relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 block ml-1">Phone Number</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><Smartphone size={18} /></div>
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-900 dark:text-white outline-none"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
             </div>
           )}

           {/* Tab: Skills */}
           {activeTab === 'skills' && (
             <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-8">
                <div className="group relative">
                   <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 block ml-1">Add Skills (Press Enter)</label>
                   <div className="relative flex items-center">
                      <input 
                        type="text" 
                        placeholder="Type a skill e.g., 'Figma'"
                        className="w-full pl-5 pr-24 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-900 dark:text-white outline-none"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill(skillInput)}
                      />
                      <button 
                        onClick={() => addSkill(skillInput)}
                        className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-xs font-black tracking-wider transition-colors"
                      >
                        ADD
                      </button>
                   </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                   {(formData.skills || []).map(skill => (
                     <div key={skill} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center gap-2 group animate-in zoom-in duration-300 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                        <span className="text-sm font-bold">{skill}</span>
                        <button onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-rose-500 transition-colors">
                          <X size={14} strokeWidth={3} />
                        </button>
                     </div>
                   ))}
                   {(!formData.skills || formData.skills.length === 0) && (
                     <p className="text-sm text-slate-400 font-medium italic w-full text-center py-4">No skills added yet. Add some above to stand out!</p>
                   )}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Suggested for you</p>
                   <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SKILLS.filter(s => !(formData.skills || []).includes(s)).map(s => (
                        <button 
                          key={s} 
                          onClick={() => addSkill(s)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                          + {s}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {/* Tab: Certificates */}
           {activeTab === 'certs' && (
             <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-6">
                <div 
                  onClick={() => certInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 dark:border-white/10 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all duration-300 group cursor-pointer bg-slate-50/50 dark:bg-slate-800/30"
                >
                   <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      <Award size={28} />
                   </div>
                   <div className="text-center">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Upload Certification</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">PDF or Image (Max 5MB)</p>
                   </div>
                   <input ref={certInputRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleCertUpload} />
                </div>

                <div className="space-y-3">
                   {(formData.certificates || []).map(cert => (
                     <div key={cert.id} className="border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 shadow-sm rounded-[24px] animate-in zoom-in-95 duration-300 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <FileText size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[200px]">{cert.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{cert.issuer || 'Unknown Issuer'} • {cert.date}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button onClick={() => setExpandedCertId(expandedCertId === cert.id ? null : cert.id)} className={`p-2 rounded-xl transition-colors ${expandedCertId === cert.id ? 'bg-indigo-500/10 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}><Edit3 size={18} /></button>
                             <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Download size={18} /></button>
                             <button onClick={() => removeCert(cert.id)} className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                        </div>
                        {expandedCertId === cert.id && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 animate-in slide-in-from-top-4 fade-in duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                               <div>
                                 <label className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-1 block ml-1">Issuing Organization</label>
                                 <input 
                                   type="text" 
                                   placeholder="e.g. Coursera, AWS"
                                   className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-xs font-semibold text-slate-900 dark:text-white outline-none"
                                   value={cert.issuer || ''}
                                   onChange={(e) => updateCertDetail(cert.id, 'issuer', e.target.value)}
                                 />
                               </div>
                               <div>
                                 <label className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-1 block ml-1">Credential ID</label>
                                 <input 
                                   type="text" 
                                   placeholder="e.g. UC-123456"
                                   className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-xs font-mono font-bold text-slate-900 dark:text-white outline-none tracking-wider"
                                   value={cert.credentialId || ''}
                                   onChange={(e) => updateCertDetail(cert.id, 'credentialId', e.target.value)}
                                 />
                               </div>
                               <div className="sm:col-span-2">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-1 block ml-1">Issue Date</label>
                                 <input 
                                   type="text" 
                                   placeholder="e.g. Aug 2024"
                                   className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-xs font-semibold text-slate-900 dark:text-white outline-none"
                                   value={cert.date || ''}
                                   onChange={(e) => updateCertDetail(cert.id, 'date', e.target.value)}
                                 />
                               </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <button onClick={() => setExpandedCertId(null)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black tracking-widest uppercase transition-colors">Done</button>
                            </div>
                          </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:px-12 sm:py-8 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm z-10">
           <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest order-2 sm:order-1">
             {isDirty && (
               <div className="flex items-center gap-2 animate-in fade-in zoom-in">
                 <AlertCircle size={14} className="text-amber-500" />
                 <span className="text-amber-500">Unsaved changes</span>
               </div>
             )}
           </div>
           <div className="flex items-center w-full sm:w-auto gap-4 order-1 sm:order-2">
              <button 
                onClick={handleClose}
                className="flex-1 sm:flex-none px-6 py-4 rounded-2xl text-sm font-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading || !isDirty}
                className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <><Check size={18} strokeWidth={3} /> SAVE CHANGES</>}
              </button>
           </div>
        </div>

        </div>
      </div>
    </div>
  );
}
