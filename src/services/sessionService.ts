import axios from 'axios';
import { 
  SessionData, 
  CreateSessionRequest, 
  UpdateSessionStatusRequest, 
  SessionListResponse 
} from '@/types/session';

// Define response types for axios
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

// Define axios error type
interface AxiosError {
  response?: {
    status: number;
    data?: unknown;
  };
  request?: unknown;
  message: string;
}

// Session service for frontend API calls
class SessionService {
  private readonly baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/session`;

  // Create new interview session
  async createSession(sessionData: CreateSessionRequest): Promise<SessionData> {
    try {
      const response = await axios.post<ApiResponse<SessionData>>(`${this.baseURL}/create`, sessionData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create interview session');
    }
  }

  // Get session by ID
  async getSessionById(sessionId: string): Promise<SessionData> {
    try {
      const response = await axios.get<ApiResponse<SessionData>>(`${this.baseURL}/${sessionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting session by ID:', error);
      throw new Error('Failed to retrieve session');
    }
  }

  // Get session by application ID
  async getSessionByApplicationId(applicationId: string): Promise<SessionData | null> {
    try {
      const response = await axios.get<ApiResponse<SessionData>>(`${this.baseURL}/application/${applicationId}`);
      return response.data.data;
    } catch (error: unknown) {
      if ((error as AxiosError).response?.status === 404) {
        return null; // Session not found
      }
      console.error('Error getting session by application ID:', error);
      throw new Error('Failed to retrieve session');
    }
  }

  // Update session status
  async updateSessionStatus(sessionId: string, updateData: UpdateSessionStatusRequest): Promise<SessionData> {
    try {
      const response = await axios.patch<ApiResponse<SessionData>>(`${this.baseURL}/${sessionId}/status`, updateData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating session status:', error);
      throw new Error('Failed to update session status');
    }
  }

  // Start interview session
  async startSession(sessionId: string): Promise<SessionData> {
    try {
      const response = await axios.patch<ApiResponse<SessionData>>(`${this.baseURL}/${sessionId}/start`);
      return response.data.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw new Error('Failed to start interview session');
    }
  }

  // Complete interview session
  async completeSession(sessionId: string, score: number, evaluation?: Record<string, unknown>): Promise<SessionData> {
    try {
      const response = await axios.patch<ApiResponse<SessionData>>(`${this.baseURL}/${sessionId}/complete`, {
        status: 'completed', // Add required status field
        score,
        evaluation
      });
      return response.data.data;
    } catch (error) {
      console.error('Error completing session:', error);
      throw new Error('Failed to complete interview session');
    }
  }

  // Skip interview session (treat as completed)
  async skipSession(sessionId: string): Promise<SessionData> {
    try {
      const response = await axios.patch<ApiResponse<SessionData>>(`${this.baseURL}/${sessionId}/skip`);
      return response.data.data;
    } catch (error) {
      console.error('Error completing session:', error);
      throw new Error('Failed to complete interview session');
    }
  }

  // Get all sessions with pagination
  async getAllSessions(page: number = 1, limit: number = 10, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<SessionListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await axios.get<ApiResponse<SessionListResponse>>(`${this.baseURL}/?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting all sessions:', error);
      throw new Error('Failed to retrieve sessions');
    }
  }

  // Get active sessions count
  async getActiveSessionsCount(): Promise<number> {
    try {
      const response = await axios.get<ApiResponse<{ activeSessionsCount: number }>>(`${this.baseURL}/stats/active-count`);
      return response.data.data.activeSessionsCount;
    } catch (error) {
      console.error('Error getting active sessions count:', error);
      throw new Error('Failed to get active sessions count');
    }
  }
}

// Export singleton instance
export const sessionService = new SessionService();
export default sessionService;
