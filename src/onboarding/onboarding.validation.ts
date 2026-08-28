// Onboarding module - validation schema.
//
// Every rule here mirrors the backend's express-validator chain, so a form that
// passes in the browser also passes on the server. When you change one, change
// the other (Ai-Hiring-backend/src/onboarding/onboarding.validation.ts).

import * as Yup from 'yup';
import {
  ACCEPTED_FILE_TYPES,
  BLOOD_GROUPS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  WEEK_DAYS,
} from './onboarding.constants';
import { OnboardingFormValues } from './onboarding.types';

const NAME_PATTERN = /^[a-zA-Z\s]+$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const AADHAAR_PATTERN = /^\d{12}$/;
const ACCOUNT_PATTERN = /^\d{9,18}$/;
/** Indian mobile number, with or without the +91 country code. */
const PHONE_PATTERN = /^(\+91)?[6-9]\d{9}$/;

/** Last 10 digits of a number, so "+919..." and "9..." compare as equal. */
const toComparablePhone = (value?: string): string =>
  (value || '').replace(/\D/g, '').slice(-10);

/** Whole years between a date of birth and today. */
const yearsSince = (isoDate: string): number => {
  const dob = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

/** Shared size/type rules for an uploaded document. */
const documentSchema = (label: string) =>
  Yup.mixed<File>()
    .test(
      'fileSize',
      `${label} must be ${MAX_FILE_SIZE_MB}MB or smaller`,
      (file) => !file || file.size <= MAX_FILE_SIZE_BYTES
    )
    .test(
      'fileType',
      `${label} must be a PDF, JPG, PNG or WEBP file`,
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type)
    );

export const onboardingValidation = Yup.object().shape({
  // ---------------------------------------------------------------- Personal
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(NAME_PATTERN, 'First name can only contain letters and spaces'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(NAME_PATTERN, 'Last name can only contain letters and spaces'),
  panNumber: Yup.string()
    .required('PAN number is required')
    .matches(PAN_PATTERN, 'PAN must be in the format AAAAA9999A'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  phoneNumber: Yup.string()
    .required('Contact number is required')
    .matches(PHONE_PATTERN, 'Enter a valid 10-digit mobile number'),
  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .test('validDate', 'Enter a valid date of birth', (value) =>
      !!value && !Number.isNaN(new Date(value).getTime())
    )
    .test('age', 'You must be between 18 and 100 years old', (value) => {
      if (!value) return false;
      const age = yearsSince(value);
      return age >= 18 && age <= 100;
    }),
  bloodGroup: Yup.string()
    .required('Blood group is required')
    .oneOf(BLOOD_GROUPS, 'Select a valid blood group'),
  city: Yup.string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must not exceed 50 characters'),
  linkedinProfile: Yup.string()
    .max(255, 'LinkedIn profile must not exceed 255 characters')
    .test('validUrl', 'Enter a valid URL (including https://)', (value) => {
      if (!value) return true; // optional field
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),

  // ------------------------------------------------- Course and availability
  courseProgram: Yup.string().required('Please select the course you want to teach'),
  crossTrainingWilling: Yup.string().required('Please answer the cross-training question'),
  applicationSource: Yup.string().required('Please tell us how you applied'),
  // One 5-hour window, kept as a single-item list so the database column keeps
  // its JSON shape (and could hold more than one again later).
  availableSlots: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Please select your available slot')
    .required('Please select your available slot'),
  weeklyBreak: Yup.string()
    .required('Please choose your weekly break')
    .oneOf(WEEK_DAYS.map((day) => day.value), 'Select a valid day'),
  language1: Yup.string()
    .required('Language 1 is required')
    .max(50, 'Language must not exceed 50 characters'),
  language2: Yup.string().max(50, 'Language must not exceed 50 characters'),
  language3: Yup.string().max(50, 'Language must not exceed 50 characters'),

  // -------------------------------------------------------------------- Bio
  bio: Yup.string()
    .required('Bio is required')
    .min(50, 'Bio must be at least 50 characters (3-4 lines)')
    .max(2000, 'Bio must not exceed 2000 characters'),

  // ------------------------------------------------------- Alternate contact
  altContactNumber: Yup.string()
    .required('Alternate contact number is required')
    .matches(PHONE_PATTERN, 'Enter a valid 10-digit mobile number')
    .test(
      'different',
      'Alternate number must be different from your contact number',
      function (value) {
        const { phoneNumber } = this.parent as OnboardingFormValues;
        if (!value || !phoneNumber) return true; // other rules report the missing value
        return toComparablePhone(value) !== toComparablePhone(phoneNumber);
      }
    ),
  altContactName: Yup.string()
    .required("Alternate contact's name is required")
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  altContactRelation: Yup.string()
    .required('Relationship is required')
    .min(2, 'Relationship must be at least 2 characters')
    .max(50, 'Relationship must not exceed 50 characters'),

  // ------------------------------------------------------------- Tech setup
  hasEightGbRam: Yup.string().required('Please answer the RAM question'),
  cameraQualityOk: Yup.string().required('Please answer the camera question'),
  hasHighSpeedInternet: Yup.string().required('Please answer the internet question'),
  lightingAdequate: Yup.string().required('Please answer the lighting question'),
  attireWilling: Yup.string().required('Please answer the dress code question'),

  // ----------------------------------------------------------- Bank and KYC
  aadhaarNumber: Yup.string()
    .required('Aadhaar number is required')
    .matches(AADHAAR_PATTERN, 'Aadhaar number must be exactly 12 digits'),
  bankAccountNumber: Yup.string()
    .required('Bank account number is required')
    .matches(ACCOUNT_PATTERN, 'Account number must be between 9 and 18 digits'),
  bankName: Yup.string()
    .required('Bank name is required')
    .min(2, 'Bank name must be at least 2 characters')
    .max(100, 'Bank name must not exceed 100 characters'),
  bankBranch: Yup.string()
    .required('Bank branch is required')
    .min(2, 'Branch must be at least 2 characters')
    .max(100, 'Branch must not exceed 100 characters'),
  ifscCode: Yup.string()
    .required('IFSC code is required')
    .matches(IFSC_PATTERN, 'IFSC code must be in the format AAAA0XXXXXX'),

  // -------------------------------------------------------------- Documents
  resume: documentSchema('Resume').required('Please attach your resume'),
  addressProof: documentSchema('Address proof').required('Please attach your address proof'),
  panCard: documentSchema('PAN card').required('Please attach a copy of your PAN card'),
  aadhaarCard: documentSchema('Aadhaar card').required('Please attach a copy of your Aadhaar card'),
  relievingLetter: documentSchema('Relieving letter').nullable(),
  payslip: documentSchema('Payslip').nullable(),
  ramScreenshot: documentSchema('RAM screenshot').required('Please attach the System Information screenshot'),
  speedScreenshot: documentSchema('Speed test screenshot').required('Please attach your internet speed screenshot'),
});
