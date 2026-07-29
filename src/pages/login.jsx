import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeContext } from '@/pages/_app';
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, Sun, Moon,
  Smartphone, Hash, School, Calendar, CheckCircle2, ChevronRight,
  BookOpen, PartyPopper, AlertCircle
} from 'lucide-react';

const STEPS = {
  SIGN_IN: 'SIGN_IN',
  REGISTER: 'REGISTER',
  OTP_CHOICE: 'OTP_CHOICE',
  OTP_VERIFY: 'OTP_VERIFY',
  SUCCESS: 'SUCCESS',
  PASSWORD_SETUP: 'PASSWORD_SETUP',
  PROFILE: 'PROFILE'
};

const BrandPanel = () => {
  const letters = ['C', 'A', 'M', 'P', 'U', 'S'];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => {
      setActiveIdx((p) => (p + 1) % letters.length);
    }, 2000);
    return () => clearInterval(itv);
  }, [letters.length]);

  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-[450px] bg-[#1A56DB] dark:bg-slate-900 relative overflow-hidden transition-all duration-500 shrink-0">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-blue-400 rounded-full blur-[120px] animate-mesh-1" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-purple-500 rounded-full blur-[100px] animate-pulse" />
      </div>
      <div className="relative z-10 text-center scale-90">
        <div className="flex flex-col items-center mb-12">
          {letters.map((char, i) => (
            <span key={i} className={`font-syne font-black text-7xl md:text-8xl leading-[0.85] tracking-tighter transition-all duration-1000 ${i === activeIdx ? 'text-white scale-110 opacity-100' : 'text-white/10 scale-90 opacity-20'}`}>
              {char}
            </span>
          ))}
        </div>
        <p className="text-white/60 font-black uppercase tracking-[0.4em] text-sm">Everything inside one word</p>
      </div>
    </div>
  );
};

import { login as apiLogin, register as apiRegister, verifyOtp } from '@/routes/user';

