import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AppRoute } from '../types';
// Added Trophy to imports
import { CheckCircle, XCircle, Award, AlertCircle, Zap, Shield, Flame, Trophy } from 'lucide-react';

interface QuizProps {
  navigate: (route: string) => void;
  lessonId: string | null;
}

const Quiz: React.FC<QuizProps> = ({ navigate, lessonId }) => {
  const { lessons, completeLesson } = useApp();
  const lesson = lessons.find(l => l.id === lessonId);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Game Mechanics
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [animateCombo, setAnimateCombo] = useState(false);

  useEffect(() => {
    if (combo > maxCombo) setMaxCombo(combo);
    if (combo > 1) {
        setAnimateCombo(true);
        const timer = setTimeout(() => setAnimateCombo(false), 500);
        return () => clearTimeout(timer);
    }
  }, [combo]);

  if (!lesson) return <div className="p-8 text-center text-gray-500">Lesson not found. Return to library.</div>;

  const currentQuestion = lesson.quiz[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    // Haptics & Logic
    if (idx === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
      setCombo(prev => prev + 1);
      // Success Haptic: Light Tap
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      setCombo(0); // Reset combo on miss
      // Error Haptic: Double Tap
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIdx < lesson.quiz.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz Finished - Long Vibration for success
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      setShowResults(true);
      if (score > 0 && !lesson.isCompleted) {
        setIsSubmitting(true);
        const finalMastery = Math.round((score / lesson.quiz.length) * 100);
        await completeLesson(lesson.id, lesson.xpReward, finalMastery);
        setIsSubmitting(false);
      }
    }
  };

  // --- VICTORY SCREEN ---
  if (showResults) {
    const accuracy = Math.round((score / lesson.quiz.length) * 100);
    let grade = 'F';
    let color = 'text-red-500';
    if (accuracy >= 90) { grade = 'S'; color = 'text-yellow-400'; }
    else if (accuracy >= 80) { grade = 'A'; color = 'text-green-400'; }
    else if (accuracy >= 60) { grade = 'B'; color = 'text-blue-400'; }
    else if (accuracy >= 40) { grade = 'C'; color = 'text-orange-400'; }

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-scale-up p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 to-transparent pointer-events-none"></div>
        
        <div className={`w-32 h-32 rounded-3xl bg-surface-100 border-4 border-white/10 flex items-center justify-center mb-4 shadow-2xl relative ${accuracy >= 80 ? 'shadow-glow-green' : ''}`}>
          <span className={`text-8xl font-black ${color} drop-shadow-md`}>{grade}</span>
          {accuracy >= 90 && <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase">Perfect</div>}
        </div>
        
        <div className="space-y-2 relative z-10">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Mission Complete</h2>
            <p className="text-xl text-gray-400">
            Accuracy: <span className={color}>{accuracy}%</span> • Max Combo: <span className="text-orange-400">{maxCombo}x</span>
            </p>
        </div>
        
        {lesson.isCompleted || isSubmitting ? (
             <div className="px-8 py-4 bg-green-500/10 rounded-2xl border border-green-500/30 flex items-center gap-4 shadow-lg backdrop-blur-md">
                <CheckCircle size={32} className="text-green-500" />
                <div className="text-left">
                    <div className="text-green-400 font-bold text-lg">XP Secured</div>
                    <div className="text-green-500/70 text-xs uppercase font-bold tracking-wider">Progress Saved</div>
                </div>
             </div>
        ) : (
            <div className="px-8 py-4 bg-primary-500/10 rounded-2xl border border-primary-500/30 flex items-center gap-4 shadow-lg backdrop-blur-md">
               <Trophy size={32} className="text-primary-400 animate-bounce" />
               <div className="text-left">
                    <div className="text-primary-400 font-bold text-lg">+{lesson.xpReward} XP</div>
                    <div className="text-primary-500/70 text-xs uppercase font-bold tracking-wider">Rewards Pending</div>
                </div>
            </div>
        )}

        <button
          onClick={() => navigate(AppRoute.DASHBOARD)}
          className="px-12 py-4 bg-white text-black font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
        >
          Return to Base
        </button>
      </div>
    );
  }

  // --- QUIZ GAME HUD ---
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-24 relative">
      
      {/* Top HUD */}
      <div className="flex items-center justify-between bg-surface-100 p-4 rounded-2xl border border-white/5 shadow-lg">
         <div className="flex items-center gap-4 w-full">
            <button onClick={() => navigate(AppRoute.DASHBOARD)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <XCircle size={24} className="text-gray-500" />
            </button>
            
            <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{currentQuestionIdx + 1} / {lesson.quiz.length}</span>
                </div>
                {/* Health Bar Style Progress */}
                <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/10 relative">
                    <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-primary-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        style={{ width: `${((currentQuestionIdx) / lesson.quiz.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Combo Meter */}
            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-black border border-white/10 transition-transform ${animateCombo ? 'scale-110 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : ''}`}>
                <div className={`text-2xl font-black italic leading-none ${combo > 1 ? 'text-orange-500' : 'text-gray-600'}`}>
                    {combo}x
                </div>
                <div className="text-[8px] font-bold text-gray-500 uppercase">Combo</div>
            </div>
         </div>
      </div>

      {/* Warning if re-playing */}
      {lesson.isCompleted && (
          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-center gap-2 text-sm text-blue-300 justify-center">
              <Shield size={16} /> 
              <span>Practice Mode: No XP will be awarded.</span>
          </div>
      )}

      {/* Question Card */}
      <div className="bg-surface-50 rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-8">
            {currentQuestion.question}
            </h3>

            <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
                let cardClass = "w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-lg relative overflow-hidden group ";
                
                if (isAnswered) {
                if (idx === currentQuestion.correctAnswerIndex) {
                    cardClass += "border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]";
                } else if (idx === selectedOption) {
                    cardClass += "border-red-500 bg-red-500/10 text-red-400 animate-shake";
                } else {
                    cardClass += "border-white/5 bg-black/20 text-gray-600 opacity-50";
                }
                } else {
                cardClass += "border-white/10 bg-surface-100 hover:border-primary-500/50 hover:bg-surface-200 text-gray-300 hover:text-white";
                }

                return (
                <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswered}
                    className={cardClass}
                >
                    <div className="flex justify-between items-center relative z-10">
                    <span>{option}</span>
                    {isAnswered && idx === currentQuestion.correctAnswerIndex && <CheckCircle size={24} className="text-green-500" />}
                    {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <XCircle size={24} className="text-red-500" />}
                    </div>
                </button>
                );
            })}
            </div>
        </div>
      </div>

      {/* Explanation & Next Button */}
      {isAnswered && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-xl border-t border-white/10 animate-slide-up z-50">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className={`p-4 rounded-xl border ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-red-500/10 border-red-500/30 text-red-200'}`}>
               <div className="font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                  {selectedOption === currentQuestion.correctAnswerIndex ? <><CheckCircle size={16}/> Correct</> : <><AlertCircle size={16}/> Incorrect</>}
               </div>
               <p className="text-sm opacity-90">{currentQuestion.explanation}</p>
            </div>
            
            <button
              onClick={handleNext}
              className={`w-full py-4 rounded-xl font-black text-lg shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${
                 selectedOption === currentQuestion.correctAnswerIndex ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {currentQuestionIdx === lesson.quiz.length - 1 ? 'Finish Mission' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;