import React from 'react';
import { ArrowLeft, Target, Heart, Zap } from 'lucide-react';
import { AppRoute } from '../types';

interface MissionProps {
  navigate: (route: string) => void;
}

const Mission: React.FC<MissionProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-black text-white">
        <nav className="p-6">
            <button 
                onClick={() => navigate(AppRoute.LANDING)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back home
            </button>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                The Mission.
            </h1>
            <p className="text-2xl text-gray-400 leading-relaxed font-light mb-16">
                Education hasn't changed in 100 years. <br/>
                <span className="text-white font-medium">We think that's a problem.</span>
            </p>

            <div className="grid gap-12">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Target className="text-red-500" size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">The Problem: Friction</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Textbooks are dense. Lectures are long. The cognitive load required just to *start* studying is too high. 
                            Students spend more time organizing their notes than actually learning from them.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Zap className="text-yellow-500" size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">The Solution: Translation</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Synapse isn't just a flashcard app. It's a translator. We take academic language and translate it into 
                            concepts you actually care about—whether that's Anime, Sports, or Music. 
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Heart className="text-primary-500" size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">The Goal: Flow State</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            We want to make studying as addictive as scrolling TikTok. By adding XP, streaks, and leagues, 
                            we hack your brain's dopamine reward system to make you *want* to learn.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-24 text-center">
                <p className="text-gray-500 mb-8">Ready to join the movement?</p>
                <button 
                    onClick={() => navigate(AppRoute.SIGNUP)}
                    className="px-8 py-4 bg-white text-black font-black text-xl rounded-full hover:scale-105 transition-transform"
                >
                    Get Started
                </button>
            </div>
        </div>
    </div>
  );
};

export default Mission;
