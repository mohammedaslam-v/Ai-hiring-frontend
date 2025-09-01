import { DailyTrends } from '@/types/analytics';

export type DashboardSummary = {
  total_registered: number;
  started_ai: number;
  completed: number;
  left_midway: number;
  passed: number;
  failed: number;
};

// Empty summary data - will be populated from API
export const EMPTY_SUMMARY: DashboardSummary = {
  total_registered: 0,
  started_ai: 0,
  completed: 0,
  left_midway: 0,
  passed: 0,
  failed: 0
};

// Empty trends data - will be populated from API
export const EMPTY_TRENDS_DATA: DailyTrends[] = [];

// Default detailed stats structure
export const DEFAULT_DETAILED_STATS = {
  totalRegistered: 0,
  totalStartedInterview: 0,
  totalCompletedInterview: 0,
  totalLeftMidway: 0,
  neverStartedInterview: 0,
  totalPassed: 0,
  totalFailed: 0,
  interviewStartRate: 0,
  interviewCompletionRate: 0,
  passRate: 0,
  failRate: 0,
  leftMidwayRate: 0
};
