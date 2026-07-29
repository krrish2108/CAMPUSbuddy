import { useState, useContext, useEffect, useRef } from 'react';
import { ThemeContext } from '@/pages/_app';
import { 
  X, Camera, User, School, BookOpen, Smartphone, Hash, 
  Plus, Check, Loader2, AlertCircle, FileText, Download, Trash2,
  Settings, Award, Sparkles, GraduationCap
} from 'lucide-react';

const SUGGESTED_SKILLS = ['React', 'Next.js', 'Python', 'JavaScript', 'UI/UX Design', 'Tailwind CSS', 'Java', 'Data Structures', 'Machine Learning'];

export default function EditProfileModal({ isOpen, onClose }) {
  const { userProfile, updateProfile } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('identity');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Local Form Stata
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
        size: (file.size / 1024).toFixed(1) + ' KB'
      };
      handleInputChange('certificates', [...currentCerts, newCert]);
    }
  };

  const removeCert = (id) => {
    const currentCerts = formData.certificates || [];
    handleInputChange('certificates', currentCerts.filter(c => c.id !== id));
  };

  const handleClose = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="min-h-screen w-full flex items-start justify-center p-4 md:p-8"
        onClick={handleClose}
      >
        {/* Modal Card */}
        <div 
          className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-[32px] md:rounded-[40px] shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 flex flex-col mt-12 mb-12"
          onClick={(e) => e.stopPropagation()}
        >
        
        {/* Header */}
        <div className="p-8 pb-0 flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-3xl bg-[#1A56DB] flex items-center justify-center text-white text-4xl font-black shadow-xl overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  formData.name?.charAt(0) || 'U'
                )}
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-white"
              >
                <Camera size={24} />
              </div>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div>
              <h2 className="font-syne font-black text-3xl text-slate-900 dark:text-white tracking-tighter">Edit Profile</h2>
              <p className="text-sm font-medium text-gray-400 mt-1">Manage your identity and credentials</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 px-8 mt-8 border-b border-gray-100 dark:border-white/5">
           {[
             { id: 'identity', label: 'Identity', icon: User },
             { id: 'skills', label: 'Skills', icon: Sparkles },
             { id: 'certs', label: 'Certificates', icon: Award }
           ].map(tab => (
             <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all relative ${activeTab === tab.id ? 'text-[#1A56DB] dark:text-blue-400' : 'text-gray-400 hover:text-gray-600'}`}
             >
               <tab.icon size={16} />
               {tab.label}
               {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A56DB] dark:bg-blue-400 rounded-full" />}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
           
           {/* Tab: Identity */}
           {activeTab === 'identity' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="group relative">
                    <label className="absolute -top-2 left-4 bg-white dark:bg-slate-950 px-2 text-[10px] font-black uppercase tracking-widest text-blue-500 z-10">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><User size={18} /></div>
                      <input 
                        type="text" 
                        className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:text-white"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Dept Input */}
                  <div className="group relative">
                    <label className="absolute -top-2 left-4 bg-white dark:bg-slate-950 px-2 text-[10px] font-black uppercase tracking-widest text-blue-500 z-10">Department</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><School size={18} /></div>
                      <input 
                        type="text" 
                        className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:text-white"
                        value={formData.dept}
                        onChange={(e) => handleInputChange('dept', e.target.value)}
                      />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <label className="absolute -top-2 left-4 bg-white dark:bg-slate-950 px-2 text-[10px] font-black uppercase tracking-widest text-blue-500 z-10">College ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Hash size={18} /></div>
                      <input 
                        type="text" 
                        className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:text-white font-mono"
                        value={formData.collegeId}
                        onChange={(e) => handleInputChange('collegeId', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="group relative">
                    <label className="absolute -top-2 left-4 bg-white dark:bg-slate-950 px-2 text-[10px] font-black uppercase tracking-widest text-blue-500 z-10">Semester</label>
                    <select 
                      value={formData.semester} 
                      onChange={(e) => handleInputChange('semester', e.target.value)}
                      className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:text-white appearance-none cursor-pointer font-bold"
                    >
                      {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => (
                        <option key={s} value={s}>{s} Semester</option>
                      ))}
                    </select>
                  </div>
               </div>

               <div className="group relative">
                <label className="absolute -top-2 left-4 bg-white dark:bg-slate-950 px-2 text-[10px] font-black uppercase tracking-widest text-blue-500 z-10">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Smartphone size={18} /></div>
                  <input 
                    type="tel" 
                    className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:text-white"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
             </div>
           )}

           {/* Tab: Skills */}
           {activeTab === 'skills' && (
             <div className="animate-in fade-in duration-300 space-y-8">
                <div className="group relative">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Add Skills (Press Enter)</label>
                   <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Type a skill..."
                        className="block w-full px-5 py-5 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:text-white"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill(skillInput)}
                      />
                      <button 
                        onClick={() => addSkill(skillInput)}
                        className="absolute right-3 top-3 bottom-3 px-4 rounded-2xl bg-[#1A56DB] text-white flex items-center gap-2 text-xs font-black"
                      >
                        ADD
                      </button>
                   </div>
                </div>

                <div className="flex flex-wrap gap-3">
                   {(formData.skills || []).map(skill => (
                     <div key={skill} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center gap-2 group animate-in zoom-in duration-300">
                        <span className="text-sm font-black">{skill}</span>
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                     </div>
                   ))}
                   {(!formData.skills || formData.skills.length === 0) && (
                     <p className="text-sm text-gray-400 font-medium">No skills added yet.</p>
                   )}
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Suggested for you</p>
                   <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SKILLS.filter(s => !(formData.skills || []).includes(s)).map(s => (
                        <button 
                          key={s} 
                          onClick={() => addSkill(s)}
                          className="px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/10 text-xs font-bold text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all active:scale-95"
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
             <div className="animate-in fade-in duration-300 space-y-6">
                <div 
                  onClick={() => certInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-500/5 transition-all group cursor-pointer"
                >
                   <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                      <Award size={32} />
                   </div>
                   <div className="text-center">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Upload Certification</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">PDF or image, max 5MB</p>
                   </div>
                   <input ref={certInputRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleCertUpload} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {(formData.certificates || []).map(cert => (
                     <div key={cert.id} className="p-4 rounded-[28px] border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 flex items-center justify-between group animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <FileText size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">{cert.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{cert.date} · {cert.size}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors"><Download size={18} /></button>
                           <button onClick={() => removeCert(cert.id)} className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

        </div>

        {/* Footer */}
        <div className="p-8 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-transparent">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
             {isDirty && <><AlertCircle size={14} className="text-blue-500" /> Unsaved changes</>}
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={handleClose}
                className="px-6 py-4 rounded-2xl text-sm font-black text-gray-400 hover:text-gray-600 transition-colors"
              >
                CANCEL
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading || !isDirty}
                className="px-10 py-4 rounded-2xl bg-[#1A56DB] text-white text-sm font-black flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <><Check size={20} /> SAVE CHANGES</>}
              </button>
           </div>
        </div>

      </div>
    </div>
  </div>
);
}
