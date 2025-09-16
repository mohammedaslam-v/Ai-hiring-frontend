// Admin related interfaces and types
export interface DetailedStats {
  totalRegistered: number;
  totalStartedInterview: number;
  totalCompletedInterview: number;
  totalLeftMidway: number;
  neverStartedInterview: number;
  totalPassed: number;
  totalFailed: number;
  interviewStartRate: number;
  interviewCompletionRate: number;
  passRate: number;
  failRate: number;
  leftMidwayRate: number;
}

export interface DashboardSummary {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalInterviews: number;
  completedInterviews: number;
  pendingInterviews: number;
  averageInterviewScore: number;
}

export interface StatsCardsProps {
  stats: DetailedStats;
  isLoading: boolean;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

export interface BulkDeleteApplicationsProps {
  onDeleteComplete: () => void;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
}

// Admin header props
export interface AdminHeaderProps {
  onLogout: () => void;
}

// Re-export ApplicationDetail from application types
import { ApplicationDetail } from './application';

// Extended ApplicationDetail for admin components
export interface AdminApplicationDetail extends ApplicationDetail {
  name: string;
  availability: string[];
  application_status: string;
  application_date: string;
  interview_status?: string;
  score?: number;
  interview_started?: string;
  interview_completed?: string;
  interview_scheduled?: string;
  session_id?: string;
  evaluation?: Record<string, unknown>;
  strengths?: string[];
  areas_for_improvement?: string[];
  email_status?: string;
  // Additional properties for AdminApplicationDetail component
  applicationId?: string;
  latest_status?: string;
  latest_score?: number;
  latest_completed_at?: string;
  resume_filename?: string;
}

// Alternative ApplicationDetail for components that use different structure
export interface SimpleApplicationDetail {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  additionalLanguages: string[];
  availableDays: string[];
  availableTimeSlots: string[];
  position: string;
  status: string;
  applicationId: string;
}

// Dashboard-specific ApplicationDetail interface
export interface DashboardApplicationDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  additionalLanguages: string[];
  availableDays: string[];
  availableTimeSlots: string[];
  availability: string[];
  application_status: string;
  application_date: string;
  application_date_iso?: string;
  interview_status?: string;
  score?: number;
  interview_started?: string;
  interview_completed?: string;
  interview_scheduled?: string;
  session_id?: string;
  evaluation?: Record<string, unknown>;
  strengths?: string[];
  areas_for_improvement?: string[];
  email_status?: string;
  applicationId?: string;
}

// Applicant details modal props
export interface ApplicantDetailsModalProps {
  applicant: DashboardApplicationDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onRefreshToughTongue: (sessionId: string, applicationId?: string) => void;
  refreshingSession: string | null;
}

// Chart component props
export interface FunnelChartProps {
  detailedStats: DetailedStats;
}

// Alerts banner props
export interface AlertsBannerProps {
  detailedStats: DetailedStats;
}

// Detailed evaluation display props
export interface RubricScore {
  grammar_sentence_structure?: number;
  pronunciation?: number;
  years_teaching_experience?: number;
  mode_of_teaching?: number;
  program_interest?: number;
  weekday_hours?: number;
  weekend_hours?: number;
  highest_qualification?: number;
  additional_certifications?: number;
  languages_spoken?: number;
}

export interface DetailedEvaluationProps {
  score: number;
  evaluation?: Record<string, unknown>;
  strengths?: string[];
  areas_for_improvement?: string[];
}

export interface ApplicationDetailState {
  application: AdminApplicationDetail | null;
  loading: boolean;
  error: string | null;
}

// Sorting configuration interface
export interface SortConfig {
  key: string;
  dir: 'asc' | 'desc';
}

// Pagination data interface
export interface PaginationData {
  rows: SimpleApplicationDetail[];
  count: number;
  page: number;
  pageSize: number;
  loading: boolean;
}

// Transcript message interface
export interface TranscriptMessage {
  role?: string;
  speaker?: string;
  sender?: string;
  text?: string;
  content?: string;
  message?: string;
  timestamp?: string;
  time?: string;
}

// Admin login response interface
export interface AdminLoginResponse {
  refreshToken: string;
  accessToken: string;
  email: string;
  role: string;
  adminId: string;
}

// Admin dashboard stats interface
export interface AdminDashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  recentApplications: number;
}

// Admin profile interface
export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

// Admin applications response interface
export interface AdminApplicationsResponse {
  applications: unknown[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}