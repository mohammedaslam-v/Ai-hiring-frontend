// Data constants - country codes, time slots, subjects, positions, and other repeated values
export const COUNTRY_CODES = [
  '+91', // India
  '+1',  // USA/Canada
  '+44', // UK
  '+61', // Australia
  '+81', // Japan
  '+49', // Germany
  '+33', // France
  '+86', // China
  '+7',  // Russia
  '+55', // Brazil
] as const;

export const TIME_SLOTS = [
  { name: '6:00 AM - 8:00 AM', highDemand: false },
  { name: '8:00 AM - 10:00 AM', highDemand: false },
  { name: '10:00 AM - 12:00 PM', highDemand: false },
  { name: '12:00 PM - 2:00 PM', highDemand: false },
  { name: '2:00 PM - 4:00 PM', highDemand: false },
  { name: '4:00 PM - 6:00 PM', highDemand: false },
  { name: '6:00 PM - 8:00 PM', highDemand: true },
  { name: '8:00 PM - 10:00 PM', highDemand: false },
] as const;

export const AVAILABLE_DAYS = [
  { name: 'Monday', highDemand: false },
  { name: 'Tuesday', highDemand: false },
  { name: 'Wednesday', highDemand: false },
  { name: 'Thursday', highDemand: false },
  { name: 'Friday', highDemand: false },
  { name: 'Saturday', highDemand: true },
  { name: 'Sunday', highDemand: true },
] as const;

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Literature',
  'Art',
  'Music',
  'Physical Education',
  'Foreign Languages',
] as const;

export const POSITIONS = [
  'Educator',
  'Role 2 - Senior Educator',
  'Role 3 - Lead Educator',
  'Role 4 - Subject Specialist',
  'Role 5 - Curriculum Developer',
] as const;

export const ADDITIONAL_LANGUAGES = [
  'Bengali',
  'Malayalam',
  'Hindi',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Urdu',
  'Arabic',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
] as const;

export const APPLICATION_STATUSES = [
  'submitted',
  'approved',
  'rejected',
  'pending',
  'under_review',
] as const;

export const FEEDBACK_CATEGORIES = [
  'general',
  'technical',
  'user_experience',
  'content',
  'support',
  'other',
] as const;

export const FEEDBACK_RATINGS = [1, 2, 3, 4, 5] as const;

export const MOCK_DATA = {
  // Mock application data for development
  FIRST_NAMES: ['Ravi', 'Kavimalar', 'Yamini', 'Priya', 'Anjali', 'Suresh', 'Rajesh', 'Meera'],
  LAST_NAMES: ['Kumar', 'Sharma', 'Patel', 'Singh', 'Verma', 'Gupta', 'Joshi', 'Malhotra'],
  DOMAINS: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'],
  
  // Mock application IDs
  APPLICATION_ID_PREFIX: 'APP-',
  APPLICATION_ID_LENGTH: 8,
  
  // Mock tokens
  TOKEN_PREFIX: {
    REFRESH: 'mock-refresh-token-',
    ACCESS: 'mock-access-token-',
  },
  
  // Mock feedback IDs
  FEEDBACK_ID_PREFIX: 'feedback-',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
} as const;

export const TIMEOUTS = {
  LOGIN_DELAY: 1000,
  OTP_VERIFICATION: 2000,
  FEEDBACK_SUBMISSION: 1000,
  API_TIMEOUT: 30000,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const STORAGE_KEYS = {
  AUTH_USER: 'authUser',
  LOGIN_PHONE_NUMBER: 'loginPhoneNumber',
  CANDIDATE_NAME: 'candidateName',
  CANDIDATE_EMAIL: 'candidateEmail',
  APPLICATION_ID: 'applicationId',
  FEEDBACK: 'feedback',
  ADMIN_FEEDBACK: 'adminFeedback',
} as const;
