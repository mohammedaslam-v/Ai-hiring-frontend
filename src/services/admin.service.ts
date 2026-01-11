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

interface BackendCountResponse {
  status: boolean;
  msg?: string;
  data: {
    total: number;
  };
}

class AdminService {

    async getAdminDashboardStats(): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                totalApplications: 150,
                pendingApplications: 45,
                approvedApplications: 78,
                rejectedApplications: 27,
                totalCandidates: 120,
                activePositions: 15,

            };
            
            return {
                status: true,
                message: "Admin dashboard stats retrieved successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
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
                    data: { count: responseData.data.total }
                };
            } else {
                return {
                    status: false,
                    message: responseData.msg || "Failed to retrieve applications count",
                };
            }
            
        } catch (error: unknown) {
            console.error('Error fetching applications count:', error);
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }

    async getApplicationsPage(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ServiceResponse> {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('limit', pageSize.toString());
            queryParams.append('sortBy', 'createdAt');
            queryParams.append('sortOrder', 'desc');

            const response = await axiosInstance.get(`/api/admin/applications?${queryParams.toString()}`);
            const responseData = response.data as BackendResponse;
            
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
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }


    async updateApplicationStatus(id: string, status: string): Promise<ServiceResponse> {
        try {
            // Make API call to backend
            const response = await axiosInstance.patch(`/api/admin/applications/${id}/status`, {
                status: status
            });
            const responseData = response.data as BackendResponse;
            
            if (responseData.status) {
                return {
                    status: true,
                    message: "Application status updated successfully",
                    data: responseData.data
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
                const responseError = error as { response: { data: { msg?: string } } };
                return {
                    status: false,
                    message: responseError.response.data?.msg || "Backend error occurred",
                };
            } else if (error && typeof error === 'object' && 'request' in error) {
                return {
                    status: false,
                    message: "Network error - unable to connect to backend",
                };
            } else {
                return {
                    status: false,
                    message: error instanceof Error ? error.message : "Something went wrong",
                };
            }
        }
    }

    async deleteApplication(id: string): Promise<ServiceResponse> {
        try {
            const response = await axiosInstance.delete(`/api/admin/applications/${id}`);
            const responseData = response.data as { status: boolean; msg?: string; data?: { applicationId: string } };
            if (responseData.status) {
                return {
                    status: true,
                    message: responseData.msg || "Application deleted successfully",
                    data: responseData.data
                }
            }
            return {
                status: false,
                message: responseData.msg || "Failed to delete application",
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async getAdminProfile(): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                id: "admin-001",
                name: "Admin User",
                email: "admin@bambinos.live",
                role: "admin",
                permissions: ["read", "write", "delete", "manage_users"],
                lastLogin: new Date().toISOString(),
                createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
            };
            
            return {
                status: true,
                message: "Admin profile retrieved successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async getReportsAnalytics(): Promise<ServiceResponse> {
        try {
            const response = await axiosInstance.get('/api/admin/dashboard/reports');
            const responseData = response.data as {
                status: boolean;
                msg?: string;
                data?: {
                    totalApplications: number;
                    totalInterviewMinutes: number;
                    totalInterviewSeconds: number;
                    averageMinutesPerUser: number;
                    users: Array<{
                        email: string;
                        firstName: string;
                        lastName: string;
                        applicationId: string;
                        interviewMinutes: number;
                        interviewSeconds: number;
                    }>;
                };
            };
            
            if (responseData.status && responseData.data) {
                return {
                    status: true,
                    message: responseData.msg || "Reports analytics retrieved successfully",
                    data: responseData.data
                };
            } else {
                return {
                    status: false,
                    message: responseData.msg || "Failed to retrieve reports analytics",
                };
            }
            
        } catch (error: unknown) {
            console.error('Error fetching reports analytics:', error);
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }


}

export default AdminService;
