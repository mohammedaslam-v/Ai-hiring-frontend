import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePreventNavigation } from "@/hooks/candidate/usePreventNavigation";

const CandidateResult = () => {
  const [candidateName] = useLocalStorage('candidateName', 'Candidate');

  // Use custom hook to prevent navigation back
  usePreventNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto max-w-4xl">
        {/* Main Thank You Card */}
        <div className="text-center mb-8">
          {/* Blue checkmark icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-8 border border-blue-200 dark:border-blue-800">
            <CheckCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>

          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Thank You for Attending
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            We appreciate your time, {candidateName}. Our HR team will share your interview result via email soon.
          </p>
        </div>

        {/* Thank You Card */}
        <Card className="max-w-4xl mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">
                Thank You!
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-6 pb-8">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              We sincerely appreciate you taking the time to attend the interview with us.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              Your interest in joining our team means a lot to us.
            </p>

            {/* What's Next Section */}
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                What's Next?
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                Our HR team will carefully review your interview and share the results with you via email within the next few business days.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Please keep an eye on your inbox (including spam folder) for updates from our team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateResult;