// Analytics related interfaces and types
export interface TrendsPoint {
  date: string;
  applications: number;
  interviews: number;
  approvals: number;
}

// Daily trends data structure matching backend
export interface DailyTrends {
  date: string;
  applications: number;
  interviewsStarted: number;
  interviewsCompleted: number;
  passed: number;
  failed: number;
}

// Funnel analytics data structure matching backend
export interface FunnelAnalytics {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

// Chart props interfaces
export interface TrendsChartProps {
  data: DailyTrends[];
}

export interface FunnelChartProps {
  data: FunnelAnalytics[];
}

export interface ApplicantLike {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}



export interface ExportFilters {
  status?: string;
  subject?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
}

export interface FeedbackResult {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  demo_status: string;
  demo_date: string;
  interviewer_name: string;
  lesson_clarity: string;
  student_engagement: string;
  language_communication: string;
  teaching_aids: string;
  creativity_delivery: string;
  grammar_pronunciation: string;
  feedback: string;
  confirmation_email_sent: string;
  onboarding_call_made: string;
  remarks: string;
  created_at: string;
}


