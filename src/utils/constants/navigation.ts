// Navigation routes, paths, and navigation-related constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  NOT_FOUND: '*',
  
  // Candidate routes
  CANDIDATE: {
    LOGIN: '/candidate/login',
    APPLICATION: '/candidate/application',
    INTERVIEW: '/candidate/interview',
    RESULT: '/candidate/result',
    SALARY_STRUCTURE: '/candidate/salary-structure',
    ASSESSMENT_SALARY_STRUCTURE: '/candidate/assessment-salary-structure',
    SIMPLIFIED_SALARY_STRUCTURE: '/candidate/simplified-salary-structure',
  },
  
  // Admin routes
  ADMIN: {
    LOGIN: '/admin/login',
    SIGNUP: '/admin/signup',
    DASHBOARD: '/admin/dashboard',
    APPLICATIONS: '/admin/applications',
    APPLICATION_DETAIL: '/admin/applications/:id',
    FEEDBACK_RESULTS: '/admin/feedback-results',
  },
  

  
  // Auth routes
  AUTH: {
    SETUP: '/admin/setup',
  },
  
  // Feedback routes
  FEEDBACK: '/feedback',
} as const;

export const NAVIGATION_LABELS = {
  // Navigation menu labels
  HOME: 'Home',
  LOGIN: 'Login',
  SIGNUP: 'Sign Up',
  DASHBOARD: 'Dashboard',
  APPLICATIONS: 'Applications',
  FEEDBACK: 'Feedback',
  LOGOUT: 'Logout',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  
  // Button labels
  APPLY_AS_TEACHER: 'Apply as a Teacher',
  BEGIN_JOURNEY: 'Begin Your Journey',
  BACK_TO_HOME: 'Back to Home',
  GO_TO_DASHBOARD: 'Go to Dashboard',
  VIEW_APPLICATION: 'View Application',
  EDIT_APPLICATION: 'Edit Application',
  DELETE_APPLICATION: 'Delete Application',
  
  // Breadcrumb labels
  BREADCRUMB: {
    HOME: 'Home',
    CANDIDATE: 'Candidate',
    ADMIN: 'Admin',
    APPLICATIONS: 'Applications',
    FEEDBACK: 'Feedback',
  },
} as const;

export const REDIRECT_PATHS = {
  // Default redirect paths
  DEFAULT_LOGIN_REDIRECT: '/admin/dashboard',
  DEFAULT_LOGOUT_REDIRECT: '/admin/login',
  CANDIDATE_LOGIN_REDIRECT: '/candidate/application',
  ADMIN_LOGIN_REDIRECT: '/admin/dashboard',
  
  // Error redirect paths
  UNAUTHORIZED_REDIRECT: '/admin/login',
  FORBIDDEN_REDIRECT: '/admin/login',
  NOT_FOUND_REDIRECT: '/',
} as const;

export const NAVIGATION_CONFIG = {
  // Navigation configuration
  STICKY_HEADER: true,
  BACKDROP_BLUR: true,
  SHADOW: true,
  Z_INDEX: 50,
  
  // Mobile navigation
  MOBILE_BREAKPOINT: 'md',
  MOBILE_MENU_ANIMATION: true,
} as const;
