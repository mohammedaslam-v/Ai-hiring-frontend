import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { log, error as logError } from '@/utils/logger';
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
  const [processingStage, setProcessingStage] = useState<string>('Initializing...');

  // React 18 StrictMode guards to prevent duplicate initialization
  const initOnceRef = useRef(false);
  const startingRef = useRef(false);

  // Get application ID from location state, URL params, or localStorage fallback
  const applicationId = location.state?.applicationId || 
                       new URLSearchParams(location.search).get('applicationId') ||
                       (typeof window !== 'undefined' ? localStorage.getItem('applicationId') : null);

  const startProcessing = useCallback(async () => {
    // Prevent re-entry during processing
    if (startingRef.current) {
      log('🔄 ProcessingPage: Already starting processing, skipping...');
      return;
    }
    startingRef.current = true;

    try {
      log('🔄 ProcessingPage: Starting Tough Tongue processing for session:', sessionId);
      
      if (!applicationId) {
        throw new Error('Application ID is required. Please restart the interview process.');
      }
      
      setProcessingStage('Starting AI evaluation...');
      setProgress(10);
      
      // Start the processing and poll for results
      const results = await toughTongueService.getInterviewResults(sessionId!);
      
      log('✅ ProcessingPage: Tough Tongue processing completed, now polling for processed results...');
      setProcessingStage('AI evaluation complete, finalizing results...');
      setProgress(70);
      
      // Now poll for the processed results from our database
      const processedResults = await pollForProcessedResults(applicationId);
      
      log('✅ ProcessingPage: Processed results received');
      
      // Results are ready!
      setStatus('completed');
      setResults(processedResults);
      setProgress(100);
      setProcessingStage('Complete! Redirecting to results...');
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate('/candidate/results', { 
          state: { 
            results: processedResults, 
            sessionId, 
            applicationId 
          } 
        });
      }, 2000); // 2 second delay to show completion
      
    } catch (error) {
      logError('❌ ProcessingPage: Error getting results:', error instanceof Error ? error.message : error);
      setStatus('failed');
      setProgress(0);
      
      // Provide more user-friendly error messages
      let userFriendlyError = 'An unexpected error occurred during processing.';
      if (error instanceof Error) {
        if (error.message.includes('Application ID is required')) {
          userFriendlyError = 'Session information is missing. Please restart the interview.';
        } else if (error.message.includes('timeout')) {
          userFriendlyError = 'The evaluation is taking longer than expected. This may be due to high server load. Please try again.';
        } else if (error.message.includes('Network')) {
          userFriendlyError = 'Network connection error. Please check your internet connection and try again.';
        } else if (error.message.includes('Failed after')) {
          userFriendlyError = 'The evaluation service is currently experiencing high demand. Please try again in a few minutes.';
        } else {
          userFriendlyError = error.message;
        }
      }
      
      setError(userFriendlyError);
      setProcessingStage('Processing failed');
    } finally {
      startingRef.current = false;
    }
  }, [sessionId, applicationId, navigate]);

  // Guard navigation while processing is active
  useNavigationGuard(status === 'processing', 'Processing is running. Are you sure you want to leave?');

  useEffect(() => {
    if (!sessionId) {
      navigate('/candidate/dashboard');
      return;
    }

    // React 18 StrictMode guard - prevent double initialization
    if (initOnceRef.current) {
      log('🔄 ProcessingPage: Already initialized, skipping...');
      return;
    }
    initOnceRef.current = true;
    
    // Start processing immediately
    startProcessing();
    
    // Start timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, navigate, startProcessing]);

  const pollForProcessedResults = async (applicationId: string) => {
    // Improved polling: check after 30s, then every 15s for up to 3 minutes total
    const initialWaitMs = 30000; // 30 seconds
    const perAttemptIntervalMs = 15000; // 15 seconds
    const maxAttempts = 12; // 30s + 11×15s = 195s total

    log(`🔄 ProcessingPage: Polling for processed results for application ${applicationId}`);

    // Wait before first check to reduce unnecessary calls
    await new Promise(resolve => setTimeout(resolve, initialWaitMs));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        log(`🔍 ProcessingPage: Polling attempt ${attempt}/${maxAttempts} for processed results`);
        setProcessingStage(`Finalizing results... (${attempt}/${maxAttempts})`);
        
        const response = await interviewResultsService.getInterviewResults(applicationId);
        
        if (response.status && response.data) {
          log(`✅ ProcessingPage: Processed results ready on attempt ${attempt}`);
          return response.data;
        } else if (response.error === 'INTERVIEW_NOT_COMPLETED') {
          log(`⏳ ProcessingPage: Interview still processing... (attempt ${attempt}/${maxAttempts})`);
          
          // Update progress based on polling attempts
          const progressIncrement = Math.min(20 / maxAttempts, 2); // Max 2% per attempt
          setProgress(prev => Math.min(prev + progressIncrement, 95));
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, perAttemptIntervalMs));
          }
        } else {
          throw new Error(response.msg || 'Failed to get processed results');
        }
      } catch (error) {
        logError(`❌ ProcessingPage: Error on attempt ${attempt}:`, error instanceof Error ? error.message : error);
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, perAttemptIntervalMs));
      }
    }
    
    throw new Error('Results are still being processed. Please check back in a few minutes.');
  };

  const handleRetry = () => {
    setStatus('processing');
    setError(null);
    setProgress(0);
    setTimeElapsed(0);
    setProcessingStage('Retrying...');
    startProcessing();
  };

  const handleGoBack = () => {
    navigate('/candidate/dashboard');
  };

  // Enhanced progress bar animation
  useEffect(() => {
    if (status === 'processing' && progress < 60) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 60) return prev; // Don't go past 60% until actually done
          return prev + Math.random() * 2; // Slower, more realistic progress
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [status, progress]);

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
          <div className="text-sm text-gray-500 mb-6">
            Processing time: {formatTime(timeElapsed)}
          </div>
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
            <div className="bg-green-500 h-2 rounded-full w-full transition-all duration-300"></div>
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
          We're analyzing your responses using advanced AI. This process ensures accurate and fair evaluation.
        </p>
        
        {/* Enhanced Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
        
        {/* Status Text */}
        <div className="text-sm text-gray-500 mb-4">
          <div className="font-medium text-blue-600 mb-1">{processingStage}</div>
          <div className="mt-1">{Math.round(progress)}% complete</div>
        </div>

        {/* Enhanced Processing Steps */}
        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">Processing Steps:</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Audio processing complete</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${progress > 30 ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
              <span>AI evaluation in progress</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${progress > 70 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span>Generating detailed feedback</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 100 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Finalizing results</span>
            </div>
          </div>
        </div>

        {/* Enhanced Help Text */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>This process typically takes 2-5 minutes.</div>
          <div>Please keep this page open during processing.</div>
          {timeElapsed > 180 && (
            <div className="text-yellow-600 font-medium">
              Taking longer than usual - high server demand detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;