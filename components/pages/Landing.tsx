import React, { useState, useEffect, useRef } from 'react';
import { AppRoute } from '../types';
import { 
  ArrowRight, Download, Brain, Menu, X, 
  Sparkles, Zap, Activity, Layers, 
  Star, Check, Trophy, Flame, BookOpen, 
  Gamepad2, GraduationCap, Timer, Heart, Repeat,
  CheckCircle2, XCircle, Smartphone, User
} from 'lucide-react';

// --- INTERSECTION OBSERVER COMPONENT ---
const ScrollReveal = ({ children, className = '', delay = 0 }: { children?: React.ReactNode, className?: string, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface LandingProps {
  navigate: (route: string) => void;
  installPwa: () => void;
  supportsPWA: boolean;
}

const Landing: React.FC<LandingProps> = ({ navigate, installPwa, supportsPWA }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Hero Typing Effect
  const [heroText, setHeroText] = useState('');
  const fullHeroText = "Gamify Your Degree.";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    let i = 0;
    const interval = setInterval(() => {
      setHeroText(fullHeroText.slice(0, i));
      i++;
      if (i > fullHeroText.length) clearInterval(interval);
    }, 80);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    }
  }, []);

  // Mouse Parallax Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
    document.documentElement.style.setProperty('--mouse-move-x', `${moveX}px`);
    document.documentElement.style.setProperty('--mouse-move-y', `${moveY}px`);
    
    const cards = document.getElementsByClassName('spotlight-card');
    for (const card of cards) {
      const rect = (card as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-primary-500/30" onMouseMove={handleMouseMove}>
      
      {/* Global Noise Overlay */}
      <div className="noise-overlay fixed inset-0 z-[100] pointer-events-none opacity-5"></div>

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vh] bg-primary-900/10 rounded-full blur-[120px] animate-blob"></div>
         <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vh] bg-green-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-emerald-900/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
         <div className="absolute inset-0 bg-grid opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>
      </div>

      {/* --- Navbar --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-strong py-4 shadow-lg border-b border-white/5' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(AppRoute.LANDING)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform">
                 <Brain size={24} className="text-black fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-sans group-hover:text-primary-400 transition-colors">Synapse</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
               {['How it Works', 'Leagues', 'Engine', 'Reviews'].map((item) => (
                 <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm font-bold text-gray-400 hover:text-white transition-colors relative group">
                   {item}
                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                 </a>
               ))}
               <div className="h-6 w-px bg-white/10 mx-2"></div>
               <button onClick={() => navigate(AppRoute.LOGIN)} className="text-sm font-bold text-white hover:text-primary-400 transition-colors">Log in</button>
               <button onClick={() => navigate(AppRoute.SIGNUP)} className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-black hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                 Start Free
               </button>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
        
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 md:hidden animate-fade-in z-50">
            <button onClick={() => navigate(AppRoute.LOGIN)} className="text-lg font-bold text-gray-300 text-left py-2 border-b border-white/5">Log in</button>
            <button onClick={() => navigate(AppRoute.SIGNUP)} className="w-full py-4 bg-primary-600 text-white font-black rounded-xl shadow-lg">Start Free</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-40 pb-20 px-6 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
         
         <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-900/10 backdrop-blur-md text-xs font-black text-primary-400 mb-8 hover:bg-primary-900/20 transition-colors cursor-default shadow-lg shadow-primary-900/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span className="tracking-wide uppercase">AI-Powered Mastery</span>
            </div>
         </ScrollReveal>

         <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9] max-w-5xl mx-auto drop-shadow-2xl">
            {heroText}
            <span className="animate-pulse text-primary-500">_</span>
         </h1>
         
         <ScrollReveal delay={200}>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                The addictively fun way to master your coursework. Upload notes, earn XP, and compete in leagues. 
            </p>
         </ScrollReveal>
         
         <ScrollReveal delay={400} className="flex flex-col sm:flex-row gap-4 items-center justify-center z-20 relative">
            <button 
               onClick={() => navigate(AppRoute.SIGNUP)} 
               className="px-10 py-5 bg-primary-500 text-black rounded-2xl font-black text-xl hover:scale-105 hover:bg-primary-400 transition-all w-full sm:w-auto flex items-center justify-center gap-3 group shadow-[0_0_40px_rgba(34,197,94,0.4)] relative overflow-hidden"
            >
               <span className="relative z-10">Start Learning</span>
               <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform relative z-10"/>
            </button>
            
            {supportsPWA && (
               <button 
                  onClick={installPwa} 
                  className="px-8 py-5 bg-surface-100 hover:bg-surface-200 border-b-4 border-surface-300 text-white rounded-2xl font-bold text-lg transition-all w-full sm:w-auto flex items-center justify-center gap-2 active:border-b-0 active:translate-y-1"
               >
                  <Download size={20} className="text-gray-400" />
                  Get App
               </button>
            )}
         </ScrollReveal>

         <div className="mt-8 text-sm font-bold text-gray-500 flex items-center gap-2">
             <CheckCircle2 size={16} className="text-primary-500" /> No credit card needed
             <span className="mx-2">•</span>
             <CheckCircle2 size={16} className="text-primary-500" /> Open Access
         </div>

         {/* GAMIFIED MOCKUP (Desktop) */}
         <div 
            className="mt-24 relative w-full max-w-6xl mx-auto perspective-1000"
            style={{ transform: `translate(var(--mouse-move-x), var(--mouse-move-y))` }}
         >
             <ScrollReveal delay={600} className="relative z-10 rounded-3xl border-4 border-gray-800 bg-[#0a0a0a] shadow-2xl shadow-primary-900/20 overflow-hidden transform rotate-x-6 hover:rotate-x-0 transition-transform duration-1000 mx-auto max-w-4xl h-[500px] flex flex-col md:flex-row">
                
                {/* Sidebar (Fake) */}
                <div className="hidden md:flex flex-col w-20 border-r border-white/5 items-center py-8 gap-8 bg-black">
                   <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-500 flex items-center justify-center"><BookOpen size={20}/></div>
                   <div className="w-10 h-10 rounded-xl bg-transparent text-gray-600 flex items-center justify-center"><Trophy size={20}/></div>
                   <div className="w-10 h-10 rounded-xl bg-transparent text-gray-600 flex items-center justify-center"><Gamepad2 size={20}/></div>
                   <div className="mt-auto w-8 h-8 rounded-full bg-gray-800"></div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-surface-50 relative overflow-hidden flex flex-col items-center justify-center">
                   
                   {/* Confetti / Success State */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-black to-black"></div>
                   
                   <div className="relative z-10 text-center space-y-6 animate-float">
                      <div className="flex justify-center gap-2 mb-4">
                         {[1,2,3].map(i => (
                             <Star key={i} size={48} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                         ))}
                      </div>
                      
                      <div>
                         <h2 className="text-4xl font-black text-white mb-2">Lesson Complete!</h2>
                         <p className="text-primary-400 font-bold text-xl">+150 XP Earned</p>
                      </div>

                      <div className="flex justify-center gap-4 mt-8">
                         <div className="bg-surface-100 border border-white/10 p-4 rounded-2xl w-32">
                            <div className="text-orange-500 font-black text-2xl mb-1 flex justify-center items-center gap-2">
                               <Flame fill="currentColor" size={24}/> 12
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase">Day Streak</div>
                         </div>
                         <div className="bg-surface-100 border border-white/10 p-4 rounded-2xl w-32">
                            <div className="text-blue-500 font-black text-2xl mb-1 flex justify-center items-center gap-2">
                               <Zap fill="currentColor" size={24}/> 94%
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase">Accuracy</div>
                         </div>
                      </div>

                      <div className="pt-8">
                         <button className="w-full max-w-xs mx-auto py-4 bg-primary-600 rounded-xl text-white font-black shadow-lg hover:scale-105 transition-transform">
                            CONTINUE
                         </button>
                      </div>
                   </div>

                </div>

             </ScrollReveal>
             
             {/* Decorative Elements around Mockup */}
             <div className="absolute -right-12 top-20 w-24 h-24 bg-primary-500 rounded-2xl rotate-12 blur-2xl opacity-20 animate-pulse"></div>
             <div className="absolute -left-12 bottom-20 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
         </div>
      </section>

      {/* --- SUBJECT MARQUEE (Infinite Scroll) --- */}
      <section className="py-12 bg-surface-50 border-y border-white/5 overflow-hidden">
         <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
               <div key={i} className="flex gap-12 px-6 items-center">
                  {[
                     "Computer Science", "Law", "Medicine", "History", "Psychology", 
                     "Physics", "Economics", "Literature", "Chemistry", "Art History",
                     "Philosophy", "Engineering", "Marketing", "Political Science"
                  ].map((subject, j) => (
                     <div key={j} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <span className="text-xl font-bold text-white">{subject}</span>
                     </div>
                  ))}
               </div>
            ))}
         </div>
      </section>

      {/* --- MOBILE MOCKUP SECTION --- */}
      <section className="py-32 px-6 bg-black relative overflow-hidden">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            
            <ScrollReveal className="order-2 md:order-1 relative flex justify-center">
               {/* Mobile Phone Mockup */}
               <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden z-10">
                  <div className="absolute top-0 inset-x-0 h-8 bg-black z-20 rounded-b-xl w-40 mx-auto"></div>
                  
                  {/* Screen Content */}
                  <div className="w-full h-full bg-surface-50 flex flex-col relative">
                      {/* Fake App Header */}
                      <div className="p-6 pt-12 flex justify-between items-center bg-black/50 backdrop-blur-md">
                          <div className="flex gap-2">
                             <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">XP</div>
                             <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500"><Flame size={16} fill="currentColor"/></div>
                          </div>
                      </div>

                      {/* Fake App Body */}
                      <div className="flex-1 p-6 space-y-4">
                          <div className="bg-surface-100 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white"><BookOpen size={20}/></div>
                             <div>
                                <div className="font-bold text-white">Daily Quest</div>
                                <div className="text-xs text-gray-400">Complete 1 Lesson</div>
                             </div>
                             <div className="ml-auto text-primary-400 font-bold text-xs">500 XP</div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="aspect-square bg-surface-100 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-4">
                                <Trophy size={32} className="text-yellow-400 mb-2" />
                                <div className="font-bold text-white text-sm">League</div>
                             </div>
                             <div className="aspect-square bg-surface-100 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-4">
                                <Activity size={32} className="text-red-400 mb-2" />
                                <div className="font-bold text-white text-sm">Stats</div>
                             </div>
                          </div>
                      </div>

                      {/* Fake Bottom Nav */}
                      <div className="mt-auto h-20 bg-surface-100 border-t border-white/5 flex justify-around items-center px-4">
                         <div className="text-primary-500"><Gamepad2 size={24}/></div>
                         <div className="text-gray-600"><Layers size={24}/></div>
                         <div className="text-gray-600"><User size={24}/></div>
                      </div>
                  </div>
               </div>

               {/* Glows */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            </ScrollReveal>

            <ScrollReveal delay={200} className="order-1 md:order-2 space-y-8">
               <div className="inline-block px-4 py-2 rounded-full bg-surface-100 border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                  <Smartphone size={14} className="inline mr-2 -mt-0.5" /> Mobile Optimized
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  Learn anywhere.<br/>
                  <span className="text-primary-500">Conquer everywhere.</span>
               </h2>
               <p className="text-xl text-gray-400 leading-relaxed">
                  Synapse feels like a native app. Install it on your home screen to keep your streak alive during your commute, coffee break, or boring lectures.
               </p>
               <div className="flex gap-4 pt-4">
                   <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-xl bg-surface-100 border border-white/10 flex items-center justify-center text-white font-bold text-lg">PWA</div>
                       <span className="text-xs text-gray-500 font-bold uppercase">Installable</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-xl bg-surface-100 border border-white/10 flex items-center justify-center text-white font-bold text-lg">OFF</div>
                       <span className="text-xs text-gray-500 font-bold uppercase">Offline Mode</span>
                   </div>
               </div>
            </ScrollReveal>
         </div>
      </section>

      {/* --- COMPARISON SECTION (Old vs New) --- */}
      <section id="how-it-works" className="py-32 px-6 bg-surface-50 relative">
         <div className="max-w-7xl mx-auto">
            <ScrollReveal>
               <h2 className="text-4xl md:text-6xl font-black text-center mb-20">
                  Stop Studying. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-600">Start Playing.</span>
               </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
               {/* Old Way */}
               <ScrollReveal className="bg-black p-8 md:p-12 rounded-3xl border border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><XCircle size={32} /></div>
                     <h3 className="text-2xl font-bold text-gray-400">The Boring Way</h3>
                  </div>
                  <ul className="space-y-6">
                     <li className="flex gap-4 items-start text-gray-500">
                        <X size={20} className="shrink-0 mt-1 text-red-900" />
                        <span>Reading 50-page PDFs until you fall asleep.</span>
                     </li>
                     <li className="flex gap-4 items-start text-gray-500">
                        <X size={20} className="shrink-0 mt-1 text-red-900" />
                        <span>Highlighting text blindly with no retention.</span>
                     </li>
                     <li className="flex gap-4 items-start text-gray-500">
                        <X size={20} className="shrink-0 mt-1 text-red-900" />
                        <span>Cramming 12 hours before the exam.</span>
                     </li>
                     <li className="flex gap-4 items-start text-gray-500">
                        <X size={20} className="shrink-0 mt-1 text-red-900" />
                        <span>Generic examples you can't relate to.</span>
                     </li>
                  </ul>
               </ScrollReveal>

               {/* Synapse Way */}
               <ScrollReveal delay={200} className="bg-black p-8 md:p-12 rounded-3xl border-2 border-primary-500/30 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-[50px] rounded-full"></div>
                  
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                     <div className="p-3 bg-primary-500/20 rounded-xl text-primary-400"><Gamepad2 size={32} /></div>
                     <h3 className="text-2xl font-black text-white">The Synapse Way</h3>
                  </div>
                  <ul className="space-y-6 relative z-10">
                     <li className="flex gap-4 items-start text-white text-lg font-medium">
                        <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-primary-500" />
                        <span>Uploaded notes turn into bite-sized levels.</span>
                     </li>
                     <li className="flex gap-4 items-start text-white text-lg font-medium">
                        <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-primary-500" />
                        <span>Instant quizzes with XP rewards.</span>
                     </li>
                     <li className="flex gap-4 items-start text-white text-lg font-medium">
                        <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-primary-500" />
                        <span>Study 15 mins/day to keep your streak alive.</span>
                     </li>
                     <li className="flex gap-4 items-start text-white text-lg font-medium">
                        <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-primary-500" />
                        <span>Analogies based on Anime, Sports, or Music.</span>
                     </li>
                  </ul>
               </ScrollReveal>
            </div>
         </div>
      </section>

      {/* --- FEATURES (Gamification) --- */}
      <section id="leagues" className="py-32 px-6 bg-black">
         <div className="max-w-7xl mx-auto">
            <ScrollReveal>
               <h2 className="text-4xl md:text-6xl font-black mb-16 text-center">Engineered for <span className="text-primary-500">Obsession</span></h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
               
               {/* 1. Streaks */}
               <ScrollReveal className="spotlight-card md:col-span-1 rounded-3xl bg-surface-50 border border-white/10 relative overflow-hidden group p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                     <Flame className="text-orange-500 fill-current animate-pulse-slow" size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Build a Streak</h3>
                  <p className="text-gray-400">
                     Consistency is key. Study every day to keep your fire burning. Don't let it go out!
                  </p>
               </ScrollReveal>

               {/* 2. Leagues */}
               <ScrollReveal delay={100} className="spotlight-card md:col-span-1 rounded-3xl bg-surface-50 border border-white/10 relative overflow-hidden group p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                     <Trophy className="text-yellow-400 fill-current animate-float" size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Climb the Leagues</h3>
                  <p className="text-gray-400">
                     Earn XP to promote from Bronze to Diamond league. Compete against students worldwide.
                  </p>
               </ScrollReveal>

               {/* 3. Vibe Mode */}
               <ScrollReveal delay={200} className="spotlight-card md:col-span-1 rounded-3xl bg-surface-50 border border-white/10 relative overflow-hidden group p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                     <Sparkles className="text-purple-400 fill-current animate-spin-slow" size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Vibe Mode</h3>
                  <p className="text-gray-400">
                     AI translates boring notes into metaphors you actually get. Physics explained via Football? Yes.
                  </p>
               </ScrollReveal>
            </div>
         </div>
      </section>

      {/* --- COMMUNITY --- */}
      <section id="reviews" className="py-24 border-y border-white/5 bg-surface-50 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
            <h2 className="text-3xl font-bold">Join 10,000+ Students</h2>
         </div>
         <div className="flex w-[200%] animate-marquee">
             {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-8 px-4">
                   {[
                      { text: "I actually look forward to studying now. It's weird.", user: "Alex, Med Student" },
                      { text: "My streak is at 45 days. I can't stop.", user: "Priya, Law Major" },
                      { text: "Finally a leaderboard that feels fair.", user: "Marcus, High School Senior" },
                      { text: "My screen time is now 80% Synapse.", user: "Sarah, Comp Sci" },
                      { text: "The Vibe Mode is literally magic.", user: "Chen, Self-Taught Dev" },
                      { text: "Turned my lecture notes into a game.", user: "Jordan, History Buff" }
                   ].map((t, j) => (
                      <div key={j} className="w-[350px] bg-black p-6 rounded-2xl border border-white/5 flex flex-col justify-between shrink-0 hover:border-primary-500/30 transition-colors">
                         <div className="flex gap-1 mb-4 text-yellow-500">
                             {[1,2,3,4,5].map(k => <Star key={k} size={16} fill="currentColor"/>)}
                         </div>
                         <p className="text-lg font-medium text-gray-200 mb-4">"{t.text}"</p>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                            <div className="text-sm text-gray-400 font-bold">{t.user}</div>
                         </div>
                      </div>
                   ))}
                </div>
             ))}
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6 relative overflow-hidden text-center bg-black">
         <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent pointer-events-none"></div>
         <ScrollReveal>
            <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
               Ready to<br/>Level Up?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
               Join thousands of students turning their boring course materials into addictive learning streaks.
            </p>
            <button 
               onClick={() => navigate(AppRoute.SIGNUP)} 
               className="px-12 py-6 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            >
               Get Started
            </button>
            <p className="mt-6 text-sm text-gray-600 font-bold uppercase tracking-widest">No Ads • No Hidden Fees</p>
         </ScrollReveal>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-surface-50 text-center relative z-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center gap-4 mb-8">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-400 to-emerald-600 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  <Brain size={24} className="text-black fill-current" />
               </div>
               <span className="font-black text-2xl tracking-tight text-white">Synapse</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-8 font-bold">
               <a href="#" className="hover:text-primary-400 transition-colors">Mission</a>
               <a href="#" className="hover:text-primary-400 transition-colors">Leagues</a>
               <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
               <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
            </div>
            <p className="text-gray-700 text-sm font-medium">
               &copy; {new Date().getFullYear()} Synapse. <br/>
               <span className="text-xs opacity-50">Making learning addictive since 2024.</span>
            </p>
         </div>
      </footer>

    </div>
  );
};

export default Landing;