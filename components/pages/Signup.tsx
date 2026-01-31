import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AppRoute, Country, School } from '../types';
import { INTERESTS_LIST, API_URL } from '../constants';
import { Loader2, Activity, Globe, GraduationCap, ArrowRight, User, Mail, Lock } from 'lucide-react';

interface SignupProps {
  navigate: (route: string) => void;
}

const Signup: React.FC<SignupProps> = ({ navigate }) => {
  const { login } = useApp();
  const [step, setStep] = useState(1); // 1: Details, 2: Interests
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    country: '',
    school: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [countries, setCountries] = useState<Country[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Countries from Backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${API_URL}/locations/countries`);
        if (res.ok) {
          const data = await res.json();
          setCountries(data);
        }
      } catch (err) {
        console.error("Failed to fetch countries", err);
      }
    };
    fetchCountries();
  }, []);

  // 2. Fetch Schools when Country changes
  useEffect(() => {
    if (formData.country) {
      setLoadingSchools(true);
      const fetchSchools = async () => {
        try {
          const res = await fetch(`${API_URL}/locations/schools/${encodeURIComponent(formData.country)}`);
          if (res.ok) {
            const data = await res.json();
            setSchools(data);
          } else {
            setSchools([]);
          }
        } catch (err) {
          console.error("Failed to fetch schools", err);
          setSchools([]);
        } finally {
          setLoadingSchools(false);
          // Reset school if country changes
          setFormData(prev => ({ ...prev, school: '' }));
        }
      };
      fetchSchools();
    } else {
      setSchools([]);
    }
  }, [formData.country]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests(prev => [...prev, interest]);
      }
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === 1) setStep(2);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Register via Backend API
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto-login after registration
      await login(formData.email, formData.password);
      navigate(AppRoute.DASHBOARD);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-background border-r border-white/5 relative">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          
          {/* Header */}
          <div className="space-y-2">
             <div onClick={() => navigate(AppRoute.LANDING)} className="inline-flex items-center gap-2 cursor-pointer mb-2">
               <div className="bg-gradient-to-tr from-green-400 to-emerald-600 p-1.5 rounded text-black shadow-glow-green">
                 <Activity size={20} />
               </div>
               <span className="text-lg font-bold text-white tracking-tight">Synapse</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
               <span className={`font-medium ${step === 1 ? 'text-primary-400' : 'text-gray-600'}`}>1. Details</span>
               <div className="w-8 h-px bg-gray-800"></div>
               <span className={`font-medium ${step === 2 ? 'text-primary-400' : 'text-gray-600'}`}>2. Interests</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleNextStep} className="space-y-5">
            
            {step === 1 && (
              <div className="space-y-4 animate-slide-up">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text" required placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface-50 outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder:text-gray-600"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                    <input
                      type="text" required placeholder="johnny_d"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface-50 outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder:text-gray-600"
                      value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="email" required placeholder="john@university.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-surface-50 outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder:text-gray-600"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                   <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="password" required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-surface-50 outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder:text-gray-600"
                      value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                   </div>
                   <p className="text-xs text-gray-500 mt-1 ml-1">Must be at least 6 characters</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                    <div className="relative">
                      <select
                        required
                        className="w-full pl-4 pr-8 py-3 rounded-xl border border-white/10 bg-surface-50 outline-none focus:ring-2 focus:ring-primary-500 text-white appearance-none"
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                      >
                        <option value="" disabled>Select</option>
                        {countries.length > 0 ? (
                           countries.map(c => <option key={c._id} value={c.name}>{c.flag} {c.name}</option>)
                        ) : (
                           <option disabled>Loading...</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">School</label>
                    <div className="relative">
                      <select
                        required
                        disabled={!formData.country || loadingSchools}
                        className="w-full pl-4 pr-8 py-3 rounded-xl border border-white/10 bg-surface-50 outline-none focus:ring-2 focus:ring-primary-500 text-white appearance-none disabled:opacity-50"
                        value={formData.school}
                        onChange={e => setFormData({...formData, school: e.target.value})}
                      >
                        <option value="" disabled>Select</option>
                        {schools.length > 0 ? (
                          schools.map(s => <option key={s._id} value={s.name}>{s.name}</option>)
                        ) : (
                          <option disabled>{formData.country ? (loadingSchools ? "Loading..." : "No schools found") : "Select Country"}</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-slide-up">
                <div>
                   <h3 className="text-lg font-bold text-white mb-2">Pick your Vibe ✨</h3>
                   <p className="text-sm text-gray-500">Select at least 3 topics. We'll use these to customize your lessons.</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {INTERESTS_LIST.map(interest => (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-all transform active:scale-95 ${
                        selectedInterests.includes(interest)
                          ? 'bg-primary-900/30 border-primary-500 text-primary-400'
                          : 'bg-surface-50 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                
                <div className="text-xs text-center text-gray-500">
                   Selected: {selectedInterests.length}/3 required
                </div>
              </div>
            )}

            <div className="pt-2">
               <button
                  type="submit"
                  disabled={loading || (step === 2 && selectedInterests.length < 3)}
                  className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
               >
                  {loading ? <Loader2 className="animate-spin" /> : (step === 1 ? <>Continue <ArrowRight size={18}/></> : 'Create Account')}
               </button>
            </div>

            {step === 2 && (
               <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-500 hover:text-white">Back</button>
            )}

          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account? <button onClick={() => navigate(AppRoute.LOGIN)} className="font-semibold text-primary-400 hover:text-primary-300">Log in</button>
          </p>
        </div>
      </div>

      {/* Right Panel: Feature (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-[#000000] relative overflow-hidden items-center justify-center p-12">
          {/* Abstract BG */}
          <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-green-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="relative z-10 grid gap-6 max-w-md w-full">
             <div className="bg-surface-50 border border-white/5 p-6 rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl backdrop-blur-md">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                       <Globe size={20} />
                    </div>
                    <div>
                       <p className="text-white font-bold">Global Community</p>
                       <p className="text-gray-400 text-xs">Connect with learners worldwide</p>
                    </div>
                 </div>
                 <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-emerald-500"></div>
                 </div>
             </div>

             <div className="bg-surface-50 border border-white/5 p-6 rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl ml-8 backdrop-blur-md">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                       <GraduationCap size={20} />
                    </div>
                    <div>
                       <p className="text-white font-bold">Smart Analysis</p>
                       <p className="text-gray-400 text-xs">AI personalizes your curriculum</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">Physics</span>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">History</span>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">Math</span>
                 </div>
             </div>
          </div>
      </div>

    </div>
  );
};

export default Signup;