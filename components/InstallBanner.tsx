import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap } from 'lucide-react';
import { usePwa } from '../hooks/usePwa';

const InstallBanner: React.FC = () => {
  const { supportsPWA, installPwa, isStandalone } = usePwa();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay showing the banner slightly for better UX
    const timer = setTimeout(() => {
      // Only show if browser supports PWA, it's NOT already installed/standalone, and user hasn't dismissed it this session
      if (supportsPWA && !isStandalone && !sessionStorage.getItem('dismissInstall')) {
        setIsVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [supportsPWA, isStandalone]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('dismissInstall', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-slide-up">
      <div className="bg-surface-100/90 backdrop-blur-xl border border-primary-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/20 blur-[30px] rounded-full pointer-events-none"></div>

        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
          <Smartphone className="text-primary-400" size={24} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm">Install Synapse App</h4>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">
            Enable offline mode, haptics, and instant loading.
          </p>
        </div>

        <button
          onClick={installPwa}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-glow transition-all active:scale-95 whitespace-nowrap"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;