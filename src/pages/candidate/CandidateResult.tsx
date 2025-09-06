import { useState, useEffect, useCallback } from 'react';
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
  
  const [results, setResults] = useState<{
    candidateName: string;
    candidateEmail: string;
    position: string;
    score: number;
    status: string;
    interviewDate: string;
    applicationId: string;
    isPassed: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
   // Email state
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Use custom hook to prevent navigation back
  usePreventNavigation();

  const fetchResults = useCallback(async (isRetry = false) => {
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
        // Map the backend response to the expected frontend format
        const backendData = response.data;
        const mappedResults = {
          candidateName: `${backendData.firstName} ${backendData.lastName}`,
          candidateEmail: backendData.email,
          position: backendData.position,
          score: backendData.results.score,
          status: backendData.results.status,
          interviewDate: backendData.submittedAt,
          applicationId: backendData.applicationId,
          isPassed: backendData.results.isPassed
        };
        setResults(mappedResults);
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
  }, [applicationId, retryCount]);

  // Email sending function
  const sendInterviewResultEmail = useCallback(async () => {
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
  }, [applicationId, emailSent, emailLoading]);

  useEffect(() => {
    fetchResults();
  }, [applicationId, fetchResults]);

  // Trigger email when results are first loaded
  useEffect(() => {
    if (results && !emailSent && !emailLoading) {
      console.log('📧 Results loaded, triggering email send...');
      sendInterviewResultEmail();
    }
  }, [results, emailSent, emailLoading, sendInterviewResultEmail]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchResults(true);
  };

  const handleSecondRoundClick = () => {
    window.open('https://book.bambinos.live/mock-demo', '_blank');
  };

  if (loading && !isRetrying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        
        <div className="container mx-auto max-w-4xl flex items-center justify-center min-h-screen py-12 px-4">
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="text-center p-8">
              {/* Simple Loading Animation */}
              <div className="mb-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                
                {/* Simple Progress Dots */}
                <div className="flex justify-center items-center space-x-1 mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Preparing Your Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We're finalizing your interview analysis and preparing your results...
              </p>
              
              {/* Simple Skeleton Loading */}
              <div className="mt-6 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !isRetrying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        
        <div className="container mx-auto max-w-4xl flex items-center justify-center min-h-screen py-12 px-4">
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="text-center p-8">
              {/* Simple Error Icon */}
              <div className="mx-auto w-12 h-12 mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Results Not Available
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                {error}
              </p>
              
              {retryCount > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Retry attempt: {retryCount}/10
                  </p>
                </div>
              )}

              <Button 
                onClick={handleRetry} 
                variant="outline"
                disabled={isRetrying}
                className="flex items-center gap-2 px-4 py-2 text-sm"
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

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <p>If the problem persists, please contact support</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isRetrying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        
        <div className="container mx-auto max-w-4xl flex items-center justify-center min-h-screen py-12 px-4">
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="text-center p-8">
              {/* Simple Retry Loading Animation */}
              <div className="mb-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                
                {/* Simple Progress Dots */}
                <div className="flex justify-center items-center space-x-1 mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Checking Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Please wait while we check for your results...
              </p>
              
              {/* Simple Retry Progress */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                  Attempt {retryCount}/10
                </p>
                <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                    style={{width: `${(retryCount / 10) * 100}%`}}
                  ></div>
                </div>
              </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Interview Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Thank you for completing your interview, <span className="font-semibold text-gray-900 dark:text-gray-100">{results.candidateName}</span>
          </p>

          {/* Email Status Alert Banner */}
          {emailSent && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Results email sent to your inbox</span>
              </div>
            </div>
          )}
          {emailLoading && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Sending results email...</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Results Card */}
        <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg border-0 rounded-xl mb-8">
          <CardContent className="p-8">
            {/* Result Display */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center">
                {/* Result Icon */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${
                    results.isPassed 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <div className={`text-6xl font-bold ${
                      results.isPassed 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {results.isPassed ? '✓' : '✗'}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    results.isPassed 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {results.isPassed ? 'PASSED' : 'NOT SELECTED'}
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="mt-6">
                <Badge 
                  variant={results.isPassed ? "default" : "destructive"}
                  className={`text-lg px-6 py-3 font-semibold shadow-sm ${
                    results.isPassed 
                      ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                  }`}
                >
                  {results.isPassed ? 'PASSED' : 'FAILED'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Section - Two Separate Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Candidate Details Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Candidate Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{results.candidateName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{results.candidateEmail}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{results.position}</p>
              </div>
            </CardContent>
          </Card>

          {/* Interview Details Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Interview Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Date</span>
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{new Date(results.interviewDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Time</span>
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{new Date(results.interviewDate).toLocaleTimeString()}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Application ID</label>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">{results.applicationId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Round Section - Only show if passed */}
        {results.isPassed && (
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-lg border-0 rounded-xl mb-8">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">
                Congratulations! You've Passed
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-6 text-sm leading-relaxed">
                You've successfully completed the first round. Click below to schedule your second round interview.
              </p>
              <Button 
                onClick={handleSecondRoundClick}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
                aria-label="Schedule your second round interview"
              >
                <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                Schedule Second Round
              </Button>
            </CardContent>
          </Card>
        )}

        {/* What's Next Section */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-lg border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                What's Next?
              </h3>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
              <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                {results.isPassed 
                  ? "Our HR team will contact you soon with further instructions for the second round. Please check your email for additional details and prepare for the next phase of your interview process."
                  : "Thank you for your interest in joining our team. We appreciate your time and effort. We'll keep your application on file for future opportunities and will reach out if a suitable position becomes available."
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