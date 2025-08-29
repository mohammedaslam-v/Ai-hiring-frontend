import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { INTERVIEW_STATUS, UI_MESSAGES } from '@/constants/candidate/interviewConstants';

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
    toast.info(UI_MESSAGES.TOAST.VIDEO_PLAY);
  };

  const handleVideoEnd = () => {
    setVideoWatched(true);
    toast.success(UI_MESSAGES.TOAST.VIDEO_END);
  };

  const handleSkipVideo = () => {
    setVideoWatched(true);
    toast.info(UI_MESSAGES.TOAST.SKIP_VIDEO);
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
