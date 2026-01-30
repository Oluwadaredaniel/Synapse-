import React, { useState, useEffect } from 'react';
import { AppRoute } from '../types';
import { API_URL } from '../constants';
import { Lock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface Props {
  navigate: (route: string) => void;
}

const ResetPassword: React.FC<Props> = ({ navigate }) => {
  const { login } = useApp();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  useEffect(() => {
    // Extract token from URL manually since we're not using a full router lib
    const pathParts = window.location.pathname.split('/');
    const urlToken = pathParts[pathParts.length - 1];
    if (urlToken) setToken(urlToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
       setStatus({ type: 'error', msg: 'Passwords do not match' });
       return;
    }
    
    setLoading(true);
    setStatus({ type: null, msg: '' });

    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Password updated successfully! Logging you in...' });
        // Auto login simulation (in real app, we might need to re-login explicitly or use returned token)
        if (data.token) {
           localStorage.setItem('token', data.token);
           // Force reload or nav to dashboard to pick up new session
           setTimeout(() => {
              window.location.href = '/dashboard'; 
           }, 1500);
        } else {
           setTimeout(() => navigate(AppRoute.LOGIN), 2000);
        }
      } else {
        setStatus({ type: 'error', msg: data.message || 'Failed to reset password.' });
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
          
          <div>
             <h1 className="text-3xl font-black text-white mb-2">Set New Password</h1>
             <p className="text-gray-400">Please enter your new password below.</p>
          </div>

          {status.type && (
             <div className={`p-4 rounded-xl border flex items-start gap-3 ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {status.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
                <p className="text-sm font-medium">{status.msg}</p>
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                   <input 
                      type="password" 
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-colors"
                      placeholder="••••••••"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                   <input 
                      type="password" 
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-colors"
                      placeholder="••••••••"
                   />
                </div>
             </div>

             <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
             >
                {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
             </button>
          </form>

       </div>
    </div>
  );
};

export default ResetPassword;