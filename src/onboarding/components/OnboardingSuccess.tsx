// Onboarding module - confirmation shown after a successful submission.
//
// There is no login behind this link, so the form is replaced by this screen
// rather than navigating somewhere else.

import { CheckCircle2, Sparkles } from 'lucide-react';

interface OnboardingSuccessProps {
  candidateName: string;
}

const OnboardingSuccess = ({ candidateName }: OnboardingSuccessProps) => (
  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden animate-fade-in-up">
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-8 text-center">
      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 className="h-7 w-7 text-white" />
      </div>
      <h2 className="text-lg font-bold text-white">Onboarding Form Submitted</h2>
      <p className="text-emerald-50 text-xs mt-1">
        Thank you{candidateName ? `, ${candidateName}` : ''}! We have received your details.
      </p>
    </div>

    <div className="p-6 sm:p-8 text-center space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
        Our team will verify your information and documents, and will reach out to you on WhatsApp
        with the next steps of your onboarding.
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bambinos-blue/10 dark:bg-bambinos-blue/20 text-bambinos-blue dark:text-bambinos-blue-light text-xs font-semibold">
        <Sparkles className="h-3.5 w-3.5" />
        Welcome to the Bambinos.live family
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-500 pt-2">
        You can safely close this page. If something needs to be corrected, contact your recruiter.
      </p>
    </div>
  </div>
);

export default OnboardingSuccess;
