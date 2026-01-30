import { useState, useEffect } from 'react';

export const usePwa = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installPwa = () => {
    if (!promptInstall) return;
    promptInstall.prompt();
  };

  return { supportsPWA, installPwa, isStandalone };
};