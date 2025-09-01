import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { sessionService } from '@/services/sessionService';
import { 
  SessionData, 
  CreateSessionRequest, 
  UpdateSessionStatusRequest,
  InterviewSessionState 
} from '@/types/session';

// Custom hook for managing interview sessions
export const useSessionManagement = () => {
  const [sessionState, setSessionState] = useState<InterviewSessionState>({
    sessionId: null,
    status: 'pending',
    isLoading: false,
    error: null
  });

  // Create new interview session
  const createSession = useCallback(async (sessionData: CreateSessionRequest): Promise<SessionData | null> => {
    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Creating session with data:', sessionData);
      const session = await sessionService.createSession(sessionData);
      
      console.log('Session created successfully:', session);
      
      setSessionState(prev => ({
        ...prev,
        sessionId: session.sessionId,
        status: session.status,
        isLoading: false
      }));

      console.log('Session state updated with ID:', session.sessionId);
      toast.success('Interview session created successfully!');
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
      
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Start interview session
  const startSession = useCallback(async (sessionId: string): Promise<SessionData | null> => {
    if (!sessionId) {
      toast.error('Session ID is required');
      return null;
    }

    console.log('Starting session with ID:', sessionId);
    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const session = await sessionService.startSession(sessionId);
      
      if (session) {
        setSessionState(prev => ({
          ...prev,
          status: session.status,
          isLoading: false
        }));

        console.log('Session started successfully with status:', session.status);
        toast.success('Interview started successfully!');
        return session;
      } else {
        throw new Error('Session not found or could not be started');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start interview';
      
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      console.error('Error starting session:', error);
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Complete interview session
  const completeSession = useCallback(async (
    sessionId: string, 
    score: number, 
    evaluation?: Record<string, unknown>
  ): Promise<SessionData | null> => {
    if (!sessionId) {
      toast.error('Session ID is required');
      return null;
    }

    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const session = await sessionService.completeSession(sessionId, score, evaluation);
      
      setSessionState(prev => ({
        ...prev,
        status: session.status,
        isLoading: false
      }));

      toast.success('Interview completed successfully!');
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete interview';
      
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Skip interview session
  const skipSession = useCallback(async (sessionId: string): Promise<SessionData | null> => {
    if (!sessionId) {
      toast.error('Session ID is required');
      return null;
    }

    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const session = await sessionService.skipSession(sessionId);
      
      setSessionState(prev => ({
        ...prev,
        status: session.status,
        isLoading: false
      }));

      toast.info('Interview was skipped');
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to skip interview';
      
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Update session status
  const updateSessionStatus = useCallback(async (
    sessionId: string, 
    updateData: UpdateSessionStatusRequest
  ): Promise<SessionData | null> => {
    if (!sessionId) {
      toast.error('Session ID is required');
      return null;
    }

    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const session = await sessionService.updateSessionStatus(sessionId, updateData);
      
      setSessionState(prev => ({
        ...prev,
        status: session.status,
        isLoading: false
      }));

      toast.success('Session status updated successfully!');
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update session status';
      
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Get session by application ID
  const getSessionByApplicationId = useCallback(async (applicationId: string): Promise<SessionData | null> => {
    if (!applicationId) {
      return null;
    }

    try {
      const session = await sessionService.getSessionByApplicationId(applicationId);
      return session;
    } catch (error) {
      console.error('Error getting session by application ID:', error);
      return null;
    }
  }, []);

  // Reset session state
  const resetSession = useCallback(() => {
    setSessionState({
      sessionId: null,
      status: 'pending',
      isLoading: false,
      error: null
    });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setSessionState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    sessionState,
    
    // Actions
    createSession,
    startSession,
    completeSession,
    skipSession,
    updateSessionStatus,
    getSessionByApplicationId,
    resetSession,
    clearError
  };
};
