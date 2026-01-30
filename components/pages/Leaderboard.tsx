import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { Trophy, Medal, MapPin, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { API_URL } from '../constants';

const Leaderboard: React.FC = () => {
  const { user } = useApp();
  const [filterType, setFilterType] = useState<'global' | 'school'>('global');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          type: filterType,
          domain: domainFilter
        });
        
        if (filterType === 'school' && user?.school) {
          queryParams.append('school', user.school);
        }

        const res = await fetch(`${API_URL}/users/leaderboard?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaderboard();
    }
  }, [filterType, domainFilter, user]);

  const getFlag = (countryName: string) => {
    if (countryName === 'Nigeria') return '🇳🇬';
    if (countryName === 'United States') return '🇺🇸';
    if (countryName === 'India') return '🇮🇳';
    if (countryName === 'United Kingdom') return '🇬🇧';
    return '🏳️';
  };

  return (
    <div className="space-y-8 animate-slide-up pb-24 max-w-4xl mx-auto">
      
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-surface-100 to-transparent p-6 rounded-3xl border border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Trophy className="text-yellow-500" fill="currentColor" /> League Standings
            </h1>
            <p className="text-gray-400 text-sm mt-1">
               Rankings updated in real-time based on Weighted XP.
            </p>
          </div>

          <div className="flex bg-black p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterType('global')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                filterType === 'global' ? 'bg-surface-200 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setFilterType('school')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                filterType === 'school' ? 'bg-surface-200 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              My School
            </button>
          </div>
        </div>

        {/* Domain Filter Scroll */}
        <div className="overflow-x-auto pb-2 pt-6 scrollbar-hide">
           <div className="flex gap-2">
              {['all', 'STEM', 'Humanities', 'Arts', 'Business', 'Language'].map((domain) => (
                 <button
                    key={domain}
                    onClick={() => setDomainFilter(domain)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                       domainFilter === domain
                       ? 'bg-primary-600 border-primary-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                       : 'bg-surface-100 border-white/5 text-gray-500 hover:bg-surface-200'
                    }`}
                 >
                    {domain === 'all' ? 'All Domains' : domain}
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {loading ? (
           <div className="p-12 text-center text-gray-500">Retrieving satellite data...</div>
        ) : entries.length === 0 ? (
           <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">No rankings found for this sector.</div>
        ) : (
           entries.map((entry) => {
             const isMe = user?.username === entry.username;
             const displayXp = domainFilter === 'all' 
               ? (entry.weightedXp || entry.xp) 
               : (entry.domainStats?.[domainFilter] || 0);
             
             let rankStyle = "bg-surface-50 border-white/5 text-gray-400";
             let icon = <span className="font-mono font-bold text-sm">{entry.rank}</span>;

             if (entry.rank === 1) {
                rankStyle = "bg-gradient-to-r from-yellow-900/20 to-surface-50 border-yellow-500/30 text-yellow-500";
                icon = <Crown size={20} fill="currentColor" />;
             } else if (entry.rank === 2) {
                rankStyle = "bg-surface-50 border-gray-400/30 text-gray-300";
                icon = <Medal size={20} />;
             } else if (entry.rank === 3) {
                rankStyle = "bg-surface-50 border-orange-700/30 text-orange-400";
                icon = <Medal size={20} />;
             }

             if (isMe) {
                rankStyle = "bg-primary-900/20 border-primary-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]";
             }

             return (
               <div 
                 key={entry.userId}
                 className={`flex items-center p-4 rounded-2xl border transition-all hover:scale-[1.01] ${rankStyle}`}
               >
                 <div className="w-10 flex justify-center mr-4 font-bold text-lg">
                   {icon}
                 </div>
                 
                 <div className="w-12 h-12 rounded-xl bg-surface-200 mr-4 overflow-hidden border border-white/10">
                   <img src={entry.avatarUrl || 'https://picsum.photos/200'} alt={entry.username} className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2">
                       <h3 className={`font-bold truncate text-lg ${isMe ? 'text-primary-400' : 'text-white'}`}>
                          {entry.name}
                       </h3>
                       {filterType === 'global' && <span className="text-xl">{getFlag(entry.country)}</span>}
                   </div>
                   
                   <div className="flex items-center text-xs text-gray-500 mt-1">
                     {filterType === 'global' ? (
                       <><MapPin size={12} className="mr-1" /> <span className="truncate max-w-[150px]">{entry.school}</span></>
                     ) : (
                       <span className="text-primary-500 font-bold uppercase tracking-wider">Student</span>
                     )}
                   </div>
                 </div>
                 
                 <div className="text-right pl-4">
                   <span className="block font-black text-xl text-white tracking-tight">{displayXp.toLocaleString()}</span>
                   <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                      XP
                   </span>
                 </div>
               </div>
             );
           })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;