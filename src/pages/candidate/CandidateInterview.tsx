import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock, CheckCircle, Square, AlertTriangle, Play, Eye, Camera, Mic, MapPin } from "lucide-react";
import { toast } from 'react-toastify';
import WhatsAppHelpButton from "@/components/candidate/WhatsAppHelpButton";

// Import custom hooks
import { useInterviewState } from "@/hooks/candidate/useInterviewState";
import { useVideoManagement } from "@/hooks/candidate/useVideoManagement";
import { useInterviewSession } from "@/hooks/candidate/useInterviewSession";
import { useInterviewCompletion } from "@/hooks/candidate/useInterviewCompletion";
import { useInterviewNavigation } from "@/hooks/candidate/useInterviewNavigation";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

// Import utilities and constants
import { formatTime, generateInterviewUrl } from "@/utils/candidate/interviewUtils";
import { 
  INTERVIEW_STATUS,
  VIDEO_REQUIREMENTS,
  INTERVIEW_REQUIREMENTS,
  INTERVIEW_GUIDELINES,
  INTERVIEW_PROGRESS_INSTRUCTIONS,
  UI_MESSAGES
} from "@/constants/candidate/interviewConstants";

// Import Tough Tongue service
import { toughTongueService } from "@/services/toughTongueService";

