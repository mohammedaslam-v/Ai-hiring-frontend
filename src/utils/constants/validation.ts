// Validation messages and rules
export const VALIDATION_MESSAGES = {
  // Common validation messages
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_FORMAT: 'Invalid format',
  FILE_TOO_LARGE: 'File size is too large',
  MIN_LENGTH: 'Must be at least {min} characters',
  MAX_LENGTH: 'Must not exceed {max} characters',
  
  // Field-specific validation messages
  FIRST_NAME: {
    REQUIRED: 'First name is required',
    MIN_LENGTH: 'First name must be at least 2 characters',
    MAX_LENGTH: 'First name must not exceed 50 characters',
  },
  
  LAST_NAME: {
    REQUIRED: 'Last name is required',
    MIN_LENGTH: 'Last name must be at least 2 characters',
    MAX_LENGTH: 'Last name must not exceed 50 characters',
  },
  
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
  },
  
  PHONE: {
    REQUIRED: 'Phone number is required',
    INVALID: 'Phone number must contain only digits',
    MIN_LENGTH: 'Phone number must be at least 10 digits',
    MAX_LENGTH: 'Phone number must not exceed 15 digits',
  },
  
  COUNTRY_CODE: {
    REQUIRED: 'Country code is required',
    INVALID_FORMAT: 'Invalid country code format',
    INVALID_VALUE: 'Please select a valid country code',
  },
  
  POSITION: {
    REQUIRED: 'Position is required',
  },
  
  SUBJECTS: {
    REQUIRED: 'Subjects are required',
    MIN_SELECTION: 'Please select at least one subject',
  },
  
  AVAILABLE_DAYS: {
    REQUIRED: 'Available days are required',
    MIN_SELECTION: 'Please select at least one available day',
  },
  
  TIME_SLOTS: {
    REQUIRED: 'Time slots are required',
    MIN_SELECTION: 'Please select at least one time slot',
  },
  
  
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least 6 characters',
  },
  
  CONFIRM_PASSWORD: {
    REQUIRED: 'Please confirm your password',
    MISMATCH: 'Passwords do not match',
  },
} as const;

export const VALIDATION_RULES = {
  // Length constraints
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_PASSWORD_LENGTH: 6,
  
  // File size constraints
  MAX_RESUME_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  
  // Regex patterns
  PHONE_PATTERN: /^[0-9]+$/,
  COUNTRY_CODE_PATTERN: /^\+[0-9]+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const VALIDATION_SCHEMAS = {
  // Common validation patterns
  PATTERNS: {
    PHONE: VALIDATION_RULES.PHONE_PATTERN,
    COUNTRY_CODE: VALIDATION_RULES.COUNTRY_CODE_PATTERN,
    EMAIL: VALIDATION_RULES.EMAIL_PATTERN,
  },
  
  // Error variants for UI components
  ERROR_VARIANTS: {
    DEFAULT: 'default',
    DESTRUCTIVE: 'destructive',
    WARNING: 'warning',
  },
} as const;
