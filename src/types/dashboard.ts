// Dashboard analytics types for frontend

// Dashboard analytics response
export interface DashboardAnalytics {
  totalApplicants: number;
  startedInterview: number;
  completedInterview: number;
  leftMidway: number;
  passed: number;
  failed: number;
  pendingEvaluation: number;
  summary: DashboardAnalyticsSummary;
}

// Dashboard summary with percentages
export interface DashboardAnalyticsSummary {
  totalApplicants: number;
  startedInterview: number;
  startedInterviewPercentage: number;
  completedInterview: number;
  completedInterviewPercentage: number;
  leftMidway: number;
  leftMidwayPercentage: number;
  passed: number;
  passedPercentage: number;
  failed: number;
  failedPercentage: number;
  pendingEvaluation: number;
  pendingEvaluationPercentage: number;
  neverStartedInterview: number;
  neverStartedInterviewPercentage: number;
}

// Interview statistics breakdown
export interface InterviewStats {
  totalSessions: number;
  pendingSessions: number;
  startedSessions: number;
  completedSessions: number;
  skippedSessions: number;
  averageScore: number;
  scoreDistribution: ScoreDistribution;
}

// Score distribution for analytics
export interface ScoreDistribution {
  excellent: number; // 9-10
  good: number;      // 7-8
  average: number;   // 6
  belowAverage: number; // 4-5
  poor: number;      // 0-3
}

// Daily trends data
export interface DailyTrends {
  date: string;
  applications: number;
  interviewsStarted: number;
  interviewsCompleted: number;
  passed: number;
  failed: number;
}

// Funnel analytics data
export interface FunnelAnalytics {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

// API response wrapper
export interface DashboardApiResponse<T> {
  status: boolean;
  msg: string;
  data: T;
  error?: string;
}

// Dashboard state for React hooks
export interface DashboardState {
  analytics: DashboardAnalytics | null;
  summary: DashboardAnalyticsSummary | null;
  interviewStats: InterviewStats | null;
  dailyTrends: DailyTrends[];
  funnelAnalytics: FunnelAnalytics[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Dashboard hook return type
export interface UseDashboardReturn {
  // State
  dashboardState: DashboardState;
  
  // Actions
  fetchAnalytics: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchInterviewStats: () => Promise<void>;
  fetchDailyTrends: (days?: number) => Promise<void>;
  fetchFunnelAnalytics: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Utilities
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}
