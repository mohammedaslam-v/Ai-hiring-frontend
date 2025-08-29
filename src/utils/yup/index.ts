// Main export file for all Yup validation schemas and utilities

// Export all validation schemas
export {
  candidateApplicationValidation,
  adminLoginValidation,
  candidateLoginValidation,
  adminSignupValidation,
  profileUpdateValidation,
} from './validation';

// Export all initial values
export {
  candidateApplicationInitialValues,
  adminLoginInitialValues,
  candidateLoginInitialValues,
  adminSignupInitialValues,
  profileUpdateInitialValues,
} from './initialValues';

// Export all error messages
export {
  PHONE_ERRORS,
  NAME_ERRORS,
  EMAIL_ERRORS,
  POSITION_ERRORS,
  SUBJECTS_ERRORS,
  AVAILABLE_DAYS_ERRORS,
  TIME_SLOTS_ERRORS,
  RESUME_ERRORS,
  PASSWORD_ERRORS,
} from './errorMessages';

// Re-export Yup for convenience
export * as Yup from 'yup';
