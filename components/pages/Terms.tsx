import React from 'react';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import { AppRoute } from '../types';

interface TermsProps {
  navigate: (route: string) => void;
}

const Terms: React.FC<TermsProps> = ({ navigate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20 p-6 md:p-12">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(AppRoute.LANDING)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="text-primary-500" /> Terms of Service
        </h1>
      </div>

      <div className="space-y-8 text-gray-300">
        <div className="bg-surface-100 p-8 rounded-2xl border border-white/5">
           <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
           <p className="leading-relaxed">
              By accessing and using Synapse, you accept and agree to be bound by the terms and provision of this agreement. 
              Synapse is an educational tool designed to assist students in reviewing and gamifying their own study materials.
           </p>
        </div>

        <div className="bg-surface-100 p-8 rounded-2xl border border-white/5">
           <h2 className="text-xl font-bold text-white mb-4">2. Academic Integrity</h2>
           <p className="leading-relaxed mb-4">
              Synapse is built to enhance learning, not to facilitate academic dishonesty.
           </p>
           <ul className="space-y-3">
              <li className="flex items-start gap-3">
                 <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                 <span>You agree NOT to upload exam questions, copyrighted textbooks, or confidential materials.</span>
              </li>
              <li className="flex items-start gap-3">
                 <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                 <span>You agree NOT to use the AI generation features to write essays or complete assignments on your behalf.</span>
              </li>
           </ul>
        </div>

        <div className="bg-surface-100 p-8 rounded-2xl border border-white/5">
           <h2 className="text-xl font-bold text-white mb-4">3. Data Usage</h2>
           <p className="leading-relaxed">
              Content uploaded to Synapse is processed by our AURA Engine (powered by Google Gemini) solely for the purpose of generating study aids. 
              We do not claim ownership of your uploaded notes.
           </p>
        </div>

        <div className="bg-surface-100 p-8 rounded-2xl border border-white/5">
           <h2 className="text-xl font-bold text-white mb-4">4. Beta Access</h2>
           <p className="leading-relaxed">
              Synapse is currently in Public Beta. We do not guarantee 100% uptime or data persistence during this phase. 
              Features may change or be removed without notice.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
