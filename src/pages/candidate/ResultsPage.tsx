import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { interviewResultsService } from '../../services/interviewResults';
import { log, error as logError } from '@/utils/logger';

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

  const recoverResults = useCallback(async () => {
    try {
      setIsLoading(true);
      log('🔍 ResultsPage: Attempting to recover results...');
      
      if (applicationId) {
        log('🔍 ResultsPage: Fetching results from backend...');
        const response = await interviewResultsService.getInterviewResults(applicationId);
        
        if (response.status && response.data) {
          log('✅ ResultsPage: Results recovered successfully');
          setResults(response.data);
          return;
        }
      }
      
      // If no results found, redirect to dashboard
      log('❌ ResultsPage: No results found, redirecting to dashboard');
      navigate('/candidate/dashboard');
      
    } catch (error) {
      logError('❌ ResultsPage: Error recovering results:', error instanceof Error ? error.message : error);
      navigate('/candidate/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, applicationId]);

  useEffect(() => {
    // If no results from state, try to recover from backend
    if (!results) {
      recoverResults();
    }
  }, [results, recoverResults]);


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

        {/* Email Notification */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Email Sent!</h3>
              <p className="text-blue-700">
               The report has been sent to your email address with your interview results and next steps.
              </p>
            </div>
          </CardContent>
        </Card>

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
