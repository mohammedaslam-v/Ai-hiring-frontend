import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";

const DirectDemoConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const applicationId = location.state?.applicationId || localStorage.getItem('applicationId');
  const candidateName = location.state?.candidateName || JSON.parse(localStorage.getItem('candidateName') || 'null');

  useEffect(() => {
    // Clear direct demo flag after showing confirmation
    // Keep applicationId for future reference
  }, []);

  return (
    <div className="min-h-screen bg-neutral-warm dark:bg-gray-900 relative">
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Success Card */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Application Submitted Successfully!</h1>
            <p className="text-emerald-100 text-sm">Your direct demo application has been received</p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Application Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">What's Next?</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Our team will review your application and contact you via email or phone to schedule your demo session. 
                    You will receive further instructions within 1-2 business days.
                  </p>
                </div>
              </div>

              {applicationId && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Application ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{applicationId}</p>
                </div>
              )}

              {candidateName && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Applicant Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{candidateName}</p>
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                  <span>You have applied directly for a demo session (AI interview skipped)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                  <span>Our team will contact you to schedule your demo at your convenience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                  <span>Please ensure your contact information is correct and accessible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                  <span>Keep your Application ID for future reference</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light hover:from-bambinos-blue-dark hover:to-bambinos-blue text-white"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => navigate('/candidate/login')}
                variant="outline"
                className="flex-1 border-bambinos-blue text-bambinos-blue hover:bg-bambinos-blue/10"
              >
                Check Application Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectDemoConfirmation;

