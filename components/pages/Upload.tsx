import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, Sparkles, Loader2, FileText, Info, X, File, AlertTriangle, Terminal } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { AppRoute } from '../types';

// Declare window interface to satisfy TypeScript regarding the CDN script
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface UploadProps {
  navigate: (route: string) => void;
}

const Upload: React.FC<UploadProps> = ({ navigate }) => {
  const { addLesson } = useApp();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!text || !title) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      // Calls the Backend API (AURA Engine)
      await addLesson({ title, content: text });
      navigate(AppRoute.LEARNING);
    } catch (error: any) {
      console.error(error);
      setError("Failed to generate lesson. Ensure the backend is running and Gemini API key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      setError('Invalid file type. Only PDF and Text files are supported currently.');
      return;
    }

    setIsProcessingFile(true);
    
    try {
      if (file.type === 'text/plain') {
        const content = await file.text();
        setText(content);
        if (!title) setTitle(file.name.replace('.txt', ''));
      } 
      else if (file.type === 'application/pdf') {
        // Safety check if script loaded
        if (!window.pdfjsLib) {
          throw new Error("PDF Engine not loaded. Please refresh the page.");
        }

        // PDF Processing using the CDN-injected pdfjsLib
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        if (!fullText.trim()) {
          throw new Error("This PDF appears to be an image scan. AURA needs selectable text.");
        }

        setText(fullText);
        if (!title) setTitle(file.name.replace('.pdf', ''));
      }
    } catch (error: any) {
      console.error("File processing error:", error);
      setError(error.message || "Could not read file. Please copy/paste the text manually.");
    } finally {
      setIsProcessingFile(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-24">
      <div className="text-center md:text-left space-y-2 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Terminal className="text-primary-500" size={32} />
          Data Ingestion Protocol
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          > INITIALIZING AURA_ENGINE.EXE... READY FOR INPUT.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
           <AlertTriangle className="shrink-0 mt-0.5" size={20} />
           <div>
              <p className="font-bold">System Error</p>
              <p className="text-sm opacity-80">{error}</p>
           </div>
           <button onClick={() => setError(null)} className="ml-auto hover:text-white"><X size={18}/></button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-surface-50 rounded-2xl p-6 shadow-sm border border-white/10 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Subject Title
              </label>
              <input
                type="text"
                placeholder="e.g., Introduction to Macroeconomics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black focus:border-primary-500 outline-none text-white transition-all font-mono placeholder:text-gray-700"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Source Data
                </label>
                <div className="flex items-center gap-2">
                   {text && (
                     <button 
                       onClick={() => setText('')} 
                       className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 font-bold"
                     >
                       <X size={12} /> CLEAR BUFFER
                     </button>
                   )}
                   <span className="text-xs font-mono text-primary-500">{text.length}/20000 CHARS</span>
                </div>
              </div>
              
              <div className="relative group">
                 <textarea
                   value={text}
                   onChange={(e) => setText(e.target.value)}
                   rows={12}
                   disabled={isProcessingFile}
                   className={`w-full px-4 py-3 rounded-xl border border-white/10 bg-black focus:border-primary-500 outline-none text-gray-300 resize-none font-mono text-xs leading-relaxed transition-opacity ${isProcessingFile ? 'opacity-50' : ''}`}
                   placeholder="// Paste your raw lecture notes here, or upload a PDF..."
                 />
                 {isProcessingFile && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-surface-100 border border-primary-500/30 text-primary-400 px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
                         <Loader2 className="animate-spin" size={16} /> 
                         <span className="font-mono text-xs font-bold">PARSING BINARY DATA...</span>
                      </div>
                   </div>
                 )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !title || !text || isProcessingFile}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center space-x-2 transition-all shadow-lg uppercase tracking-wider ${
                isGenerating || !title || !text || isProcessingFile
                  ? 'bg-surface-200 text-gray-600 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow-primary-500/30 hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Compiling Lesson...</span>
                </>
              ) : (
                <>
                  <Sparkles className="fill-current" />
                  <span>Execute Generation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Info & Upload Button */}
        <div className="space-y-4">
           
           {/* File Upload Box */}
           <div 
             className="bg-surface-50 p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary-500 hover:bg-surface-100 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center h-48"
             onClick={() => fileInputRef.current?.click()}
           >
              <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept=".pdf,.txt" 
                 onChange={handleFileChange}
              />
              <div className="w-12 h-12 bg-surface-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-primary-500 group-hover:text-black">
                 <FileText className="text-gray-400 group-hover:text-black" size={24} />
              </div>
              <h3 className="font-bold text-white mb-1">
                 Upload File
              </h3>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                 PDF or TXT
              </p>
           </div>
           
           <div className="bg-primary-900/10 p-5 rounded-2xl border border-primary-500/20">
              <h3 className="font-bold text-primary-400 flex items-center gap-2 mb-2 text-sm uppercase tracking-wide">
                 <Info size={16} /> Protocols
              </h3>
              <ul className="text-xs text-primary-300/70 space-y-2 list-disc list-inside font-mono">
                 <li>Headers improve parsing accuracy.</li>
                 <li>Max buffer: 20,000 chars.</li>
                 <li>OCR for images not supported.</li>
              </ul>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Upload;