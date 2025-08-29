import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { UI_MESSAGES } from '@/constants/candidate/interviewConstants';

export const useInterviewNavigation = (
  canProceedToInterview: () => boolean,
  setToReady: () => void
) => {
  const handleProceedToInterview = useCallback(() => {
    if (!canProceedToInterview()) {
      toast.error(UI_MESSAGES.TOAST.VIDEO_REQUIRED);
      return;
    }

    setToReady();
    toast.info(UI_MESSAGES.TOAST.PROCEED_READY);
  }, [canProceedToInterview, setToReady]);

  const handleBeginInterview = useCallback(async (
    handleInterviewStart: () => Promise<string | void>,
    setToInProgress: () => void
  ) => {
    try {
      await handleInterviewStart();
      setToInProgress();
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  }, []);

  return {
    handleProceedToInterview,
    handleBeginInterview
  };
};
