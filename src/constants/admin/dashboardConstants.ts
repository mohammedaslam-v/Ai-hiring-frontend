export type DashboardSummary = {
  total_registered: number;
  started_ai: number;
  completed: number;
  left_midway: number;
  passed: number;
  failed: number;
};

// Mock dashboard summary data based on your screenshot
export const MOCK_SUMMARY: DashboardSummary = {
  total_registered: 5785,
  started_ai: 2609,
  completed: 1865,
  left_midway: 744,
  passed: 507,
  failed: 1004
};

// Mock trends data for the chart
export const MOCK_TRENDS_DATA = [
  { date: '2025-08-21', registered: 40, started: 22, completed: 15, passed: 10, failed: 10 },
  { date: '2025-08-22', registered: 35, started: 18, completed: 12, passed: 9, failed: 9 },
  { date: '2025-08-23', registered: 30, started: 12, completed: 10, passed: 8, failed: 8 },
  { date: '2025-08-24', registered: 38, started: 20, completed: 14, passed: 11, failed: 9 },
  { date: '2025-08-25', registered: 42, started: 25, completed: 18, passed: 12, failed: 10 },
  { date: '2025-08-26', registered: 36, started: 19, completed: 13, passed: 9, failed: 8 },
  { date: '2025-08-27', registered: 39, started: 21, completed: 15, passed: 10, failed: 9 },
];

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
