import React, { useState, useEffect, useRef } from 'react';
import { AppRoute } from '../types';
import { 
  ArrowRight, Download, Brain, Menu, X, 
  Sparkles, Zap, Trophy, Flame, BookOpen, 
  Gamepad2, Smartphone, CheckCircle2, Globe, Crown
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

  const navLinks = [
    { label: 'How it Works', route: AppRoute.HOW_IT_WORKS },
    { label: 'Mission', route: AppRoute.MISSION },
    { label: 'Engine', route: AppRoute.AURA_ENGINE },
  ];

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
               {navLinks.map((item) => (
                 <button 
                    key={item.label} 
                    onClick={() => navigate(item.route)} 
                    className="text-sm font-bold text-gray-400 hover:text-white transition-colors relative group"
                 >
                   {item.label}
                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                 </button>
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
            {navLinks.map(link => (
                <button key={link.label} onClick={() => navigate(link.route)} className="text-lg font-bold text-gray-300 text-left py-2 border-b border-white/5">{link.label}</button>
            ))}
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
                <span className="tracking-wide uppercase">Private Beta Now Open</span>
            </div>
         </ScrollReveal>

         <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9] max-w-5xl mx-auto drop-shadow-2xl">
            {heroText}
            <span className="animate-pulse text-primary-500">_</span>
         </h1>
         
         <ScrollReveal delay={200}>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Be among the first to turn boring PDFs into addictive XP streaks. The future of learning starts here.
            </p>
         </ScrollReveal>
         
         <ScrollReveal delay={400} className="flex flex-col sm:flex-row gap-4 items-center justify-center z-20 relative">
            <button 
               onClick={() => navigate(AppRoute.SIGNUP)} 
               className="px-10 py-5 bg-primary-500 text-black rounded-2xl font-black text-xl hover:scale-105 hover:bg-primary-400 transition-all w-full sm:w-auto flex items-center justify-center gap-3 group shadow-[0_0_40px_rgba(34,197,94,0.4)] relative overflow-hidden"
            >
               <span className="relative z-10">Join Early Access</span>
               <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform relative z-10"/>
            </button>
            
            {supportsPWA && (
               <button 
                  onClick={installPwa} 
                  className="px-8 py-5 bg-surface-100 hover:bg-surface-200 border border-white/10 text-white rounded-2xl font-bold text-lg transition-all w-full sm:w-auto flex items-center justify-center gap-2 active:scale-95 group"
               >
                  <Download size={20} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
                  Install App
               </button>
            )}
         </ScrollReveal>

         <div className="mt-8 text-sm font-bold text-gray-500 flex items-center gap-2">
             <CheckCircle2 size={16} className="text-primary-500" /> Free for Students
             <span className="mx-2">•</span>
             <CheckCircle2 size={16} className="text-primary-500" /> No Waitlist
         </div>

         {/* GAMIFIED MOCKUP */}
         <div 
            className="mt-24 relative w-full max-w-5xl mx-auto perspective-1000"
            style={{ transform: `translate(var(--mouse-move-x), var(--mouse-move-y))` }}
         >
             <ScrollReveal delay={600} className="relative z-10 rounded-3xl border-4 border-gray-800 bg-[#0a0a0a] shadow-2xl shadow-primary-900/20 overflow-hidden transform rotate-x-6 hover:rotate-x-0 transition-transform duration-1000 mx-auto max-w-4xl h-[400px] md:h-[500px] flex flex-col md:flex-row">
                {/* Fake Sidebar */}
                <div className="hidden md:flex flex-col w-20 border-r border-white/5 items-center py-8 gap-8 bg-black">
                   <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-500 flex items-center justify-center"><BookOpen size={20}/></div>
                   <div className="w-10 h-10 rounded-xl bg-transparent text-gray-600 flex items-center justify-center"><Trophy size={20}/></div>
                   <div className="w-10 h-10 rounded-xl bg-transparent text-gray-600 flex items-center justify-center"><Gamepad2 size={20}/></div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-surface-50 relative overflow-hidden flex flex-col items-center justify-center p-8">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-black to-black"></div>
                   
                   <div className="relative z-10 text-center space-y-6 animate-float">
                      <div>
                         <h2 className="text-4xl font-black text-white mb-2">Concept Mastered!</h2>
                         <p className="text-primary-400 font-bold text-xl">+250 XP Awarded</p>
                      </div>

                      <div className="flex justify-center gap-4 mt-8">
                         <div className="bg-surface-100 border border-white/10 p-4 rounded-2xl w-32 backdrop-blur-md">
                            <div className="text-orange-500 font-black text-2xl mb-1 flex justify-center items-center gap-2">
                               <Flame fill="currentColor" size={24}/> 3
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase">Day Streak</div>
                         </div>
                         <div className="bg-surface-100 border border-white/10 p-4 rounded-2xl w-32 backdrop-blur-md">
                            <div className="text-blue-500 font-black text-2xl mb-1 flex justify-center items-center gap-2">
                               <Zap fill="currentColor" size={24}/> S
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase">Rank</div>
                         </div>
                      </div>
                   </div>
                </div>
             </ScrollReveal>
         </div>
      </section>

      {/* --- LEAGUES SECTION (New) --- */}
      <section className="py-24 bg-surface-50 border-y border-white/5 overflow-hidden relative">
         <div className="absolute inset-0 bg-grid opacity-10"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Rise Through the Ranks</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                      We've gamified the academic curve. Your grades might be private, but your XP tells the world who's really putting in the work.
                  </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                      { name: 'Bronze', color: 'text-orange-700', bg: 'bg-orange-900/20', border: 'border-orange-800' },
                      { name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-800/20', border: 'border-gray-700' },
                      { name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-600' },
                      { name: 'Platinum', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-600' },
                      { name: 'Diamond', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-600', glow: true }
                  ].map((rank, i) => (
                      <div key={rank.name} className={`p-6 rounded-2xl border ${rank.border} ${rank.bg} flex flex-col items-center justify-center text-center group transition-all hover:-translate-y-2`}>
                          <Crown size={32} className={`${rank.color} mb-3 ${rank.glow ? 'animate-pulse' : ''}`} />
                          <h3 className={`font-bold text-lg ${rank.color}`}>{rank.name}</h3>
                          <p className="text-xs text-gray-500 mt-2 font-mono">Top {100 - (i * 20)}%</p>
                      </div>
                  ))}
              </div>
            </ScrollReveal>
         </div>
      </section>

      {/* --- STUDENT ARCHETYPES (Replacing Testimonials) --- */}
      <section className="py-32 px-6 bg-black relative">
         <div className="max-w-7xl mx-auto">
             <ScrollReveal className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Built for Every Brain</h2>
                 <p className="text-gray-400 text-lg">Synapse adapts to your study style, not the other way around.</p>
             </ScrollReveal>

             <div className="grid md:grid-cols-3 gap-8">
                 <div className="bg-surface-50 p-8 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all">
                     <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 mb-6"><Zap size={24}/></div>
                     <h3 className="text-xl font-bold text-white mb-2">The Night Owl</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        For the 2 AM crammer who needs concepts explained simply and quickly. AURA condenses 50 slides into 5 minutes of high-yield content.
                     </p>
                 </div>
                 <div className="bg-surface-50 p-8 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 mb-6"><Brain size={24}/></div>
                     <h3 className="text-xl font-bold text-white mb-2">The Deep Diver</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        For the student who wants to connect History to Economics. Synapse builds knowledge graphs that link your subjects together.
                     </p>
                 </div>
                 <div className="bg-surface-50 p-8 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all">
                     <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 mb-6"><Trophy size={24}/></div>
                     <h3 className="text-xl font-bold text-white mb-2">The Competitor</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        For those who need a scoreboard to feel alive. Turn your GPA grind into a global ranking battle.
                     </p>
                 </div>
             </div>
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6 relative overflow-hidden text-center bg-black border-t border-white/5">
         <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent pointer-events-none"></div>
         <ScrollReveal>
            <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
               Claim Your<br/>Username
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
               The first 1,000 users get a special "Founder" badge on their profile. Don't miss out.
            </p>
            <button 
               onClick={() => navigate(AppRoute.SIGNUP)} 
               className="px-12 py-6 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            >
               Get Started Now
            </button>
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
               <button onClick={() => navigate(AppRoute.MISSION)} className="hover:text-primary-400 transition-colors">Mission</button>
               <button onClick={() => navigate(AppRoute.HOW_IT_WORKS)} className="hover:text-primary-400 transition-colors">How it Works</button>
               <button onClick={() => navigate(AppRoute.PRIVACY)} className="hover:text-primary-400 transition-colors">Privacy</button>
               <button onClick={() => navigate(AppRoute.TERMS)} className="hover:text-primary-400 transition-colors">Terms</button>
            </div>
            <p className="text-gray-700 text-sm font-medium">
               &copy; {new Date().getFullYear()} Synapse. <br/>
               <span className="text-xs opacity-50">Redefining Education.</span>
            </p>
         </div>
      </footer>

    </div>
  );
};

export default Landing;
