import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock, CheckCircle, Square, AlertTriangle, Play, Eye, Camera, Mic, MapPin } from "lucide-react";
import { toast } from 'react-toastify';
import WhatsAppHelpButton from "@/components/candidate/WhatsAppHelpButton";
import DarkModeToggle from "@/components/DarkModeToggle";

// Import custom hooks
import { useInterviewState } from "@/hooks/candidate/useInterviewState";
import { useVideoManagement } from "@/hooks/candidate/useVideoManagement";
import { useInterviewSession } from "@/hooks/candidate/useInterviewSession";
import { useInterviewCompletion } from "@/hooks/candidate/useInterviewCompletion";
import { useInterviewNavigation } from "@/hooks/candidate/useInterviewNavigation";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { log, error as logError } from "@/utils/logger";

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
    log('🔍 DEBUG: Current interviewSessionId:', interviewSessionId);
    log('🔍 DEBUG: Current sessionState:', sessionState);
    log('🔍 DEBUG: Current applicationId:', applicationId);
            log('🔍 DEBUG: localStorage applicationId:', localStorage.getItem('applicationId'));
  }, [interviewSessionId, sessionState, applicationId]);

  // Guard navigation only while the interview is active or we are handing off to processing
  const blockInterviewLeave =
    interviewStatus === INTERVIEW_STATUS.IN_PROGRESS ||
    interviewStatus === INTERVIEW_STATUS.PREPARING_RESULTS;
  useNavigationGuard(blockInterviewLeave, "Your interview is in progress. Leaving will interrupt it.");

  // Helper functions to call session APIs with our session ID
  const handleStartInterviewWithId = useCallback(async (sessionId: string) => {
    try {
      log('Starting interview with our session ID:', sessionId);
      
      // Validate that we have a valid session ID
      if (!sessionId || sessionId.trim() === '') {
        logError('Invalid session ID provided');
        toast.error('Invalid session ID - cannot start interview');
        return;
      }
      
      // Log the current state for debugging
      log('Current interviewSessionId state:', interviewSessionId);
      log('Current sessionId parameter:', sessionId);
      
      const session = await startSession(sessionId);
      if (session) {
        log('Session status updated to started');
      }
    } catch (error) {
      logError('Error starting interview with our session ID:', error instanceof Error ? error.message : error);
      toast.error('Failed to start interview');
    }
  }, [interviewSessionId, startSession]);

  const handleCompleteInterviewWithId = useCallback(async (sessionId: string, score: number) => {
    try {
      log('🎯 handleCompleteInterviewWithId called');
      log('🎯 About to call completeSession');
      const session = await completeSession(sessionId, score);
      log('🎯 completeSession returned');
      if (session) {
        // Toast message handled by useInterviewSession hook
        log('✅ Session status updated to completed');
      } else {
        log('⚠️ completeSession returned null/undefined');
      }
    } catch (error) {
      logError('❌ Error completing interview with our session ID:', error instanceof Error ? error.message : error);
      toast.error('Failed to complete interview');
    }
  }, [completeSession]);

  const handleSkipInterviewWithId = useCallback(async (sessionId: string) => {
    try {
      log('Skipping interview with our session ID');
      log('Current session status before skip:', sessionState?.status);
      
      const session = await skipSession(sessionId);
      if (session) {
        // Provide different messages based on when the interview was stopped
        if (sessionState?.status === 'pending') {
          toast.info('Interview was stopped before starting');
          log('Interview stopped before starting - status updated to skipped');
        } else if (sessionState?.status === 'started') {
          toast.info('Interview was stopped early');
          log('Interview stopped early - status updated to skipped');
        } else {
          toast.info('Interview was skipped');
          log('Interview skipped - status updated to skipped');
        }
        
        log('Session status updated to skipped');
      }
    } catch (error) {
      logError('Error skipping interview with our session ID:', error instanceof Error ? error.message : error);
      toast.error('Failed to skip interview');
    }
  }, [sessionState?.status, skipSession]);

  // Generate iframe URL with real candidate information from localStorage
  // Using useMemo to prevent recalculating on every render
  const iframeUrl = useMemo(() => {
    const realCandidateName = JSON.parse(localStorage.getItem('candidateName') || 'null') || candidateName;
    const realCandidateEmail = JSON.parse(localStorage.getItem('candidateEmail') || 'null') || candidateEmail;
    return generateInterviewUrl(realCandidateName, realCandidateEmail);
  }, [candidateName, candidateEmail]);

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
      log('Interview session ID synchronized:', interviewSessionId);
    }
  }, [interviewSessionId]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Only accept messages from Tough Tongue domain
      if (event.origin !== 'https://bambinos.app.toughtongueai.com') {
        return;
      }

      try {
        const data = event.data;
        log('Tough Tongue message received');
        
        // Check if interview has started (when user clicks Start in Tough Tongue)
        if (data && typeof data === 'object') {
          // Log all events to investigate scoring
          if (data.event || data.type) {
            log(`🔍 Processing Tough Tongue Event: ${data.event || data.type}`);
            
            // Check if this event contains score/evaluation data
            if (data.score !== undefined) {
              log('🎯 SCORE DETECTED');
            }
            if (data.evaluation !== undefined) {
              log('📊 EVALUATION DETECTED');
            }
            if (data.result !== undefined) {
              log('🏆 RESULT DETECTED');
            }
            if (data.assessment !== undefined) {
              log('📋 ASSESSMENT DETECTED');
            }
          }
          
          // Detect interview start - look for onStart event
          if (data.event === 'onStart' && interviewSessionId) {
            log('Tough Tongue interview started (onStart detected)');
            
            // Link Tough Tongue session ID to our session
            try {
              await linkToughTongueSession(interviewSessionId, data.sessionId);
              log('✅ Sessions linked successfully');
            } catch (error) {
              logError('❌ Failed to link sessions:', error instanceof Error ? error.message : error);
              toast.error('Failed to link interview session. Please refresh and try again.');
              return;
            }
            
            // Start our session
            log('Calling handleStartInterviewWithId');
            handleStartInterviewWithId(interviewSessionId);
          }
          
          // Detect mic check - look for onMicCheck event
          if (data.event === 'onMicCheck') {
            log('🎤 Mic check event received');
            log('🎤 Status:', data.data?.status);
            log('🎤 Message:', data.data?.message);
            
            // Show toast notification based on status
            if (data.data?.status === 'passed') {
              toast.success(`Microphone working properly!`);
            } else if (data.data?.status === 'failed') {
              toast.error(`❌ Microphone issue detected: ${data.data.message}`);
              
              // If interview has already started, this is critical - return to setup
              if (sessionState?.status === 'started' && interviewSessionId) {
                log('🚨 Mic failure during active interview - stopping and returning to setup');
                
                // Alert user about the critical issue
                toast.error('🚨 Microphone stopped working. Interview stopped. Please fix it and restart.', {
                  autoClose: 5000
                });
                
                // Mark session as skipped due to technical issue
                await handleSkipInterviewWithId(interviewSessionId);
                
                // Return to interview setup/instruction page (READY state)
                setToReady();
                
                // Show additional guidance
                toast.info('💡 Please check your microphone settings and allow browser permissions, then try again.', {
                  autoClose: 7000
                });
              } else {
                // Pre-interview mic check - just warn
                toast.warning('⚠️ Please fix your microphone before starting the interview.');
              }
            }
          }
          
          // Detect interview completion - look for onSubmit event
          if (data.event === 'onSubmit' && interviewSessionId) {
            log('=== TOUGH TONGUE INTERVIEW COMPLETION (summary) ===');
            
            log('🎯 VIDEO UPLOAD COMPLETED (onSubmit detected) - Starting evaluation process...');
            
            // Show processing page immediately when video upload completes
            setToPreparingResults();
            // Proceed to processing page
            log('✅ Processing page shown - waiting for evaluation...');
            
            // Navigate to processing page - it will handle polling and navigation to results
            log('🎯 Waiting 5 seconds before navigating to processing page...');
            
            // Add 5 second delay before navigation
            setTimeout(() => {
              log('🎯 5 second delay completed - now navigating to processing page...');
              navigate(`/candidate/processing/${interviewSessionId}`, {
                state: { applicationId }
              });
            }, 5000);
          }
          
          // Detect interview stop/abandon - look for onStop/onTerminated events
          if ((data.event === 'onStop' || data.event === 'onTerminated') && interviewSessionId) {
            log('=== TOUGH TONGUE INTERVIEW STOPPED (summary) ===');
            
            log('🛑 INTERVIEW STOPPED (onStop/onTerminated detected)');
            
            // Do NOT navigate on onStop/onTerminated.
          }
        }
      } catch (error) {
        logError('Error processing Tough Tongue message:', error instanceof Error ? error.message : error);
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [interviewSessionId, sessionState?.status, applicationId, handleCompleteInterviewWithId, handleStartInterviewWithId, handleSkipInterviewWithId, navigate, setToPreparingResults, setToReady, linkToughTongueSession]);

  // Browser close detection - mark as left midway if user closes browser during interview
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only mark as left midway if interview is actually in progress
      if (sessionState?.status === 'started' && interviewSessionId) {
        log('🚨 Browser closing during interview - marking as left midway');
        
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
          logError('Could not call skipSession during unload:', error instanceof Error ? error.message : error);
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
      log('🌐 Network connection restored');
      // Could trigger retry logic here if needed
    };

    const handleOffline = () => {
      log('📡 Network connection lost');
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
        log('Tough Tongue iframe loaded, checking for state changes...');
        
        // Check Tough Tongue API health when iframe loads
        toughTongueService.checkApiHealth()
          .then(isHealthy => {
            if (isHealthy) {
              log('✅ Tough Tongue API is accessible');
            } else {
              log('⚠️ Tough Tongue API may not be accessible');
            }
          })
          .catch(error => {
            logError('❌ Could not check Tough Tongue API health:', error instanceof Error ? error.message : error);
          });
        
        // Try to detect if interview has started by checking iframe content
        try {
          // This is a fallback method - the iframe might not allow access due to CORS
          log('Iframe loaded, but CORS restrictions may prevent content access');
        } catch (error) {
          log('Cannot access iframe content due to CORS restrictions');
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

  // Video required state - Redesigned to match application form
  if (interviewStatus === INTERVIEW_STATUS.VIDEO_REQUIRED) {
    return (
      <div className="h-screen bg-neutral-warm dark:bg-gray-900 relative overflow-hidden">
        {/* Subtle background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-bambinos-blue/[0.03] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-bambinos-yellow/[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-bambinos-blue/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>

        <div className="relative max-w-7xl lg:max-w-[95%] xl:max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 animate-fade-in-up shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105">
              <img 
                src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" 
                alt="Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain" 
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-bambinos-blue dark:text-bambinos-blue-light tracking-tight">
                Bambinos.live
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                Premium Educator Application
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden animate-fade-in-up animation-delay-100 flex flex-col flex-1 min-h-0">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light px-3 sm:px-4 py-2.5 sm:py-3 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 h-7 sm:h-8">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-white">Mandatory Instructions Video</h2>
                  <p className="text-blue-100 text-[10px] sm:text-xs">Watch before proceeding to interview</p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3 sm:p-4 lg:p-5 flex flex-col lg:grid lg:grid-cols-2 lg:gap-4 flex-1 min-h-0">
              {/* Left Column - Video Section (Desktop) / Top (Mobile) */}
              <div className="flex flex-col flex-1 min-h-0 order-2 lg:order-1">
                {/* Video Section */}
                <div className="mb-2 sm:mb-3 lg:mb-0 flex-1 min-h-0 flex flex-col">
                  <div className="relative w-full flex-1 min-h-0 overflow-hidden rounded-xl sm:rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50">
                    <div className="absolute inset-0">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/Ey0Gey_Y2lI?rel=0&modestbranding=1&showinfo=0"
                        title="Interview Instructions Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={handleVideoPlay}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Video Status Indicators */}
                <div className="mb-2 sm:mb-3 lg:mb-0 shrink-0">
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-gray-100 dark:border-gray-700/50 shadow-soft">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                      <div className={`flex items-center gap-1.5 sm:gap-2 ${videoStarted ? 'text-bambinos-blue dark:text-bambinos-blue-light' : 'text-gray-400 dark:text-gray-500'}`}>
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-[11px] sm:text-xs font-medium">Video Started</span>
                        {videoStarted && <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />}
                      </div>
                      <div className={`flex items-center gap-1.5 sm:gap-2 ${videoWatched ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-[11px] sm:text-xs font-medium">Video Completed</span>
                        {videoWatched && <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Instructions & Checklist (Desktop) / Bottom (Mobile) */}
              <div className="flex flex-col flex-1 min-h-0 gap-2 sm:gap-3 order-1 lg:order-2">
                {/* Importance Notice */}
                <div className="shrink-0">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3">
                    <div className="flex items-start gap-2 sm:gap-2.5">
                      <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-200 mb-0.5 sm:mb-1">
                          IMPORTANT
                        </p>
                        <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 leading-snug sm:leading-relaxed">
                          You MUST watch this complete instructional video before proceeding to the AI interview. This video contains essential guidelines that will help you succeed in your interview.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Checklist */}
                <div className="flex-1 min-h-0 flex flex-col shrink-0">
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-gray-100 dark:border-gray-700/50 shadow-soft flex flex-col h-full">
                    <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3 h-6 sm:h-7 shrink-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-rose-500/10 dark:bg-rose-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white leading-none">Required Before Interview</h3>
                    </div>
                    <ul className="space-y-1 sm:space-y-1.5 flex-1 overflow-y-auto">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed">Watch the complete video (no skipping allowed)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed">Take notes of important instructions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed">Dress professionally for a formal interview</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed">Ensure proper camera position and good lighting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed">Ensure you understand all guidelines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed">Only then you can proceed to the AI interview</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Completion Confirmation */}
                <div className="shrink-0">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3">
                    <div className="flex items-start gap-2 sm:gap-2.5">
                      <input
                        type="checkbox"
                        id="videoCompleted"
                        checked={videoWatched}
                        onChange={(e) => handleSkipVideo()}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-bambinos-blue rounded border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-bambinos-blue/20 focus:ring-offset-0 cursor-pointer shrink-0"
                      />
                      <label htmlFor="videoCompleted" className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed cursor-pointer">
                        I have watched the complete instructional video and understand all guidelines
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700/50 shrink-0">
                  <Button
                    onClick={handleProceedToInterview}
                    disabled={!canProceedToInterview()}
                    className="
                      w-full h-10 sm:h-11
                      bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light
                      hover:from-bambinos-blue-dark hover:to-bambinos-blue
                      text-white text-xs sm:text-sm font-semibold
                      rounded-lg sm:rounded-xl
                      shadow-bambinos hover:shadow-bambinos-lg
                      transition-all duration-300
                      hover:-translate-y-0.5
                      active:translate-y-0
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                      focus:outline-none focus:ring-2 focus:ring-bambinos-blue/30
                    "
                  >
                    {canProceedToInterview() ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Proceed to AI Interview Setup</span>
                      </div>
                    ) : (
                      <span>Complete Video First</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Ready state - Redesigned to match modern, calm, professional design
  if (interviewStatus === INTERVIEW_STATUS.READY) {
    return (
      <div className="min-h-screen md:h-screen bg-neutral-warm dark:bg-gray-900 relative md:overflow-hidden">
        {/* Subtle background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-bambinos-blue/[0.03] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-bambinos-yellow/[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-bambinos-blue/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 md:h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5 animate-fade-in-up shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105">
              <img 
                src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" 
                alt="Logo" 
                className="w-8 h-8 object-contain" 
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-bambinos-blue dark:text-bambinos-blue-light tracking-tight">
                Bambinos.live
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Premium Educator Application
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden animate-fade-in-up animation-delay-100 flex flex-col md:flex-1 md:min-h-0">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light px-4 sm:px-6 py-4 shrink-0">
              <div className="flex items-center gap-3 h-8">
                <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Video className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">AI Interview Setup</h2>
                  <p className="text-blue-100 text-xs">Prepare for your interview experience</p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-6 flex flex-col flex-1 md:min-h-0 overflow-y-auto">
              {/* Hero Description */}
              <div className="mb-5 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Prepare for your AI-powered interview experience. Ensure you're in an optimal environment for the best results.
                </p>
              </div>

              {/* Access Requirements Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft text-center">
                  <div className="w-12 h-12 bg-bambinos-blue/10 dark:bg-bambinos-blue/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Camera className="h-5 w-5 text-bambinos-blue" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Camera Access</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Enable high-quality video recording for visual assessment
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft text-center">
                  <div className="w-12 h-12 bg-bambinos-blue/10 dark:bg-bambinos-blue/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Mic className="h-5 w-5 text-bambinos-blue" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Microphone Access</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Enable crystal-clear audio recording for speech analysis
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft text-center">
                  <div className="w-12 h-12 bg-bambinos-blue/10 dark:bg-bambinos-blue/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-5 w-5 text-bambinos-blue" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Secure Environment</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Quiet space with stable internet connection
                  </p>
                </div>
              </div>

              {/* Interview Guidelines Section */}
              <div className="mb-5">
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft">
                  <div className="flex items-center gap-3 mb-4 h-8">
                    <div className="w-8 h-8 bg-bambinos-blue/10 dark:bg-bambinos-blue/20 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="h-3.5 w-3.5 text-bambinos-blue" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-none">Interview Guidelines</h3>
                  </div>

                  {/* Critical Requirements */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2.5 mb-3">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-200">Critical Requirements</h4>
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">Please make sure you are in a quiet place without any disturbance</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">Listen to the questions carefully and take your time to think before answering</span>
                      </li>
                    </ul>
                  </div>

                  {/* General Guidelines */}
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-bambinos-blue rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">The interview will last approximately 10 minutes</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-bambinos-blue rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">You'll be asked about your teaching experience and methods</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-bambinos-blue rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">You may be asked to read or discuss the passage below</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-bambinos-blue rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">Speak naturally and authentically - be yourself</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-bambinos-blue rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">Maintain eye contact with the camera</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-bambinos-blue rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">Dress professionally as you would for a formal interview</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-bambinos-blue rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">Position camera at eye level and ensure good front lighting</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">Wait for the interview to complete fully - the system will automatically process your results after the AI analysis is done</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">You cannot re-attempt this interview once completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tough Tongue AI Preview */}
              <div className="mb-5">
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white mb-3 text-center">Tough Tongue AI Interview Preview</h3>
                  <div className="relative w-full h-32 bg-black rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-12 h-12 bg-bambinos-blue rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-xl font-bold">b</span>
                        </div>
                        <p className="text-xs">bambinos.live Hiring</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-3 leading-relaxed">
                    Your interview will be conducted through our AI-powered Tough Tongue platform
                  </p>
                </div>
              </div>

              {/* Begin Interview Button */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700/50 shrink-0">
                <Button 
                  onClick={onBeginInterviewClick} 
                  className="
                    w-full h-12
                    bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light
                    hover:from-bambinos-blue-dark hover:to-bambinos-blue
                    text-white text-sm font-semibold
                    rounded-xl
                    shadow-bambinos hover:shadow-bambinos-lg
                    transition-all duration-300
                    hover:-translate-y-0.5
                    active:translate-y-0
                    focus:outline-none focus:ring-2 focus:ring-bambinos-blue/30
                  "
                >
                  <div className="flex items-center justify-center gap-2.5">
                    <Video className="h-4 w-4" />
                    <span>Begin AI Interview</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Interview in progress state - Redesigned to match modern, calm, premium design
  if (interviewStatus === INTERVIEW_STATUS.IN_PROGRESS) {
    return (
      <div className="min-h-screen md:h-screen bg-neutral-warm dark:bg-gray-900 relative md:overflow-hidden">
        {/* Subtle background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-bambinos-blue/[0.03] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-bambinos-yellow/[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-bambinos-blue/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 md:h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5 animate-fade-in-up shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105">
              <img 
                src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" 
                alt="Logo" 
                className="w-8 h-8 object-contain" 
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-bambinos-blue dark:text-bambinos-blue-light tracking-tight">
                Bambinos.live
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Premium Educator Application
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden animate-fade-in-up animation-delay-100 flex flex-col md:flex-1 md:min-h-0">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light px-4 sm:px-6 py-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 h-8">
                  <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                    <Video className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">AI Interview</h2>
                    <p className="text-blue-100 text-xs">Live Session</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-white">AI Agent is waiting</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-6 flex flex-col flex-1 md:min-h-0 overflow-y-auto">
              {/* Candidate Info - Subtle */}
              <div className="mb-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {candidateName} ({candidateEmail})
                </p>
              </div>

              {/* Video Section - Hero Element */}
              <div className="mb-5">
                <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-soft" style={{ aspectRatio: '16/9', minHeight: '500px' }}>
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

              {/* Important Instructions */}
              <div className="mb-5">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <h3 className="text-xs font-bold text-amber-800 dark:text-amber-200">Important Instructions</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        <strong>Be in a quiet place</strong> with <strong>no background noise</strong> before starting.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 shrink-0 mt-0.5 flex items-center justify-center">
                        <span className="text-bambinos-blue text-sm">→</span>
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        <strong>Click "Your Task"</strong> to begin reading <strong>only when instructed by the AI</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed mb-1">
                          <strong>Wait for the message</strong>:
                        </p>
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-200 leading-relaxed ml-4">
                          "Session Completed. Thank you for completing this session!"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 pt-2 border-t border-amber-200 dark:border-amber-700/50">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed mb-1">
                          <strong>Do NOT close the browser or leave the page</strong> before this message appears.
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed ml-4">
                          Doing so will <strong>make you ineligible</strong> for the next step.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden End Interview Button */}
              <div className="text-center" style={{ display: 'none' }}>
                <Button
                  onClick={handleEndInterview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  End Interview
                </Button>
              </div>
            </div>
          </div>
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