const CandidateInterview = () => {
  const navigate = useNavigate();
  
  // Use custom hooks
  const {
    interviewStatus,
    candidateName,
    candidateEmail,
    applicationId,
    currentInterviewSession,
    interviewResult,
    setCurrentInterviewSession,
    setInterviewResult,
    setToReady,
    setToInProgress,
    setToPreparingResults
  } = useInterviewState();

  const {
    videoWatched,
    videoStarted,
    timeElapsed,
    handleVideoPlay,
    handleVideoEnd,
    handleSkipVideo,
    canProceedToInterview
  } = useVideoManagement(interviewStatus);

  const {
    interviewSessionId,
    sessionState,
    handleInterviewStart,
    handleStartInterview,
    handleCompleteInterview,
    handleSkipInterview,
    handleEndInterview
  } = useInterviewSession(applicationId, setCurrentInterviewSession, setInterviewResult, setToPreparingResults);

  // Get session management functions from the hook
  const { startSession, completeSession, skipSession, linkToughTongueSession } = useSessionManagement();

  // Debug logging for session ID tracking
  useEffect(() => {
    console.log('🔍 DEBUG: Current interviewSessionId:', interviewSessionId);
    console.log('🔍 DEBUG: Current sessionState:', sessionState);
    console.log('🔍 DEBUG: Current applicationId:', applicationId);
            console.log('🔍 DEBUG: localStorage applicationId:', localStorage.getItem('applicationId'));
  }, [interviewSessionId, sessionState, applicationId]);

  // Guard navigation only while the interview is active or we are handing off to processing
  const blockInterviewLeave =
    interviewStatus === INTERVIEW_STATUS.IN_PROGRESS ||
    interviewStatus === INTERVIEW_STATUS.PREPARING_RESULTS;
  useNavigationGuard(blockInterviewLeave, "Your interview is in progress. Leaving will interrupt it.");

  // Helper functions to call session APIs with our session ID
  const handleStartInterviewWithId = useCallback(async (sessionId: string) => {
    try {
      console.log('Starting interview with our session ID:', sessionId);
      
      // Validate that we have a valid session ID
      if (!sessionId || sessionId.trim() === '') {
        console.error('Invalid session ID provided:', sessionId);
        toast.error('Invalid session ID - cannot start interview');
        return;
      }
      
      // Log the current state for debugging
      console.log('Current interviewSessionId state:', interviewSessionId);
      console.log('Current sessionId parameter:', sessionId);
      
      const session = await startSession(sessionId);
      if (session) {
        console.log('Session status updated to started:', session);
      }
    } catch (error) {
      console.error('Error starting interview with our session ID:', error);
      toast.error('Failed to start interview');
    }
  }, [interviewSessionId, startSession]);

  const handleCompleteInterviewWithId = useCallback(async (sessionId: string, score: number) => {
    try {
      console.log('🎯 handleCompleteInterviewWithId called with sessionId:', sessionId, 'score:', score);
      console.log('🎯 About to call completeSession with sessionId:', sessionId, 'score:', score);
      const session = await completeSession(sessionId, score);
      console.log('🎯 completeSession returned:', session);
      if (session) {
        // Toast message handled by useInterviewSession hook
        console.log('✅ Session status updated to completed:', session);
      } else {
        console.log('⚠️ completeSession returned null/undefined');
      }
    } catch (error) {
      console.error('❌ Error completing interview with our session ID:', error);
      toast.error('Failed to complete interview');
    }
  }, [completeSession]);

  const handleSkipInterviewWithId = async (sessionId: string) => {
    try {
      console.log('Skipping interview with our session ID:', sessionId);
      console.log('Current session status before skip:', sessionState?.status);
      
      const session = await skipSession(sessionId);
      if (session) {
        // Provide different messages based on when the interview was stopped
        if (sessionState?.status === 'pending') {
          toast.info('Interview was stopped before starting');
          console.log('Interview stopped before starting - status updated to skipped');
        } else if (sessionState?.status === 'started') {
          toast.info('Interview was stopped early');
          console.log('Interview stopped early - status updated to skipped');
        } else {
          toast.info('Interview was skipped');
          console.log('Interview skipped - status updated to skipped');
        }
        
        console.log('Session status updated to skipped:', session);
      }
    } catch (error) {
      console.error('Error skipping interview with our session ID:', error);
      toast.error('Failed to skip interview');
    }
  };

  // Generate iframe URL with real candidate information from localStorage
  const realCandidateName = JSON.parse(localStorage.getItem('candidateName') || 'null') || candidateName;
  const realCandidateEmail = JSON.parse(localStorage.getItem('candidateEmail') || 'null') || candidateEmail;
  const iframeUrl = generateInterviewUrl(realCandidateName, realCandidateEmail);
  
  // Debug: Log when iframe URL is generated
  useEffect(() => {
    console.log('🎯 Interview Page - Generated iframe URL:');
    console.log('🎯 - URL:', iframeUrl);
    console.log('🎯 - Using candidate name:', realCandidateName);
    console.log('🎯 - Using candidate email:', realCandidateEmail);
    console.log('🎯 - localStorage values:', {
      candidateName: JSON.parse(localStorage.getItem('candidateName') || 'null'),
      candidateEmail: JSON.parse(localStorage.getItem('candidateEmail') || 'null'),
              applicationId: localStorage.getItem('applicationId')
    });
  }, [iframeUrl, realCandidateName, realCandidateEmail]);

  // Use custom hooks for interview logic
  const { handleProceedToInterview, handleBeginInterview } = useInterviewNavigation(
    canProceedToInterview,
    setToReady
  );

  // Create a wrapper function for the button onClick
  const onBeginInterviewClick = () => {
    handleBeginInterview(handleInterviewStart, setToInProgress);
  };

  const { handleInterviewComplete } = useInterviewCompletion(
    interviewSessionId,
    setInterviewResult,
    setToInProgress,
    setToPreparingResults
  );

  // Listen for messages from Tough Tongue iframe to detect interview start
  // Ensure session ID is properly synchronized
  useEffect(() => {
    if (interviewSessionId) {
      console.log('Interview session ID synchronized:', interviewSessionId);
    }
  }, [interviewSessionId]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Only accept messages from Tough Tongue domain
      if (event.origin !== 'https://app.toughtongueai.com') {
        return;
      }

      try {
        const data = event.data;
        console.log('Tough Tongue message received:', data);
        
        // Check if interview has started (when user clicks Start in Tough Tongue)
        if (data && typeof data === 'object') {
          // Log all events to investigate scoring
          if (data.event || data.type) {
            console.log(`🔍 Processing Tough Tongue Event: ${data.event || data.type}`);
            
            // Check if this event contains score/evaluation data
            if (data.score !== undefined) {
              console.log('🎯 SCORE DETECTED:', data.score);
            }
            if (data.evaluation !== undefined) {
              console.log('📊 EVALUATION DETECTED:', data.evaluation);
            }
            if (data.result !== undefined) {
              console.log('🏆 RESULT DETECTED:', data.result);
            }
            if (data.assessment !== undefined) {
              console.log('📋 ASSESSMENT DETECTED:', data.assessment);
            }
          }
          
          // Detect interview start - look for onStart event
          if (data.event === 'onStart' && interviewSessionId) {
            console.log('Tough Tongue interview started (onStart detected)');
            console.log('Tough Tongue Session ID:', data.sessionId);
            console.log('Our Session ID:', interviewSessionId);
            
            // Link Tough Tongue session ID to our session
            try {
              await linkToughTongueSession(interviewSessionId, data.sessionId);
              console.log('✅ Sessions linked successfully');
            } catch (error) {
              console.error('❌ Failed to link sessions:', error);
              toast.error('Failed to link interview session. Please refresh and try again.');
              return;
            }
            
            // Start our session
            console.log('Calling handleStartInterviewWithId with session ID:', interviewSessionId);
            handleStartInterviewWithId(interviewSessionId);
          }
          
          // Detect interview completion - look for onSubmit event
          if (data.event === 'onSubmit' && interviewSessionId) {
            console.log('=== TOUGH TONGUE INTERVIEW COMPLETION DATA ===');
            console.log('Event:', data.event);
            console.log('Session ID:', data.sessionId);
            console.log('Timestamp:', data.timestamp);
            console.log('Full Tough Tongue Response:', JSON.stringify(data, null, 2));
            console.log('=============================================');
            
            console.log('🎯 VIDEO UPLOAD COMPLETED (onSubmit detected) - Starting evaluation process...');
            console.log('Using our session ID for API call:', interviewSessionId);
            
            // Show processing page immediately when video upload completes
            setToPreparingResults();
            // Proceed to processing page
            console.log('✅ Processing page shown - waiting for evaluation...');
            
            // Navigate to processing page - it will handle polling and navigation to results
            console.log('🎯 Navigating to processing page - it will handle the evaluation flow...');
            console.log('🎯 DEBUG: applicationId before navigation:', applicationId);
            console.log('🎯 DEBUG: localStorage applicationId before navigation:', localStorage.getItem('applicationId'));
            
            // Navigate to processing page immediately
            navigate(`/candidate/processing/${interviewSessionId}`, {
              state: { applicationId }
            });
          }
          
          // Detect interview stop/abandon - look for onStop/onTerminated events
          if ((data.event === 'onStop' || data.event === 'onTerminated') && interviewSessionId) {
            console.log('=== TOUGH TONGUE INTERVIEW STOPPED DATA ===');
            console.log('Event:', data.event);
            console.log('Session ID:', data.sessionId);
            console.log('Timestamp:', data.timestamp);
            console.log('Full Tough Tongue Response:', JSON.stringify(data, null, 2));
            console.log('==========================================');
            
            console.log('🛑 INTERVIEW STOPPED (onStop/onTerminated detected) - Waiting for final submit/upload completion...');
            console.log('Using our session ID for API call:', interviewSessionId);
            console.log('Current session status:', sessionState?.status);
            
            // Do NOT navigate on onStop/onTerminated.
          }
        }
      } catch (error) {
        console.error('Error processing Tough Tongue message:', error);
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [interviewSessionId, sessionState?.status, applicationId, handleCompleteInterviewWithId, handleStartInterviewWithId, navigate, setToPreparingResults, linkToughTongueSession]);

  // Browser close detection - mark as left midway if user closes browser during interview
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only mark as left midway if interview is actually in progress
      if (sessionState?.status === 'started' && interviewSessionId) {
        console.log('🚨 Browser closing during interview - marking as left midway');
        
        // Try to mark as left midway before page unloads
        // Use sendBeacon for reliable delivery even during page unload
        if (navigator.sendBeacon) {
          const data = JSON.stringify({
            sessionId: interviewSessionId,
            action: 'mark_left_midway',
            timestamp: new Date().toISOString()
          });
          
          // Send to a special endpoint that marks session as skipped
          navigator.sendBeacon(`${import.meta.env.VITE_API_URL}/api/session/${interviewSessionId}/skip`, data);
        }
        
        // Also try to call skipSession directly (may not complete due to page unload)
        try {
          skipSession(interviewSessionId);
        } catch (error) {
          console.log('Could not call skipSession during unload:', error);
        }
      }
    };

    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionState?.status, interviewSessionId, skipSession]);

  // Network connectivity detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Network connection restored');
      // Could trigger retry logic here if needed
    };

    const handleOffline = () => {
      console.log('📡 Network connection lost');
      // Could show offline message or pause processing
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Alternative: Monitor iframe load events and detect state changes
  useEffect(() => {
    const iframe = document.querySelector('iframe[src*="toughtongueai.com"]') as HTMLIFrameElement;
    
    if (iframe) {
      const handleIframeLoad = () => {
        console.log('Tough Tongue iframe loaded, checking for state changes...');
        
        // Check Tough Tongue API health when iframe loads
        toughTongueService.checkApiHealth()
          .then(isHealthy => {
            if (isHealthy) {
              console.log('✅ Tough Tongue API is accessible');
            } else {
              console.log('⚠️ Tough Tongue API may not be accessible');
            }
          })
          .catch(error => {
            console.log('❌ Could not check Tough Tongue API health:', error.message);
          });
        
        // Try to detect if interview has started by checking iframe content
        try {
          // This is a fallback method - the iframe might not allow access due to CORS
          console.log('Iframe loaded, but CORS restrictions may prevent content access');
        } catch (error) {
          console.log('Cannot access iframe content due to CORS restrictions');
        }
      };

      iframe.addEventListener('load', handleIframeLoad);
      
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
      };
    }
  }, []);

  // Loading state
  if (interviewStatus === INTERVIEW_STATUS.LOADING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Interview...</h2>
        </div>
      </div>
    );
  }

  // Video required state - EXACTLY as shown in your first image
  if (interviewStatus === INTERVIEW_STATUS.VIDEO_REQUIRED) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info - EXACTLY as shown */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs">
            <p><strong>Debug:</strong> Application ID: {applicationId || 'Not found'}</p>
            <p><strong>Interview Session ID:</strong> {interviewSessionId || 'Not created'}</p>
            <p><strong>Candidate:</strong> {candidateName} ({candidateEmail})</p>
            {/* Video Status removed as per requirements */}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-blue-600/20 p-12">
            {/* Mandatory Video Section - EXACTLY as shown */}
            <div className="text-center mb-12">
              <div className="mx-auto w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border-2 border-red-200">
                <Play className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">Mandatory Instructions Video</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                <strong>IMPORTANT:</strong> You MUST watch this complete instructional video before proceeding to the AI interview.
                This video contains essential guidelines that will help you succeed in your interview.
              </p>

              {/* Video Alert Box - EXACTLY as shown */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Required Before Interview</h4>
                    <ul className="text-red-700 space-y-1">
                      <li>• Watch the complete video (no skipping allowed)</li>
                      <li>• Take notes of important instructions</li>
                      <li>• Ensure you understand all guidelines</li>
                      <li>• Only then you can proceed to the AI interview</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* YouTube Video Embed - EXACTLY as shown */}
              <div className="relative w-full max-w-4xl mx-auto mb-8">
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg border-2 border-blue-600/20">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/Ey0Gey_Y2lI?rel=0&modestbranding=1&showinfo=0"
                    title="Interview Instructions Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoPlay}
                  ></iframe>
                </div>
              </div>

              {/* Video Status Indicators - EXACTLY as shown */}
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className={`flex items-center space-x-2 ${videoStarted ? 'text-blue-600' : 'text-gray-400'}`}>
                  <Eye className="h-5 w-5" />
                  <span className="font-medium">Video Started</span>
                  {videoStarted && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                <div className={`flex items-center space-x-2 ${videoWatched ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Video Completed</span>
                  {videoWatched && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
              </div>

              {/* Manual Completion Checkbox - EXACTLY as shown */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <input
                    type="checkbox"
                    id="videoCompleted"
                    checked={videoWatched}
                    onChange={(e) => handleSkipVideo()} // Changed to handleSkipVideo
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600"
                  />
                  <label htmlFor="videoCompleted" className="text-gray-700 font-medium">
                    I have watched the complete instructional video and understand all guidelines
                  </label>
                </div>
              </div>

              {/* Proceed Button - EXACTLY as shown */}
              <Button
                onClick={handleProceedToInterview}
                disabled={!canProceedToInterview()}
                className={`px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${canProceedToInterview()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {canProceedToInterview() ? 'Proceed to AI Interview Setup' : 'Complete Video First'}
              </Button>
            </div>
          </div>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Ready state - EXACTLY as shown in your second and third images
  if (interviewStatus === INTERVIEW_STATUS.READY) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-3xl shadow-sm border border-blue-600/20 p-12">
            {/* AI Interview Setup Header - EXACTLY as shown */}
            <div className="text-center mb-12">
              <div className="mx-auto w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 border-2 border-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">AI Interview Setup</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Prepare for your AI-powered interview experience. Ensure you're in an optimal
                environment for the best results.
              </p>
            </div>

            {/* Access Requirements - EXACTLY as shown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 border border-orange-300">
                  <Camera className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Camera Access</h3>
                <p className="text-gray-600 text-sm">
                  Enable high-quality video recording for visual assessment
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 border border-blue-200">
                  <Mic className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Microphone Access</h3>
                <p className="text-gray-600 text-sm">
                  Enable crystal-clear audio recording for speech analysis
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 border border-red-300">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Secure Environment</h3>
                <p className="text-gray-600 text-sm">
                  Quiet space with stable internet connection
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-600">Interview Guidelines</h3>
              </div>

              {/* Highlighted Important Points - EXACTLY as shown */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start space-x-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-amber-800 mb-2">Critical Requirements</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-amber-700 font-medium">Please make sure you are in a quiet place without any disturbance</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-amber-700 font-medium">Listen to the questions carefully and take your time to think before answering</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">The interview will last approximately 10 minutes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">You'll be asked about your teaching experience and methods</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">You may be asked to read or discuss the passage below</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Speak naturally and authentically - be yourself</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Maintain eye contact with the camera</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-orange-600 font-medium">Wait for the interview to complete fully - the system will automatically process your results after the AI analysis is done</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-red-600 font-medium">You cannot re-attempt this interview once completed</p>
                </div>
              </div>
            </div>



            {/* Tough Tongue AI Preview */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Tough Tongue AI Interview Preview</h3>
              <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden border border-gray-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-xl font-bold">b</span>
                    </div>
                    <p className="text-sm">bambinos.live Hiring</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-3">
                Your interview will be conducted through our AI-powered Tough Tongue platform
              </p>
            </div>

            <div className="text-center">
              <Button onClick={onBeginInterviewClick} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg">
                Begin AI Interview
              </Button>
            </div>
          </div>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Interview in progress state - EXACTLY as shown in your fourth image
  if (interviewStatus === INTERVIEW_STATUS.IN_PROGRESS) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info - EXACTLY as shown in screenshot */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs">
            <p><strong>Application ID:</strong> {applicationId || 'Not found'}</p>
            <p><strong>Interview Session ID:</strong> {interviewSessionId || 'Not created'}</p>
            <p><strong>Candidate:</strong> {candidateName} ({candidateEmail})</p>
            {/* Video Status removed as per requirements */}
          </div>



          <Card className="border-blue-600/20 shadow-xl bg-white">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <CardTitle className="text-2xl text-blue-600">AI Interview</CardTitle>
              <CardDescription>
                Candidate: {candidateName} ({candidateEmail})
              </CardDescription>
            </CardHeader>
            <CardContent>


              {/* Tough Tongue AI Interview Interface */}
              <div className="mb-6">
                <div className="relative w-full h-[700px] bg-black rounded-lg overflow-hidden border-2 border-blue-600/20">
                  <iframe
                    src={iframeUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="microphone; camera; display-capture"
                    className="absolute inset-0"
                    title="Tough Tongue AI Interview"
                  />
                </div>
              </div>

              {/* Important Instructions - EXACTLY as shown in screenshot */}
              <div className="mb-6 p-6 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">Important Instructions</h3>
                <div className="text-orange-600 font-medium space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 text-xl">✅</span>
                    <p><strong>Be in a quiet place</strong> with <strong>no background noise</strong> before starting.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 text-xl">→</span>
                    <p><strong>Click "Your Task"</strong> to begin reading <strong>only when instructed by the AI</strong>.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-600 text-xl">⏳</span>
                    <div>
                      <p><strong>Wait for the message</strong>:</p>
                      <p className="ml-4 font-bold text-orange-700">"Session Completed. Thank you for completing this session!"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-red-600 text-xl">🚫</span>
                    <div>
                      <p><strong>Do NOT close the browser or leave the page</strong> before this message appears.</p>
                      <p className="ml-4">Doing so will <strong>make you ineligible</strong> for the next step.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center" style={{ display: 'none' }}>
                <Button
                  onClick={handleEndInterview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  End Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Interview completed state
  if (interviewStatus === INTERVIEW_STATUS.COMPLETED) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-blue-600/20 shadow-xl bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 border border-yellow-300">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl text-blue-600">Interview Completed!</CardTitle>
              <CardDescription>
                Processing your responses and generating evaluation...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">This may take a few moments</p>
            </CardContent>
          </Card>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Preparing results state
  if (interviewStatus === INTERVIEW_STATUS.PREPARING_RESULTS) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm border">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-6 h-6 rounded" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bambinos.live</h1>
            </div>
          </div>

          {/* Main Processing Card */}
          <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-6 pt-8">
              {/* Simple Success Icon */}
              <div className="mx-auto w-16 h-16 mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Processing Your Results
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                We're analyzing your interview responses and calculating your score...
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-8">
              {/* Simple Loading Animation */}
              <div className="mb-6">
                <div className="flex justify-center items-center space-x-1 mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                </div>
                
                {/* Simple Progress Bar */}
                <div className="w-full max-w-xs mx-auto">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Analyzing responses...</p>
                </div>
              </div>

              {/* Simple Processing Steps */}
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm text-green-800 dark:text-green-200">Video Upload Complete</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-sm text-blue-800 dark:text-blue-200">AI Analysis in Progress</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Generating Results</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we prepare your results
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  This usually takes 2-3 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <WhatsAppHelpButton />
      </div>
    );
  }

  return null;
};

export default CandidateInterview;
