import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { AppRoute } from '../types';
import { Activity, ArrowRight, Lock, Mail, Zap, Brain } from 'lucide-react';

interface LoginProps {
  navigate: (route: string) => void;
}

const Login: React.FC<LoginProps> = ({ navigate }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password); // Passing password now properly
      navigate(AppRoute.DASHBOARD);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background border-r border-white/5">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          
          <div className="space-y-2">
            <div onClick={() => navigate(AppRoute.LANDING)} className="inline-flex items-center gap-2 cursor-pointer mb-4">
               <div className="bg-gradient-to-tr from-green-400 to-emerald-600 p-1.5 rounded text-black shadow-glow-green">
                 <Activity size={20} />
               </div>
               <span className="text-xl font-bold text-white tracking-tight">Synapse</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-gray-400">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-500" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-surface-50 text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600"
                    placeholder="name@university.edu"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-surface-50 text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
               <div className="flex items-center">
                 <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary-600 focus:ring-primary-500" />
                 <label htmlFor="remember" className="ml-2 block text-gray-400">Remember me</label>
               </div>
               <button type="button" onClick={() => navigate(AppRoute.FORGOT_PASSWORD)} className="font-medium text-primary-400 hover:text-primary-300">Forgot password?</button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Sign in <ArrowRight size={18} className="ml-2" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account? <button onClick={() => navigate(AppRoute.SIGNUP)} className="font-semibold text-primary-400 hover:text-primary-300">Sign up for free</button>
          </p>
        </div>
      </div>

      {/* Right Panel: Decorative (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-[#000000] relative overflow-hidden items-center justify-center p-12">
         {/* Abstract BG */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         
         {/* Content - Removed Fake Reviews, Focused on Mission */}
         <div className="relative z-10 max-w-lg text-white space-y-8">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                <Brain size={32} className="text-primary-400" />
              </div>
               <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                <Zap size={32} className="text-yellow-400" />
              </div>
            </div>
            
            <h2 className="text-5xl font-bold leading-tight font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
               Turn academic chaos into <br/>
               <span className="text-primary-400">structured mastery.</span>
            </h2>
            
            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                   <div>
                      <h4 className="font-bold text-white">Adaptive Intelligence</h4>
                      <p className="text-sm text-gray-400">Our AURA engine customizes every lesson to your personal interests.</p>
                   </div>
               </div>
               <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                   <div>
                      <h4 className="font-bold text-white">Gamified Progression</h4>
                      <p className="text-sm text-gray-400">Earn XP, maintain streaks, and visualize your intellectual growth.</p>
                   </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Login;