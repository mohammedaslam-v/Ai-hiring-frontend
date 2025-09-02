import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Mail, Clock, Trophy, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePreventNavigation } from "@/hooks/candidate/usePreventNavigation";
import { interviewResultsService, InterviewResultsData, EmailResponse } from "@/services/interviewResults";
import { toast } from "react-toastify";

const CandidateResult = () => {
  const [candidateName] = useLocalStorage('candidateName', 'Candidate');
  
  // Get applicationId from interview result first, then fallback to localStorage
  const interviewResultStr = localStorage.getItem('interviewResult');
  let applicationId = localStorage.getItem('applicationId'); // fallback
  
  if (interviewResultStr) {
    try {
      const interviewResult = JSON.parse(interviewResultStr);
      if (interviewResult.applicationId) {
        applicationId = interviewResult.applicationId;
        console.log('🔍 CandidateResult: Using applicationId from interview result:', applicationId);
      }
    } catch (error) {
      console.log('🔍 CandidateResult: Error parsing interview result, using fallback applicationId');
    }
  }
  
  // Debug logging
  console.log('🔍 CandidateResult: Final applicationId to use:', applicationId);
  
  const [results, setResults] = useState<InterviewResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
   // Email state
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Use custom hook to prevent navigation back
  usePreventNavigation();

  const fetchResults = async (isRetry = false) => {
    // Get applicationId from localStorage
    const fallbackApplicationId = applicationId;
    
    if (!fallbackApplicationId) {
      setError('Application ID not found');
      setLoading(false);
      return;
    }
    
    console.log('🔍 Using applicationId for results:', fallbackApplicationId);

    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await interviewResultsService.getInterviewResults(fallbackApplicationId);
      
      if (response.status && response.data) {
        setResults(response.data);
        setRetryCount(0); // Reset retry count on success
      } else {
        // Check if it's an evaluation in progress error
        if (response.error === 'EVALUATION_IN_PROGRESS' || response.error === 'INTERVIEW_NOT_COMPLETED') {
          setError(response.msg || 'Interview evaluation is still in progress. Please wait and try again.');
          
          // Auto-retry after 5 seconds if we haven't retried too many times
          if (retryCount < 10) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              fetchResults(true);
            }, 5000); // Wait 5 seconds before retry
          }
        } else {
          setError(response.msg || 'Failed to fetch results');
        }
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load interview results');
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  // Email sending function
  const sendInterviewResultEmail = async () => {
    if (!applicationId || emailSent || emailLoading) {
      return;
    }

    try {
      setEmailLoading(true);
      console.log('📧 Sending interview result email for applicationId:', applicationId);
      
      const response = await interviewResultsService.sendInterviewResultEmail(applicationId);
      
      if (response.status) {
        setEmailSent(true);
        console.log('✅ Interview result email sent successfully');
        toast.success('Interview result email sent successfully!');
      } else {
        console.log('❌ Failed to send email:', response.msg);
        toast.error('Failed to send email: ' + response.msg);
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      toast.error('Failed to send interview result email');
    } finally {
      setEmailLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [applicationId]);

  // Trigger email when results are first loaded
  useEffect(() => {
    if (results && !emailSent && !emailLoading) {
      console.log('📧 Results loaded, triggering email send...');
      sendInterviewResultEmail();
    }
  }, [results, emailSent, emailLoading]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchResults(true);
  };

  const handleSecondRoundClick = () => {
    window.open('https://book.bambinos.live/mock-demo', '_blank');
  };

  if (loading && !isRetrying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        
        <div className="container mx-auto max-w-4xl flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="text-center p-8">
              <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Preparing Your Results
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we process your interview results...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !isRetrying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        
        <div className="container mx-auto max-w-4xl">
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="text-center p-8">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Results Not Available
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error}
              </p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  Retry attempt: {retryCount}/10
                </p>
              )}
              <Button 
                onClick={handleRetry} 
                variant="outline"
                disabled={isRetrying}
                className="flex items-center gap-2"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isRetrying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        
        <div className="container mx-auto max-w-4xl flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="text-center p-8">
              <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Checking Results
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we check for your results...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Attempt {retryCount}/10
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        
        <div className="container mx-auto max-w-4xl">
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="text-center p-8">
              <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Results Not Ready
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your interview results are still being processed. Please check back later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
            {results.isPassed ? (
              <CheckCircle className="h-12 w-12 text-white" />
            ) : (
              <XCircle className="h-12 w-12 text-white" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Interview Results
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Thank you for completing your interview, {results.candidateName}
          </p>

          {/* Email Status Indicator */}
          {emailSent && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg mb-4">
              <Mail className="h-4 w-4 mr-2" />
              <span>Results email sent to your inbox</span>
            </div>
          )}
          {emailLoading && (
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg mb-4">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Sending results email...</span>
            </div>
          )}
        </div>

        {/* Results Card */}
        <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">
                Your Performance
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Score Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-4 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{results.score}</div>
                  <div className="text-sm text-blue-100">out of 100</div>
                </div>
              </div>
              
              <Badge 
                variant={results.isPassed ? "default" : "destructive"}
                className={`text-lg px-4 py-2 ${results.isPassed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {results.isPassed ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>

            {/* Details Section */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Candidate Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div><span className="font-medium">Name:</span> {results.candidateName}</div>
                    <div><span className="font-medium">Email:</span> {results.candidateEmail}</div>
                    <div><span className="font-medium">Position:</span> {results.position}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Interview Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div><span className="font-medium">Date:</span> {new Date(results.interviewDate).toLocaleDateString()}</div>
                    <div><span className="font-medium">Time:</span> {new Date(results.interviewDate).toLocaleTimeString()}</div>
                    <div><span className="font-medium">Application ID:</span> {results.applicationId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Round Section - Only show if passed */}
            {results.isPassed && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                    Congratulations! You've Passed
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    You've successfully completed the first round. Click below to schedule your second round interview.
                  </p>
                  <Button 
                    onClick={handleSecondRoundClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Schedule Second Round
                  </Button>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  What's Next?
                </h3>
              </div>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                {results.isPassed 
                  ? "Our HR team will contact you soon with further instructions for the second round. Please check your email for additional details."
                  : "Thank you for your interest in joining our team. We appreciate your time and effort. We'll keep your application on file for future opportunities."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateResult;