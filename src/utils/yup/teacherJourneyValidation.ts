import * as Yup from 'yup';
import { TEACHER_JOURNEY_ERROR_MESSAGES } from './teacherJourneyErrorMessages';
import { 
  DemoStatus, 
  InductionStatus, 
  TrainingStatus, 
  CertificationStatus, 
  GoLiveStatus,
  Subject,
  TeachingStyleRating,
  YesNo,
  WhatsAppGroupStatus
} from '@/types/teacherJourney';
import { getSortedIndianLanguages } from '@/constants/indianLanguages';

// Validation helper functions
const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const isPastDate = (dateString: string | null | undefined, maxYearsPast: number = 1): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const maxPastDate = new Date();
  maxPastDate.setFullYear(maxPastDate.getFullYear() - maxYearsPast);
  return date >= maxPastDate;
};

const isFutureDate = (dateString: string | null | undefined, maxMonthsFuture: number = 12): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const maxFutureDate = new Date();
  maxFutureDate.setMonth(maxFutureDate.getMonth() + maxMonthsFuture);
  return date <= maxFutureDate;
};

// Demo Section Validation Schema
export const demoSectionValidation = Yup.object().shape({
  demoStatus: Yup.string()
    .required(TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.STATUS_REQUIRED)
    .oneOf(['PENDING', 'SCHEDULED', 'SELECTED', 'NOT_SELECTED'], TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.STATUS_INVALID),
  
  demoDate: Yup.string()
    .nullable()
    .when('demoStatus', {
      is: (status: DemoStatus) => status === 'SCHEDULED' || status === 'SELECTED' || status === 'NOT_SELECTED',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.DATE_REQUIRED)
        .test('is-valid-date', TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.DATE_INVALID, (value) => isValidDate(value))
        .test('not-future', TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.DATE_FUTURE, (value) => {
          if (!value) return true;
          const date = new Date(value);
          return date <= new Date();
        })
        .test('not-too-past', TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.DATE_PAST, (value) => {
          if (!value) return true;
          return isPastDate(value, 1);
        }),
      otherwise: (schema) => schema.nullable(),
    }),
  
  demoInterviewerName: Yup.string()
    .nullable()
    .when('demoStatus', {
      is: (status: DemoStatus) => status === 'SCHEDULED' || status === 'SELECTED' || status === 'NOT_SELECTED',
      then: (schema) => schema.required(TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.INTERVIEWER_REQUIRED),
      otherwise: (schema) => schema.nullable(),
    }),
  
  demoFeedback: Yup.string()
    .nullable()
    .when('demoStatus', {
      is: (status: DemoStatus) => status === 'SELECTED' || status === 'NOT_SELECTED',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.FEEDBACK_REQUIRED)
        .min(10, TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.FEEDBACK_MIN_LENGTH)
        .max(2000, TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.FEEDBACK_MAX_LENGTH),
      otherwise: (schema) => schema
        .nullable()
        .max(2000, TEACHER_JOURNEY_ERROR_MESSAGES.DEMO.FEEDBACK_MAX_LENGTH),
    }),
  
  // Ratings (1-5 scale) - Required when demo is conducted
  lessonClarity: Yup.number()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.LESSON_CLARITY)
        .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .max(5, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .integer('Rating must be a whole number'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  studentEngagement: Yup.number()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.STUDENT_ENGAGEMENT)
        .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .max(5, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .integer('Rating must be a whole number'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  languageCommunication: Yup.number()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.LANGUAGE_COMMUNICATION)
        .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .max(5, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .integer('Rating must be a whole number'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  teachingAids: Yup.number()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.TEACHING_AIDS)
        .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .max(5, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .integer('Rating must be a whole number'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  creativityDelivery: Yup.number()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.CREATIVITY_DELIVERY)
        .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .max(5, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .integer('Rating must be a whole number'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  grammarPronunciation: Yup.number()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.GRAMMAR_PRONUNCIATION)
        .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .max(5, TEACHER_JOURNEY_ERROR_MESSAGES.RATINGS.INVALID_RANGE)
        .integer('Rating must be a whole number'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  // Extended Demo Evaluation
  overallTeachingStyle: Yup.string()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.DEMO_EVALUATION.OVERALL_STYLE_REQUIRED)
        .oneOf(['BAD', 'AVERAGE', 'GOOD', 'EXCELLENT'], TEACHER_JOURNEY_ERROR_MESSAGES.DEMO_EVALUATION.OVERALL_STYLE_INVALID),
      otherwise: (schema) => schema.nullable(),
    }),
  
  demoConducted: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.DEMO_EVALUATION.DEMO_CONDUCTED_REQUIRED),
  
  goodToGo: Yup.string()
    .nullable()
    .when('demoConducted', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.DEMO_EVALUATION.GOOD_TO_GO_REQUIRED)
        .oneOf(['YES', 'NO'], 'Invalid good to go status'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  // Languages & Subjects
  languagesSpoken: Yup.array()
    .of(Yup.string())
    .nullable()
    .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.LANGUAGES.MIN_SELECTION)
    .max(10, TEACHER_JOURNEY_ERROR_MESSAGES.LANGUAGES.MAX_SELECTION)
    .test('valid-languages', TEACHER_JOURNEY_ERROR_MESSAGES.LANGUAGES.INVALID_LANGUAGE, (value) => {
      if (!value || value.length === 0) return false;
      const validLanguages = getSortedIndianLanguages();
      return value.every(lang => validLanguages.includes(lang));
    }),
  
  subjectsPrograms: Yup.array()
    .of(Yup.string())
    .nullable()
    .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.SUBJECTS.MIN_SELECTION)
    .max(4, TEACHER_JOURNEY_ERROR_MESSAGES.SUBJECTS.MAX_SELECTION)
    .test('valid-subjects', TEACHER_JOURNEY_ERROR_MESSAGES.SUBJECTS.INVALID_SUBJECT, (value) => {
      if (!value || value.length === 0) return false;
      const validSubjects = ['Unbox English', 'Little Yogi', 'Alpha Maths', 'Phonics'];
      return value.every(subj => validSubjects.includes(subj));
    }),
  
  // Availability
  minHoursConfirmed: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.AVAILABILITY.MIN_HOURS_INVALID),
  
  // Training & Onboarding Confirmation
  willingGitaTraining: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING_CONFIRMATION.WILLING_TRAINING_INVALID),
  
  salaryStructureAccepted: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING_CONFIRMATION.SALARY_ACCEPTED_INVALID),
  
  willingToStartIn2Weeks: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING_CONFIRMATION.START_IN_2_WEEKS_INVALID),
});

