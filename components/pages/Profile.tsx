import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Moon, Sun, Settings as SettingsIcon, Edit2, Check, X, Sparkles, User as UserIcon, Shield, Zap } from 'lucide-react';
import { AppRoute } from '../types';
import { INTERESTS_LIST } from '../constants';

interface ProfileProps {
  navigate: (route: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ navigate }) => {
  const { user, theme, toggleTheme, logout, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    interests: [] as string[]
  });

  if (!user) return null;

  const startEditing = () => {
    setFormData({
      name: user.name,
      school: user.school,
      interests: [...user.interests]
    });
    setIsEditing(true);
  };

  const saveProfile = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }));
    } else {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, interest] }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* --- Character Card --- */}
      <div className="bg-surface-100 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-surface-200 shadow-2xl relative group">
               <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs font-bold text-white uppercase">Change</span>
               </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
               {isEditing ? (
                  <div className="space-y-4 max-w-sm">
                     <input 
                       type="text" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full text-2xl font-black bg-black/30 border border-white/20 rounded-lg p-2 text-white outline-none focus:border-primary-500"
                     />
                     <input 
                       type="text" 
                       value={formData.school}
                       onChange={(e) => setFormData({...formData, school: e.target.value})}
                       className="w-full text-sm text-gray-400 bg-black/30 border border-white/20 rounded-lg p-2 outline-none focus:border-primary-500"
                     />
                  </div>
               ) : (
                  <>
                     <div className="flex items-center justify-center md:justify-start gap-2">
                         <h1 className="text-3xl font-black text-white">{user.name}</h1>
                         <span className="px-2 py-0.5 rounded bg-primary-500/20 text-primary-400 text-[10px] font-bold uppercase tracking-wider border border-primary-500/30">Lvl {user.level}</span>
                     </div>
                     <p className="text-gray-400 font-medium">@{user.username} • {user.school}</p>
                     
                     <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                        {user.interests.map(interest => (
                           <span key={interest} className="px-3 py-1 bg-surface-200 text-gray-300 rounded-full text-xs font-bold border border-white/5">
                              {interest}
                           </span>
                        ))}
                     </div>
                  </>
               )}
            </div>

            {/* Edit Controls */}
            <div className="flex gap-2">
               {isEditing ? (
                  <>
                     <button onClick={() => setIsEditing(false)} className="p-3 bg-surface-200 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors"><X size={20}/></button>
                     <button onClick={saveProfile} className="p-3 bg-green-500 text-black rounded-xl font-bold hover:scale-105 transition-transform"><Check size={20}/></button>
                  </>
               ) : (
                  <button onClick={startEditing} className="p-3 bg-surface-200 rounded-xl hover:bg-white/10 transition-colors">
                     <Edit2 size={20} className="text-gray-400" />
                  </button>
               )}
            </div>
         </div>
      </div>

      {/* --- Stats Grid (RPG Style) --- */}
      <div className="grid md:grid-cols-2 gap-6">
         
         {/* Attributes */}
         <div className="bg-surface-100 rounded-3xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
               <Shield size={16} /> Attributes
            </h3>
            
            <div className="space-y-6">
               <StatBar label="Intelligence (XP)" value={user.xp} max={5000} color="bg-blue-500" />
               <StatBar label="Discipline (Streak)" value={user.streak} max={30} color="bg-orange-500" />
               <StatBar label="Mastery (Accuracy)" value={user.averageMastery || 0} max={100} color="bg-green-500" />
            </div>
         </div>

         {/* Account Settings */}
         <div className="bg-surface-100 rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
            <div>
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <SettingsIcon size={16} /> System
               </h3>
               
               <div className="space-y-2">
                  <button 
                     onClick={toggleTheme}
                     className="w-full p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 flex justify-between items-center transition-all group"
                  >
                     <div className="flex items-center gap-3 text-gray-300">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        <span className="font-bold">Theme</span>
                     </div>
                     <span className="text-xs text-gray-500 uppercase font-bold group-hover:text-white transition-colors">{theme}</span>
                  </button>

                  <button className="w-full p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 flex justify-between items-center transition-all">
                     <div className="flex items-center gap-3 text-gray-300">
                        <Zap size={20} />
                        <span className="font-bold">Subscription</span>
                     </div>
                     <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-[10px] font-bold uppercase rounded">Free Tier</span>
                  </button>
               </div>
            </div>

            <button 
               onClick={() => {
                  logout();
                  navigate(AppRoute.LOGIN);
               }}
               className="mt-6 w-full py-4 rounded-xl border border-red-500/20 text-red-400 font-bold hover:bg-red-500/10 transition-colors"
            >
               Log Out
            </button>
         </div>

      </div>

    </div>
  );
};

const StatBar = ({ label, value, max, color }: any) => {
   const percent = Math.min(100, (value / max) * 100);
   return (
      <div>
         <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-gray-400 uppercase">{label}</span>
            <span className="text-white">{value} / {max}</span>
         </div>
         <div className="h-3 bg-black rounded-full overflow-hidden border border-white/5">
            <div 
               className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} 
               style={{ width: `${percent}%` }}
            ></div>
         </div>
      </div>
   )
}

export default Profile;