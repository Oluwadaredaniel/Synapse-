import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { usePwa } from './hooks/usePwa';
import { AppRoute } from './types';
import { Loader2, Menu } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

// Pages
import Landing from './pages/Landing';
import PwaLanding from './pages/PwaLanding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword'; // Added
import ResetPassword from './pages/ResetPassword'; // Added
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Learning from './pages/Learning';
import Quiz from './pages/Quiz';
import Exam from './pages/Exam';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import HowItWorks from './pages/HowItWorks';
import AuraEngine from './pages/AuraEngine';
import AdminDashboard from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useApp();
  const { supportsPWA, installPwa, isStandalone } = usePwa();
  
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial Route Resolution (Handle URL parameters for Reset Password)
  useEffect(() => {
     const path = window.location.pathname;
     if (path.startsWith('/reset-password/')) {
        setCurrentRoute(AppRoute.RESET_PASSWORD);
     }
  }, []);

  // Initial Onboarding Check for PWA
  useEffect(() => {
    if (isLoading) return; // Wait for auth check

    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    // Strict Logic: Only go to PWA landing if in standalone mode AND hasn't seen onboarding AND not logged in
    if (isStandalone && !hasSeenOnboarding && !user) {
      setCurrentRoute(AppRoute.PWA_LANDING);
    } 
    // If just checking the site on web and not logged in, stick to LANDING
    else if (!user && !isStandalone && currentRoute !== AppRoute.LOGIN && currentRoute !== AppRoute.SIGNUP && currentRoute !== AppRoute.FORGOT_PASSWORD && currentRoute !== AppRoute.RESET_PASSWORD) {
      setCurrentRoute(AppRoute.LANDING);
    }
  }, [user, isStandalone, isLoading]);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      // 1. Security Redirect: Prevent students from accessing Admin Dashboard via URL
      if (currentRoute === AppRoute.ADMIN_DASHBOARD && user.role !== 'admin') {
        setCurrentRoute(AppRoute.DASHBOARD);
        return;
      }

      // 2. Convenience Redirect: Logged-in users shouldn't see Landing/Login/Signup/Forgot
      if ([AppRoute.LANDING, AppRoute.LOGIN, AppRoute.PWA_LANDING, AppRoute.SIGNUP, AppRoute.FORGOT_PASSWORD, AppRoute.HOW_IT_WORKS, AppRoute.AURA_ENGINE].includes(currentRoute)) {
        if (user.role === 'admin') {
          setCurrentRoute(AppRoute.ADMIN_DASHBOARD);
        } else {
          // Allow access to info pages even if logged in? Usually apps redirect to dashboard.
          if ([AppRoute.LANDING, AppRoute.LOGIN, AppRoute.SIGNUP, AppRoute.FORGOT_PASSWORD].includes(currentRoute)) {
             setCurrentRoute(AppRoute.DASHBOARD);
          }
        }
      }
    }
  }, [user, currentRoute, isLoading]);

  const navigate = (route: string, params?: any) => {
    if (params?.lessonId) {
      setSelectedLessonId(params.lessonId);
    }
    // If navigating to Exam without specific lesson, clear selection so it generates 'All' deck
    if (route === AppRoute.EXAM && !params?.lessonId) {
       setSelectedLessonId(null);
    }
    setCurrentRoute(route as AppRoute);
    window.scrollTo(0, 0);
  };

  // --- 1. GLOBAL LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-600/20 blur-xl rounded-full"></div>
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin relative z-10" />
        </div>
        <p className="mt-4 text-sm text-gray-400 font-medium tracking-wider animate-pulse">INITIALIZING AURA...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentRoute) {
      case AppRoute.LANDING:
        return <Landing navigate={navigate} installPwa={installPwa} supportsPWA={supportsPWA} />;
      case AppRoute.PWA_LANDING:
        return <PwaLanding navigate={navigate} />;
      case AppRoute.LOGIN:
        return <Login navigate={navigate} />;
      case AppRoute.SIGNUP:
        return <Signup navigate={navigate} />;
      case AppRoute.FORGOT_PASSWORD:
        return <ForgotPassword navigate={navigate} />;
      case AppRoute.RESET_PASSWORD:
        return <ResetPassword navigate={navigate} />;
      case AppRoute.HOW_IT_WORKS:
        return <HowItWorks navigate={navigate} />;
      case AppRoute.AURA_ENGINE:
        return <AuraEngine navigate={navigate} />;
      case AppRoute.DASHBOARD:
        return <Dashboard navigate={navigate} />;
      case AppRoute.UPLOAD:
        return <Upload navigate={navigate} />;
      case AppRoute.LEARNING:
        return <Learning navigate={navigate} selectedLessonId={selectedLessonId} />;
      case AppRoute.QUIZ:
        return <Quiz navigate={navigate} lessonId={selectedLessonId} />;
      case AppRoute.EXAM:
        return <Exam navigate={navigate} lessonId={selectedLessonId} />;
      case AppRoute.ACHIEVEMENTS:
        return <Achievements />;
      case AppRoute.LEADERBOARD:
        return <Leaderboard />;
      case AppRoute.PROFILE:
        return <Profile navigate={navigate} />;
      case AppRoute.SETTINGS:
        return <Settings navigate={navigate} />;
      case AppRoute.PRIVACY:
        return <Privacy navigate={navigate} />;
      case AppRoute.ADMIN_DASHBOARD:
        return user?.role === 'admin' ? <AdminDashboard navigate={navigate} /> : <Dashboard navigate={navigate} />;
      default:
        return <Landing navigate={navigate} installPwa={installPwa} supportsPWA={supportsPWA} />;
    }
  };

  // Routes that do NOT show the main sidebar/bottom nav
  const isAuthRoute = [
    AppRoute.LANDING, 
    AppRoute.LOGIN, 
    AppRoute.SIGNUP,
    AppRoute.FORGOT_PASSWORD,
    AppRoute.RESET_PASSWORD,
    AppRoute.PWA_LANDING,
    AppRoute.HOW_IT_WORKS,
    AppRoute.AURA_ENGINE
  ].includes(currentRoute);

  const isAdminRoute = currentRoute.startsWith('/admin');
  const isFocusMode = [AppRoute.QUIZ, AppRoute.EXAM].includes(currentRoute);

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary-500/30">
      
      {/* Mobile Sidebar Trigger (Hamburger) */}
      {!isAuthRoute && !isAdminRoute && !isFocusMode && (
         <div className="md:hidden fixed top-0 left-0 right-0 p-4 z-40 pointer-events-none">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="bg-surface-100/80 backdrop-blur-md p-2 rounded-lg text-white border border-white/10 shadow-lg pointer-events-auto"
            >
               <Menu size={24} />
            </button>
         </div>
      )}

      {/* Sidebar (Responsive) */}
      {!isAuthRoute && !isAdminRoute && !isFocusMode && (
         <Sidebar 
            currentRoute={currentRoute} 
            navigate={navigate} 
            isMobileOpen={isSidebarOpen}
            closeMobile={() => setIsSidebarOpen(false)}
         />
      )}
      
      <main className={`
        min-h-screen transition-all duration-300
        ${!isAuthRoute && !isAdminRoute && !isFocusMode ? 'md:ml-64' : 'w-full'}
        ${isAuthRoute ? 'p-0' : 'p-4 pb-24 md:p-8 lg:p-12'}
        ${currentRoute === AppRoute.LEARNING ? 'max-w-4xl mx-auto' : 'max-w-7xl mx-auto'}
      `}>
        {renderPage()}
      </main>

      {/* Mobile Bottom Nav */}
      {!isAuthRoute && !isAdminRoute && !isFocusMode && <BottomNav currentRoute={currentRoute} navigate={navigate} />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}