// Induction Section Validation Schema
export const inductionSectionValidation = Yup.object().shape({
  inductionAttendance: Yup.string()
    .required(TEACHER_JOURNEY_ERROR_MESSAGES.INDUCTION.ATTENDANCE_REQUIRED)
    .oneOf(['PENDING', 'YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.INDUCTION.ATTENDANCE_INVALID),
  
  inductionDate: Yup.string()
    .nullable()
    .when('inductionAttendance', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.INDUCTION.DATE_REQUIRED)
        .test('is-valid-date', TEACHER_JOURNEY_ERROR_MESSAGES.INDUCTION.DATE_INVALID, (value) => isValidDate(value))
        .test('not-future', TEACHER_JOURNEY_ERROR_MESSAGES.INDUCTION.DATE_FUTURE, (value) => {
          if (!value) return true;
          const date = new Date(value);
          return date <= new Date();
        }),
      otherwise: (schema) => schema.nullable(),
    }),
});

// Training Section Validation Schema
export const trainingSectionValidation = Yup.object().shape({
  trainingStatus: Yup.string()
    .required(TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING.STATUS_REQUIRED)
    .oneOf(['NOT_JOINED', 'JOINED', 'INCOMPLETE', 'SHIFTED_TO_NEXT_WEEK', 'DROPPED', 'COMPLETED'], 
      TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING.STATUS_INVALID),
  
  trainingStartDate: Yup.string()
    .nullable()
    .when('trainingStatus', {
      is: (status: TrainingStatus) => status === 'JOINED' || status === 'COMPLETED',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING.START_DATE_REQUIRED)
        .test('is-valid-date', TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING.START_DATE_INVALID, (value) => isValidDate(value))
        .test('not-too-future', TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING.START_DATE_FUTURE, (value) => {
          if (!value) return true;
          return isFutureDate(value, 12);
        }),
      otherwise: (schema) => schema.nullable(),
    }),
  
  trainingNotes: Yup.string()
    .nullable()
    .max(2000, TEACHER_JOURNEY_ERROR_MESSAGES.TRAINING.NOTES_MAX_LENGTH),
});

