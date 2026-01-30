import React from 'react';
import { useApp } from '../store/AppContext';
import { Bell, Moon, LogOut, Shield, Globe, Volume2 } from 'lucide-react';
import { AppRoute } from '../types';

interface SettingsProps {
  navigate: (route: string) => void;
}

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
    <h3 className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 uppercase tracking-wider">
      {title}
    </h3>
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {children}
    </div>
  </div>
);

const Item = ({ icon: Icon, label, action, value }: any) => (
  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer" onClick={action}>
    <div className="flex items-center text-gray-700 dark:text-gray-200">
      <Icon size={20} className="mr-4 text-gray-400" />
      <span className="font-medium">{label}</span>
    </div>
    {value}
  </div>
);

const Settings: React.FC<SettingsProps> = ({ navigate }) => {
  const { toggleTheme, theme, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate(AppRoute.LANDING);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <Section title="Appearance">
        <Item 
          icon={Moon} 
          label="Dark Mode" 
          action={toggleTheme}
          value={
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`} />
            </div>
          } 
        />
      </Section>

      <Section title="Notifications">
        <Item 
          icon={Bell} 
          label="Push Notifications" 
          value={<span className="text-sm text-primary-600 font-semibold">Enabled</span>} 
        />
        <Item 
          icon={Volume2} 
          label="Sound Effects" 
          value={<span className="text-sm text-gray-400">On</span>} 
        />
      </Section>

      <Section title="Account">
        <Item 
           icon={Globe} 
           label="Language" 
           value={<span className="text-sm text-gray-500">English</span>} 
           action={() => alert("More languages coming soon in v2.2!")}
        />
        <Item 
           icon={Shield} 
           label="Privacy & Security" 
           action={() => navigate(AppRoute.PRIVACY)}
        />
        <Item 
          icon={LogOut} 
          label="Log Out" 
          action={handleLogout}
          value={<span className="text-red-500 text-sm">Sign out</span>} 
        />
      </Section>
    </div>
  );
};

export default Settings;