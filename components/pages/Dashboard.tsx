import React, { useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { usePwa } from '../hooks/usePwa';
import { 
  Flame, ArrowRight, Upload, PlayCircle, Zap, Trophy, Target, 
  Sparkles, Plus, Share2, X, Check, Download, Instagram, Facebook, 
  Twitter, MessageCircle, Smartphone, Loader2, Copy
} from 'lucide-react';
import { AppRoute } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';
import html2canvas from 'html2canvas';

interface DashboardProps {
  navigate: (route: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { user, lessons } = useApp();
  const { supportsPWA, installPwa, isStandalone } = usePwa();
  const [showStreakCard, setShowStreakCard] = useState(false);
  
  // Share Sheet States
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const displayXp = user.weightedXp !== undefined ? user.weightedXp : user.xp;
  const safeLevel = Math.min(user.level, LEVEL_THRESHOLDS.length);
  const isMaxLevel = safeLevel >= LEVEL_THRESHOLDS.length;
  const currentLevelXp = LEVEL_THRESHOLDS[safeLevel - 1] || 0;
  const nextLevelXp = isMaxLevel ? currentLevelXp : (LEVEL_THRESHOLDS[safeLevel] || 5000);
  
  let progressPercent = 100;
  if (!isMaxLevel) {
     progressPercent = Math.min(100, Math.max(0, ((displayXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));
  }

  const xpRemaining = Math.floor(nextLevelXp - displayXp);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; 

  // --- SHARE LOGIC ---
  const handleCaptureAndShare = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, 
        backgroundColor: null, 
        useCORS: true, 
        logging: false,
      });
      const image = canvas.toDataURL('image/png');
      setCapturedImage(image);
      setShowShareSheet(true);
      setShowStreakCard(false); 
    } catch (err) {
      console.error("Capture failed:", err);
      alert("Failed to create image. Please try taking a screenshot manually.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleNativeShare = async () => {
    if (!capturedImage) return;
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const file = new File([blob], 'synapse-streak.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `I'm on a ${user.streak} day streak on Synapse!`,
          text: `Turning my degree into a game. Join me on Synapse!`,
          files: [file]
        });
      } else {
        alert("System sharing is not supported on this browser. Use the download button.");
      }
    } catch (err) {
      console.error("Native share failed:", err);
    }
  };

  const handleDownload = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `synapse-streak-${user.streak}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareText = `I'm on a ${user.streak} day streak on Synapse! 🚀 #Synapse #StudyStreak`;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* --- HUD Header --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono text-gray-400 border border-white/5">
                STUDENT_ID: {user.username.toUpperCase()}
             </span>
             <span className="flex items-center gap-1 text-xs font-bold text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ONLINE
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Command Center
          </h1>
        </div>
        
        {/* Streak Badge */}
        <div 
          onClick={() => setShowStreakCard(true)}
          className="cursor-pointer group flex items-center gap-4 bg-surface-100 p-2 pr-6 rounded-full border border-white/5 shadow-2xl hover:bg-surface-200 transition-all active:scale-95"
        >
           <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.streak > 0 ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-gray-800 text-gray-600'}`}>
              <Flame size={24} className={user.streak > 0 ? 'animate-pulse' : ''} fill="currentColor" />
           </div>
           <div>
              <div className="text-xl font-black text-white leading-none">{user.streak}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-primary-400 transition-colors">Day Streak</div>
           </div>
        </div>
      </header>

      {/* --- PWA PROMO CARD (If Web) --- */}
      {supportsPWA && !isStandalone && (
         <div className="bg-gradient-to-r from-primary-900/30 to-blue-900/30 border border-primary-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-14 h-14 bg-black/50 rounded-2xl flex items-center justify-center border border-white/10">
                  <Smartphone size={28} className="text-white" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white">Upgrade to Synapse App</h3>
                  <p className="text-sm text-gray-300">Get offline access, haptics, and smoother performance.</p>
               </div>
            </div>
            <button 
               onClick={installPwa}
               className="px-6 py-3 bg-white text-black font-black text-sm rounded-xl hover:scale-105 transition-transform shadow-lg whitespace-nowrap relative z-10"
            >
               Install App
            </button>
         </div>
      )}

      {/* --- Main Stats Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-surface-100 border border-white/10 p-8 flex flex-col justify-between group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex justify-between items-start mb-8">
               <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</h3>
                  <div className="text-3xl font-black text-white">Level {user.level}</div>
               </div>
               <div className="text-right">
                   <div className="text-sm font-bold text-primary-400">{displayXp} / {nextLevelXp} XP</div>
                   <div className="text-xs text-gray-500">To Next Level</div>
               </div>
            </div>
            <div className="relative z-10 space-y-4">
               <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                     <div className="absolute top-0 right-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white]"></div>
                  </div>
               </div>
               <p className="text-sm text-gray-400 font-medium">
                  <span className="text-white font-bold">{xpRemaining} XP</span> required for rank promotion.
               </p>
            </div>
         </div>

         <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8 flex flex-col justify-center items-center text-center group cursor-pointer hover:border-primary-500/50 transition-all" onClick={() => navigate(AppRoute.LEARNING)}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/10 to-transparent"></div>
            <div className="w-16 h-16 rounded-2xl bg-surface-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
               <Target size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Daily Quest</h3>
            <p className="text-gray-400 text-sm mb-6">Complete a Quiz with >90% accuracy.</p>
            <div className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider">
               Reward: 500 XP
            </div>
         </div>
      </div>

      <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-4">
         <Zap size={20} className="text-yellow-400" /> Quick Actions
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <button onClick={() => navigate(AppRoute.UPLOAD)} className="group p-6 rounded-2xl bg-surface-100 border border-white/10 hover:bg-surface-200 transition-all text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Upload size={48}/></div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
               <Plus size={20} />
            </div>
            <div className="font-bold text-white">New Lesson</div>
            <div className="text-xs text-gray-500">Upload PDF/Text</div>
         </button>

         <button onClick={() => navigate(AppRoute.LEADERBOARD)} className="group p-6 rounded-2xl bg-surface-100 border border-white/10 hover:bg-surface-200 transition-all text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Trophy size={48}/></div>
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-3 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
               <Trophy size={20} />
            </div>
            <div className="font-bold text-white">Leaderboard</div>
            <div className="text-xs text-gray-500">View Rankings</div>
         </button>

         <button onClick={() => navigate(AppRoute.LEARNING)} className="md:col-span-2 group p-6 rounded-2xl bg-gradient-to-r from-primary-900/40 to-surface-100 border border-primary-500/20 hover:border-primary-500/40 transition-all text-left relative overflow-hidden flex items-center justify-between">
            <div>
               <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 mb-3 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <PlayCircle size={20} />
               </div>
               <div className="font-bold text-white">Continue Learning</div>
               <div className="text-xs text-gray-400">Jump back into your last session</div>
            </div>
            <div className="hidden md:block">
               <div className="w-12 h-12 rounded-full border-2 border-primary-500 flex items-center justify-center">
                  <ArrowRight size={24} className="text-primary-500 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
         </button>
      </div>

      {/* ... (Recent Operations list kept same as before) ... */}
      <div className="space-y-4">
         <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               <Sparkles size={20} className="text-purple-400" /> Recent Operations
            </h2>
            <button onClick={() => navigate(AppRoute.LEARNING)} className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider">View All</button>
         </div>

         {lessons.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center">
               <div className="inline-block p-4 rounded-full bg-surface-200 text-gray-500 mb-4"><Upload size={24}/></div>
               <h3 className="text-lg font-bold text-white mb-2">No active operations</h3>
               <p className="text-gray-500 mb-6">Upload your first material to begin the mastery process.</p>
               <button onClick={() => navigate(AppRoute.UPLOAD)} className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:scale-105 transition-transform">Initialize First Lesson</button>
            </div>
         ) : (
            <div className="space-y-3">
               {lessons.slice(0, 3).map((lesson, idx) => (
                  <div key={lesson.id} onClick={() => navigate(AppRoute.LEARNING)} className="group flex items-center p-4 rounded-2xl bg-surface-50 border border-white/5 hover:bg-surface-100 hover:border-primary-500/30 transition-all cursor-pointer">
                     <div className="w-12 h-12 rounded-xl bg-surface-200 flex items-center justify-center text-gray-400 font-black text-lg mr-4 group-hover:bg-primary-600 group-hover:text-white transition-colors relative overflow-hidden">
                        {lesson.coverImage ? (
                           <img src={lesson.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                        ) : (
                           <span>{idx + 1}</span>
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{lesson.interestUsed}</span>
                        </div>
                        <h4 className="font-bold text-white truncate">{lesson.title}</h4>
                     </div>
                     <div className="text-right px-4">
                        <div className="text-xs text-gray-500 uppercase font-bold">XP Reward</div>
                        <div className="text-sm font-bold text-primary-400">+{lesson.xpReward}</div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowRight size={14} />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* --- STREAK CARD MODAL (Kept same as before) --- */}
      {showStreakCard && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setShowStreakCard(false)}>
             <div className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
                 <button onClick={() => setShowStreakCard(false)} className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white"><X size={24}/></button>
                 
                 {/* CAPTURE AREA */}
                 <div ref={cardRef} className="relative bg-orange-600 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden transform transition-all duration-300">
                     <div className="bg-[#121212] rounded-[2.4rem] overflow-hidden flex flex-col h-[550px] relative">
                        {/* Top Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-orange-600/20 to-transparent pointer-events-none"></div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
                            {/* Giant Flame */}
                            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                                <div className="absolute inset-0 bg-orange-500/20 blur-[50px] rounded-full"></div>
                                <Flame size={160} className="text-orange-500 drop-shadow-[0_4px_20px_rgba(249,115,22,0.6)]" fill="currentColor" />
                            </div>

                            {/* Big Number */}
                            <h2 className="text-8xl font-black text-white leading-none tracking-tighter drop-shadow-lg mb-2">
                               {user.streak}
                            </h2>
                            <h3 className="text-2xl font-black text-orange-500 uppercase tracking-widest mb-8">
                               Day Streak
                            </h3>

                            {/* Week View */}
                            <div className="flex justify-between w-full max-w-xs bg-white/5 rounded-2xl p-4 border border-white/5 mb-6">
                               {days.map((day, idx) => {
                                  let isActive = false;
                                  if (user.streak >= 7) isActive = true;
                                  else isActive = (idx === todayIndex) || (idx < todayIndex && (todayIndex - idx) < user.streak);

                                  return (
                                     <div key={idx} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.6)]' : 'bg-surface-300 text-gray-500'}`}>
                                           {isActive && <Check size={14} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-[10px] font-bold ${isActive ? 'text-orange-500' : 'text-gray-600'}`}>{day}</span>
                                     </div>
                                  );
                               })}
                            </div>
                            <p className="text-gray-400 font-medium text-sm">Keep the fire burning!</p>
                        </div>

                        {/* Footer */}
                        <div className="bg-surface-100 p-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-400 to-emerald-600 flex items-center justify-center">
                                  <Zap size={16} className="text-black fill-black" />
                                </div>
                               <div>
                                  <div className="text-xs font-black text-white uppercase tracking-wider">Synapse</div>
                                  <div className="text-[10px] text-gray-500">{user.username}</div>
                               </div>
                            </div>
                        </div>
                     </div>
                 </div>

                 <div className="flex gap-3 mt-6">
                     <button 
                       onClick={handleCaptureAndShare} 
                       disabled={isCapturing}
                       className="flex-1 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg active:scale-95 transform"
                     >
                        {isCapturing ? <Loader2 className="animate-spin" /> : <><Share2 size={20} /> Share Progress</>}
                     </button>
                 </div>

             </div>
         </div>
      )}

      {/* SHARE SHEET (Kept same as before) */}
      {showShareSheet && capturedImage && (
         <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowShareSheet(false)}>
            <div className="bg-[#1c1c1e] w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-slide-up border border-white/10" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6 opacity-50"></div>
                <h3 className="text-xl font-bold text-white mb-6 text-center">Share Achievement</h3>
                <div className="mb-8 flex justify-center">
                    <img src={capturedImage} alt="Streak Card" className="w-48 rounded-xl shadow-lg border border-white/10 transform rotate-2" />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                   <a 
                     href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} 
                     target="_blank" rel="noreferrer"
                     className="flex flex-col items-center gap-2 group"
                   >
                      <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform">
                         <MessageCircle size={28} />
                      </div>
                      <span className="text-xs text-gray-400">WhatsApp</span>
                   </a>
                   <a 
                     href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} 
                     target="_blank" rel="noreferrer"
                     className="flex flex-col items-center gap-2 group"
                   >
                      <div className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform">
                         <Twitter size={24} />
                      </div>
                      <span className="text-xs text-gray-400">X</span>
                   </a>
                   <a 
                     href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://synapse.edu')}`} 
                     target="_blank" rel="noreferrer"
                     className="flex flex-col items-center gap-2 group"
                   >
                      <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform">
                         <Facebook size={28} />
                      </div>
                      <span className="text-xs text-gray-400">Facebook</span>
                   </a>
                    <button 
                     onClick={() => {
                        handleDownload();
                        alert("Image saved! Open Instagram and post it to your Story.");
                     }} 
                     className="flex flex-col items-center gap-2 group"
                   >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform">
                         <Instagram size={28} />
                      </div>
                      <span className="text-xs text-gray-400">Instagram</span>
                   </button>
                </div>
                <div className="space-y-3">
                   <button 
                     onClick={handleNativeShare}
                     className="w-full py-3.5 bg-surface-300 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-surface-400 transition-colors"
                   >
                      <Smartphone size={20} /> Share via System
                   </button>
                   <button 
                     onClick={handleDownload}
                     className="w-full py-3.5 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                   >
                      <Download size={20} /> Save Image
                   </button>
                </div>
                <button onClick={() => setShowShareSheet(false)} className="mt-6 w-full py-3 text-gray-500 font-bold hover:text-white">
                   Close
                </button>
            </div>
         </div>
      )}

    </div>
  );
};

export default Dashboard;