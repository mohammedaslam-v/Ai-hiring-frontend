import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { interviewResultsService } from '../../services/interviewResults';

interface ResultsData {
  score: number;
  evaluation: {
    overall_score: string;
    strengths: string;
    weaknesses: string;
    detailed_feedback: string;
    final_score?: number;
    report_card?: unknown;
  };
  feedback: string;
  transcript: string;
  duration: number;
}

type SafeEvaluation = {
  strengths?: string;
  weaknesses?: string;
  detailed_feedback?: string;
  report_card?: unknown;
};

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results: stateResults, sessionId, applicationId } = location.state || {};
  
  const [results, setResults] = useState(stateResults);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const recoverResults = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 ResultsPage: Attempting to recover results...');
      
      // Get application ID from localStorage if not in state
      const storedApplicationId = applicationId || localStorage.getItem('currentApplicationId');
      
      if (storedApplicationId) {
        console.log('🔍 ResultsPage: Fetching results from backend...');
        const response = await interviewResultsService.getInterviewResults(storedApplicationId);
        
        if (response.status && response.data) {
          console.log('✅ ResultsPage: Results recovered successfully');
          setResults(response.data);
          return;
        }
      }
      
      // If no results found, redirect to dashboard
      console.log('❌ ResultsPage: No results found, redirecting to dashboard');
      navigate('/candidate/dashboard');
      
    } catch (error) {
      console.error('❌ ResultsPage: Error recovering results:', error);
      navigate('/candidate/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, applicationId]);

  useEffect(() => {
    // If no results from state, try to recover from localStorage or fetch from backend
    if (!results) {
      recoverResults();
    }
    
    // Clean up localStorage when component unmounts (user navigates away)
    return () => {
      // Only clean up if we're not going to another page in the flow
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/candidate/processing') && !currentPath.includes('/candidate/results')) {
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentApplicationId');
      }
    };
  }, [results, recoverResults]);

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      setEmailError(null);
      
      console.log('📧 ResultsPage: Sending results email...');
      
      // Simulate email sending (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      console.log('✅ ResultsPage: Email sent successfully');
      
    } catch (error) {
      console.error('❌ ResultsPage: Error sending email:', error);
      setEmailError(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🎉';
    if (score >= 60) return '👍';
    return '💪';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Results...</h2>
          <p className="text-gray-600">Recovering your interview results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find any interview results.</p>
          <Button onClick={() => navigate('/candidate/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Safely extract evaluation details with fallbacks to avoid runtime errors
  const evaluation = (results as { evaluation?: SafeEvaluation; results?: { feedback?: string } })?.evaluation ?? null;
  const strengthsText = evaluation?.strengths ?? results?.results?.feedback ?? 'No specific strengths identified.';
  const weaknessesText = evaluation?.weaknesses ?? 'No specific areas for improvement identified.';
  const detailedFeedbackText = evaluation?.detailed_feedback ?? results?.results?.feedback ?? 'No detailed feedback available.';
  const reportCard: unknown = evaluation?.report_card ?? null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Simple pass/fail result only */}
        {(() => {
          type ResultShape = { results?: { isPassed?: boolean; passed?: boolean }; interviewStatus?: string };
          const r = results as ResultShape;
          const isPassed = r?.results?.isPassed ?? r?.results?.passed ?? r?.interviewStatus === 'passed';
          const label = isPassed ? 'Selected' : 'Not Selected';
          const color = isPassed ? 'text-green-700' : 'text-red-700';
          const bg = isPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
          const icon = isPassed ? '✅' : '❌';
          return (
            <Card className={`mb-8 ${bg}`}>
              <CardContent className="p-10">
                <div className="text-center">
                  <div className="text-6xl mb-4">{icon}</div>
                  <h1 className={`text-3xl font-bold mb-2 ${color}`}>{label}</h1>
                  <p className="text-gray-600">Your interview has been reviewed.</p>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Email Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <span className="text-2xl mr-2">📧</span>
              Email Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmailSent ? (
              <div className="text-center text-green-600">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-lg font-semibold">Results sent to your email!</p>
                <p className="text-sm text-gray-600 mt-2">
                  Check your inbox for a detailed copy of your interview results.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Would you like to receive a copy of your results via email?
                </p>
                
                {emailError && (
                  <div className="text-red-600 mb-4 p-3 bg-red-50 rounded border border-red-200">
                    {emailError}
                  </div>
                )}
                
                <Button 
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="w-full md:w-auto"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Results to Email'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/candidate/dashboard')}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={() => window.print()}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Print Results
          </Button>

          <Button 
            onClick={() => {
              const dataStr = JSON.stringify(results, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const exportFileDefaultName = `interview-results-${sessionId}.json`;
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
            }}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Download Results
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Session ID: {sessionId}</p>
          {applicationId && <p>Application ID: {applicationId}</p>}
          <p className="mt-2">
            Thank you for completing your interview. We'll be in touch soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
