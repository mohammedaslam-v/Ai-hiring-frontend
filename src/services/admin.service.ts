import { ServiceResponse } from "@/types/interface";
import axiosInstance from "./instance";
import { ApplicationsServiceFilters } from "@/types";

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
                recentActivity: [
                    { id: 1, action: "Application submitted", candidate: "Ravi Kumar", time: "2 hours ago" },
                    { id: 2, action: "Status updated", candidate: "Priya Sharma", time: "4 hours ago" },
                    { id: 3, action: "Interview scheduled", candidate: "Arjun Singh", time: "6 hours ago" }
                ]
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

    async getAdminApplications(
        page: number = 1,
        pageSize: number = 10,
        filters?: any
    ): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockApplications = Array.from({ length: 50 }, (_, i) => ({
                id: `app-${i + 1}`,
                firstName: `Candidate ${i + 1}`,
                lastName: `Last ${i + 1}`,
                email: `candidate${i + 1}@example.com`,
                phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                position: ['English Teacher', 'Math Teacher', 'Science Teacher', 'Hindi Teacher'][Math.floor(Math.random() * 4)],
                status: ['pending', 'approved', 'rejected', 'under_review'][Math.floor(Math.random() * 4)],
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                applicationId: `APP-${String(i + 1).padStart(4, '0')}`
            }));

            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedApplications = mockApplications.slice(startIndex, endIndex);
            
            const mockResponse = {
                applications: paginatedApplications,
                total: mockApplications.length,
                page,
                pageSize
            };
            
            return {
                status: true,
                message: "Admin applications retrieved successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async updateApplicationStatus(id: string, status: string): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                id,
                status,
                updatedAt: new Date().toISOString(),
                message: `Application status updated to ${status}`
            };
            
            return {
                status: true,
                message: "Application status updated successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async deleteApplication(id: string): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                id,
                message: "Application deleted successfully",
                deletedAt: new Date().toISOString()
            };
            
            return {
                status: true,
                message: "Application deleted successfully",
                data: mockResponse
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
}

export default AdminService;
