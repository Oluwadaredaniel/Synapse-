import React, { useState, useEffect } from 'react';
import { Users, BookOpen, AlertCircle, Globe, GraduationCap, Megaphone, Send, Activity, Loader2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { API_URL } from '../constants';

interface AdminProps {
  navigate: (route: string) => void;
}

const AdminDashboard: React.FC<AdminProps> = ({ navigate }) => {
  const { token } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Location Management State
  const [newCountry, setNewCountry] = useState({ name: '', code: '', flag: '' });
  const [newSchool, setNewSchool] = useState({ name: '', countryName: '' });
  const [locationStatus, setLocationStatus] = useState<{msg: string, type: 'success' | 'error' | ''}>({ msg: '', type: '' });

  // Broadcast State
  const [broadcast, setBroadcast] = useState({
    subject: '',
    message: '',
    filterType: 'all', 
    filterValue: ''
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState('');

  // Stats State
  const [stats, setStats] = useState<any>(null);

  // Fetch Stats on Mount
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats");
        }
    };
    fetchStats();
  }, [token]);

  // --- Handlers ---

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch(`${API_URL}/locations/countries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newCountry)
        });
        if (!res.ok) throw new Error('Failed');
        setLocationStatus({ msg: `Added ${newCountry.name} successfully`, type: 'success' });
        setNewCountry({ name: '', code: '', flag: '' });
    } catch (err) {
        setLocationStatus({ msg: 'Error adding country', type: 'error' });
    }
  };

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch(`${API_URL}/locations/schools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newSchool)
        });
        if (!res.ok) throw new Error('Failed');
        setLocationStatus({ msg: `Added ${newSchool.name} successfully`, type: 'success' });
        setNewSchool({ name: '', countryName: '' });
    } catch (err) {
        setLocationStatus({ msg: 'Error adding school', type: 'error' });
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingBroadcast(true);
    setBroadcastStatus('');
    try {
        const res = await fetch(`${API_URL}/admin/broadcast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(broadcast)
        });
        if (!res.ok) throw new Error('Failed');
        setBroadcastStatus('Broadcast sent successfully!');
        setBroadcast({ subject: '', message: '', filterType: 'all', filterValue: '' });
    } catch (err) {
        setBroadcastStatus('Failed to send broadcast.');
    } finally {
        setSendingBroadcast(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-24">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
             <Activity className="text-red-500" /> Admin Console
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-1">
             SYSTEM_STATUS: {stats ? <span className="text-green-500">ONLINE</span> : <span className="text-yellow-500">CONNECTING...</span>}
          </p>
        </div>
        
        <div className="flex p-1 bg-surface-100 rounded-lg border border-white/5">
           {['overview', 'locations', 'announcements'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-all ${
                   activeTab === tab ? 'bg-surface-200 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                 {tab}
              </button>
           ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <StatCard 
                icon={<Users className="text-blue-400" />} 
                label="Total Students" 
                value={stats?.users?.total || '0'} 
                change={stats?.users?.growth || '-'} 
             />
             <StatCard 
                icon={<BookOpen className="text-purple-400" />} 
                label="Lessons Generated" 
                value={stats?.lessons?.total || '0'} 
                change={stats?.lessons?.growth || '-'} 
             />
             <StatCard 
                icon={<AlertCircle className="text-red-400" />} 
                label="System Health" 
                value={stats ? "100%" : "Checking"} 
                change="Stable" 
             />
           </div>

           <div className="glass-panel p-6 rounded-xl">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Real-time Activity Log</h3>
             <div className="space-y-2 font-mono text-xs text-gray-500">
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span>[System] AURA Engine v2.1 initialized</span>
                   <span className="text-green-500">READY</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span>[Log] Admin dashboard accessed</span>
                   <span className="text-blue-500">INFO</span>
                </div>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="space-y-6">
            {locationStatus.msg && (
                <div className={`p-4 rounded-lg border ${locationStatus.type === 'success' ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-red-900/20 border-red-800 text-red-400'}`}>
                    {locationStatus.msg}
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-xl">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                        <Globe className="mr-2 text-primary-500" /> Add Country
                    </h2>
                    <form onSubmit={handleAddCountry} className="space-y-4">
                        <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Country Name</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500" 
                            placeholder="e.g. Nigeria" 
                            value={newCountry.name}
                            onChange={e => setNewCountry({...newCountry, name: e.target.value})}
                            required 
                        />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">ISO Code</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500" 
                                placeholder="NG" 
                                value={newCountry.code}
                                onChange={e => setNewCountry({...newCountry, code: e.target.value})}
                                required 
                            />
                            </div>
                            <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Flag Emoji</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500" 
                                placeholder="🇳🇬" 
                                value={newCountry.flag}
                                onChange={e => setNewCountry({...newCountry, flag: e.target.value})}
                                required 
                            />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-500 transition-colors">Add to Database</button>
                    </form>
                </div>

                <div className="glass-panel p-8 rounded-xl">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                        <GraduationCap className="mr-2 text-green-500" /> Add School
                    </h2>
                    <form onSubmit={handleAddSchool} className="space-y-4">
                        <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">School Name</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500" 
                            placeholder="University Name" 
                            value={newSchool.name}
                            onChange={e => setNewSchool({...newSchool, name: e.target.value})}
                            required 
                        />
                        </div>
                        <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Country (Exact Match)</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500" 
                            placeholder="Nigeria" 
                            value={newSchool.countryName}
                            onChange={e => setNewSchool({...newSchool, countryName: e.target.value})}
                            required 
                        />
                        </div>
                        <button type="submit" className="w-full py-3 bg-surface-200 text-white rounded-lg font-bold hover:bg-surface-300 transition-colors">Add School</button>
                    </form>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="max-w-3xl mx-auto glass-panel p-8 rounded-xl">
           <h2 className="text-lg font-bold text-white mb-6 flex items-center">
              <Megaphone className="mr-2 text-red-500" /> System Broadcast
           </h2>
           {broadcastStatus && (
               <div className="mb-4 p-3 bg-primary-900/20 border border-primary-800 text-primary-200 rounded text-sm text-center">
                   {broadcastStatus}
               </div>
           )}
           <form onSubmit={handleBroadcast} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Subject Line</label>
                    <input 
                        type="text" 
                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500" 
                        placeholder="Announcement Title" 
                        value={broadcast.subject}
                        onChange={e => setBroadcast({...broadcast, subject: e.target.value})}
                        required 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Target Audience</label>
                    <select 
                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500"
                        value={broadcast.filterType}
                        onChange={e => setBroadcast({...broadcast, filterType: e.target.value})}
                    >
                       <option value="all">All Users</option>
                       <option value="country">By Country</option>
                       <option value="school">By School</option>
                    </select>
                 </div>
              </div>

              {broadcast.filterType !== 'all' && (
                  <div className="space-y-1 animate-fade-in">
                      <label className="text-xs font-bold text-gray-500 uppercase">Target Value ({broadcast.filterType})</label>
                      <input 
                          type="text" 
                          className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500" 
                          placeholder={`Enter ${broadcast.filterType} name...`}
                          value={broadcast.filterValue}
                          onChange={e => setBroadcast({...broadcast, filterValue: e.target.value})}
                      />
                  </div>
              )}
              
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">Message Body</label>
                 <textarea 
                    rows={6} 
                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white outline-none focus:border-primary-500 font-mono text-sm" 
                    placeholder="HTML content supported..." 
                    value={broadcast.message}
                    onChange={e => setBroadcast({...broadcast, message: e.target.value})}
                    required
                ></textarea>
              </div>

              <button type="submit" disabled={sendingBroadcast} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2">
                 {sendingBroadcast ? <><Loader2 className="animate-spin" /> Dispatching...</> : <><Send size={18} /> Send Broadcast</>}
              </button>
           </form>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ icon, label, value, change }: any) => (
  <div className="bg-surface-50 p-6 rounded-xl border border-white/5">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-surface-100 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded bg-surface-100 ${change.startsWith('+') ? 'text-green-400' : 'text-gray-400'}`}>{change}</span>
    </div>
    <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</div>
  </div>
);

export default AdminDashboard;