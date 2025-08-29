import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { INTERVIEW_STATUS, ADMIN_TEST_DEFAULTS } from '@/constants/candidate/interviewConstants';
import { isAdminTestingMode } from '@/utils/candidate/interviewUtils';
import type { InterviewStatus } from '@/constants/candidate/interviewConstants';

export const useInterviewState = () => {
  const navigate = useNavigate();
  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus>(INTERVIEW_STATUS.LOADING);
  const [applicationId, setApplicationId] = useState<string>('');
  const hasShownError = useRef(false);
  const isInitialized = useRef(false);
  
  // Local storage hooks for other values
  const [candidateName, setCandidateName] = useLocalStorage('candidateName', 'Candidate Name');
  const [candidateEmail, setCandidateEmail] = useLocalStorage('candidateEmail', 'candidate@email.com');
  const [currentInterviewSession, setCurrentInterviewSession] = useLocalStorage('currentInterviewSession', null);
  const [interviewResult, setInterviewResult] = useLocalStorage('interviewResult', null);

  // Direct localStorage reading function
  const getApplicationIdFromStorage = (): string => {
    try {
      const stored = localStorage.getItem('applicationId');
      return stored || '';
    } catch {
      return '';
    }
  };

  // Function to update applicationId in both state and localStorage
  const updateApplicationId = useCallback((newId: string) => {
    setApplicationId(newId);
    try {
      localStorage.setItem('applicationId', newId);
    } catch (error) {
      console.error('Error setting applicationId in localStorage:', error);
    }
  }, []);

  // Initialize interview state - only run once
  useEffect(() => {
    if (isInitialized.current) return; // Prevent multiple runs
    isInitialized.current = true;
    
    const checkApplicationId = () => {
      const currentApplicationId = getApplicationIdFromStorage();
      
      if (currentApplicationId) {
        // Application ID found
        updateApplicationId(currentApplicationId);
        setInterviewStatus(INTERVIEW_STATUS.VIDEO_REQUIRED);
        hasShownError.current = false;
        return true; // Success
      }
      
      // Check if we're in admin testing mode
      if (isAdminTestingMode()) {
        updateApplicationId(ADMIN_TEST_DEFAULTS.APPLICATION_ID);
        setCandidateName(ADMIN_TEST_DEFAULTS.CANDIDATE_NAME);
        setCandidateEmail(ADMIN_TEST_DEFAULTS.CANDIDATE_EMAIL);
        setInterviewStatus(INTERVIEW_STATUS.VIDEO_REQUIRED);
        hasShownError.current = false;
        return true; // Success
      }
      
      return false; // No application ID found
    };
    
    // First immediate check
    if (checkApplicationId()) {
      return; // Success, no need for polling
    }
    
    // If no application ID found, start polling
    const intervalId = setInterval(() => {
      if (checkApplicationId()) {
        // Success, clear interval
        clearInterval(intervalId);
        return;
      }
    }, 50); // Check every 50ms for faster response
    
    // After 1 second, if still no application ID, show error
    const timeoutId = setTimeout(() => {
      if (!hasShownError.current) {
        hasShownError.current = true;
        toast.error("Please complete the application first.");
        navigate('/candidate/application');
      }
      // Clear interval after showing error
      clearInterval(intervalId);
    }, 1000);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [navigate, setCandidateEmail, setCandidateName, updateApplicationId]);

  // Watch for applicationId changes and update status accordingly
  useEffect(() => {
    if (applicationId && interviewStatus === INTERVIEW_STATUS.LOADING) {
      setInterviewStatus(INTERVIEW_STATUS.VIDEO_REQUIRED);
    }
  }, [applicationId, interviewStatus]);

  const updateInterviewStatus = (newStatus: InterviewStatus) => {
    setInterviewStatus(newStatus);
  };

  const resetToVideoRequired = () => {
    setInterviewStatus(INTERVIEW_STATUS.VIDEO_REQUIRED);
  };

  const setToReady = () => {
    setInterviewStatus(INTERVIEW_STATUS.READY);
  };

  const setToInProgress = () => {
    setInterviewStatus(INTERVIEW_STATUS.IN_PROGRESS);
  };

  const setToCompleted = () => {
    setInterviewStatus(INTERVIEW_STATUS.COMPLETED);
  };

  return {
    interviewStatus,
    updateInterviewStatus,
    resetToVideoRequired,
    setToReady,
    setToInProgress,
    setToCompleted,
    candidateName,
    candidateEmail,
    applicationId,
    currentInterviewSession,
    interviewResult,
    setCurrentInterviewSession,
    setInterviewResult
  };
};
