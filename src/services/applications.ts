import { ServiceResponse } from "@/types/interface";
import { ApplicationsServiceFilters } from "@/types";
import axiosInstance from "./instance";

class ApplicationService {

    // Mock data for applications - more realistic names and data
    private mockApplications = Array.from({ length: 50 }, (_, i) => {
        const firstNames = ['Ravi', 'Kavimalar', 'Yamini', 'Ashish', 'Shrushti', 'Madiha', 'Saloni', 'Priya', 'Arjun', 'Neha', 'Rajesh', 'Anjali', 'Vikram', 'Meera', 'Suresh'];
        const lastNames = ['Kumar', 'Gopinath', 'Bhardwaj', 'Tripathi', 'Rajguru', 'Kausar', 'Sikka', 'Sharma', 'Singh', 'Patel', 'Verma', 'Gupta', 'Malhotra', 'Kapoor', 'Reddy'];
        const subjects = ['English', 'Maths', 'Science', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi', 'Bhagavad Gita', 'Phonics', 'Art', 'Music', 'Physical Education'];
        const positions = ['English Teacher', 'Math Teacher', 'Science Teacher', 'Hindi Teacher', 'Bengali Teacher', 'Tamil Teacher', 'Telugu Teacher', 'Marathi Teacher', 'Gujarati Teacher', 'Punjabi Teacher', 'Bhagavad Gita Teacher', 'Phonics Teacher', 'Art Teacher', 'Music Teacher', 'Physical Education Teacher'];
        const statuses = ['submitted', 'approved', 'rejected', 'pending', 'under_review'];
        
        return {
            id: `app-${i + 1}`,
            firstName: firstNames[i % firstNames.length],
            lastName: lastNames[i % lastNames.length],
            email: `${firstNames[i % firstNames.length].toLowerCase()}${lastNames[i % lastNames.length].toLowerCase()}${i + 1}@example.com`,
            phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            position: positions[i % positions.length],
            subjects: subjects.slice(0, Math.floor(Math.random() * 3) + 1),
            additionalLanguages: ['Bengali', 'Malayalam', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi'],
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            timeSlots: ['Morning', 'Afternoon', 'Evening'],
            status: statuses[i % statuses.length],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            applicationId: `APP-${String(i + 1).padStart(4, '0')}`
        };
    });

    async getApplicationsCount(): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = { count: this.mockApplications.length };
            
            return {
                status: true,
                message: "Applications count retrieved successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async getApplicationsPage(
        page: number = 1,
        pageSize: number = 10,
        filters?: ApplicationsServiceFilters
    ): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedApplications = this.mockApplications.slice(startIndex, endIndex);
            
            // Apply filters if provided
            let filteredApplications = paginatedApplications;
            if (filters) {
                if (filters.status && filters.status !== "any" && filters.status !== "all") {
                    filteredApplications = filteredApplications.filter(app => app.status === filters.status);
                }
                if (filters.position && filters.position !== "any" && filters.position !== "all") {
                    filteredApplications = filteredApplications.filter(app => app.position === filters.position);
                }
                if (filters.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filteredApplications = filteredApplications.filter(app => 
                        app.firstName.toLowerCase().includes(searchTerm) ||
                        app.lastName.toLowerCase().includes(searchTerm) ||
                        app.email.toLowerCase().includes(searchTerm)
                    );
                }
            }
            
            const mockResponse = {
                applications: filteredApplications,
                total: this.mockApplications.length,
                page,
                pageSize
            };
            
            return {
                status: true,
                message: "Applications retrieved successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async getApplicationById(id: string): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const application = this.mockApplications.find(app => app.id === id);
            
            if (!application) {
                return {
                    status: false,
                    message: "Application not found",
                }
            }
            
            return {
                status: true,
                message: "Application retrieved successfully",
                data: application
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
            const application = this.mockApplications.find(app => app.id === id);
            
            if (!application) {
                return {
                    status: false,
                    message: "Application not found",
                }
            }
            
            // Update the mock application
            application.status = status;
            
            return {
                status: true,
                message: "Application status updated successfully",
                data: application
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
            const applicationIndex = this.mockApplications.findIndex(app => app.id === id);
            
            if (applicationIndex === -1) {
                return {
                    status: false,
                    message: "Application not found",
                }
            }
            
            // Remove from mock data
            this.mockApplications.splice(applicationIndex, 1);
            
            return {
                status: true,
                message: "Application deleted successfully",
                data: { message: "Application deleted successfully" }
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }
}

export default ApplicationService;