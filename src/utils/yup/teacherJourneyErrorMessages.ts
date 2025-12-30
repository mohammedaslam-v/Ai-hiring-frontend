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
  
  // Demo Ratings (1-5 scale)
  RATINGS: {
    REQUIRED: 'All rating fields are required when demo is conducted',
    INVALID_RANGE: 'Rating must be between 1 and 5',
    LESSON_CLARITY: 'Lesson clarity rating is required',
    STUDENT_ENGAGEMENT: 'Student engagement rating is required',
    LANGUAGE_COMMUNICATION: 'Language & communication rating is required',
    TEACHING_AIDS: 'Teaching aids rating is required',
    CREATIVITY_DELIVERY: 'Creativity & delivery rating is required',
    GRAMMAR_PRONUNCIATION: 'Grammar & pronunciation rating is required',
  },
  
  // Extended Demo Evaluation
  DEMO_EVALUATION: {
    OVERALL_STYLE_REQUIRED: 'Overall teaching style is required',
    OVERALL_STYLE_INVALID: 'Invalid teaching style rating',
    DEMO_CONDUCTED_REQUIRED: 'Demo conducted status is required',
  },
  
  // Languages & Subjects
  LANGUAGES: {
    REQUIRED: 'At least one language must be selected',
    MIN_SELECTION: 'Please select at least one language',
    MAX_SELECTION: 'Maximum 10 languages can be selected',
    INVALID_LANGUAGE: 'Invalid language selected',
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
    DATE_REQUIRED: 'Certification date is required when status is CLEARED or NOT_CLEARED',
    DATE_INVALID: 'Certification date must be a valid date',
    DATE_FUTURE: 'Certification date cannot be in the future',
    FEEDBACK_REQUIRED: 'Certification feedback is required when status is NOT_CLEARED',
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
  
  // Availability & Preferences
  AVAILABILITY: {
    MIN_HOURS_REQUIRED: 'Minimum hours confirmation is required',
    MIN_HOURS_INVALID: 'Invalid minimum hours confirmation status',
  },
  
  // Training & Onboarding Confirmation
  TRAINING_CONFIRMATION: {
    WILLING_TRAINING_REQUIRED: 'Training willingness is required',
    WILLING_TRAINING_INVALID: 'Invalid training willingness status',
    SALARY_ACCEPTED_REQUIRED: 'Salary structure acceptance is required',
    SALARY_ACCEPTED_INVALID: 'Invalid salary structure acceptance status',
    START_IN_2_WEEKS_REQUIRED: 'Start date willingness is required',
    START_IN_2_WEEKS_INVALID: 'Invalid start date willingness status',
  },
  
  // Common
  COMMON: {
    DATE_FORMAT: 'Date must be in YYYY-MM-DD format',
    REQUIRED_FIELD: 'This field is required',
    INVALID_VALUE: 'Invalid value provided',
  },
} as const;





