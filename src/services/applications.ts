import { ServiceResponse, ApplicationsServiceFilters } from "@/types/interface";
import { APPLICATION_STATUSES, MOCK_DATA, SUBJECTS, POSITIONS, ADDITIONAL_LANGUAGES, AVAILABLE_DAYS, TIME_SLOTS } from "@/utils/constants/data";

class ApplicationService {

    // Mock data for applications - more realistic names and data
    private mockApplications = Array.from({ length: 50 }, (_, i) => {
        const firstNames = MOCK_DATA.FIRST_NAMES;
        const lastNames = MOCK_DATA.LAST_NAMES;
        const domains = MOCK_DATA.DOMAINS;
        
        const statuses = APPLICATION_STATUSES;
        
        return {
            id: `app-${i + 1}`,
            firstName: firstNames[i % firstNames.length],
            lastName: lastNames[i % lastNames.length],
            email: `${firstNames[i % firstNames.length].toLowerCase()}${lastNames[i % lastNames.length].toLowerCase()}${i + 1}@${domains[i % domains.length]}`,
            phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            position: POSITIONS[i % POSITIONS.length],
            subjects: SUBJECTS.slice(0, Math.floor(Math.random() * 3) + 1),
            additionalLanguages: ADDITIONAL_LANGUAGES,
            availableDays: AVAILABLE_DAYS.map(day => day.name),
            timeSlots: TIME_SLOTS.map(slot => slot.name),
            status: statuses[i % statuses.length],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            applicationId: `${MOCK_DATA.APPLICATION_ID_PREFIX}${String(i + 1).padStart(4, '0')}`
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
            // Apply filters if provided
            let filteredApplications = [...this.mockApplications];
            
            if (filters?.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase();
                filteredApplications = filteredApplications.filter(app => 
                    app.firstName.toLowerCase().includes(searchTerm) ||
                    app.lastName.toLowerCase().includes(searchTerm) ||
                    app.email.toLowerCase().includes(searchTerm) ||
                    app.position.toLowerCase().includes(searchTerm)
                );
            }
            
            if (filters?.status) {
                filteredApplications = filteredApplications.filter(app => 
                    app.status === filters.status
                );
            }
            
            if (filters?.position) {
                filteredApplications = filteredApplications.filter(app => 
                    app.position === filters.position
                );
            }
            
            // Calculate pagination
            const totalCount = filteredApplications.length;
            const totalPages = Math.ceil(totalCount / pageSize);
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
            
            const mockResponse = {
                applications: paginatedApplications,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalCount,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
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

    async deleteApplication(id: string): Promise<ServiceResponse> {
        try {
            const index = this.mockApplications.findIndex(app => app.id === id);
            
            if (index === -1) {
                return {
                    status: false,
                    message: "Application not found",
                }
            }
            
            this.mockApplications.splice(index, 1);
            
            return {
                status: true,
                message: "Application deleted successfully",
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async bulkDeleteApplications(ids: string[]): Promise<ServiceResponse> {
        try {
            let deletedCount = 0;
            
            ids.forEach(id => {
                const index = this.mockApplications.findIndex(app => app.id === id);
                if (index !== -1) {
                    this.mockApplications.splice(index, 1);
                    deletedCount++;
                }
            });
            
            return {
                status: true,
                message: `${deletedCount} applications deleted successfully`,
                data: { deletedCount }
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