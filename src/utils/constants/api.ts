// API endpoints and service constants
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Candidate endpoints
  CANDIDATE_LOGIN: '/candidate/login',
  CANDIDATE_APPLICATION: '/candidate/application',
  CANDIDATE_INTERVIEW: '/candidate/interview',
  CANDIDATE_RESULT: '/candidate/result',
  
  // Admin endpoints
  ADMIN_LOGIN: '/admin/login',
  ADMIN_SIGNUP: '/admin/signup',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_FEEDBACK: '/admin/feedback',
  
  // Application endpoints
  APPLICATIONS: '/applications',
  APPLICATION_DETAIL: '/applications/:id',
  EXPORT_APPLICATIONS: '/applications/export',
  
  // Analytics endpoints
  ANALYTICS: '/analytics',
  STATS: '/analytics/stats',
  TRENDS: '/analytics/trends',
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  TEXT: 'text/plain',
} as const;

export const HEADERS = {
  AUTHORIZATION: 'Authorization',
  REFRESH_TOKEN: 'refreshToken',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
} as const;
