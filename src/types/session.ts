// Frontend session types matching backend DTOs

export interface SessionData {
  sessionId: string;
  applicationId: string;
  candidateId: string;
  status: 'pending' | 'started' | 'completed' | 'skipped';
  toughTongueSessionId?: string; // optional link to ToughTongue session
  startedAt?: string;
  completedAt?: string;
  skippedAt?: string;
  duration?: number;
  score?: number;
  evaluation?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  applicationId: string;
  candidateId: string;
}

export interface UpdateSessionStatusRequest {
  status: 'pending' | 'started' | 'completed' | 'skipped';
  score?: number;
  evaluation?: Record<string, unknown>;
}

export interface SessionListResponse {
  sessions: SessionData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SessionStatus {
  sessionId: string;
  status: string;
  timestamp: string;
}

export interface InterviewSessionState {
  sessionId: string | null;
  status: 'pending' | 'started' | 'completed' | 'skipped';
  isLoading: boolean;
  error: string | null;
}
