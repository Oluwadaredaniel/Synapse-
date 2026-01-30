import React from 'react';
import { useApp } from '../store/AppContext';
import { MOCK_ACHIEVEMENTS } from '../constants';
import { Lock } from 'lucide-react';

const Achievements: React.FC = () => {
  const { user, lessons } = useApp();

  if (!user) return null;

  // Dynamic check logic - Deterministic, no randomization.
  const checkUnlock = (id: string) => {
    switch(id) {
      case '1': // First Steps
        return lessons.length > 0;
      case '2': // Streak Master
        return user.streak >= 7;
      case '3': // Quiz Whiz
        // In a real app, this would check a 'maxQuizScore' field on the user model.
        // For now, we check if they have enough XP to imply mastery.
        return user.xp > 500; 
      case '4': // Night Owl
        // STRICT CHECK: Returns true if current time is between 12 AM and 5 AM
        // OR if the user's lastActive timestamp was in that range.
        const currentHour = new Date().getHours();
        const lastActiveHour = new Date(user.lastActive).getHours();
        return (currentHour >= 0 && currentHour < 5) || (lastActiveHour >= 0 && lastActiveHour < 5);
      case '5': // Socialite
        return false; // Feature pending 'Social' module
      case '6': // Content Creator
        return lessons.length >= 5;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
         <span className="text-sm text-gray-500">
            {MOCK_ACHIEVEMENTS.filter(a => checkUnlock(a.id)).length} / {MOCK_ACHIEVEMENTS.length} Unlocked
         </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MOCK_ACHIEVEMENTS.map((ach) => {
          const isUnlocked = checkUnlock(ach.id);
          return (
            <div 
              key={ach.id}
              className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isUnlocked 
                  ? 'bg-white dark:bg-surface-50 border-primary-500/50 shadow-[0_0_15px_-3px_rgba(124,58,237,0.2)]' 
                  : 'bg-gray-100 dark:bg-surface-50/30 border-gray-200 dark:border-white/5 opacity-60 grayscale'
              }`}
            >
              <div className="text-4xl mb-3 relative">
                {ach.icon}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={24} className="text-gray-500 dark:text-gray-400 drop-shadow-md" />
                  </div>
                )}
              </div>
              <h3 className={`font-bold mb-1 ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                 {ach.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
              {isUnlocked && (
                <span className="mt-3 text-[10px] uppercase font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                  Unlocked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;