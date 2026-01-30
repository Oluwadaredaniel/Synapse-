import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { AppRoute } from '../types';

interface PrivacyProps {
  navigate: (route: string) => void;
}

const Privacy: React.FC<PrivacyProps> = ({ navigate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(AppRoute.SETTINGS)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Shield className="text-primary-500" /> Privacy & Security
        </h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                 <Lock className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Data Encryption</h2>
                 <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Your personal data, including course materials and learning progress, is encrypted both in transit (TLS 1.3) and at rest (AES-256). We use industry-standard security protocols to ensure your information remains private.
                 </p>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                 <Eye className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Data Usage</h2>
                 <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    The content you upload is processed by our AURA Engine (Gemini 1.5 Pro) solely to generate your personalized lessons. Your data is <strong>not</strong> used to train public AI models. We adhere to strict data isolation policies.
                 </p>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                 <FileText className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h2>
                 <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    By using Synapse, you agree to our terms regarding academic integrity. This tool is designed to aid learning, not to facilitate cheating.
                 </p>
                 <button className="text-primary-600 font-bold hover:underline">Read Full Terms</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;