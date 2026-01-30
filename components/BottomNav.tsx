import React from 'react';
import { Home, BookOpen, Upload, Trophy, User } from 'lucide-react';
import { AppRoute } from '../types';

interface BottomNavProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentRoute, navigate }) => {
  const navItems = [
    { icon: Home, label: 'Home', route: AppRoute.DASHBOARD },
    { icon: BookOpen, label: 'Learn', route: AppRoute.LEARNING },
    { icon: Upload, label: 'Upload', route: AppRoute.UPLOAD },
    { icon: Trophy, label: 'Rank', route: AppRoute.LEADERBOARD },
    { icon: User, label: 'Profile', route: AppRoute.PROFILE },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;