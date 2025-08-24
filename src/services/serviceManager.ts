import AuthService from './auth.service';
import ApplicationService from './applications';
import AdminService from './admin.service';
import CandidateService from './candidate.service';

// Initialize all services once
const authService = new AuthService();
const applicationService = new ApplicationService();
const adminService = new AdminService();
const candidateService = new CandidateService();

// Export initialized instances
export {
    authService,
    applicationService,
    adminService,
    candidateService
};

// Export service classes for cases where new instances are needed
export {
    AuthService,
    ApplicationService,
    AdminService,
    CandidateService
};
