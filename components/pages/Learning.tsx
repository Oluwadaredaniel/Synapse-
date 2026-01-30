import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { AppRoute, Lesson } from '../types';
import { 
  PlayCircle, CheckCircle, ArrowLeft, Brain, BookOpen, Clock, 
  ChevronRight, Search, Trash2, Layers, Volume2, VolumeX, Mic, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LearningProps {
  navigate: (route: string, params?: any) => void;
  selectedLessonId: string | null;
}

const Learning: React.FC<LearningProps> = ({ navigate, selectedLessonId }) => {
  const { lessons, deleteLesson } = useApp();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    selectedLessonId ? lessons.find(l => l.id === selectedLessonId) || null : null
  );
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tutor Mode State
  const [isTutorMode, setIsTutorMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechBlock, setCurrentSpeechBlock] = useState<number>(-1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synth = useRef<SpeechSynthesis>(window.speechSynthesis);

  // Filter lessons based on search
  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Load voices reliably (handles async loading in Chrome/Android)
    const loadVoices = () => {
      const voices = synth.current.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.current.cancel();
    };
  }, []);

  useEffect(() => {
    // Stop speech if lesson changes
    synth.current.cancel();
    setIsSpeaking(false);
    setCurrentSpeechBlock(-1);
  }, [activeLesson]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lesson? This cannot be undone.")) {
      deleteLesson(id);
    }
  };

  const toggleSpeech = (text: string, blockIndex: number) => {
    // If clicking the same block that is playing, stop it.
    if (isSpeaking && currentSpeechBlock === blockIndex) {
      synth.current.cancel();
      setIsSpeaking(false);
      setCurrentSpeechBlock(-1);
      return;
    } 

    // Stop any current speech
    synth.current.cancel();

    // Start new speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Intelligent Voice Selection based on Interest
    let preferredVoice = null;
    const interest = activeLesson?.interestUsed.toLowerCase() || '';

    if (interest.includes('anime') || interest.includes('pop')) {
       // Look for higher pitched or female voices often used for assistants
       preferredVoice = availableVoices.find(v => v.name.includes('Samantha')) || 
                        availableVoices.find(v => v.name.includes('Google US English'));
       utterance.pitch = 1.1;
       utterance.rate = 1.1;
    } else if (interest.includes('history') || interest.includes('business')) {
       // Deeper, authoritative voices
       preferredVoice = availableVoices.find(v => v.name.includes('Daniel')) || 
                        availableVoices.find(v => v.name.includes('Google UK English Male'));
       utterance.pitch = 0.9;
       utterance.rate = 0.95;
    } else {
       // Default balanced
       preferredVoice = availableVoices.find(v => v.default) || availableVoices[0];
    }
    
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => {
       setIsSpeaking(true);
       setCurrentSpeechBlock(blockIndex);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeechBlock(-1);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeechBlock(-1);
    }

    synth.current.speak(utterance);
    
    // If not in tutor mode, enter it automatically for immersion
    if (!isTutorMode) setIsTutorMode(true);
  };

  // Helper to get character image based on interest
  const getCharacterImage = (interest: string) => {
    const lower = interest.toLowerCase();
    // Using high quality vertical sprites for visual novel feel
    if (lower.includes('sport') || lower.includes('basketball')) return 'https://img.freepik.com/free-photo/anime-style-basketball-player_23-2151151747.jpg';
    if (lower.includes('history')) return 'https://img.freepik.com/free-photo/anime-style-portrait-historical-figure_23-2151151760.jpg';
    if (lower.includes('tech') || lower.includes('sci-fi')) return 'https://img.freepik.com/free-photo/cyberpunk-anime-character-city_23-2151151712.jpg';
    // Default Anime Scholar
    return 'https://img.freepik.com/free-photo/anime-style-character-university_23-2151151731.jpg'; 
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://img.freepik.com/free-photo/3d-rendering-boy-wearing-cap-with-messy-hair_1149-1658.jpg'; // Safe Fallback
  };

  // --- LIST VIEW (Library) ---
  if (!activeLesson) {
    return (
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-24">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
             <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Library</h1>
             <p className="text-gray-400">Your personalized knowledge base.</p>
          </div>
          <button 
             onClick={() => navigate(AppRoute.UPLOAD)}
             className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-100 hover:bg-surface-200 text-white rounded-lg transition-colors text-sm font-medium border border-white/5"
          >
             <BookOpen size={16} /> New Lesson
          </button>
        </header>

        {/* Search Bar */}
        {lessons.length > 0 && (
           <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search lessons..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
           </div>
        )}
        
        <div className="grid gap-4">
          {lessons.length === 0 ? (
             <div className="text-center py-24 bg-surface-50 rounded-3xl border border-dashed border-white/10">
               <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                  <Brain size={32} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No lessons yet</h3>
               <p className="text-gray-500 mb-6 max-w-md mx-auto">Upload your course materials to generate your first AI-powered lesson.</p>
               <button 
                 onClick={() => navigate(AppRoute.UPLOAD)}
                 className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all"
               >
                 Create First Lesson
               </button>
             </div>
          ) : filteredLessons.length === 0 ? (
             <div className="text-center py-12 text-gray-500">No lessons match your search.</div>
          ) : (
            filteredLessons.map(lesson => (
              <div 
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className="group flex flex-col md:flex-row md:items-center p-6 bg-surface-50 rounded-2xl border border-white/5 hover:border-primary-500/30 hover:bg-surface-100 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Background Image Effect */}
                {lesson.coverImage && (
                    <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                        <img src={lesson.coverImage} className="w-full h-full object-cover" alt="" />
                    </div>
                )}

                <div className="flex-1 min-w-0 mb-4 md:mb-0 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                        {lesson.interestUsed}
                     </span>
                     {lesson.isCompleted && <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded"><CheckCircle size={10} /> Completed</span>}
                  </div>
                  <h3 className="font-bold text-xl text-white group-hover:text-primary-300 transition-colors pr-8">{lesson.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {lesson.estimatedTime}</span>
                    <span>{lesson.sections.length} Sections</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto relative z-10">
                   <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-500 uppercase font-bold">Reward</p>
                      <p className="font-bold text-primary-400">+{lesson.xpReward} XP</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => handleDelete(e, lesson.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors z-10"
                        title="Delete Lesson"
                      >
                         <Trash2 size={18} />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <ChevronRight size={20} />
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- ACTIVE LESSON VIEW (Focus Mode) ---
  return (
    <div className={`max-w-4xl mx-auto pb-48 animate-slide-up relative ${isTutorMode ? 'md:mr-96 transition-all duration-500' : ''}`}>
      
      {/* CSS Animations for Character */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.01); }
        }
        @keyframes talk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .char-breathe { animation: breathe 4s infinite ease-in-out; }
        .char-talk { animation: talk 0.4s infinite ease-in-out; }
      `}</style>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-b border-white/5 z-40 px-4 py-4 md:px-8">
         <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => {
                synth.current.cancel();
                setActiveLesson(null);
              }} 
              className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" /> Library
            </button>
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setIsTutorMode(!isTutorMode)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${isTutorMode ? 'bg-primary-600 border-primary-500 text-white shadow-[0_0_15px_-3px_rgba(124,58,237,0.5)]' : 'bg-surface-100 border-white/5 text-gray-400 hover:bg-surface-200'}`}
               >
                  <Brain size={14} /> {isTutorMode ? 'Tutor Active' : 'Enable Tutor'}
               </button>
            </div>
         </div>
      </nav>

      {/* TUTOR CHARACTER & DIALOGUE UI */}
      {isTutorMode && (
         <>
             {/* Character Sprite Container (Fixed Right) */}
             <div className="fixed bottom-0 right-0 md:right-10 z-30 pointer-events-none hidden md:block">
                <div className={`
                    w-[350px] h-[500px] relative transition-all duration-300 origin-bottom
                    ${isSpeaking ? 'char-talk' : 'char-breathe'}
                `}>
                   {/* Glow behind character */}
                   <div className="absolute inset-0 bg-primary-600/20 blur-[60px] rounded-full transform translate-y-20"></div>
                   
                   <img 
                      src={getCharacterImage(activeLesson.interestUsed)} 
                      onError={handleImageError}
                      alt="AI Tutor" 
                      className="w-full h-full object-cover object-top mask-image-gradient"
                      style={{ 
                          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                      }}
                   />
                </div>
             </div>

             {/* Mobile Character (Small Circle) */}
             <div className="fixed bottom-32 right-4 md:hidden z-30 pointer-events-none">
                 <div className={`w-20 h-20 rounded-full border-2 border-primary-500 shadow-xl overflow-hidden ${isSpeaking ? 'animate-bounce' : ''}`}>
                    <img 
                       src={getCharacterImage(activeLesson.interestUsed)}
                       onError={handleImageError} 
                       alt="AI Tutor" 
                       className="w-full h-full object-cover"
                    />
                 </div>
             </div>

             {/* RPG Dialogue Box (Fixed Bottom) */}
             <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-8 pointer-events-none">
                 <div className="max-w-4xl mx-auto bg-black/80 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-6 shadow-2xl relative pointer-events-auto animate-slide-up">
                    
                    {/* Name Tag */}
                    <div className="absolute -top-4 left-8 bg-primary-600 text-white px-4 py-1 rounded-t-lg font-bold text-xs uppercase tracking-wider shadow-lg">
                        {activeLesson.interestUsed} Tutor
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={() => setIsTutorMode(false)}
                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex gap-6">
                        <div className="flex-1">
                            {isSpeaking && currentSpeechBlock !== -1 ? (
                                <p className="text-lg md:text-xl text-white font-medium leading-relaxed font-sans text-balance animate-fade-in">
                                    "{activeLesson.sections[currentSpeechBlock].content.substring(0, 150)}..."
                                </p>
                            ) : (
                                <div className="flex items-center gap-4 text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                                    <p className="text-sm italic">"Click on the speaker icon next to any section, and I will explain it to you!"</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Audio Visualizer (Fake) */}
                        {isSpeaking && (
                            <div className="flex items-end gap-1 h-12 pb-2">
                                <div className="w-1 bg-primary-400 h-4 animate-[bounce_0.5s_infinite]"></div>
                                <div className="w-1 bg-primary-400 h-8 animate-[bounce_0.7s_infinite]"></div>
                                <div className="w-1 bg-primary-400 h-6 animate-[bounce_0.4s_infinite]"></div>
                                <div className="w-1 bg-primary-400 h-3 animate-[bounce_0.6s_infinite]"></div>
                            </div>
                        )}
                    </div>
                 </div>
             </div>
         </>
      )}

      <div className="mt-24 space-y-12 px-4 md:px-0">
         {/* Lesson Header with Cover Image */}
         <header className="relative rounded-3xl overflow-hidden mb-16 border border-white/5">
            {activeLesson.coverImage && (
               <div className="absolute inset-0 z-0">
                  <img src={activeLesson.coverImage} className="w-full h-full object-cover opacity-30" alt="Lesson Cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
               </div>
            )}
            
            <div className="relative z-10 p-12 text-center space-y-6">
               <div className="inline-block px-3 py-1 rounded-full bg-surface-100/50 backdrop-blur border border-white/10 text-xs font-mono text-primary-300">
                  {activeLesson.interestUsed} Edition
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight text-balance">
                  {activeLesson.title}
               </h1>
               <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-bold">
                  <span className="flex items-center gap-2"><Clock size={16} /> {activeLesson.estimatedTime}</span>
                  <span className="flex items-center gap-2"><Brain size={16} /> +{activeLesson.xpReward} XP</span>
               </div>
            </div>
         </header>

         {/* Content Sections */}
         <div className="space-y-16">
            {activeLesson.sections.map((section, idx) => (
               <section 
                 key={idx} 
                 className={`group relative p-6 rounded-3xl transition-all duration-500 border border-transparent ${isSpeaking && currentSpeechBlock === idx ? 'bg-primary-900/10 border-primary-500/20 shadow-[0_0_30px_-10px_rgba(124,58,237,0.1)]' : 'hover:bg-white/5'}`}
               >
                  <div className="flex items-baseline justify-between mb-6">
                     <div className="flex items-baseline gap-4">
                        <span className={`text-4xl font-black select-none transition-colors ${currentSpeechBlock === idx ? 'text-primary-500' : 'text-white/10 group-hover:text-primary-500/20'}`}>
                           0{idx + 1}
                        </span>
                        <h2 className={`text-2xl font-bold ${currentSpeechBlock === idx ? 'text-primary-300' : 'text-white'}`}>{section.title}</h2>
                     </div>
                     <button 
                        onClick={() => toggleSpeech(section.content, idx)}
                        className={`p-3 rounded-xl transition-all transform hover:scale-105 ${currentSpeechBlock === idx ? 'bg-primary-600 text-white shadow-lg' : 'bg-surface-100 text-gray-400 hover:text-white'}`}
                     >
                        {currentSpeechBlock === idx ? <div className="flex gap-2 items-center"><VolumeX size={20} /> <span className="text-xs font-bold">Stop</span></div> : <Volume2 size={20} />}
                     </button>
                  </div>
                  
                  {/* React Markdown Rendering for Rich Text Support */}
                  <div className={`prose prose-invert prose-lg max-w-none leading-relaxed transition-colors ${currentSpeechBlock === idx ? 'text-gray-100' : 'text-gray-400'}`}>
                     <ReactMarkdown
                        components={{
                          strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                          em: ({node, ...props}) => <em className="text-primary-300 not-italic" {...props} />,
                          code: ({node, ...props}) => <code className="bg-surface-100 text-primary-200 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                        }}
                     >
                        {section.content}
                     </ReactMarkdown>
                  </div>

                  {section.visualPrompt && (
                     <div className="mt-8 rounded-2xl bg-black/20 border border-white/5 p-8 flex flex-col items-center justify-center text-center gap-4">
                        <div className="text-4xl grayscale opacity-50">🎨</div>
                        <p className="text-sm text-gray-500 font-mono max-w-md">
                           "Visual Aid: {section.visualPrompt}"
                        </p>
                     </div>
                  )}
               </section>
            ))}
         </div>

         {/* Footer Action */}
         <div className="pt-12 border-t border-white/10 text-center">
            <h3 className="text-xl font-bold text-white mb-6">Master this topic</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button
                  onClick={() => navigate(AppRoute.EXAM, { lessonId: activeLesson.id })}
                  className="px-8 py-4 bg-surface-100 hover:bg-surface-200 text-white rounded-xl font-bold text-lg border border-white/10 flex items-center justify-center gap-2 transition-all"
               >
                  <Layers size={20} /> Flashcards
               </button>
               <button
                  onClick={() => navigate(AppRoute.QUIZ, { lessonId: activeLesson.id })}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg shadow-glow transition-all hover:scale-105 flex items-center justify-center gap-2"
               >
                  <Brain size={20} /> Take Quiz
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Learning;