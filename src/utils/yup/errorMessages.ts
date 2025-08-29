// Centralized error messages for all validation schemas
export const VALIDATION_ERROR_MESSAGES = {
  // Common validation errors
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  INVALID_VALUE: 'Invalid value',
  
  // Phone number validation
  PHONE: {
    REQUIRED: 'Phone number is required',
    INVALID: 'Please enter a valid phone number',
    MIN_LENGTH: 'Phone number must be at least 10 digits',
    MAX_LENGTH: 'Phone number must not exceed 15 digits',
  },
  
  // Country code validation
  COUNTRY_CODE: {
    REQUIRED: 'Country code is required',
    INVALID_FORMAT: 'Invalid country code format',
    INVALID_VALUE: 'Please select a valid country code',
  },
  
  // Name validation
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
  
  // Email validation
  EMAIL: {
    REQUIRED: 'Email address is required',
    INVALID: 'Please enter a valid email address',
  },
  
  // Position validation
  POSITION: {
    REQUIRED: 'Please select a position',
  },
  
  // Subjects validation
  SUBJECTS: {
    REQUIRED: 'Please select at least one subject',
    MIN_SELECTION: 'Please select at least one subject',
  },
  
  // Availability validation
  AVAILABLE_DAYS: {
    REQUIRED: 'Please select available days',
    MIN_SELECTION: 'Please select at least one available day',
  },
  
  TIME_SLOTS: {
    REQUIRED: 'Please select available time slots',
    MIN_SELECTION: 'Please select at least one time slot',
  },
  
  // Resume validation
  RESUME: {
    REQUIRED: 'Please upload your resume',
    FILE_SIZE: 'Resume file size must not exceed 5MB',
    FILE_TYPE: 'Please upload a valid file type (PDF, DOC, DOCX)',
  },
  
  // Password validation
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least 8 characters',
    WEAK: 'Password is too weak. Include uppercase, lowercase, number, and special character',
  },
} as const;

// Export individual error message groups for specific use cases
export const PHONE_ERRORS = VALIDATION_ERROR_MESSAGES.PHONE;
export const NAME_ERRORS = {
  FIRST_NAME: VALIDATION_ERROR_MESSAGES.FIRST_NAME,
  LAST_NAME: VALIDATION_ERROR_MESSAGES.LAST_NAME,
};
export const EMAIL_ERRORS = VALIDATION_ERROR_MESSAGES.EMAIL;
export const POSITION_ERRORS = VALIDATION_ERROR_MESSAGES.POSITION;
export const SUBJECTS_ERRORS = VALIDATION_ERROR_MESSAGES.SUBJECTS;
export const AVAILABLE_DAYS_ERRORS = VALIDATION_ERROR_MESSAGES.AVAILABLE_DAYS;
export const TIME_SLOTS_ERRORS = VALIDATION_ERROR_MESSAGES.TIME_SLOTS;
export const RESUME_ERRORS = VALIDATION_ERROR_MESSAGES.RESUME;
export const PASSWORD_ERRORS = VALIDATION_ERROR_MESSAGES.PASSWORD;
