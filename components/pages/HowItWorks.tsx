import React, { useState } from 'react';
import { AppRoute } from '../types';
import { ArrowLeft, Upload, Brain, Trophy, Zap, Layers, Smartphone } from 'lucide-react';

interface Props {
  navigate: (route: string) => void;
}

const HowItWorks: React.FC<Props> = ({ navigate }) => {
  const steps = [
    {
      id: 1,
      title: "Content Ingestion",
      desc: "Upload your raw lecture slides, PDFs, or messy notes. Synapse's secure parser extracts text and structure.",
      icon: <Upload className="text-blue-400" size={32} />
    },
    {
      id: 2,
      title: "AURA Analysis",
      desc: "Our AI engine scans the content for key concepts and cross-references them with your selected 'Vibe' (e.g., Anime, Sports).",
      icon: <Brain className="text-purple-400" size={32} />
    },
    {
      id: 3,
      title: "Lesson Generation",
      desc: "The content is rewritten using metaphors you understand. A physics lesson becomes a football strategy guide.",
      icon: <Zap className="text-yellow-400" size={32} />
    },
    {
      id: 4,
      title: "Active Recall",
      desc: "The system automatically generates flashcards and quizzes to test your retention immediately.",
      icon: <Layers className="text-green-400" size={32} />
    },
    {
      id: 5,
      title: "Gamified Mastery",
      desc: "Earn XP, maintain streaks, and climb the leaderboard. Learning becomes a competitive sport.",
      icon: <Trophy className="text-orange-400" size={32} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Navbar */}
      <nav className="p-6 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(AppRoute.LANDING)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold">How it Works</h1>
           </div>
           <button 
             onClick={() => navigate(AppRoute.SIGNUP)}
             className="px-6 py-2 bg-primary-600 rounded-full font-bold text-sm hover:bg-primary-500 transition-colors"
           >
             Get Started
           </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
           From <span className="text-gray-500 line-through">Boring PDF</span> to <span className="text-primary-400">Epic Lesson</span>.
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
           We don't just summarize. We translate complex academic material into the language of your hobbies.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
         <div className="space-y-12">
            {steps.map((step, idx) => (
               <div key={step.id} className="flex flex-col md:flex-row gap-8 items-center bg-[#0f172a] p-8 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all group">
                  <div className="w-20 h-20 rounded-2xl bg-[#1e293b] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                     {step.icon}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <div className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-2">Step 0{step.id}</div>
                     <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                     <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-900/20 py-24 border-y border-white/5">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to transform your grades?</h2>
            <div className="flex justify-center gap-4">
               <button 
                 onClick={() => navigate(AppRoute.SIGNUP)}
                 className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
               >
                 Start Learning Free
               </button>
               <button 
                 onClick={() => navigate(AppRoute.PWA_LANDING)}
                 className="px-8 py-4 bg-transparent border border-white/20 rounded-xl font-bold text-lg hover:bg-white/5 transition-all flex items-center gap-2"
               >
                 <Smartphone size={20} /> Mobile App
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HowItWorks;