export default function LoginPage() {
  // Navigation & Step State
  const [step, setStep] = useState(STEPS.SIGN_IN);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpMethod, setOtpMethod] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Profile State
  const [dept, setDept] = useState('');
  const [semester, setSemester] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [course, setCourse] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const [showBack, setShowBack] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const router = useRouter();
  const { login, isLoggedIn, isDarkMode, toggleTheme, updateProfile } = useContext(ThemeContext);
  const { redirect } = router.query;

  // Resend Timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Typewriter effect logic
  useEffect(() => {
    let text = "Welcome";
    if (step === STEPS.REGISTER) text = "Join";
    if (step === STEPS.OTP_CHOICE || step === STEPS.OTP_VERIFY) text = "Verify";
    if (step === STEPS.SUCCESS) text = "Success";
    if (step === STEPS.PASSWORD_SETUP) text = "Secure";
    if (step === STEPS.PROFILE) text = "Final";

    let i = 0;
    setWelcomeText('');
    setShowBack(false);

    const itv = setInterval(() => {
      setWelcomeText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(itv);
        setTimeout(() => setShowBack(true), 300);
      }
    }, 100);
    return () => clearInterval(itv);
  }, [step]);

  const handleAction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (step === STEPS.SIGN_IN) {
        const res = await apiLogin(email, password);

        if (res.status === 'success') {
          // Pass the tokens from the JSON body to the global login handler
          login(res.user, res.access_token, res.refresh_token, rememberMe);
          
          setTimeout(() => {
            if (redirect) {
              router.push(redirect);
            } else if (res.user?.role === 'admin') {
              router.push('/admin/dashboard');
            } else {
              router.push('/user/home');
            }
          }, 100);
        }
      } else if (step === STEPS.REGISTER) {
        // Validation check
        if (!email || !password || !name) {
          throw { message: 'Required fields missing: name, email, password' };
        }
        
        const res = await apiRegister({ 
            name, email, password, phone, course, department: dept, semester: parseInt(semester) || null, college_id: collegeId 
          });
        
        if (res.status === 'success') {
          setStep(STEPS.OTP_CHOICE);
        }
      } else if (step === STEPS.OTP_CHOICE) {
         setStep(STEPS.OTP_VERIFY);
      } else if (step === STEPS.OTP_VERIFY) {
        // 2. THE FINAL HANDSHAKE: Verify OTP
        const res = await verifyOtp(email, otp);

        if (res.status === 'success') {
          // Success! Now we have the final tokens and user profile
          login(res.user, res.access_token, res.refresh_token, rememberMe);
          
          setTimeout(() => {
            if (redirect) {
              router.push(redirect);
            } else if (res.user?.role === 'admin') {
              router.push('/admin/dashboard');
            } else {
              router.push('/user/home');
            }
          }, 100);
        }
      } else if (step === STEPS.PROFILE) {
        // Profile update if any extra fields needed
        // await updateProfile({ dept, semester, college_id: collegeId, course });
        login(null, null, null, rememberMe); 
        router.push(redirect || '/');
      }
    } catch (err) {
      console.error('Login Action Error:', err);
      setErrorMsg(err.message || err.detail || 'Something went wrong. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    // Mock resend logic
  };

  const selectOtpMethod = (method) => {
    setOtpMethod(method);
    setStep(STEPS.OTP_VERIFY);
    setResendTimer(30);
  };

  return (
    <div className="min-h-screen flex transition-colors duration-500 bg-white dark:bg-[#020617] font-inter">
      <BrandPanel />

      <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-24 xl:px-32 relative dot-grid overflow-y-auto">
        {/* Background Blobs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-400/10 blur-3xl rounded-full" />

        {/* Theme Toggle */}
        <div className="absolute top-8 right-8">
          <button onClick={toggleTheme} className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-[#1A56DB] transition-all">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="max-w-md w-full mx-auto animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <button onClick={() => router.push('/')} className="group mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1A56DB] transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </button>

          <div className="mb-10 min-h-[140px]">
            <h2 className="font-syne font-black text-4xl md:text-6xl tracking-tighter text-slate-900 dark:text-white flex flex-wrap gap-x-3 items-baseline">
              <span className="typewriter-cursor">{welcomeText}</span>
              <span className={`text-[#1A56DB] dark:text-blue-400 italic transition-all duration-700 ${showBack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 font-normal'}`}>
                {step === STEPS.SIGN_IN ? "Back." : step === STEPS.REGISTER ? "Us." : step === STEPS.SUCCESS ? "Done!" : "Today."}
              </span>
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium tracking-tight">
              {step === STEPS.SIGN_IN ? "Access your student portal to manage campus life." :
                step === STEPS.REGISTER ? "Create your student account to join the campus hub." :
                  step === STEPS.OTP_VERIFY ? `Code sent to your ${otpMethod}.` :
                    step === STEPS.SUCCESS ? "Verification successful! Hang on a moment..." :
                      step === STEPS.PROFILE ? "Complete your profile to get started." : "Choose how you'd like to receive your verification code."}
            </p>
          </div>

          <div className="glass-card p-1 dark:p-[1px] rounded-[32px] overflow-hidden">
            <div className="bg-white/80 dark:bg-slate-900/40 p-8 md:p-10 rounded-[31px]">
              
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={18} />
                  <p className="text-xs font-bold">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleAction} className="space-y-6">

                {/* 1. SIGN IN VIEW */}
                {step === STEPS.SIGN_IN && (
                  <div className="animate-in fade-in duration-500 space-y-5">
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Student Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><Mail size={18} /></div>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="student@college.edu" />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><Lock size={18} /></div>
                        <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-11 pr-12 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group/cb">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#1A56DB] border-[#1A56DB]' : 'border-gray-300 dark:border-white/20 group-hover/cb:border-[#1A56DB]'}`}>
                            {rememberMe && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover/cb:text-slate-900 dark:group-hover/cb:text-white transition-colors">Remember me</span>
                        </label>
                        <button type="button" className="text-[10px] font-bold text-[#1A56DB] dark:text-blue-400 hover:underline uppercase tracking-widest">Forgot Password?</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. REGISTER VIEW */}
                {step === STEPS.REGISTER && (
                  <div className="animate-in fade-in duration-500 space-y-5">
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Student Name</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="e.g. Krish Sharma" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Mobile Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><Smartphone size={18} /></div>
                        <input
                          type="tel"
                          required
                          maxLength="10"
                          pattern="[0-9]{10}"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                          placeholder="9876543210"
                        />
                      </div>
                      <p className="mt-2 text-[10px] text-gray-400 italic">Exactly 10 digits required</p>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Student Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><Mail size={18} /></div>
                        <input 
                          type="email" 
                          required 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" 
                          placeholder="student@college.edu" 
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><Lock size={18} /></div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="block w-full pl-11 pr-12 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" 
                          placeholder="••••••••" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. OTP CHOICE VIEW */}
                {step === STEPS.OTP_CHOICE && (
                  <div className="animate-in fade-in duration-500 space-y-4">
                    <button type="button" disabled className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/10 opacity-60 cursor-not-allowed group relative overflow-hidden">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500"><Smartphone size={20} /></div>
                        <div className="text-left">
                           <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                             Get OTP on Number
                             <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-[8px] uppercase tracking-widest">Coming soon</span>
                           </p>
                           <p className="text-xs text-gray-500">{phone}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-300" />
                    </button>
                    <button type="button" onClick={() => selectOtpMethod('email')} className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-slate-800/30 hover:border-blue-500 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><Mail size={20} /></div>
                        <div className="text-left"><p className="text-sm font-black text-slate-900 dark:text-white">Get OTP on Email</p><p className="text-xs text-gray-500">{email}</p></div>
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  </div>
                )}

                {/* 4. OTP VERIFY VIEW */}
                {step === STEPS.OTP_VERIFY && (
                  <div className="animate-in fade-in duration-500 space-y-6 text-center">
                    <div className="group text-left">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Enter Verification Code</label>
                      <input type="text" required maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full px-4 py-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-4xl font-black text-center tracking-[0.3em] text-slate-900 dark:text-white" placeholder="000000" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {resendTimer > 0 ? (
                        `Resend code in ${resendTimer}s`
                      ) : (
                        <button type="button" onClick={handleResend} className="text-[#1A56DB] dark:text-blue-400 hover:underline">
                          Resend Code Now
                        </button>
                      )}
                    </p>
                  </div>
                )}

                {/* 5. SUCCESS VIEW */}
                {step === STEPS.SUCCESS && (
                  <div className="animate-in zoom-in duration-700 flex flex-col items-center justify-center py-10 space-y-6">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 animate-bounce">
                      <PartyPopper size={48} />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-syne font-black text-slate-900 dark:text-white tracking-tighter">Verified!</p>
                      <p className="text-sm text-gray-500 font-medium">Your identity has been confirmed.</p>
                    </div>
                  </div>
                )}

                {/* 6. PASSWORD SETUP VIEW */}
                {step === STEPS.PASSWORD_SETUP && (
                  <div className="animate-in fade-in duration-500 space-y-6">
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Create Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><Lock size={18} /></div>
                        <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-11 pr-12 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="••••••••"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><CheckCircle2 size={18} /></div>
                        <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full pl-11 pr-12 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="••••••••"/>
                      </div>
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> Passwords do not match
                      </p>
                    )}
                  </div>
                )}

                {/* 7. PROFILE SETUP VIEW */}
                {step === STEPS.PROFILE && (
                  <div className="animate-in fade-in duration-500 space-y-5">
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Department</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><School size={18} /></div>
                        <input type="text" required value={dept} onChange={(e) => setDept(e.target.value)} className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="B.Tech (CSE)" />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Course</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><BookOpen size={18} /></div>
                        <input type="text" required value={course} onChange={(e) => setCourse(e.target.value)} className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="e.g. Computer Science" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">Current Semester</label>
                        <select
                          required
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="block w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Sem</option>
                          {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => (
                            <option key={s} value={s}>{s} Semester</option>
                          ))}
                        </select>
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#1A56DB]">College ID</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1A56DB]"><Hash size={18} /></div>
                          <input type="text" required value={collegeId} onChange={(e) => setCollegeId(e.target.value)} className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white" placeholder="KU2507..." />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DYNAMIC BUTTONS */}
                {step !== STEPS.OTP_CHOICE && step !== STEPS.SUCCESS && (
                  <button type="submit" disabled={isLoading || (step === STEPS.PASSWORD_SETUP && password !== confirmPassword)} className="animate-shine-sweep group w-full flex justify-center py-5 px-6 border border-transparent rounded-2xl shadow-xl shadow-blue-500/10 text-lg font-black text-white bg-[#1A56DB] hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 transition-all">
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : 
                     step === STEPS.SIGN_IN ? "Sign in" : 
                     step === STEPS.REGISTER ? "Get OTP" :
                     step === STEPS.OTP_VERIFY ? "Validate OTP" : 
                     step === STEPS.PASSWORD_SETUP ? "Set Password" : "Finalize Profile"}
                  </button>
                )}
              </form>

              {/* FOOTER LINKS */}
              {(step === STEPS.SIGN_IN || step === STEPS.REGISTER) && (
                <p className="mt-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {step === STEPS.SIGN_IN ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => setStep(step === STEPS.SIGN_IN ? STEPS.REGISTER : STEPS.SIGN_IN)} className="text-[#1A56DB] dark:text-blue-400 font-black hover:underline">
                    {step === STEPS.SIGN_IN ? "Create one" : "Sign in"}
                  </button>
                </p>
              )}

              {step !== STEPS.SIGN_IN && step !== STEPS.PROFILE && step !== STEPS.SUCCESS && (
                <button onClick={() => setStep(step === STEPS.REGISTER ? STEPS.SIGN_IN : STEPS.REGISTER)} className="mt-6 w-full text-center text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors">
                  Go back
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
