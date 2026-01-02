import axiosInstance from './instance';
import { 
  TeacherJourney, 
  TeacherJourneyFilters, 
  TeacherJourneyStats,
  SubmitDemoFeedbackData,
  UpdateTeacherJourneyData
} from '@/types/teacherJourney';

interface ApiResponse<T> {
  status: boolean;
  msg: string;
  data: T;
  error?: string;
}

interface PaginatedResponse<T> {
  journeys: T[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface JourneyStatusData {
  demoStatus: string;
  onboardingEmailSent: string | null;
  inductionAttendance: string;
  trainingStatus: string;
  certificationStatus: string;
  goLiveReadiness: string;
  demoEmailSent: string | null;
  demoEmailSentAt: string | null;
  demoEmailType: string | null;
  demoEmailSentCount: number;
  demoEmailSentBy: string | null;
  progress: number;
}

class TeacherJourneyService {
  private baseUrl = '/api/admin/teacher-journey';

  async getAllJourneys(filters: TeacherJourneyFilters = {}): Promise<{
    status: boolean;
    message: string;
    data?: PaginatedResponse<TeacherJourney>;
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.demoStatus && filters.demoStatus !== 'all') queryParams.append('demoStatus', filters.demoStatus);
      if (filters.onboardingEmailSent && filters.onboardingEmailSent !== 'all') queryParams.append('onboardingEmailSent', filters.onboardingEmailSent);
      if (filters.inductionAttendance && filters.inductionAttendance !== 'all') queryParams.append('inductionAttendance', filters.inductionAttendance);
      if (filters.trainingStatus && filters.trainingStatus !== 'all') queryParams.append('trainingStatus', filters.trainingStatus);
      if (filters.certificationStatus && filters.certificationStatus !== 'all') queryParams.append('certificationStatus', filters.certificationStatus);
      if (filters.goLiveReadiness && filters.goLiveReadiness !== 'all') queryParams.append('goLiveReadiness', filters.goLiveReadiness);
      if (filters.assignedSubject && filters.assignedSubject !== 'all') queryParams.append('assignedSubject', filters.assignedSubject);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const response = await axiosInstance.get<ApiResponse<PaginatedResponse<TeacherJourney>>>(
        `${this.baseUrl}?${queryParams.toString()}`
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to fetch teacher journeys',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error fetching teacher journeys:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async getJourneyById(id: number): Promise<{
    status: boolean;
    message: string;
    data?: TeacherJourney;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.get<ApiResponse<TeacherJourney>>(
        `${this.baseUrl}/${id}`
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to fetch teacher journey',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error fetching teacher journey:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async getJourneyByApplicationId(applicationId: string): Promise<{
    status: boolean;
    message: string;
    data?: TeacherJourney;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.get<ApiResponse<TeacherJourney>>(
        `${this.baseUrl}/application/${applicationId}`
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to fetch teacher journey',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error fetching teacher journey:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async updateJourney(id: number, data: UpdateTeacherJourneyData): Promise<{
    status: boolean;
    message: string;
    data?: TeacherJourney;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.patch<ApiResponse<TeacherJourney>>(
        `${this.baseUrl}/${id}`,
        data
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to update teacher journey',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error updating teacher journey:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async submitDemoFeedback(data: SubmitDemoFeedbackData): Promise<{
    status: boolean;
    message: string;
    data?: TeacherJourney;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.post<ApiResponse<TeacherJourney>>(
        `${this.baseUrl}/demo-feedback`,
        data
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to submit demo feedback',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error submitting demo feedback:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async createJourneyFromCandidate(applicationId: string): Promise<{
    status: boolean;
    message: string;
    data?: TeacherJourney;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.post<ApiResponse<TeacherJourney>>(
        `${this.baseUrl}/create-from-candidate`,
        { applicationId }
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to create teacher journey',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error creating teacher journey:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async deleteJourney(id: number): Promise<{
    status: boolean;
    message: string;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.delete<ApiResponse<{ id: number }>>(
        `${this.baseUrl}/${id}`
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to delete teacher journey',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error deleting teacher journey:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async getStats(queryParams?: string): Promise<{
    status: boolean;
    message: string;
    data?: TeacherJourneyStats;
    error?: string;
  }> {
    try {
      const url = queryParams 
        ? `${this.baseUrl}/stats?${queryParams}` 
        : `${this.baseUrl}/stats`;
        
      const response = await axiosInstance.get<ApiResponse<TeacherJourneyStats>>(url);

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to fetch stats',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error fetching teacher journey stats:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  /** Fetch batch journey status for multiple applications */
  async getBatchJourneyStatus(applicationIds: string[]): Promise<{
    status: boolean;
    message: string;
    data?: Record<string, JourneyStatusData>;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.post<ApiResponse<Record<string, JourneyStatusData>>>(
        `${this.baseUrl}/batch-status`,
        { applicationIds }
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to fetch batch journey status',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error fetching batch journey status:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async sendDemoResultEmail(applicationId: string): Promise<{
    status: boolean;
    message: string;
    data?: any;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/${applicationId}/send-demo-email`
      );

      if (response.data.success) {
        return {
          status: true,
          message: response.data.message || 'Demo result email sent successfully',
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.message || 'Failed to send demo result email',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error sending demo result email:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.message || 'Network error',
        error: err?.message
      };
    }
  }

  async getInterviewers(): Promise<{
    status: boolean;
    message: string;
    data?: { id: number; name: string }[];
    error?: string;
  }> {
    try {
      const response = await axiosInstance.get<ApiResponse<{ id: number; name: string }[]>>(
        `${this.baseUrl}/interviewers`
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to fetch interviewers',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error fetching interviewers:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async createInterviewer(name: string): Promise<{
    status: boolean;
    message: string;
    data?: { id: number; name: string };
    error?: string;
  }> {
    try {
      const response = await axiosInstance.post<ApiResponse<{ id: number; name: string }>>(
        `${this.baseUrl}/interviewers`,
        { name }
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to create interviewer',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error creating interviewer:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async updateInterviewer(id: number, name: string): Promise<{
    status: boolean;
    message: string;
    data?: { id: number; name: string };
    error?: string;
  }> {
    try {
      const response = await axiosInstance.patch<ApiResponse<{ id: number; name: string }>>(
        `${this.baseUrl}/interviewers/${id}`,
        { name }
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg,
          data: response.data.data
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to update interviewer',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error updating interviewer:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }

  async deleteInterviewer(id: number): Promise<{
    status: boolean;
    message: string;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.delete<ApiResponse<any>>(
        `${this.baseUrl}/interviewers/${id}`
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.msg
        };
      }

      return {
        status: false,
        message: response.data.msg || 'Failed to delete interviewer',
        error: response.data.error
      };
    } catch (error: unknown) {
      console.error('Error deleting interviewer:', error);
      const err = error as { response?: { data?: { msg?: string } }; message?: string };
      return {
        status: false,
        message: err?.response?.data?.msg || 'Network error',
        error: err?.message
      };
    }
  }
}

export const teacherJourneyService = new TeacherJourneyService();
export default teacherJourneyService;

