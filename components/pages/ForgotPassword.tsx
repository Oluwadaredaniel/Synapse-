import React, { useState } from 'react';
import { AppRoute } from '../types';
import { API_URL } from '../constants';
import { ArrowLeft, Mail, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  navigate: (route: string) => void;
}

const ForgotPassword: React.FC<Props> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', msg: data.message || 'Check your email for the reset link.' });
      } else {
        setStatus({ type: 'error', msg: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-fade-in">
       <div className="w-full max-w-md space-y-8">
          
          <button onClick={() => navigate(AppRoute.LOGIN)} className="flex items-center text-gray-500 hover:text-white transition-colors">
             <ArrowLeft size={18} className="mr-2" /> Back to Login
          </button>

          <div>
             <h1 className="text-3xl font-black text-white mb-2">Reset Password</h1>
             <p className="text-gray-400">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {status.type && (
             <div className={`p-4 rounded-xl border flex items-start gap-3 ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {status.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
                <p className="text-sm font-medium">{status.msg}</p>
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                   <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-colors"
                      placeholder="student@university.edu"
                   />
                </div>
             </div>

             <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
             >
                {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
             </button>
          </form>

       </div>
    </div>
  );
};

export default ForgotPassword;