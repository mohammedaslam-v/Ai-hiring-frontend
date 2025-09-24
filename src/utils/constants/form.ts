// Form field labels, placeholders, and form-related constants
export const FORM_LABELS = {
  // Personal Information
  FIRST_NAME: 'First Name *',
  LAST_NAME: 'Last Name *',
  EMAIL: 'Email Address *',
  PHONE: 'Phone Number *',
  COUNTRY_CODE: 'Country Code *',
  FULL_NAME: 'Full Name *',
  
  // Position and Subjects
  POSITION: 'Position *',
  SUBJECTS: 'Subjects *',
  ADDITIONAL_LANGUAGES: 'Additional Languages',
  
  // Availability
  AVAILABLE_DAYS: 'Available Days *',
  TIME_SLOTS: 'Available Time Slots *',
  
  
  // Authentication
  PASSWORD: 'Password *',
  CONFIRM_PASSWORD: 'Confirm Password *',
  
  // Feedback
  CATEGORY: 'Feedback Category *',
  RATING: 'Rating *',
  MESSAGE: 'Message *',
  
  // Admin
  ADMIN_ACCESS: 'Admin Access',
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
} as const;

export const FORM_PLACEHOLDERS = {
  // Personal Information
  FIRST_NAME: 'Enter your first name',
  LAST_NAME: 'Enter your last name',
  EMAIL: 'Enter your email address',
  PHONE: 'Enter your phone number',
  ADMIN_EMAIL: 'admin@bambinos.live',
  
  // Position and Subjects
  POSITION: 'Select your position',
  SUBJECTS: 'Select subjects you can teach',
  ADDITIONAL_LANGUAGES: 'Select additional languages',
  
  // Availability
  AVAILABLE_DAYS: 'Select your available days',
  TIME_SLOTS: 'Select your available time slots',
  
  
  // Authentication
  PASSWORD: 'Enter your password',
  CONFIRM_PASSWORD: 'Confirm your password',
  
  // Feedback
  NAME: 'Enter your full name',
  FEEDBACK_EMAIL: 'Enter your email',
  MESSAGE: 'Share your feedback with us',
} as const;

export const FORM_SECTIONS = {
  // Form section titles
  PERSONAL_INFORMATION: 'Personal Information',
  TEACHING_INFORMATION: 'Teaching Information',
  AVAILABILITY: 'Availability',
  AUTHENTICATION: 'Authentication',
  FEEDBACK: 'Feedback',
} as const;

export const FORM_VALIDATION = {
  // Form validation states
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
  INFO: 'info',
} as const;

export const FORM_INITIAL_VALUES = {
  // Default form values
  EMPTY_STRING: '',
  EMPTY_ARRAY: [],
  DEFAULT_COUNTRY_CODE: '+91',
  DEFAULT_POSITION: 'Educator',
  DEFAULT_RATING: 5,
  DEFAULT_CATEGORY: 'general',
} as const;

export const FORM_FIELD_TYPES = {
  // Input field types
  TEXT: 'text',
  EMAIL: 'email',
  TEL: 'tel',
  PASSWORD: 'password',
  FILE: 'file',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  TEXTAREA: 'textarea',
} as const;
