import React from 'react';
import { AppRoute } from '../types';
import { ArrowLeft, Cpu, ShieldCheck, GitBranch, Fingerprint, Activity, Code } from 'lucide-react';

interface Props {
  navigate: (route: string) => void;
}

const AuraEngine: React.FC<Props> = ({ navigate }) => {
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
              <h1 className="text-xl font-bold flex items-center gap-2">
                 <Cpu className="text-primary-500" /> AURA Engine
              </h1>
           </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden py-24 px-6">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-xs font-bold uppercase tracking-wider mb-6">
               Powered by Gemini 1.5 Pro
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
               Adaptive Unified <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Reasoning Agent</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
               AURA is not just a summarizer. It is a pedagogical engine designed to map academic concepts to personal interest vectors, ensuring maximum retention through analogical reasoning.
            </p>
         </div>
      </div>

      {/* Technical Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-8">
         
         <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/5">
            <Fingerprint className="text-blue-400 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Personalization Vectors</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
               AURA maintains a high-dimensional vector embedding of your interests. When you upload a lesson, it calculates the semantic distance between the topic (e.g., "Quantum Mechanics") and your interest (e.g., "Marvel Movies") to find the perfect analogy.
            </p>
            {/* Visual Representation instead of raw JSON */}
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
               <div className="flex justify-between text-xs text-gray-500 font-mono">
                  <span>INPUT TOPIC</span>
                  <span className="text-white">Calculus</span>
               </div>
               <div className="flex justify-between text-xs text-gray-500 font-mono">
                  <span>USER INTEREST</span>
                  <span className="text-white">Basketball</span>
               </div>
               <div className="h-px bg-white/10 my-1"></div>
               <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-gray-500">ANALOGY GENERATED</span>
                  <span className="text-green-400">Derivatives -> Velocity of Jump Shot</span>
               </div>
            </div>
         </div>

         <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/5">
            <ShieldCheck className="text-green-400 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Fairness & Integrity</h3>
            <p className="text-gray-400 leading-relaxed">
               To ensure fair leaderboards, AURA classifies every lesson into a domain (STEM, Humanities, etc.) and assigns a <strong>Difficulty Multiplier</strong>. A complex Astrophysics paper yields more XP than a 1-page essay, normalizing progress across different majors.
            </p>
         </div>

         <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/5">
            <GitBranch className="text-purple-400 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Pedagogical Verification</h3>
            <p className="text-gray-400 leading-relaxed">
               The output is structured according to Bloom's Taxonomy. It starts with lower-order thinking (Recall/Define) in the flashcards and moves to higher-order thinking (Analyze/Evaluate) in the quiz explanations.
            </p>
         </div>

         <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/5">
            <Code className="text-yellow-400 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Instant Processing</h3>
            <p className="text-gray-400 leading-relaxed">
               Our event-driven architecture handles complex PDF parsing, text extraction, and AI generation in parallel, delivering your personalized lesson in seconds.
            </p>
         </div>

      </div>

      <div className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
         <Activity size={16} className="inline mr-2" /> System Status: Operational
      </div>
    </div>
  );
};

export default AuraEngine;