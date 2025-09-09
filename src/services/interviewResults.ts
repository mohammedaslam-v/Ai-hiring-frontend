import { axiosInstance } from './instance';

export interface InterviewResultsData {
  id: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  interviewStatus: string;
  score: number;
  submittedAt: string;
  updatedAt: string;
  results: {
    score: number;
    status: string;
    passed: boolean;
    isPassed: boolean;
    feedback: string;
  };
}

export interface InterviewResultsResponse {
  status: boolean;
  msg: string;
  data: InterviewResultsData;
  error?: string;
}


class InterviewResultsService {
  /**
   * Fetch interview results for a candidate
   * @param applicationId - The application ID to fetch results for
   * @returns Promise with interview results data
   */
  async getInterviewResults(applicationId: string): Promise<InterviewResultsResponse> {
    try {
      const response = await axiosInstance.get(`/api/candidate/interview-results/${applicationId}`);
      return response.data as InterviewResultsResponse;
    } catch (error: unknown) {
      console.error('Error fetching interview results:', error);
      
      // Handle different error scenarios
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data: InterviewResultsResponse } };
        if (axiosError.response?.data) {
          return axiosError.response.data as InterviewResultsResponse;
        }
      }
      
      return {
        status: false,
        msg: 'Failed to fetch interview results',
        data: {} as InterviewResultsData,
        error: 'NETWORK_ERROR'
      };
    }
  }

}

export const interviewResultsService = new InterviewResultsService();
