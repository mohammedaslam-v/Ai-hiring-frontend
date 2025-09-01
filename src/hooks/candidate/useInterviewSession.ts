import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { UI_MESSAGES, NAVIGATION_DELAYS } from '@/constants/candidate/interviewConstants';
import { InterviewResult } from '@/types';
import { SessionData } from '@/types/session';
 
 

export const useInterviewSession = (
  applicationId: string,
  setCurrentInterviewSession: (session: SessionData | null) => void,
  setInterviewResult: (result: InterviewResult | null) => void,
  setToPreparingResults: () => void
) => {
  const navigate = useNavigate();
  const [interviewSessionId, setInterviewSessionId] = useState<string | null>(null);
  
  // Use the new session management hook
  const {
    sessionState,
    createSession,
    startSession,
    completeSession,
    skipSession,
    getSessionByApplicationId
  } = useSessionManagement();

  const handleInterviewStart = async () => {
    try {
      console.log('Creating new interview session for application:', applicationId);
      
      // Create new interview session in database
      const session = await createSession({
        applicationId,
        candidateId: applicationId // Using applicationId as candidateId for now
      });

      if (session) {
        console.log('Session created successfully:', session);
        
        // Store the sessionId for API calls - CRITICAL FIX: Use the actual returned session ID
        const actualSessionId = session.sessionId;
        setInterviewSessionId(actualSessionId);
        
        console.log('Setting interview session ID to:', actualSessionId);
        
        // Store session info in localStorage for tracking
        const sessionData: SessionData = {
          sessionId: actualSessionId,
          applicationId: applicationId,
          candidateId: applicationId, // Using applicationId as candidateId for now
          status: 'pending', // Start with pending status, will be updated to 'started' when Tough Tongue starts
          startedAt: undefined, // Will be set when Tough Tongue starts
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setCurrentInterviewSession(sessionData);
        toast.success(UI_MESSAGES.TOAST.INTERVIEW_START);
        return actualSessionId;
      }
      
      throw new Error('Failed to create interview session');
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error("There was an error starting your interview. Please try again.");
      throw error;
    }
  };

  const handleInterviewComplete = async (resultData: InterviewResult = {}) => {
    try {
      // Show preparing results state
      setToPreparingResults();

      // Store mock result in localStorage
      const result: InterviewResult = {
        sessionId: interviewSessionId,
        score: resultData?.score || 85,
        completedAt: new Date().toISOString(),
        status: 'completed'
      };
      
      setInterviewResult(result);
      toast.success(UI_MESSAGES.TOAST.INTERVIEW_COMPLETE);

      // REMOVED: Navigation logic - let CandidateInterview handle this
      // The preparing results state will handle navigation via ProcessingResultsChecker

    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error("There was an error completing your interview. Please try again.");
      throw error;
    }
  };

  const handleEndInterview = () => {
    try {
      // Update session status in localStorage
      if (interviewSessionId) {
        const sessionData: SessionData = {
          sessionId: interviewSessionId,
          applicationId: applicationId,
          candidateId: applicationId, // Using applicationId as candidateId for now
          status: 'completed',
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCurrentInterviewSession(sessionData);
      }

      toast.info(UI_MESSAGES.TOAST.INTERVIEW_END);

      // REMOVED: Navigation logic - let CandidateInterview handle this
      // The preparing results state will handle navigation via ProcessingResultsChecker

    } catch (error) {
      console.error('Error ending interview:', error);
      toast.error("There was an error ending your interview. Please try again.");
      throw error;
    }
  };

  // Start the actual interview (called when Start button is clicked in Tough Tongue)
  const handleStartInterview = async () => {
    if (!interviewSessionId) {
      toast.error('No interview session found');
      return;
    }

    try {
      const session = await startSession(interviewSessionId);
      if (session) {
        toast.success('Interview started successfully!');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview');
    }
  };

  // Complete interview with score
  const handleCompleteInterview = async (score: number, evaluation?: Record<string, unknown>) => {
    if (!interviewSessionId) {
      toast.error('No interview session found');
      return;
    }

    try {
      const session = await completeSession(interviewSessionId, score, evaluation);
      if (session) {
        toast.success('Interview completed successfully!');
        // REMOVED: Navigation logic - let CandidateInterview handle this
        // The preparing results state will handle navigation via ProcessingResultsChecker
      }
    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error('Failed to complete interview');
    }
  };

  // Skip interview
  const handleSkipInterview = async () => {
    if (!interviewSessionId) {
      toast.error('No interview session found');
      return;
    }

    try {
      const session = await skipSession(interviewSessionId);
      if (session) {
        toast.info('Interview was skipped');
        // REMOVED: Navigation logic - let CandidateInterview handle this
        // The preparing results state will handle navigation via ProcessingResultsChecker
      }
    } catch (error) {
      console.error('Error skipping interview:', error);
      toast.error('Failed to skip interview');
    }
  };

  const resetSession = () => {
    console.log('Resetting interview session');
    setInterviewSessionId(null);
    setCurrentInterviewSession(null);
  };

  return {
    interviewSessionId,
    sessionState,
    handleInterviewStart,
    handleStartInterview,
    handleInterviewComplete,
    handleCompleteInterview,
    handleEndInterview,
    handleSkipInterview,
    resetSession
  };
};
