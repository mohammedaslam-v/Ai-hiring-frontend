import AuthService from './auth.service';
import ApplicationService from './applications';
import AdminService from './admin.service';
import CandidateService from './candidate.service';
import ApplicationsFilteredService from './applicationsFiltered.service';

// Initialize all services once (Singleton Pattern)
const authService = new AuthService();
const applicationService = new ApplicationService();
const adminService = new AdminService();
const candidateService = new CandidateService();
const applicationsFilteredService = new ApplicationsFilteredService();

// Export initialized instances (Service Registry Pattern)
export {
    authService,
    applicationService,
    adminService,
    candidateService,
    applicationsFilteredService
};

// Export service classes for cases where new instances are needed
export {
    AuthService,
    ApplicationService,
    AdminService,
    CandidateService,
    ApplicationsFilteredService
};

// Service type definitions for better TypeScript support
export type ServiceManager = {
    authService: AuthService;
    applicationService: ApplicationService;
    adminService: AdminService;
    candidateService: CandidateService;
    applicationsFilteredService: ApplicationsFilteredService;
};

// Default export for convenience
export default {
    authService,
    applicationService,
    adminService,
    candidateService,
    applicationsFilteredService
} as ServiceManager;
