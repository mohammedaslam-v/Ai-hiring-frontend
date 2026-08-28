// Onboarding module - option lists and upload limits.
//
// The upload limits mirror the backend (multer) exactly, so a file rejected
// here would have been rejected there too.

import { OnboardingChoiceOption } from './onboarding.types';

/** Courses a candidate can be hired to teach - same list as the application form. */
export const ONBOARDING_COURSES = [
  'English',
  'Phonics',
  'Maths',
  'Bhagavad Gita',
  'Science',
  'Sanatan Unbox',
  'Kannada',
  'Chess',
];

/**
 * Teaching windows of 5 hours each - the minimum an educator must be available
 * per day. The educator picks exactly one. A day does not divide evenly into
 * 5-hour windows, so the last one overlaps the previous by an hour.
 */
export const ONBOARDING_TIME_SLOTS = [
  'Late Night (12AM-5AM)',
  'Early Morning (5AM-10AM)',
  'Morning (10AM-3PM)',
  'Evening (3PM-8PM)',
  'Night (7PM-12AM)',
];

/** Weekly break - value is what the backend stores, label is what the candidate sees. */
export const WEEK_DAYS: OnboardingChoiceOption[] = [
  { value: 'MONDAY', label: 'Monday' },
  { value: 'TUESDAY', label: 'Tuesday' },
  { value: 'WEDNESDAY', label: 'Wednesday' },
  { value: 'THURSDAY', label: 'Thursday' },
  { value: 'FRIDAY', label: 'Friday' },
  { value: 'SATURDAY', label: 'Saturday' },
  { value: 'SUNDAY', label: 'Sunday' },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/** How the candidate reached Bambinos.live. */
export const APPLICATION_SOURCES = [
  'Bambinos Website',
  'LinkedIn',
  'Naukri',
  'Indeed',
  'WhatsApp',
  'Referral by a friend',
  'Facebook / Instagram',
  'Job Fair / Walk-in',
  'Other',
];

// --- Two-way choices -------------------------------------------------------

export const YES_NO_CHOICES: OnboardingChoiceOption[] = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
];

export const RAM_CHOICES: OnboardingChoiceOption[] = [
  { value: 'YES', label: 'Yes, 8GB or more' },
  { value: 'WILL_UPGRADE', label: 'No, I will upgrade in 2 days' },
];

export const CAMERA_CHOICES: OnboardingChoiceOption[] = [
  { value: 'YES', label: 'Yes, quality is good' },
  { value: 'WILL_BUY_WEBCAM', label: 'No, I will buy a webcam' },
];

export const INTERNET_CHOICES: OnboardingChoiceOption[] = [
  { value: 'YES', label: 'Yes, 100 Mbps or more' },
  { value: 'WILL_UPGRADE', label: 'No, I will upgrade my plan' },
];

// --- Upload limits (must match the backend's multer configuration) ----------

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

/** `accept` attribute for the file inputs. */
export const ACCEPTED_FILE_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.webp';