// Certification Section Validation Schema
export const certificationSectionValidation = Yup.object().shape({
  certificationStatus: Yup.string()
    .required(TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.STATUS_REQUIRED)
    .oneOf(['PENDING', 'CLEARED', 'NOT_CLEARED'], TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.STATUS_INVALID),
  
  certificationDate: Yup.string()
    .nullable()
    .when('certificationStatus', {
      is: (status: CertificationStatus) => status === 'CLEARED' || status === 'NOT_CLEARED',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.DATE_REQUIRED)
        .test('is-valid-date', TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.DATE_INVALID, (value) => isValidDate(value))
        .test('not-future', TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.DATE_FUTURE, (value) => {
          if (!value) return true;
          const date = new Date(value);
          return date <= new Date();
        }),
      otherwise: (schema) => schema.nullable(),
    }),
  
  certificationFeedback: Yup.string()
    .nullable()
    .when('certificationStatus', {
      is: 'NOT_CLEARED',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.FEEDBACK_REQUIRED)
        .min(10, TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.FEEDBACK_MIN_LENGTH)
        .max(2000, TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.FEEDBACK_MAX_LENGTH),
      otherwise: (schema) => schema
        .nullable()
        .max(2000, TEACHER_JOURNEY_ERROR_MESSAGES.CERTIFICATION.FEEDBACK_MAX_LENGTH),
    }),
});

// Go-Live Section Validation Schema
export const goLiveSectionValidation = Yup.object().shape({
  goLiveReadiness: Yup.string()
    .required(TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.READINESS_REQUIRED)
    .oneOf(['PENDING', 'YES', 'NEEDS_MORE_TRAINING'], TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.READINESS_INVALID),
  
  goLiveDate: Yup.string()
    .nullable()
    .when('goLiveReadiness', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.DATE_REQUIRED)
        .test('is-valid-date', TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.DATE_INVALID, (value) => isValidDate(value))
        .test('not-too-future', TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.DATE_FUTURE, (value) => {
          if (!value) return true;
          return isFutureDate(value, 3);
        }),
      otherwise: (schema) => schema.nullable(),
    }),
  
  assignedSubject: Yup.string()
    .nullable()
    .when('goLiveReadiness', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.SUBJECT_REQUIRED)
        .oneOf(['LITTLE_YOGI', 'UNBOX_7_PLUS', 'PHONICS', 'ALPHA_MATH'], 
          TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.SUBJECT_INVALID),
      otherwise: (schema) => schema.nullable(),
    }),
});

// Onboarding Section Validation Schema
export const onboardingSectionValidation = Yup.object().shape({
  onboardingEmailSent: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.EMAIL_SENT_INVALID),
  
  hireCallMade: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.HIRE_CALL_INVALID),
  
  joinedWhatsAppGroup: Yup.string()
    .nullable()
    .oneOf(['DEMO', 'PAID', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.WHATSAPP_GROUP_INVALID),
  
  rejectComments: Yup.string()
    .nullable()
    .when('rejectEmailSent', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.REJECT_COMMENTS_REQUIRED)
        .min(10, TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.REJECT_COMMENTS_MIN_LENGTH)
        .max(1000, TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.REJECT_COMMENTS_MAX_LENGTH),
      otherwise: (schema) => schema
        .nullable()
        .max(1000, TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.REJECT_COMMENTS_MAX_LENGTH),
    }),
  
  rejectEmailSent: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], 'Invalid reject email status'),
  
  internalComments: Yup.string()
    .nullable()
    .max(2000, TEACHER_JOURNEY_ERROR_MESSAGES.ONBOARDING.INTERNAL_COMMENTS_MAX_LENGTH),
});

// Combined validation schema for all sections
export const teacherJourneyValidation = {
  demo: demoSectionValidation,
  induction: inductionSectionValidation,
  training: trainingSectionValidation,
  certification: certificationSectionValidation,
  goLive: goLiveSectionValidation,
  onboarding: onboardingSectionValidation,
};

// Helper function to validate a specific section
export const validateTeacherJourneySection = async (
  section: 'demo' | 'induction' | 'training' | 'certification' | 'goLive' | 'onboarding',
  data: Record<string, unknown>
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    const schema = teacherJourneyValidation[section];
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

