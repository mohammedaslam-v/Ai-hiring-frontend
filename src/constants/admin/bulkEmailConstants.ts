/**
 * Email templates for bulk email functionality
 */
export const EMAIL_TEMPLATES = [
  {
    id: "interview-invite",
    name: "Interview Invitation",
    subject: "Invitation for an Interview Session",
    message: "Dear Candidate,\n\nThank you for your application. We are pleased to invite you for an online interview session. Please log in to our portal to schedule your interview at your convenience.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "interview-reminder",
    name: "Interview Reminder",
    subject: "Reminder: Your Scheduled Interview",
    message: "Dear Candidate,\n\nThis is a friendly reminder about your upcoming interview session. Please ensure you log in to our platform 5 minutes before the scheduled time.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "congratulations",
    name: "Congratulations - Passed",
    subject: "Congratulations on Passing Your Interview",
    message: "Dear Candidate,\n\nCongratulations! We are pleased to inform you that you have successfully passed your interview. Our team will contact you soon with the next steps.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "application-update",
    name: "Application Status Update",
    subject: "Update on Your Application Status",
    message: "Dear Candidate,\n\nWe would like to provide you with an update on your application. Your application is currently under review, and we will inform you of any developments soon.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "custom",
    name: "Custom Template",
    subject: "",
    message: ""
  }
] as const;

export type EmailTemplateId = typeof EMAIL_TEMPLATES[number]['id'];

/**
 * Status filter options for email recipients
 */
export const STATUS_FILTER_OPTIONS = {
  ALL: "all",
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
  PASSED: "passed"
} as const;

export type StatusFilterOption = typeof STATUS_FILTER_OPTIONS[keyof typeof STATUS_FILTER_OPTIONS];

/**
 * Status filter display labels
 */
export const STATUS_FILTER_LABELS = {
  [STATUS_FILTER_OPTIONS.ALL]: "All Applicants",
  [STATUS_FILTER_OPTIONS.PENDING]: "Pending Applications",
  [STATUS_FILTER_OPTIONS.IN_PROGRESS]: "In Interview",
  [STATUS_FILTER_OPTIONS.COMPLETED]: "Completed Interviews",
  [STATUS_FILTER_OPTIONS.FAILED]: "Failed Interviews",
  [STATUS_FILTER_OPTIONS.PASSED]: "Passed Interviews"
} as const;

/**
 * Score filter options
 */
export const SCORE_FILTER_OPTIONS = {
  ALL: "all",
  PASSED: "passed",
  FAILED: "failed"
} as const;

export type ScoreFilterOption = typeof SCORE_FILTER_OPTIONS[keyof typeof SCORE_FILTER_OPTIONS];

/**
 * Score filter display labels
 */
export const SCORE_FILTER_LABELS = {
  [SCORE_FILTER_OPTIONS.ALL]: "All Results",
  [SCORE_FILTER_OPTIONS.PASSED]: "Passed (Final Total Score ≥ 6/10)",
  [SCORE_FILTER_OPTIONS.FAILED]: "Failed (Final Total Score < 6/10)"
} as const;

/**
 * UI text and messages
 */
export const BULK_EMAIL_UI_TEXT = {
  TITLE: "Send Bulk Email",
  DESCRIPTION: "Send an email to multiple candidates based on their status.",
  LABELS: {
    EMAIL_TEMPLATE: "Select Email Template",
    RECIPIENTS_BY_STATUS: "Select Recipients By Status",
    FILTER_BY_RESULT: "Filter By Result",
    FILTER_BY_DATE: "Filter By Application Date",
    EMAIL_SUBJECT: "Email Subject",
    EMAIL_MESSAGE: "Email Message",
    FROM_DATE: "From Date",
    TO_DATE: "To Date"
  },
  PLACEHOLDERS: {
    EMAIL_SUBJECT: "Enter email subject",
    EMAIL_MESSAGE: "Enter your message here...",
    FROM_DATE: "From Date",
    TO_DATE: "To Date"
  },
  BUTTONS: {
    CANCEL: "Cancel",
    SEND_EMAIL: "Send Email to",
    PREPARING: "Preparing..."
  },
  CHECKBOX: {
    USE_FILTERED: "Use current table filters instead (respects search and all filters)"
  },
  RECIPIENT_INFO: {
    NO_RECIPIENTS: "⚠️ No recipients match your criteria.",
    RECIPIENT_COUNT: "✉️ This will prepare an email to",
    RECIPIENT: "recipient",
    RECIPIENTS: "recipients"
  },
  TOAST: {
    SUBJECT_REQUIRED: "Please enter an email subject",
    MESSAGE_REQUIRED: "Please enter an email message",
    NO_RECIPIENTS: "No recipients match your criteria",
    SUCCESS: "Email prepared for",
    RECIPIENTS: "recipients. Your email client should open automatically.",
    FAILED: "Failed to open email client. Please try again."
  }
} as const;

/**
 * Configuration values
 */
export const BULK_EMAIL_CONFIG = {
  MIN_SCORE_PASS: 6,
  MESSAGE_MIN_HEIGHT: 150,
  DIALOG_MAX_WIDTH: "sm:max-w-[600px]"
} as const;

/**
 * Default template mapping based on status
 */
export const DEFAULT_TEMPLATE_MAPPING = {
  [STATUS_FILTER_OPTIONS.PENDING]: "interview-invite",
  [STATUS_FILTER_OPTIONS.IN_PROGRESS]: "interview-reminder",
  [STATUS_FILTER_OPTIONS.PASSED]: "congratulations",
  DEFAULT: "application-update"
} as const;
