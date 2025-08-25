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

export interface SystemStatusProps {
  applicants: SystemStatusApplicationDetail[];
  onRefreshData: () => void;
  onForceRefresh?: () => void;
  onTestApi?: () => void;
  onBulkSync?: () => void;
}

export interface SystemStatusApplicationDetail {
  id: string;
  session_id?: string;
  interview_status?: string;
  evaluation?: Record<string, unknown>;
  score?: number;
}

export interface StatsCardsProps {
  stats: DetailedStats;
  isLoading: boolean;
}

export interface ApplicationsTableProps {
  applicants: AdminApplicationDetail[];
  filteredApplicants: AdminApplicationDetail[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  subjectFilter: string;
  setSubjectFilter: (value: string) => void;
  resultFilter: string;
  setResultFilter: (value: string) => void;
  fromDate: Date | undefined;
  setFromDate: (date: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (date: Date | undefined) => void;
  clearDateFilters: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  totalItems: number;
  onViewDetails: (applicant: AdminApplicationDetail) => void;
  onRefreshData: () => void;
  scoreRange: [number, number];
  setScoreRange: (value: [number, number]) => void;
  hasSessionOnly: boolean;
  setHasSessionOnly: (value: boolean) => void;
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

export interface SavedFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  subjectFilter: string;
  setSubjectFilter: (v: string) => void;
  resultFilter: string;
  setResultFilter: (v: string) => void;
  fromDate: Date | undefined;
  setFromDate: (d: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (d: Date | undefined) => void;
}

export interface BulkDeleteApplicationsProps {
  onDeleteComplete: () => void;
}

export interface BulkEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: AdminApplicationDetail[];
  filteredApplicants: AdminApplicationDetail[];
  statusFilter: string;
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
  feedback?: string;
  email_status?: string;
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
  feedback?: string;
  email_status?: string;
  applicationId?: string;
}

// Feedback modal props
export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
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

// Simple application detail for super admin dashboard
export interface SuperAdminApplicationDetail {
  id: string;
  name: string;
  email: string;
  application_status: string;
  interview_status?: string;
  score?: number;
  application_date: string;
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
  feedback?: string;
}
