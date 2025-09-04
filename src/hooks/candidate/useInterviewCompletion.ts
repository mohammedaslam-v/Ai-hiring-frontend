import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { UI_MESSAGES, NAVIGATION_DELAYS } from '@/constants/candidate/interviewConstants';

import { InterviewResultData } from '@/types';
 
export const useInterviewCompletion = (
  interviewSessionId: string | null,
  setInterviewResult: (result: InterviewResultData | null) => void,
  setToInProgress: () => void,
  setToPreparingResults: () => void
) => {
  const handleInterviewComplete = useCallback(async (
    resultData: InterviewResultData = {}
  ) => {
    try {
      // Show preparing results state
      setToPreparingResults();

      // Store result in localStorage - only if we have a valid score
      if (!resultData?.score) {
        console.warn('No score available from result data');
        return;
      }
      
      setInterviewResult({
        sessionId: interviewSessionId,
        score: resultData.score,
        completedAt: new Date().toISOString(),
        status: 'completed'
      });

      // Toast handled by useSessionManagement hook

      // REMOVED: Navigation logic - let CandidateInterview handle this
      // The preparing results state will handle navigation via ProcessingResultsChecker

    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error("There was an error completing your interview. Please try again.");
    }
  }, [interviewSessionId, setInterviewResult, setToPreparingResults]);

  return {
    handleInterviewComplete
  };
};
