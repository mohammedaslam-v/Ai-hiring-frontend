// Teacher Journey Validation Error Messages
export const TEACHER_JOURNEY_ERROR_MESSAGES = {
  // Demo Section
  DEMO: {
    STATUS_REQUIRED: 'Demo status is required',
    STATUS_INVALID: 'Invalid demo status',
    DATE_REQUIRED: 'Demo date is required when status is SCHEDULED or SELECTED',
    DATE_INVALID: 'Demo date must be a valid date',
    DATE_FUTURE: 'Demo date cannot be in the future',
    DATE_PAST: 'Demo date cannot be more than 1 year in the past',
    INTERVIEWER_REQUIRED: 'Interviewer name is required when demo is conducted',
    INTERVIEWER_INVALID: 'Please select a valid interviewer',
    FEEDBACK_REQUIRED: 'Demo feedback is required when status is SELECTED or NOT_SELECTED',
    FEEDBACK_MIN_LENGTH: 'Demo feedback must be at least 10 characters',
    FEEDBACK_MAX_LENGTH: 'Demo feedback must not exceed 2000 characters',
  },
  
  // Extended Demo Evaluation
  DEMO_EVALUATION: {
    OVERALL_STYLE_REQUIRED: 'Overall teaching style is required',
    OVERALL_STYLE_INVALID: 'Invalid teaching style rating',
    DEMO_CONDUCTED_REQUIRED: 'Demo conducted status is required',
  },
  
  SUBJECTS: {
    REQUIRED: 'At least one subject/program must be selected',
    MIN_SELECTION: 'Please select at least one subject/program',
    MAX_SELECTION: 'Maximum 4 subjects can be selected',
    INVALID_SUBJECT: 'Invalid subject selected',
  },
  
  // Induction Section
  INDUCTION: {
    ATTENDANCE_REQUIRED: 'Induction attendance status is required',
    ATTENDANCE_INVALID: 'Invalid attendance status',
    DATE_REQUIRED: 'Induction date is required when attendance is YES',
    DATE_INVALID: 'Induction date must be a valid date',
    DATE_FUTURE: 'Induction date cannot be in the future',
  },
  
  // Training Section
  TRAINING: {
    STATUS_REQUIRED: 'Training status is required',
    STATUS_INVALID: 'Invalid training status',
    START_DATE_REQUIRED: 'Training start date is required when status is JOINED or COMPLETED',
    START_DATE_INVALID: 'Training start date must be a valid date',
    START_DATE_FUTURE: 'Training start date cannot be more than 1 year in the future',
    NOTES_MAX_LENGTH: 'Training notes must not exceed 2000 characters',
  },
  
  // Certification Section
  CERTIFICATION: {
    STATUS_REQUIRED: 'Certification status is required',
    STATUS_INVALID: 'Invalid certification status',
    DATE_REQUIRED: 'Certification date is required',
    DATE_INVALID: 'Certification date must be a valid date',
    DATE_FUTURE: 'Certification date cannot be in the future',
    FEEDBACK_REQUIRED: 'Certification feedback is required',
    FEEDBACK_MIN_LENGTH: 'Certification feedback must be at least 10 characters',
    FEEDBACK_MAX_LENGTH: 'Certification feedback must not exceed 2000 characters',
  },
  
  // Go-Live Section
  GO_LIVE: {
    READINESS_REQUIRED: 'Go-live readiness status is required',
    READINESS_INVALID: 'Invalid go-live readiness status',
    DATE_REQUIRED: 'Go-live date is required when readiness is YES',
    DATE_INVALID: 'Go-live date must be a valid date',
    DATE_FUTURE: 'Go-live date cannot be more than 3 months in the future',
    SUBJECT_REQUIRED: 'Assigned subject is required when readiness is YES',
    SUBJECT_INVALID: 'Invalid subject assignment',
  },
  
  // Onboarding Section
  ONBOARDING: {
    EMAIL_SENT_INVALID: 'Invalid onboarding email status',
    HIRE_CALL_INVALID: 'Invalid hire call status',
    WHATSAPP_GROUP_INVALID: 'Invalid WhatsApp group status',
    REJECT_COMMENTS_REQUIRED: 'Reject comments are required when reject email is sent',
    REJECT_COMMENTS_MIN_LENGTH: 'Reject comments must be at least 10 characters',
    REJECT_COMMENTS_MAX_LENGTH: 'Reject comments must not exceed 1000 characters',
    INTERNAL_COMMENTS_MAX_LENGTH: 'Internal comments must not exceed 2000 characters',
  },
  
  // Common
  COMMON: {
    DATE_FORMAT: 'Date must be in YYYY-MM-DD format',
    REQUIRED_FIELD: 'This field is required',
    INVALID_VALUE: 'Invalid value provided',
  },
} as const;
