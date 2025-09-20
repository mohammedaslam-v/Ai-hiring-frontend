// Main hooks index file
// Export all hooks for easy importing

// Base hooks
export { useApi, type ApiResponse, type UseApiReturn, type UseApiState } from './useApi';

// Authentication and user management hooks
export { useAuth } from './useAuth';
export { useTheme } from './useTheme';
export { useLocalStorage } from './useLocalStorage';

// Admin-related hooks
export { useAdmin } from './useAdmin';
export type { AdminDashboardStats, AdminProfile, AdminApplicationsResponse } from '@/types/admin';

// Application management hooks
export { useApplications } from './useApplications';
export type { ApplicationCountResponse, ApplicationsPageResponse } from '@/types/common';
export type { ApplicationDetail } from '@/types/application';

// Candidate-related hooks
export { useCandidate } from './useCandidate';
export type { 
  ApplicationSubmissionResponse, 
  ApplicationStatusResponse, 
  CandidateProfileResponse 
} from '@/types/candidate';

// Form-specific hooks
export { useCandidateApplication } from './forms/useCandidateApplication';
export { useCandidateLogin } from './forms/useCanidateLogin';
export { useAdminLogin } from './forms/useAdminLogin';
export type { MockLoginResponse } from '@/types/candidate';
export type { AdminLoginResponse } from '@/types/admin';

// Backend integration hooks
export { useBackendIntegration } from './useBackendIntegration';

// Utility hooks
export { useIsMobile } from './use-mobile';
export { useToast } from './use-toast';
export { useAnalytics } from './useAnalytics';

