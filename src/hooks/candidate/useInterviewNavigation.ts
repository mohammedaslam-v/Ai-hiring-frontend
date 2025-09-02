import { useCallback } from 'react';

export const useInterviewNavigation = (
  canProceedToInterview: () => boolean,
  setToReady: () => void
) => {
  const handleProceedToInterview = useCallback(() => {
    if (!canProceedToInterview()) {
      return;
    }

    setToReady();
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
