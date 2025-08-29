import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateMockSessionId } from '@/utils/candidate/interviewUtils';
import { UI_MESSAGES, NAVIGATION_DELAYS } from '@/constants/candidate/interviewConstants';
import { InterviewResult,SessionData  } from '@/types';
 
 

export const useInterviewSession = (
  applicationId: string,
  setCurrentInterviewSession: (session: SessionData | null) => void,
  setInterviewResult: (result: InterviewResult | null) => void
) => {
  const navigate = useNavigate();
  const [interviewSessionId, setInterviewSessionId] = useState<string | null>(null);

  const handleInterviewStart = async () => {
    try {
      // Mock interview session creation (no database calls)
      const mockSessionId = generateMockSessionId();
      setInterviewSessionId(mockSessionId);

      // Store session info in localStorage for tracking
      const sessionData: SessionData = {
        id: mockSessionId,
        startedAt: new Date().toISOString(),
        status: 'in-progress',
        applicationId: applicationId
      };
      
      setCurrentInterviewSession(sessionData);
      toast.success(UI_MESSAGES.TOAST.INTERVIEW_START);

      return mockSessionId;
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error("There was an error starting your interview. Please try again.");
      throw error;
    }
  };

  const handleInterviewComplete = async (resultData: InterviewResult = {}) => {
    try {
      // Store mock result in localStorage
      const result: InterviewResult = {
        sessionId: interviewSessionId,
        score: resultData?.score || 85,
        completedAt: new Date().toISOString(),
        status: 'completed'
      };
      
      setInterviewResult(result);
      toast.success(UI_MESSAGES.TOAST.INTERVIEW_COMPLETE);

      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate('/candidate/result');
      }, NAVIGATION_DELAYS.INTERVIEW_COMPLETE);

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
          id: interviewSessionId,
          status: 'completed',
          completedAt: new Date().toISOString(),
          applicationId: applicationId
        };
        setCurrentInterviewSession(sessionData);
      }

      toast.info(UI_MESSAGES.TOAST.INTERVIEW_END);

      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate('/candidate/result');
      }, NAVIGATION_DELAYS.INTERVIEW_END);

    } catch (error) {
      console.error('Error ending interview:', error);
      toast.error("There was an error ending your interview. Please try again.");
      throw error;
    }
  };

  const resetSession = () => {
    setInterviewSessionId(null);
  };

  return {
    interviewSessionId,
    handleInterviewStart,
    handleInterviewComplete,
    handleEndInterview,
    resetSession
  };
};
