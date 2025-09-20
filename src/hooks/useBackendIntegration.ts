import { useState } from 'react';
import { candidateService } from '@/services/serviceManager';
import { ApplicationData, BackendApplicationResponse } from '@/types';

/**
 * Custom hook for backend integration
 * Handles API calls and data transformation between frontend and backend
 */
export const useBackendIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate required fields before submission
   */
  const validateApplicationData = (applicationData: ApplicationData): string[] => {
    const errors: string[] = [];
    
    if (!applicationData.firstName?.trim()) errors.push('First name is required');
    if (!applicationData.lastName?.trim()) errors.push('Last name is required');
    if (!applicationData.email?.trim()) errors.push('Email is required');
    if (!applicationData.phone?.trim()) errors.push('Phone number is required');
    if (!applicationData.position?.trim()) errors.push('Position is required');
    if (!applicationData.subjects?.length) errors.push('At least one subject must be selected');
    if (!applicationData.availableDays?.length) errors.push('At least one available day must be selected');
    if (!applicationData.timeSlots?.length) errors.push('At least one time slot must be selected');
    
    return errors;
  };

  /**
   * Submit application to backend
   */
  const submitApplication = async (applicationData: ApplicationData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting to backend:', applicationData);
      
      // Validate required fields first
      const validationErrors = validateApplicationData(applicationData);
      if (validationErrors.length > 0) {
        const errorMessage = `Validation failed: ${validationErrors.join(', ')}`;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }
      
      const response = await candidateService.submitApplication(applicationData);
      
      if (response.status) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        setError(response.message);
        return {
          success: false,
          error: response.message
        };
      }
    } catch (err: any) {
      console.error('Backend submission error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to submit application';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get application status from backend
   */
  const getApplicationStatus = async (applicationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await candidateService.getApplicationStatus(applicationId);
      
      if (response.status) {
        return {
          success: true,
          data: response.data
        };
      } else {
        setError(response.message);
        return {
          success: false,
          error: response.message
        };
      }
    } catch (err: any) {
      console.error('Get status error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get application status';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get candidate profile from backend
   */
  const getCandidateProfile = async (candidateId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await candidateService.getCandidateProfile(candidateId);
      
      if (response.status) {
        return {
          success: true,
          data: response.data
        };
      } else {
        setError(response.message);
        return {
          success: false,
          error: response.message
        };
      }
    } catch (err: any) {
      console.error('Get profile error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get candidate profile';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => setError(null);

  return {
    loading,
    error,
    submitApplication,
    getApplicationStatus,
    getCandidateProfile,
    clearError
  };
};
