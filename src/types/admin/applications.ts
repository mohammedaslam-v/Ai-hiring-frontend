// Frontend types for applications management

export interface AppListFilters {
  search?: string;              // name, email, or phone number
  status?: string | string[]; // multiple values
  minScore?: number;
  maxScore?: number;
  fromDate?: string;            // dd-mm-yyyy
  toDate?: string;              // dd-mm-yyyy
  sortBy?: 'appliedDate' | 'name' | 'email' | 'interviewStatus' | 'score';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  directDemo?: string | string[];
  // Teacher Journey filters
  demoStatus?: string | string[];
  onboardingEmailSent?: string | string[];
  inductionAttendance?: string | string[];
  trainingStatus?: string | string[];
  certificationStatus?: string | string[];
  goLiveReadiness?: string | string[];
}

export interface AppListResponse {
  applications: ApplicantRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApplicantRow {
  id: string;
  applicationId?: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  interviewStatus: string;
  score: number | null;
  directDemo?: boolean;
  /** Interview completion date from Session model */
  interviewCompletedAt: string | null;
  appliedDate: string;
  actions: {
    view: string;
    result: string;
  };
}

// Status options for the dropdown
export const STATUS_OPTIONS = [
  { value: 'all', label: 'AI Interview Status' },
  { value: 'no_interview', label: 'No Interview' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
  { value: 'leftMidway', label: 'Left Midway' }
] as const;



// Sort options for the dropdown
export const SORT_OPTIONS = [
  { value: 'appliedDate', label: 'Applied Date' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'interviewStatus', label: 'Interview Status' },
  { value: 'score', label: 'Score' }
] as const;

// Page size options
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
  { value: 200, label: '200 per page' },
  { value: 500, label: '500 per page' }
] as const;

// Default filter values
export const DEFAULT_FILTERS: AppListFilters = {
  search: '',
  status: [],
  minScore: undefined,
  maxScore: undefined,
  fromDate: '',
  toDate: '',
  sortBy: 'appliedDate',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
  directDemo: [],
  demoStatus: [],
  onboardingEmailSent: [],
  inductionAttendance: [],
  trainingStatus: [],
  certificationStatus: [],
  goLiveReadiness: []
};
