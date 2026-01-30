import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AppRoute } from '../types';
import { RotateCw, Check, X, ArrowLeft, Brain, Layers } from 'lucide-react';

interface ExamProps {
  navigate: (route: string) => void;
  lessonId: string | null;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: 'concept' | 'quiz';
  lessonTitle: string;
}

const Exam: React.FC<ExamProps> = ({ navigate, lessonId }) => {
  const { lessons } = useApp();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Generate Flashcards from Lessons
    const deck: Flashcard[] = [];
    
    const sourceLessons = lessonId 
      ? lessons.filter(l => l.id === lessonId) 
      : lessons;

    sourceLessons.forEach(lesson => {
      // 1. Add Key Takeaways as Concept Cards
      lesson.sections.forEach((section, sIdx) => {
        if (section.keyTakeaways && section.keyTakeaways.length > 0) {
          section.keyTakeaways.forEach((takeaway, tIdx) => {
             deck.push({
               id: `concept-${lesson.id}-${sIdx}-${tIdx}`,
               front: `Key concept from "${section.title}"`,
               back: takeaway,
               type: 'concept',
               lessonTitle: lesson.title
             });
          });
        }
      });

      // 2. Add Quiz Questions
      lesson.quiz.forEach((q, qIdx) => {
        deck.push({
          id: `quiz-${lesson.id}-${qIdx}`,
          front: q.question,
          back: `${q.options[q.correctAnswerIndex]}\n\nExplaination: ${q.explanation}`,
          type: 'quiz',
          lessonTitle: lesson.title
        });
      });
    });

    // Shuffle Deck
    setFlashcards(deck.sort(() => Math.random() - 0.5));
  }, [lessons, lessonId]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIdx < flashcards.length - 1) {
        setCurrentCardIdx(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 200);
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-6 text-gray-500 border border-white/5">
          <Layers size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Cards Available</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Create some lessons first! We generate flashcards automatically from your content.
        </p>
        <button 
          onClick={() => navigate(AppRoute.UPLOAD)}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all"
        >
          Create Lesson
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-scale-up">
        <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mb-6 text-primary-400 shadow-glow-green">
          <Brain size={48} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
        <p className="text-gray-400 mb-8">You reviewed {flashcards.length} cards.</p>
        <button 
          onClick={() => navigate(AppRoute.DASHBOARD)}
          className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIdx];

  return (
    <div className="max-w-xl mx-auto pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(AppRoute.DASHBOARD)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
           Card {currentCardIdx + 1} / {flashcards.length}
        </span>
        <div className="w-6"></div>
      </div>

      {/* 3D Card Container */}
      <div 
        className="perspective-1000 w-full h-[450px] cursor-pointer group"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-surface-50 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
             {/* Decorative BG */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl"></div>
             
             <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${currentCard.type === 'quiz' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                   {currentCard.type}
                </span>
             </div>
             <p className="text-xs text-gray-500 absolute top-6 right-6 max-w-[150px] truncate font-mono">
                {currentCard.lessonTitle}
             </p>
             
             <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {currentCard.front}
             </h3>
             
             <p className="absolute bottom-8 text-primary-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                Tap to flip
             </p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black border border-primary-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-glow-green">
             <div className="prose prose-invert prose-lg">
                <p className="text-xl text-gray-100 leading-relaxed whitespace-pre-line font-medium">
                   {currentCard.back}
                </p>
             </div>
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-center gap-6">
         <button 
           onClick={handleNext}
           className="w-16 h-16 rounded-full bg-surface-50 border border-white/5 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
           title="Still Learning"
         >
            <X size={28} />
         </button>
         
         <button 
           onClick={handleFlip}
           className="px-8 py-3 rounded-xl bg-surface-50 border border-white/5 text-gray-300 font-bold uppercase tracking-wider hover:bg-surface-100 hover:text-white transition-all flex items-center gap-2"
         >
            <RotateCw size={18} /> Flip
         </button>

         <button 
           onClick={handleNext}
           className="w-16 h-16 rounded-full bg-surface-50 border border-white/5 flex items-center justify-center text-primary-400 hover:bg-primary-500/20 hover:border-primary-500/30 transition-all"
           title="Got it!"
         >
            <Check size={28} />
         </button>
      </div>
    </div>
  );
};

export default Exam;