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
  
  // Extended Demo Evaluation
  overallTeachingStyle: Yup.string()
    .nullable()
    .when('demoStatus', {
      is: (status: DemoStatus) => status === 'SELECTED' || status === 'NOT_SELECTED',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.DEMO_EVALUATION.OVERALL_STYLE_REQUIRED)
        .oneOf(['BAD', 'AVERAGE', 'GOOD', 'EXCELLENT'], TEACHER_JOURNEY_ERROR_MESSAGES.DEMO_EVALUATION.OVERALL_STYLE_INVALID),
      otherwise: (schema) => schema.nullable(),
    }),
  
  demoConducted: Yup.string()
    .nullable()
    .oneOf(['YES', 'NO'], TEACHER_JOURNEY_ERROR_MESSAGES.DEMO_EVALUATION.DEMO_CONDUCTED_REQUIRED),
  
  // Subjects - Always Required
  subjectsPrograms: Yup.array()
    .of(Yup.string())
    .required(TEACHER_JOURNEY_ERROR_MESSAGES.SUBJECTS.REQUIRED)
    .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.SUBJECTS.MIN_SELECTION)
    .max(4, TEACHER_JOURNEY_ERROR_MESSAGES.SUBJECTS.MAX_SELECTION)
    .test('valid-subjects', TEACHER_JOURNEY_ERROR_MESSAGES.SUBJECTS.INVALID_SUBJECT, (value) => {
      if (!value || value.length === 0) return false;
      const validSubjects = ['Unbox English', 'Little Yogi', 'Alpha Maths', 'Phonics'];
      return value.every(subj => validSubjects.includes(subj));
    }),
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
  
  assignedSubject: Yup.array()
    .of(Yup.string())
    .nullable()
    .when('goLiveReadiness', {
      is: 'YES',
      then: (schema) => schema
        .required(TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.SUBJECT_REQUIRED)
        .min(1, TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.SUBJECT_REQUIRED)
        .test('valid-subjects', TEACHER_JOURNEY_ERROR_MESSAGES.GO_LIVE.SUBJECT_INVALID, (value) => {
          if (!value) return true;
          const validSubjects = ['LITTLE_YOGI', 'UNBOX_7_PLUS', 'PHONICS', 'ALPHA_MATH'];
          return value.every(subj => validSubjects.includes(subj));
        }),
      otherwise: (schema) => schema.nullable(),
    }),
});

// Combined validation schema for all sections
export const teacherJourneyValidation = {
  demo: demoSectionValidation,
  induction: inductionSectionValidation,
  training: trainingSectionValidation,
  certification: certificationSectionValidation,
  goLive: goLiveSectionValidation,
};

// Helper function to validate a specific section
export const validateTeacherJourneySection = async (
  section: 'demo' | 'induction' | 'training' | 'certification' | 'goLive',
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





