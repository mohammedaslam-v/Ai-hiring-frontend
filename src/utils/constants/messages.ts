// Toast messages, notifications, and user-facing messages
export const TOAST_MESSAGES = {
  // Success messages
  SUCCESS: {
    LOGIN: 'Login successful! Redirecting to application form...',
    APPLICATION_SUBMITTED: 'Application submitted successfully! Proceeding to the interview stage.',
    
    ADMIN_LOGIN: 'Welcome to the admin dashboard!',
    SESSION_CLEARED: 'Session cleared. You can now log in.',
    ALREADY_LOGGED_IN: "You're already logged in! Redirecting to dashboard...",
    WELCOME_ADMIN: 'Welcome to the admin dashboard!',
    FEEDBACK_THANKS: "Thank you for your feedback! We'll review it shortly.",
    OTP_VERIFIED: 'Welcome to Bambinos.live',
    OTP_RESENT: 'A new verification code has been sent to your phone',
  },
  
  // Error messages
  ERROR: {
    LOGIN_FAILED: 'Login failed',
    UNEXPECTED_ERROR: 'An unexpected error occurred',
    APPLICATION_ERROR: 'An error occurred while submitting your application. Please try again.',
    SESSION_CLEAR_ERROR: 'Error clearing session',
    OTP_INVALID: 'Please enter the 6-digit verification code',
    GENERAL_ERROR: 'Something went wrong. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
  
  // Info messages
  INFO: {
    REDIRECTING: 'Redirecting to dashboard...',
    PROCESSING: 'Processing your request...',
    UPLOADING: 'Uploading file...',
    SAVING: 'Saving changes...',
    LOADING: 'Loading...',
  },
  
  // Warning messages
  WARNING: {
    DUPLICATE_EMAIL: 'This email is already registered',
    DUPLICATE_PHONE: 'This phone number is already registered',
    FILE_SIZE_WARNING: 'File size is approaching the limit',
    SESSION_EXPIRING: 'Your session will expire soon',
  },
} as const;

export const NOTIFICATION_MESSAGES = {
  // Application status messages
  APPLICATION: {
    STATUS: {
      SUBMITTED: 'Application submitted successfully',
      APPROVED: 'Your application has been approved',
      REJECTED: 'Your application has been rejected',
      PENDING: 'Your application is under review',
      UNDER_REVIEW: 'Your application is being reviewed',
    },
    ACTIONS: {
      SUBMIT: 'Submit Application',
      UPDATE: 'Update Application',
      DELETE: 'Delete Application',
      VIEW: 'View Application',
      EXPORT: 'Export Applications',
    },
  },
  
  // Interview messages
  INTERVIEW: {
    SCHEDULED: 'Interview scheduled successfully',
    COMPLETED: 'Interview completed',
    CANCELLED: 'Interview cancelled',
    RESCHEDULED: 'Interview rescheduled',
  },
  
  // System messages
  SYSTEM: {
    MAINTENANCE: 'System maintenance in progress',
    UPDATE: 'System update available',
    BACKUP: 'System backup completed',
    SECURITY: 'Security alert detected',
  },
} as const;

export const USER_MESSAGES = {
  // Welcome messages
  WELCOME: {
    CANDIDATE: 'Welcome to Bambinos.live! Start your teaching journey today.',
    ADMIN: 'Welcome to the admin dashboard. Manage applications and feedback.',
    SUPER_ADMIN: 'Welcome to the super admin panel. Full system access granted.',
  },
  
  // Instruction messages
  INSTRUCTIONS: {
    APPLICATION: 'Please fill out all required fields to submit your application.',
    INTERVIEW: 'Prepare for your interview by reviewing the requirements.',
  
    LOGIN: 'Enter your credentials to access your account.',
  },
  
  // Confirmation messages
  CONFIRMATION: {
    DELETE: 'Are you sure you want to delete this item?',
    LOGOUT: 'Are you sure you want to log out?',
    SUBMIT: 'Are you ready to submit your application?',
    CANCEL: 'Are you sure you want to cancel?',
  },
  
  // Help messages
  HELP: {
    CONTACT_SUPPORT: 'Need help? Contact our support team.',
    FAQ: 'Check our frequently asked questions for quick answers.',
    TUTORIAL: 'Watch our tutorial videos to get started.',
    DOCUMENTATION: 'Read our documentation for detailed information.',
  },
} as const;

export const ERROR_MESSAGES = {
  // Form errors
  FORM: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    MIN_LENGTH: 'Minimum length not met',
    MAX_LENGTH: 'Maximum length exceeded',
    PATTERN_MISMATCH: 'Pattern does not match',
  },
  
  // Network errors
  NETWORK: {
    TIMEOUT: 'Request timed out',
    CONNECTION_FAILED: 'Connection failed',
    SERVER_UNREACHABLE: 'Server is unreachable',
    DNS_ERROR: 'DNS resolution failed',
  },
  
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_EXPIRED: 'Authentication token expired',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    ACCOUNT_LOCKED: 'Account is locked',
  },
  
  // File errors
  FILE: {
    UPLOAD_FAILED: 'File upload failed',
    INVALID_TYPE: 'Invalid file type',
    SIZE_EXCEEDED: 'File size exceeded',
    CORRUPTED: 'File is corrupted',
  },
} as const;
