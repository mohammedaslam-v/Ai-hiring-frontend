import { useState, useEffect } from 'react';
import { INTERVIEW_STATUS } from '@/constants/candidate/interviewConstants';

export const useVideoManagement = (interviewStatus: string) => {
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect for tracking video duration
  useEffect(() => {
    let interval: number | undefined;

    if (videoStarted && !videoWatched && interviewStatus === INTERVIEW_STATUS.VIDEO_REQUIRED) {
      interval = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [videoStarted, videoWatched, interviewStatus]);

  const handleVideoPlay = () => {
    setVideoStarted(true);
  };

  const handleVideoEnd = () => {
    setVideoWatched(true);
  };

  const handleSkipVideo = () => {
    setVideoWatched(true);
  };

  const resetVideoState = () => {
    setVideoWatched(false);
    setVideoStarted(false);
    setTimeElapsed(0);
  };

  const canProceedToInterview = () => {
    return videoWatched;
  };

  return {
    videoWatched,
    videoStarted,
    timeElapsed,
    handleVideoPlay,
    handleVideoEnd,
    handleSkipVideo,
    resetVideoState,
    canProceedToInterview
  };
};
