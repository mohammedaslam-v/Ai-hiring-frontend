// Onboarding module - types shared by the page, its sections and the service.
//
// The field names below are IDENTICAL to the ones the backend expects
// (POST /api/onboarding/submit). Keeping them in sync means there is no
// mapping layer between the form and the API, so nothing can drift.

import { FormikProps } from 'formik';

/** Every value the onboarding form holds. */
export interface OnboardingFormValues {
  // --- Personal details (as per Bank and PAN) ---
  firstName: string;
  lastName: string;
  panNumber: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;          // yyyy-mm-dd, from a native date input
  bloodGroup: string;
  city: string;
  linkedinProfile: string;      // optional

  // --- Course, availability and languages ---
  courseProgram: string;
  crossTrainingWilling: string; // YES | NO
  applicationSource: string;
  availableSlots: string[];     // minimum 5 hours per day
  weeklyBreak: string;          // MONDAY .. SUNDAY
  language1: string;
  language2: string;            // optional
  language3: string;            // optional

  // --- Profile ---
  bio: string;

  // --- Alternate contact ---
  altContactNumber: string;
  altContactName: string;
  altContactRelation: string;

  // --- Tech setup ---
  hasEightGbRam: string;        // YES | WILL_UPGRADE
  cameraQualityOk: string;      // YES | WILL_BUY_WEBCAM
  hasHighSpeedInternet: string; // YES | WILL_UPGRADE
  lightingAdequate: string;     // YES | NO
  attireWilling: string;        // YES | NO

  // --- Bank and KYC ---
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranch: string;
  ifscCode: string;

  // --- Documents ---
  resume: File | null;
  addressProof: File | null;
  panCard: File | null;
  aadhaarCard: File | null;
  relievingLetter: File | null; // optional
  payslip: File | null;         // optional
  ramScreenshot: File | null;
  speedScreenshot: File | null;
}

/** Formik instance for this form, passed down to every section. */
export type OnboardingFormik = FormikProps<OnboardingFormValues>;

/** Names of the plain-text fields - used to keep field components type-safe. */
export type OnboardingTextKey = {
  [K in keyof OnboardingFormValues]: OnboardingFormValues[K] extends string ? K : never;
}[keyof OnboardingFormValues];

/** Names of the document fields. */
export type OnboardingFileKey = {
  [K in keyof OnboardingFormValues]: OnboardingFormValues[K] extends File | null ? K : never;
}[keyof OnboardingFormValues];

/** Props every section of the form receives. */
export interface OnboardingSectionProps {
  formik: OnboardingFormik;
}

/** Sections that also attach documents. */
export interface OnboardingUploadSectionProps extends OnboardingSectionProps {
  onFileChange: (fieldName: OnboardingFileKey, file: File | null) => void;
}

/** One option in a choice or dropdown. */
export interface OnboardingChoiceOption {
  value: string;
  label: string;
}

/** Data returned by the API after a successful submission. */
export interface OnboardingSubmissionData {
  id: string;
  applicationId: string | null;
  submittedAt: string;
  message: string;
}

// --- Admin views -----------------------------------------------------------

/** Query options for the admin submissions list. */
export interface OnboardingListFilters {
  page: number;
  limit: number;
  search: string;
}

/** One row of the admin table. The API deliberately omits KYC/bank fields here. */
export interface OnboardingListItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  courseProgram: string;
  applicationId: string | null;
  submittedAt: string;
}

export interface OnboardingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface OnboardingListResponse {
  submissions: OnboardingListItem[];
  pagination: OnboardingPagination;
}

/** A document plus a link that expires a few minutes after it is issued. */
export interface OnboardingDocumentLink {
  key: string;
  label: string;
  /** null when the document was optional and never attached. */
  url: string | null;
}

/** Everything one candidate submitted, as returned by the detail endpoint. */
export interface OnboardingSubmissionDetail {
  id: number;
  applicationId: string | null;

  firstName: string;
  lastName: string;
  panNumber: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  city: string;
  linkedinProfile: string | null;

  courseProgram: string;
  crossTrainingWilling: string;
  applicationSource: string;
  availableSlots: string[];
  weeklyBreak: string;
  language1: string;
  language2: string | null;
  language3: string | null;

  bio: string;

  altContactNumber: string;
  altContactName: string;
  altContactRelation: string;

  hasEightGbRam: string;
  cameraQualityOk: string;
  hasHighSpeedInternet: string;
  lightingAdequate: string;
  attireWilling: string;

  aadhaarNumber: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranch: string;
  ifscCode: string;

  documents: OnboardingDocumentLink[];
  createdAt: string;
}
