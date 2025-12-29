import { AppListFilters, AppListResponse } from '@/types/admin/applications';
import axiosInstance from './instance';

class ApplicationsFilteredService {
  /**
   * Get filtered applications with advanced filtering, sorting, and pagination
   */
  async getFilteredApplications(filters: AppListFilters): Promise<{
    status: boolean;
    message: string;
    data?: AppListResponse;
    error?: string;
  }> {
    try {
      // Convert dd-mm-yyyy to ISO format for backend
      const queryParams = new URLSearchParams();
      
      if (filters.search && filters.search.length > 0) queryParams.append('search', filters.search);
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.minScore !== undefined && filters.minScore !== null) queryParams.append('minScore', filters.minScore.toString());
      if (filters.maxScore !== undefined && filters.maxScore !== null) queryParams.append('maxScore', filters.maxScore.toString());
      // Date range filters - only append if BOTH dates are complete
      if (filters.fromDate && filters.fromDate.length === 10 && filters.toDate && filters.toDate.length === 10) {
        queryParams.append('fromDate', filters.fromDate);
        queryParams.append('toDate', filters.toDate);
        console.log('📅 Frontend Service - Sending date range:', { fromDate: filters.fromDate, toDate: filters.toDate });
      } else {
        console.log('📅 Frontend Service - Skipping date filter - incomplete dates:', { 
          fromDate: filters.fromDate, 
          toDate: filters.toDate,
          fromLength: filters.fromDate?.length,
          toLength: filters.toDate?.length
        });
      }
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.directDemo && filters.directDemo !== 'all') queryParams.append('directDemo', filters.directDemo);
      
      // Teacher Journey filters
      if (filters.demoStatus && filters.demoStatus !== 'all') queryParams.append('demoStatus', filters.demoStatus);
      if (filters.onboardingEmailSent && filters.onboardingEmailSent !== 'all') queryParams.append('onboardingEmailSent', filters.onboardingEmailSent);
      if (filters.inductionAttendance && filters.inductionAttendance !== 'all') queryParams.append('inductionAttendance', filters.inductionAttendance);
      if (filters.trainingStatus && filters.trainingStatus !== 'all') queryParams.append('trainingStatus', filters.trainingStatus);
      if (filters.certificationStatus && filters.certificationStatus !== 'all') queryParams.append('certificationStatus', filters.certificationStatus);
      if (filters.goLiveReadiness && filters.goLiveReadiness !== 'all') queryParams.append('goLiveReadiness', filters.goLiveReadiness);

      const response = await axiosInstance.get(`/api/admin/applications/filtered?${queryParams.toString()}`);
      const responseData = response.data as { 
        status: boolean; 
        msg?: string; 
        data: AppListResponse;
        error?: string;
      };
      
      console.log('🔍 Frontend Service - Raw response:', response.data);
      console.log('🔍 Frontend Service - Response data structure:', responseData);
      
      if (responseData.status) {
        console.log('🔍 Frontend Service - Success response data:', responseData.data);
        return {
          status: true,
          message: responseData.msg || 'Applications retrieved successfully',
          data: responseData.data
        };
      } else {
        console.log('🔍 Frontend Service - Error response:', responseData);
        return {
          status: false,
          message: responseData.msg || 'Failed to retrieve applications',
          error: responseData.error || 'UNKNOWN_ERROR'
        };
      }
    } catch (error: unknown) {
      console.error('Error fetching filtered applications:', error);
      
      if (error && typeof error === 'object' && 'response' in error && error.response) {
        const responseError = error as { 
          response: { 
            data: { 
              message?: string; 
              msg?: string; 
              error?: string; 
              details?: Array<{ field: string; message: string; value?: string }> 
            } 
          } 
        };
        
        // Handle validation errors with details
        if (responseError.response.data?.details && Array.isArray(responseError.response.data.details)) {
          const errorMessages = responseError.response.data.details.map(detail => detail.message).join('; ');
          return {
            status: false,
            message: errorMessages,
            error: responseError.response.data?.error || 'VALIDATION_ERROR'
          };
        }
        
        // Handle other backend errors
        return {
          status: false,
          message: responseError.response.data?.message || responseError.response.data?.msg || 'Backend error occurred',
          error: responseError.response.data?.error || 'BACKEND_ERROR'
        };
      } else if (error && typeof error === 'object' && 'request' in error) {
        return {
          status: false,
          message: 'Network error - unable to connect to backend',
          error: 'NETWORK_ERROR'
        };
      } else if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as { code: string; message: string };
        if (axiosError.code === 'ECONNABORTED') {
          return {
            status: false,
            message: 'Request timeout - please try again',
            error: 'TIMEOUT_ERROR'
          };
        }
        return {
          status: false,
          message: axiosError.message || 'Request failed',
          error: 'REQUEST_ERROR'
        };
      } else {
        return {
          status: false,
          message: error instanceof Error ? error.message : 'Something went wrong',
          error: 'UNKNOWN_ERROR'
        };
      }
    }
  }
}

export default ApplicationsFilteredService;
