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

  // Create new interview session (with idempotency check)
  const createSession = useCallback(async (sessionData: CreateSessionRequest): Promise<SessionData | null> => {
    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Creating session with data:', sessionData);
      
      // First check if an active session already exists for this application
      const existingSession = await sessionService.getSessionByApplicationId(sessionData.applicationId);
      if (existingSession && (existingSession.status === 'pending' || existingSession.status === 'started')) {
        console.log('Reusing existing active session:', existingSession.sessionId, 'with status:', existingSession.status);
        
        setSessionState(prev => ({
          ...prev,
          sessionId: existingSession.sessionId,
          status: existingSession.status,
          isLoading: false
        }));

        toast.success('Using existing interview session!');
        return existingSession;
      }
      
      // Create new session if no active session exists
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

      // Toast message handled by useInterviewSession hook
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

  // Skip interview session (treat as completed)
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

  // Link Tough Tongue session ID
  const linkToughTongueSession = useCallback(async (sessionId: string, toughTongueSessionId: string): Promise<SessionData | null> => {
    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Linking Tough Tongue session:', { sessionId, toughTongueSessionId });
      const session = await sessionService.linkToughTongueSession(sessionId, toughTongueSessionId);
      
      setSessionState(prev => ({
        ...prev,
        isLoading: false
      }));

      console.log('Tough Tongue session linked successfully');
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to link Tough Tongue session';
      
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      console.error('Error linking Tough Tongue session:', error);
      return null;
    }
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
    clearError,
    linkToughTongueSession
  };
};
