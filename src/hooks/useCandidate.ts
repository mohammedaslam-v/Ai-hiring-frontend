import { useApi } from './useApi';
import { candidateService } from '@/services/serviceManager';
import { ApplicationData, ProfileData } from '@/types';
import { 
  ApplicationSubmissionResponse, 
  ApplicationStatusResponse, 
  CandidateProfileResponse 
} from '@/types/candidate';

/**
 * Custom hook for candidate-related API operations
 * Uses the base useApi hook for consistent error handling and loading states
 */
export const useCandidate = () => {
  // Application submission hook
  const applicationSubmission = useApi<ApplicationSubmissionResponse>(
    candidateService.submitApplication
  );


  // Application status hook
  const applicationStatus = useApi<ApplicationStatusResponse>(
    candidateService.getApplicationStatus
  );

  // Profile update hook
  const profileUpdate = useApi<CandidateProfileResponse>(
    candidateService.updateCandidateProfile
  );

  // Profile retrieval hook
  const profileRetrieval = useApi<CandidateProfileResponse>(
    candidateService.getCandidateProfile
  );

  // Convenience functions with proper typing
  const submitApplication = async (applicationData: ApplicationData) => {
    return applicationSubmission.execute(applicationData);
  };


  const getApplicationStatus = async (applicationId: string) => {
    return applicationStatus.execute(applicationId);
  };

  const updateCandidateProfile = async (profileData: Partial<ProfileData>) => {
    return profileUpdate.execute(profileData);
  };

  const getCandidateProfile = async (candidateId: string) => {
    return profileRetrieval.execute(candidateId);
  };

  // Combined loading state
  const isLoading = applicationSubmission.loading || 
                   applicationStatus.loading || 
                   profileUpdate.loading || 
                   profileRetrieval.loading;

  // Combined error state
  const error = applicationSubmission.error || 
                applicationStatus.error || 
                profileUpdate.error || 
                profileRetrieval.error;

  // Clear all errors
  const clearAllErrors = () => {
    applicationSubmission.clearError();
    applicationStatus.clearError();
    profileUpdate.clearError();
    profileRetrieval.clearError();
  };

  return {
    // State
    loading: isLoading,
    error,
    
    // Individual operation states
    applicationSubmission: {
      loading: applicationSubmission.loading,
      error: applicationSubmission.error,
      clearError: applicationSubmission.clearError,
    },
    applicationStatus: {
      loading: applicationStatus.loading,
      error: applicationStatus.error,
      clearError: applicationStatus.clearError,
    },
    profileUpdate: {
      loading: profileUpdate.loading,
      error: profileUpdate.error,
      clearError: profileUpdate.clearError,
    },
    profileRetrieval: {
      loading: profileRetrieval.loading,
      error: profileRetrieval.error,
      clearError: profileRetrieval.clearError,
    },

    // Operations
    submitApplication,
    getApplicationStatus,
    updateCandidateProfile,
    getCandidateProfile,

    // Utility functions
    clearAllErrors,
  };
};
