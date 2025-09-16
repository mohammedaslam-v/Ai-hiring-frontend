import { ServiceResponse } from "@/types/interface";
import axiosInstance from "./instance";

// Define types for backend response
interface BackendApplication {
  _id?: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  subjects: string[];
  additionalLanguages?: string[];
  availableDays: string[];
  availableTimeSlots: string[];
  status: string;
  interviewStatus: string;
  score?: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendResponse {
  status: boolean;
  msg?: string;
  data: {
    applications: BackendApplication[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

class ApplicationService {

    async getApplicationsPage(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ServiceResponse> {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('limit', pageSize.toString());
            queryParams.append('sortBy', 'appliedDate');
            queryParams.append('sortOrder', 'desc');

            const response = await axiosInstance.get(`/api/admin/applications?${queryParams.toString()}`);
            const responseData = response.data as { status: boolean; msg?: string; data: BackendResponse };
            
            if (responseData.status) {
                return {
                    status: true,
                    message: "Applications retrieved successfully",
                    data: responseData.data
                };
            } else {
                return {
                    status: false,
                    message: responseData.msg || "Failed to retrieve applications",
                };
            }
            
        } catch (error: unknown) {
            console.error('Error fetching applications page:', error);
            
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
                    };
                }
                
                // Handle other backend errors
                return {
                    status: false,
                    message: responseError.response.data?.message || responseError.response.data?.msg || "Something went wrong",
                };
            }
            
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }

    async getApplicationById(id: string): Promise<ServiceResponse> {
        try {
            const response = await axiosInstance.get(`/api/admin/applications/${id}`);
            const responseData = response.data as { status: boolean; msg?: string; data: BackendApplication };
            
            if (responseData.status) {
                const application = responseData.data;
                return {
                    status: true,
                    message: "Application retrieved successfully",
                    data: {
                        id: application._id || application.applicationId,
                        firstName: application.firstName,
                        lastName: application.lastName,
                        email: application.email,
                        phone: application.phoneNumber,
                        position: application.position,
                        subjects: application.subjects || [],
                        additionalLanguages: application.additionalLanguages || [],
                        availableDays: application.availableDays || [],
                        timeSlots: application.availableTimeSlots || [],
                        status: application.status || 'Submitted',
                        interviewStatus: application.interviewStatus || 'not_started',
                        score: application.score ?? null,
                        applicationId: application.applicationId,
                        createdAt: application.createdAt,
                        updatedAt: application.updatedAt,
                        // Additional fields for AdminApplicationDetail
                        latest_status: application.interviewStatus || 'not_started',
                        latest_score: application.score ?? null,
                        latest_completed_at: null, // Not available in current backend response
                        session_id: null, // Not available in current backend response
                        name: `${application.firstName} ${application.lastName}`,
                        availability: application.availableDays || [],
                        application_status: application.status || 'Submitted',
                        application_date: application.createdAt,
                        evaluation: null // Not available in current backend response
                    }
                };
            } else {
                return {
                    status: false,
                    message: responseData.msg || "Failed to retrieve application",
                };
            }
            
        } catch (error: unknown) {
            console.error('Error fetching application by ID:', error);
            
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
                    };
                }
                
                // Handle other backend errors
                return {
                    status: false,
                    message: responseError.response.data?.message || responseError.response.data?.msg || "Something went wrong",
                };
            }
            
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }

    async updateApplicationStatus(id: string, status: string): Promise<ServiceResponse> {
        try {
            const response = await axiosInstance.patch(`/api/admin/applications/${id}/status`, { status });
            const responseData = response.data as { status: boolean; msg?: string; data: BackendApplication };
            
            if (responseData.status) {
                const application = responseData.data;
                return {
                    status: true,
                    message: "Application status updated successfully",
                    data: {
                        id: application._id || application.applicationId,
                        firstName: application.firstName,
                        lastName: application.lastName,
                        email: application.email,
                        phone: application.phoneNumber,
                        position: application.position,
                        subjects: application.subjects || [],
                        additionalLanguages: application.additionalLanguages || [],
                        availableDays: application.availableDays || [],
                        timeSlots: application.availableTimeSlots || [],
                        status: application.status || 'Submitted',
                        interviewStatus: application.interviewStatus || 'not_started',
                        score: application.score ?? null,
                        applicationId: application.applicationId,
                        createdAt: application.createdAt,
                        updatedAt: application.updatedAt
                    }
                };
            } else {
                return {
                    status: false,
                    message: responseData.msg || "Failed to update application status",
                };
            }
            
        } catch (error: unknown) {
            console.error('Error updating application status:', error);
            
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
                    };
                }
                
                // Handle other backend errors
                return {
                    status: false,
                    message: responseError.response.data?.message || responseError.response.data?.msg || "Something went wrong",
                };
            }
            
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }

    async getApplicationsCount(): Promise<ServiceResponse> {
        try {
            const response = await axiosInstance.get('/api/admin/applications/count');
            const responseData = response.data as { status: boolean; msg?: string; data: { total: number } };
            
            if (responseData.status) {
                return {
                    status: true,
                    message: "Applications count retrieved successfully",
                    data: { total: responseData.data.total }
                };
            } else {
                return {
                    status: false,
                    message: responseData.msg || "Failed to retrieve applications count",
                };
            }
            
        } catch (error: unknown) {
            console.error('Error fetching applications count:', error);
            
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
                    };
                }
                
                // Handle other backend errors
                return {
                    status: false,
                    message: responseError.response.data?.message || responseError.response.data?.msg || "Something went wrong",
                };
            }
            
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }
}

export default ApplicationService;