import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { UI_MESSAGES, NAVIGATION_DELAYS } from '@/constants/candidate/interviewConstants';

import { InterviewResultData } from '@/types';
 
export const useInterviewCompletion = (
  interviewSessionId: string | null,
  setInterviewResult: (result: InterviewResultData | null) => void,
  setToInProgress: () => void
) => {
  const handleInterviewComplete = useCallback(async (
    resultData: InterviewResultData = {}
  ) => {
    try {
      // Mock interview completion (no database calls)
      setToInProgress(); // Assuming setToInProgress handles completion state

      // Store mock result in localStorage
      setInterviewResult({
        sessionId: interviewSessionId,
        score: resultData?.score || 85,
        completedAt: new Date().toISOString(),
        status: 'completed'
      });

      toast.success(UI_MESSAGES.TOAST.INTERVIEW_COMPLETE);

      // Navigate to results page after a short delay
      setTimeout(() => {
        // For now, we'll just toast and let the user navigate manually
        toast.info(UI_MESSAGES.TOAST.REDIRECTING_RESULTS);
        // Example: navigate('/candidate/result');
      }, NAVIGATION_DELAYS.INTERVIEW_COMPLETE);

    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error("There was an error completing your interview. Please try again.");
    }
  }, [interviewSessionId, setInterviewResult, setToInProgress]);

  return {
    handleInterviewComplete
  };
};
