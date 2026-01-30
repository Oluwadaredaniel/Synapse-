import React from 'react';
import { Home, BookOpen, Upload, Trophy, User, LogOut, Settings, Award, Activity, Layers, X } from 'lucide-react';
import { AppRoute } from '../types';
import { useApp } from '../store/AppContext';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, navigate, isMobileOpen = false, closeMobile }) => {
  const { user, logout } = useApp();

  const navItems = [
    { icon: Home, label: 'Dashboard', route: AppRoute.DASHBOARD },
    { icon: BookOpen, label: 'My Learning', route: AppRoute.LEARNING },
    { icon: Layers, label: 'Exam Prep', route: AppRoute.EXAM },
    { icon: Upload, label: 'Upload Content', route: AppRoute.UPLOAD },
    { icon: Trophy, label: 'Leaderboard', route: AppRoute.LEADERBOARD },
    { icon: Award, label: 'Achievements', route: AppRoute.ACHIEVEMENTS },
    { icon: User, label: 'Profile', route: AppRoute.PROFILE },
  ];

  const handleLogout = () => {
    if (closeMobile) closeMobile();
    logout();
    navigate(AppRoute.LANDING);
  };

  const handleNav = (route: string) => {
    if (closeMobile) closeMobile();
    navigate(route);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={closeMobile}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 z-50 h-screen bg-background border-r border-white/5 flex flex-col w-64 transition-transform duration-300 shadow-2xl md:shadow-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 pb-8 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNav(AppRoute.LANDING)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-glow-green group-hover:scale-105 transition-transform">
              <Activity size={18} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Synapse</span>
          </div>
          
          {/* Mobile Close Button */}
          <button onClick={closeMobile} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-4 mb-2">Menu</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-900/20 text-white shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)] border border-primary-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`mr-3 transition-colors ${isActive ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'}`} 
                />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                )}
              </button>
            );
          })}

          {/* Admin Link */}
          {user?.role === 'admin' && (
             <button
               onClick={() => handleNav(AppRoute.ADMIN_DASHBOARD)}
               className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 group mt-4 border border-red-500/20 ${
                 currentRoute === AppRoute.ADMIN_DASHBOARD
                   ? 'bg-red-500/10 text-red-400 shadow-sm'
                   : 'text-red-400 hover:text-red-300 hover:bg-red-500/5'
               }`}
             >
               <Activity size={18} className="mr-3" />
               <span className="text-sm font-bold">Admin Console</span>
             </button>
          )}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => handleNav(AppRoute.SETTINGS)}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentRoute === AppRoute.SETTINGS ? 'text-white bg-surface-100' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={18} className="mr-3 text-gray-500" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} className="mr-3 opacity-70" />
            Logout
          </button>
        </div>
        
        {/* User Mini Profile */}
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-white/5 hover:border-white/10 transition-colors cursor-pointer" onClick={() => handleNav(AppRoute.PROFILE)}>
             <div className="w-8 h-8 rounded-full bg-surface-200 overflow-hidden ring-1 ring-white/10">
               {user?.avatarUrl && <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 truncate capitalize">{user?.role || 'Student'}</p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;