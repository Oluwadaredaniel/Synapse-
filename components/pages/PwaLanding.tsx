import React, { useState } from 'react';
import { AppRoute } from '../types';
import { ChevronRight, ArrowRight, Brain, Zap, Layers, Trophy, Check } from 'lucide-react';

interface PwaLandingProps {
  navigate: (route: string) => void;
}

const slides = [
  {
    id: 'intro',
    bg: 'bg-black',
    accent: 'text-primary-400',
    icon: <div className="w-24 h-24 bg-primary-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-float"><Layers size={48} className="text-white"/></div>,
    title: "Learning,\nReinvented.",
    desc: "Welcome to Synapse. The AI tutor that adapts to your brain, not the other way around.",
    cta: "Start Tour"
  },
  {
    id: 'aura',
    bg: 'bg-[#0f0518]', // Deep purple tint
    accent: 'text-purple-400',
    icon: <Brain size={80} className="text-purple-400 animate-pulse-slow" />,
    title: "Meet AURA",
    desc: "Our Adaptive Unified Reasoning Agent. It explains Quantum Physics using NBA highlights. Seriously.",
    cta: "Next"
  },
  {
    id: 'gamify',
    bg: 'bg-[#1a1005]', // Deep orange tint
    accent: 'text-orange-400',
    icon: <Zap size={80} className="text-orange-400 animate-bounce" />,
    title: "Addictive by Design",
    desc: "Earn XP. Maintain Streaks. Unlock Achievements. We made studying feel like leveling up in an RPG.",
    cta: "Next"
  },
  {
    id: 'rank',
    bg: 'bg-[#051a10]', // Deep green tint
    accent: 'text-green-400',
    icon: <Trophy size={80} className="text-green-400 animate-float" />,
    title: "Global Leagues",
    desc: "Compete with students from top universities around the world. Prove your mastery on the global stage.",
    cta: "I'm Ready"
  }
];

const PwaLanding: React.FC<PwaLandingProps> = ({ navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate(AppRoute.SIGNUP);
  };

  return (
    <div className="fixed inset-0 overflow-hidden font-sans">
      {/* Background Transition Layer */}
      {slides.map((slide, idx) => (
         <div 
           key={slide.id}
           className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${slide.bg} ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         >
            {/* Ambient Noise */}
            <div className="absolute inset-0 bg-noise opacity-10"></div>
            {/* Ambient Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 ${slide.accent.replace('text', 'bg')}`}></div>
         </div>
      ))}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center">
         <div className="flex gap-1">
            {slides.map((_, i) => (
               <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}></div>
            ))}
         </div>
         <button onClick={finishOnboarding} className="text-white/50 text-sm font-medium hover:text-white transition-colors">Skip</button>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-40 text-center">
          <div key={currentSlide} className="animate-slide-up space-y-8 max-w-sm">
             <div className="h-40 flex items-center justify-center">
                {slides[currentSlide].icon}
             </div>
             
             <h1 className="text-5xl font-black text-white tracking-tighter whitespace-pre-line leading-tight">
                {slides[currentSlide].title}
             </h1>
             
             <p className="text-lg text-gray-400 font-light leading-relaxed">
                {slides[currentSlide].desc}
             </p>
          </div>
      </div>

      {/* Bottom Action Area */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-50 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
         <button
            onClick={handleNext}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
               currentSlide === slides.length - 1
               ? 'bg-white text-black hover:bg-gray-200'
               : 'bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20'
            }`}
         >
            {slides[currentSlide].cta} <ArrowRight size={20} />
         </button>
      </div>

    </div>
  );
};

export default PwaLanding;