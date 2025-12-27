import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";

const DirectDemoConfirmation = () => {
  const location = useLocation();
  const applicationId = location.state?.applicationId || localStorage.getItem('applicationId');
  const candidateName = location.state?.candidateName || JSON.parse(localStorage.getItem('candidateName') || 'null');

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleBookDemo = () => {
    window.open("https://book.bambinos.live/mock-demo", "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-warm dark:bg-gray-900 relative flex items-center justify-center">
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="relative max-w-md mx-auto px-4 sm:px-6 py-8">
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-xl dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden animate-fade-in-up">
          {/* Success Decoration */}
          <div className="bg-gradient-to-br from-bambinos-blue to-bambinos-blue-light py-8 text-center relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white px-6">Success!</h1>
            <p className="text-blue-100/90 mt-1 text-sm font-medium">Application Received</p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {candidateName ? `Great job, ${candidateName.split(' ')[0]}!` : "You're one step away!"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                To finalize your journey, please schedule your live mock demo using our booking portal.
              </p>
            </div>

            {/* Booking Action */}
            <div className="bg-neutral-cool/50 dark:bg-gray-700/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-600/50 space-y-4">
              <div className="flex items-center justify-center gap-2.5 text-bambinos-blue font-bold">
                <Calendar className="h-4 w-4" />
                <span className="uppercase tracking-wider text-xs">Action Required</span>
              </div>
              
              <Button
                onClick={handleBookDemo}
                className="w-full h-14 bg-bambinos-blue hover:bg-bambinos-blue-dark text-white rounded-xl text-base font-bold shadow-bambinos hover:shadow-bambinos-lg transition-all group"
              >
                <span>Book Your Demo Now</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-[10px] text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Opens in a new tab
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        {applicationId && (
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600 font-mono tracking-tight">
            Reference ID: {applicationId}
          </p>
        )}
      </div>
    </div>
  );
};

export default DirectDemoConfirmation;

