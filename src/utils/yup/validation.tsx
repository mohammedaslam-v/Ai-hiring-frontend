import * as Yup from "yup";
import { VALIDATION_ERROR_MESSAGES } from "./errorMessages";

// Validation rules constants
const VALIDATION_RULES = {
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 8,
  MAX_RESUME_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_FEEDBACK_LENGTH: 10,
  MAX_FEEDBACK_LENGTH: 500,
} as const;

// Validation patterns
const VALIDATION_PATTERNS = {
  PHONE: /^[0-9+\-\s()]+$/,
  COUNTRY_CODE: /^\+[0-9]{1,4}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
} as const;

// Country codes for validation
const VALID_COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+81", "+49", "+33", "+86", "+7", "+55"] as const;

// Candidate Login Validation Schema
export const candidateLoginValidation = Yup.object().shape({
  phone: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.PHONE.REQUIRED)
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/, VALIDATION_ERROR_MESSAGES.PHONE.INVALID)
    .min(VALIDATION_RULES.MIN_PHONE_LENGTH, VALIDATION_ERROR_MESSAGES.PHONE.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_PHONE_LENGTH, VALIDATION_ERROR_MESSAGES.PHONE.MAX_LENGTH),
});

// Candidate Application Validation Schema
export const candidateApplicationValidation = Yup.object().shape({
  firstName: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.FIRST_NAME.REQUIRED)
    .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.FIRST_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.FIRST_NAME.MAX_LENGTH),
  lastName: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.LAST_NAME.REQUIRED)
    .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.LAST_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.LAST_NAME.MAX_LENGTH),
  email: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_ERROR_MESSAGES.EMAIL.INVALID),
  phone: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.PHONE.REQUIRED)
    .matches(VALIDATION_PATTERNS.PHONE, VALIDATION_ERROR_MESSAGES.PHONE.INVALID)
    .min(VALIDATION_RULES.MIN_PHONE_LENGTH, VALIDATION_ERROR_MESSAGES.PHONE.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_PHONE_LENGTH, VALIDATION_ERROR_MESSAGES.PHONE.MAX_LENGTH),
  position: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.POSITION.REQUIRED),
  subjects: Yup.array()
    .min(1, VALIDATION_ERROR_MESSAGES.SUBJECTS.MIN_SELECTION)
    .required(VALIDATION_ERROR_MESSAGES.SUBJECTS.REQUIRED),
  additionalLanguages: Yup.array()
    .of(Yup.string())
    .optional(),
  availableDays: Yup.array()
    .min(1, VALIDATION_ERROR_MESSAGES.AVAILABLE_DAYS.MIN_SELECTION)
    .required(VALIDATION_ERROR_MESSAGES.AVAILABLE_DAYS.REQUIRED),
  timeSlots: Yup.array()
    .min(1, VALIDATION_ERROR_MESSAGES.TIME_SLOTS.MIN_SELECTION)
    .required(VALIDATION_ERROR_MESSAGES.TIME_SLOTS.REQUIRED),
  resume: Yup.mixed()
    .required(VALIDATION_ERROR_MESSAGES.RESUME.REQUIRED)
    .test("fileSize", VALIDATION_ERROR_MESSAGES.RESUME.FILE_SIZE, (value) => {
      if (!value) return false;
      return (value as File).size <= VALIDATION_RULES.MAX_RESUME_SIZE;
    })
    .test("fileType", VALIDATION_ERROR_MESSAGES.RESUME.FILE_TYPE, (value) => {
      if (!value) return false;
      const file = value as File;
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return allowedTypes.includes(file.type);
    }),
});

// Admin Login Validation Schema
export const adminLoginValidation = Yup.object().shape({
  email: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_ERROR_MESSAGES.EMAIL.INVALID),
  password: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.PASSWORD.REQUIRED),
});

// Admin Signup Validation Schema
export const adminSignupValidation = Yup.object().shape({
  firstName: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.FIRST_NAME.REQUIRED)
    .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.FIRST_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.FIRST_NAME.MAX_LENGTH),
  lastName: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.LAST_NAME.REQUIRED)
    .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.LAST_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.LAST_NAME.MAX_LENGTH),
  email: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_ERROR_MESSAGES.EMAIL.INVALID),
  password: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.PASSWORD.REQUIRED)
    .min(VALIDATION_RULES.MIN_PASSWORD_LENGTH, VALIDATION_ERROR_MESSAGES.PASSWORD.MIN_LENGTH)
    .matches(VALIDATION_PATTERNS.PASSWORD, VALIDATION_ERROR_MESSAGES.PASSWORD.WEAK),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

// Feedback Form Validation Schema
 
// Profile Update Validation Schema
export const profileUpdateValidation = Yup.object().shape({
  firstName: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.FIRST_NAME.REQUIRED)
    .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.FIRST_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.FIRST_NAME.MAX_LENGTH),
  lastName: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.LAST_NAME.REQUIRED)
    .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.LAST_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_ERROR_MESSAGES.LAST_NAME.MAX_LENGTH),
  email: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_ERROR_MESSAGES.EMAIL.INVALID),
  phone: Yup.string()
    .required(VALIDATION_ERROR_MESSAGES.PHONE.REQUIRED)
    .matches(VALIDATION_PATTERNS.PHONE, VALIDATION_ERROR_MESSAGES.PHONE.INVALID)
    .min(VALIDATION_RULES.MIN_PHONE_LENGTH, VALIDATION_ERROR_MESSAGES.PHONE.MIN_LENGTH)
    .max(VALIDATION_RULES.MAX_PHONE_LENGTH, VALIDATION_ERROR_MESSAGES.PHONE.MAX_LENGTH),
});
// Export validation rules and patterns for external use
export { VALIDATION_RULES, VALIDATION_PATTERNS, VALID_COUNTRY_CODES };
