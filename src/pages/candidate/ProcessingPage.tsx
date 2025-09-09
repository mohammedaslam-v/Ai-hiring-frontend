import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toughTongueService } from '../../services/toughTongueService';
import { interviewResultsService } from '../../services/interviewResults';
import { Button } from '../../components/ui/button';

const ProcessingPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<unknown>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Get application ID from location state, URL params, or localStorage
  const applicationId = location.state?.applicationId || 
                       new URLSearchParams(location.search).get('applicationId') ||
                       localStorage.getItem('currentApplicationId');

  const startProcessing = useCallback(async () => {
    try {
      console.log('🔄 ProcessingPage: Starting Tough Tongue processing for session:', sessionId);
      
      if (!applicationId) {
        throw new Error('Application ID is required');
      }
      
      // Start the processing and poll for results
      const results = await toughTongueService.getInterviewResults(sessionId!);
      
      console.log('✅ ProcessingPage: Tough Tongue processing completed, now polling for processed results...');
      
      // Now poll for the processed results from our database
      const processedResults = await pollForProcessedResults(applicationId);
      
      console.log('✅ ProcessingPage: Processed results received:', processedResults);
      
      // Results are ready!
      setStatus('completed');
      setResults(processedResults);
      setProgress(100);
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        // Clean up localStorage before navigating
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentApplicationId');
        
        navigate('/candidate/results', { 
          state: { 
            results: processedResults, 
            sessionId, 
            applicationId 
          } 
        });
      }, 2000); // 2 second delay to show completion
      
    } catch (error) {
      console.error('❌ ProcessingPage: Error getting results:', error);
      setStatus('failed');
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [sessionId, applicationId, navigate]);

  const checkSessionStatus = useCallback(async () => {
    try {
      console.log('🔍 ProcessingPage: Checking existing session status...');
      
      // First check if we have processed results already
      if (applicationId) {
        const response = await interviewResultsService.getInterviewResults(applicationId);
        if (response.status && response.data) {
          console.log('✅ ProcessingPage: Session already completed, redirecting to results...');
          setStatus('completed');
          setResults(response.data);
          setProgress(100);
          
          // Navigate to results after a short delay
          setTimeout(() => {
            // Clean up localStorage before navigating
            localStorage.removeItem('currentSessionId');
            localStorage.removeItem('currentApplicationId');
            
            navigate('/candidate/results', {
              state: {
                results: response.data,
                sessionId,
                applicationId
              }
            });
          }, 2000);
          return;
        }
      }
      
      // If not completed, check Tough Tongue status
      const statusResponse = await toughTongueService.getProcessingStatus(sessionId!);
      if (statusResponse.status === 'completed') {
        console.log('✅ ProcessingPage: Tough Tongue completed, polling for processed results...');
        // Start polling for processed results
        const processedResults = await pollForProcessedResults(applicationId!);
        setStatus('completed');
        setResults(processedResults);
        setProgress(100);
        
        setTimeout(() => {
          // Clean up localStorage before navigating
          localStorage.removeItem('currentSessionId');
          localStorage.removeItem('currentApplicationId');
          
          navigate('/candidate/results', {
            state: {
              results: processedResults,
              sessionId,
              applicationId
            }
          });
        }, 2000);
      } else if (statusResponse.status === 'failed') {
        console.log('❌ ProcessingPage: Session failed, showing error...');
        setStatus('failed');
        setError(statusResponse.error || 'Processing failed');
      } else {
        console.log('🔄 ProcessingPage: Session still processing, resuming...');
        // Resume normal processing
        startProcessing();
      }
    } catch (error) {
      console.log('⚠️ ProcessingPage: Error checking status, starting fresh processing...', error);
      // If there's an error checking status, start fresh
      startProcessing();
    }
  }, [sessionId, applicationId, navigate, startProcessing]);

  useEffect(() => {
    if (sessionId) {
      // Store session data in localStorage for recovery
      localStorage.setItem('currentSessionId', sessionId);
      if (applicationId) {
        localStorage.setItem('currentApplicationId', applicationId);
      }
      
      // Check if session is already completed before starting
      checkSessionStatus();
      
      // Start timer
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      navigate('/candidate/dashboard');
    }
  }, [sessionId, navigate, applicationId, checkSessionStatus]);

  const pollForProcessedResults = async (applicationId: string) => {
    // First check only after 40s, then every 20s. Total ≈ 3 minutes.
    const initialWaitMs = 40000; // 40 seconds
    const perAttemptIntervalMs = 20000; // 20 seconds
    const maxAttempts = 8; // first check + 7 more = 3 minutes total

    console.log(`🔄 ProcessingPage: Polling for processed results for application ${applicationId} (first check after 40s, then every 20s, max ${maxAttempts} attempts)`);

    // Wait before first check to reduce unnecessary calls
    await new Promise(resolve => setTimeout(resolve, initialWaitMs));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔍 ProcessingPage: Polling attempt ${attempt}/${maxAttempts} for processed results`);
        
        const response = await interviewResultsService.getInterviewResults(applicationId);
        
        if (response.status && response.data) {
          console.log(`✅ ProcessingPage: Processed results ready on attempt ${attempt}`);
          return response.data;
        } else if (response.error === 'INTERVIEW_NOT_COMPLETED') {
          console.log(`⏳ ProcessingPage: Interview still processing... (attempt ${attempt}/${maxAttempts})`);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, perAttemptIntervalMs));
          }
        } else {
          throw new Error(response.msg || 'Failed to get processed results');
        }
      } catch (error) {
        console.error(`❌ ProcessingPage: Error on attempt ${attempt}:`, error);
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, perAttemptIntervalMs));
      }
    }
    
    throw new Error('Timeout waiting for processed results');
  };

  const handleRetry = () => {
    setStatus('processing');
    setError(null);
    setProgress(0);
    setTimeElapsed(0);
    startProcessing();
  };

  const handleGoBack = () => {
    navigate('/candidate/dashboard');
  };

  // Simulate progress bar (optional visual feedback)
  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Don't go to 100% until actually done
          return prev + Math.random() * 5;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleRetry} className="flex-1">
              Try Again
            </Button>
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Complete!</h2>
          <p className="text-gray-600 mb-6">
            Your interview has been successfully evaluated. Redirecting to results...
          </p>
          <div className="w-full bg-green-200 rounded-full h-2 mb-4">
            <div className="bg-green-500 h-2 rounded-full w-full"></div>
          </div>
          <div className="text-sm text-gray-500">
            Completed in {formatTime(timeElapsed)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Processing Animation */}
        <div className="relative mb-6">
          <div className="text-blue-500 text-6xl animate-pulse">🔄</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Interview</h2>
        <p className="text-gray-600 mb-6">
          We're analyzing your responses using AI. This usually takes 1-2 minutes.
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
        
        {/* Status Text */}
        <div className="text-sm text-gray-500 mb-4">
          <div>Please wait while we process your interview...</div>
          <div className="font-mono text-blue-600 mt-2">{formatTime(timeElapsed)}</div>
        </div>

        {/* Processing Steps */}
        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Processing Steps:</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Analyzing speech patterns
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              Evaluating responses
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
              Generating feedback
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-400">
          This process typically takes 1-3 minutes. Please don't close this page.
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
