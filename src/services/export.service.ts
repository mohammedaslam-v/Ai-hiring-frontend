import axiosInstance from './instance';
import { AppListFilters } from '@/types/admin/applications';

export interface ExportResponse {
  status: boolean;
  message: string;
  error?: string;
}

/**
 * Export applications to CSV format
 */
export const exportApplicationsToCSV = async (filters: AppListFilters): Promise<ExportResponse> => {
  try {
    // Build query parameters from filters
    const queryParams = new URLSearchParams();
    
    if (filters.search && filters.search.length > 0) queryParams.append('search', filters.search);
    // Handle status (single or multiple)
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        filters.status.forEach(status => queryParams.append('status', status));
      } else if (filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
    }
    if (filters.minScore !== undefined && filters.minScore !== null) queryParams.append('minScore', filters.minScore.toString());
    if (filters.maxScore !== undefined && filters.maxScore !== null) queryParams.append('maxScore', filters.maxScore.toString());
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.directDemo) {
      if (Array.isArray(filters.directDemo)) {
        filters.directDemo.forEach(value => queryParams.append('directDemo', value));
      } else if (filters.directDemo !== 'all') {
        queryParams.append('directDemo', filters.directDemo);
      }
    }

    // Teacher Journey filters (multi-select)
    const journeyFilters = [
      'demoStatus',
      'onboardingEmailSent',
      'inductionAttendance',
      'trainingStatus',
      'certificationStatus',
      'goLiveReadiness'
    ] as const;

    journeyFilters.forEach(filterName => {
      const value = (filters as any)[filterName];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v: string) => queryParams.append(filterName, v));
        } else if (value !== 'all') {
          queryParams.append(filterName, value);
        }
      }
    });

    // Make API request to backend
    const response = await axiosInstance.get(`/api/admin/applications/export/csv?${queryParams.toString()}`, {
      responseType: 'blob', // Important for file download
      timeout: 60000 // 60 second timeout for large exports
    });

    // Create download link
    const blob = new Blob([response.data as BlobPart], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Extract filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'applications-export.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      status: true,
      message: 'CSV export completed successfully'
    };

  } catch (error: unknown) {
    console.error('CSV export error:', error);
    
    // Handle different types of errors
    const axiosError = error as { response?: { status: number; data?: { message?: string; details?: Array<{ message: string }> } }; code?: string };
    if (axiosError.response?.status === 400) {
      // Handle validation errors with details
      if (axiosError.response.data?.details && Array.isArray(axiosError.response.data.details)) {
        const errorMessages = axiosError.response.data.details.map((detail: { message: string }) => detail.message).join('; ');
        return {
          status: false,
          message: errorMessages,
          error: 'VALIDATION_ERROR'
        };
      }
      
      return {
        status: false,
        message: axiosError.response.data?.message || 'No data available for export',
        error: 'NO_DATA'
      };
    }
    
    if (axiosError.code === 'ECONNABORTED') {
      return {
        status: false,
        message: 'Export timed out. Please try with fewer filters or contact support.',
        error: 'TIMEOUT'
      };
    }
    
    return {
      status: false,
      message: 'Failed to export CSV. Please try again.',
      error: 'EXPORT_FAILED'
    };
  }
};

/**
 * Export applications to Excel format
 */
export const exportApplicationsToExcel = async (filters: AppListFilters): Promise<ExportResponse> => {
  try {
    // Build query parameters from filters
    const queryParams = new URLSearchParams();
    
    if (filters.search && filters.search.length > 0) queryParams.append('search', filters.search);
    // Handle status (single or multiple)
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        filters.status.forEach(status => queryParams.append('status', status));
      } else if (filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
    }
    if (filters.minScore !== undefined && filters.minScore !== null) queryParams.append('minScore', filters.minScore.toString());
    if (filters.maxScore !== undefined && filters.maxScore !== null) queryParams.append('maxScore', filters.maxScore.toString());
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.directDemo) {
      if (Array.isArray(filters.directDemo)) {
        filters.directDemo.forEach(value => queryParams.append('directDemo', value));
      } else if (filters.directDemo !== 'all') {
        queryParams.append('directDemo', filters.directDemo);
      }
    }

    // Teacher Journey filters (multi-select)
    const journeyFilters = [
      'demoStatus',
      'onboardingEmailSent',
      'inductionAttendance',
      'trainingStatus',
      'certificationStatus',
      'goLiveReadiness'
    ] as const;

    journeyFilters.forEach(filterName => {
      const value = (filters as any)[filterName];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v: string) => queryParams.append(filterName, v));
        } else if (value !== 'all') {
          queryParams.append(filterName, value);
        }
      }
    });

    // Make API request to backend
    const response = await axiosInstance.get(`/api/admin/applications/export/excel?${queryParams.toString()}`, {
      responseType: 'blob', // Important for file download
      timeout: 60000 // 60 second timeout for large exports
    });

    // Create download link
    const blob = new Blob([response.data as BlobPart], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Extract filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'applications-export.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      status: true,
      message: 'Excel export completed successfully'
    };

  } catch (error: unknown) {
    console.error('Excel export error:', error);
    
    // Handle different types of errors
    const axiosError = error as { response?: { status: number; data?: { message?: string } }; code?: string };
    if (axiosError.response?.status === 400) {
      return {
        status: false,
        message: axiosError.response.data?.message || 'No data available for export',
        error: 'NO_DATA'
      };
    }
    
    if (axiosError.code === 'ECONNABORTED') {
      return {
        status: false,
        message: 'Export timed out. Please try with fewer filters or contact support.',
        error: 'TIMEOUT'
      };
    }
    
    return {
      status: false,
      message: 'Failed to export Excel. Please try again.',
      error: 'EXPORT_FAILED'
    };
  }
};
