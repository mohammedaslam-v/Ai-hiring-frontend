// Types for Teacher Journey Tracking

export interface TeacherJourney {
  id: number;
  candidateId: number;
  applicationId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;

  demoStatus: DemoStatus;
  demoDate: string | null;
  demoFeedback: string | null;
  demoInterviewerName: string | null;

  inductionAttendance: InductionStatus;
  inductionDate: string | null;

  trainingStatus: TrainingStatus;
  trainingStartDate: string | null;
  trainingNotes: string | null;

  certificationStatus: CertificationStatus;
  certificationDate: string | null;
  certificationFeedback: string | null;
  certificationTrainingCount: number | null;
  demoTrainerIds: number[] | null;
  certificationTsmId: number | null;

  goLiveReadiness: GoLiveStatus;
  goLiveDate: string | null;

  assignedSubject: Subject[] | null;
  readyForPaidClass?: ReadyForPaidClassStatus;

  // Paid Journey
  paidTrainingStatus?: PaidTrainingStatus;
  paidTrainingStartDate?: string;
  paidTrainingNotes?: string;
  paidDemoTrainerIds?: number[] | null;
  paidCertificationStatus?: PaidCertificationStatus;
  paidCertificationDate?: string;
  paidCertificationFeedback?: string;
  paidCertificationTsmId?: number | null;
  paidGoLiveReadiness?: PaidGoLiveStatus;
  paidGoLiveDate?: string;
  paidAssignedSubject?: Subject[] | null;

  // Extended Demo Evaluation
  overallTeachingStyle: TeachingStyleRating | null;
  demoConducted: YesNo | null;
  demoPaidStatus: DemoPaidType | null;
  isRehire: YesNo | null;

  // Language & Subject Info
  subjectsPrograms: string[] | null;

  // Internal Hiring Status
  onboardingEmailSent: YesNo | null;
  hireCallMade: YesNo | null;
  joinedWhatsAppGroup: WhatsAppGroupStatus | null;
  rejectComments: string | null;
  rejectEmailSent: YesNo | null;

  // Demo Email Tracking
  demoEmailSent: YesNo | null;
  demoEmailSentAt: string | null;
  demoEmailType: string | null; // 'SELECTED' | 'NOT_SELECTED'
  demoEmailSentCount: number;
  demoEmailSentBy: string | null;

  internalComments: string | null;

  // Cross Training (repeatable entries)
  crossTrainings?: CrossTrainingEntry[];

  // Exit Form (all values typed in manually — nothing is pre-filled from the candidate)
  exitTsmLeadName?: string | null;
  exitTeacherName?: string | null;
  exitTeacherContact?: string | null;
  exitTeacherEmail?: string | null;
  exitResignationDate?: string | null;
  exitResignationTicketId?: string | null;
  exitResignationReason?: string | null;
  exitServingNoticePeriod?: YesNo | null;
  exitNoticePeriodReason?: string | null;
  exitPerformance?: ExitPerformance | null;
  exitLossToCompany?: YesNo | null;
  exitRehire?: YesNo | null;
  exitHrNotes?: string | null;
  exitManagementNotes?: string | null;

  createdAt: string;
  updatedAt: string;
}

export type CrossTrainingStatus = 'PENDING' | 'CERTIFIED' | 'CLEARED' | 'NOT_CLEARED' | 'RE_TRAINING' | 'ABSENT';
export type CrossTrainingType = 'PAID_TRAINING' | 'DEMO_TRAINING';

// One repeatable Cross Training entry. `id` is present for saved rows,
// absent for newly-added (unsaved) ones.
export interface CrossTrainingEntry {
  id?: number;
  trainingType: CrossTrainingType | null;
  trainingDate: string | null;
  subject: string | null;
  certifiedTsmId: number | null;
  certificationDate: string | null;
  feedback: string | null;
  trainerFeedback: string | null;
  trainerId: number | null;
  status: CrossTrainingStatus;
}

export type DemoStatus = 'PENDING' | 'SCHEDULED' | 'SELECTED' | 'NOT_SELECTED' | 'HOLD' | 'NOT_INTERESTED';
export type InductionStatus = 'PENDING' | 'YES' | 'NO' | 'NOT_INTERESTED';
export type TrainingStatus = 'NOT_JOINED' | 'JOINED' | 'INCOMPLETE' | 'SHIFTED_TO_NEXT_WEEK' | 'DROPPED' | 'COMPLETED' | 'REJECTED_IN_TRAINING' | 'NOT_INTERESTED';
export type CertificationStatus = 'PENDING' | 'CLEARED' | 'NOT_CLEARED' | 'DEMO_ONLY' | 'DEMO_SALES' | 'NEED_MORE_TRAINING' | 'SECOND_MOCK_REQUIRED' | 'CALIBRATION_REQUIRED' | 'JOINING_FORM_SENT' | 'OFFER_LETTER_SENT_PORTAL_CREATED' | 'CHESS_OFFER_LETTER_SENT_PORTAL_CREATED' | 'PORTAL_HW_SUBMITTED' | 'NOT_INTERESTED';
export type GoLiveStatus = 'PENDING' | 'YES' | 'NEEDS_MORE_TRAINING' | 'NOT_INTERESTED';
export type ReadyForPaidClassStatus = 'PENDING' | 'YES' | 'NO';
export type PaidTrainingStatus = TrainingStatus;
export type PaidCertificationStatus = CertificationStatus;
export type PaidGoLiveStatus = GoLiveStatus;
export type Subject = 'LITTLE_YOGI' | 'UNBOX_7_PLUS' | 'UNBOX_SCIENCE' | 'PHONICS' | 'ALPHA_MATH' | 'ARTIFICIAL_INTELLIGENCE' | 'CHESS' | 'UNBOX_KANNADA' | 'UNBOX_CHESS' | 'UNBOX_AI';

// New types for extended fields
export type TeachingStyleRating = 'BAD' | 'AVERAGE' | 'GOOD' | 'EXCELLENT';
export type YesNo = 'YES' | 'NO';
export type DemoPaidType = 'DEMO' | 'PAID' | 'NA';
export type ExitPerformance = 'EXCEEDED_EXPECTATIONS' | 'MET_EXPECTATIONS' | 'DID_NOT_MEET_EXPECTATIONS';
export type TimeSlot = 'MORNING_6AM' | 'AFTERNOON_12PM' | 'EVENING_6PM' | 'NIGHT_10PM' | 'FLEXIBLE';
export type EmploymentType = 'PART_TIME' | 'FULL_TIME';
export type TrainingBatch = '11AM' | '4PM';
export type WhatsAppGroupStatus = 'DEMO' | 'PAID' | 'NO';

export interface TeacherJourneyFilters {
  search?: string;
  demoStatus?: string;
  onboardingEmailSent?: string;
  inductionAttendance?: string;
  trainingStatus?: string;
  certificationStatus?: string;
  goLiveReadiness?: string;
  assignedSubject?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'createdAt' | 'name' | 'email' | 'demoStatus' | 'trainingStatus' | 'certificationStatus' | 'goLiveReadiness';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TeacherJourneyStats {
  total: number;

  demoStats: {
    pending: number;
    scheduled: number;
    selected: number;
    notSelected: number;
    hold: number;
  };

  inductionStats: {
    pending: number;
    yes: number;
    no: number;
  };

  trainingStats: {
    notJoined: number;
    joined: number;
    incomplete: number;
    shiftedToNextWeek: number;
    dropped: number;
    completed: number;
  };

  certificationStats: {
    pending: number;
    cleared: number;
    notCleared: number;
  };

  goLiveStats: {
    pending: number;
    yes: number;
    needsMoreTraining: number;
  };

  subjectStats: {
    littleYogi: number;
    unbox7Plus: number;
    unboxScience: number;
    phonics: number;
    alphaMath: number;
    artificialIntelligence: number;
    chess: number;
    unboxKannada: number;
    unboxChess: number;
    unboxAi: number;
    unassigned: number;
  };
}

export interface SubmitDemoFeedbackData {
  applicationId: string;
  demoStatus: 'SELECTED' | 'NOT_SELECTED';
  demoDate: string;
  demoInterviewerName: string;
  demoFeedback?: string;
}

export interface UpdateTeacherJourneyData {
  demoStatus?: DemoStatus;
  demoDate?: string;
  demoFeedback?: string;
  demoInterviewerName?: string;
  inductionAttendance?: InductionStatus;
  inductionDate?: string;
  trainingStatus?: TrainingStatus;
  trainingStartDate?: string;
  trainingNotes?: string;
  certificationStatus?: CertificationStatus;
  certificationDate?: string;
  certificationFeedback?: string;
  certificationTrainingCount?: number;
  certificationTsmId?: number | null;
  goLiveReadiness?: GoLiveStatus;
  goLiveDate?: string;
  assignedSubject?: Subject[] | null;
  readyForPaidClass?: ReadyForPaidClassStatus;

  // Paid Journey
  paidTrainingStatus?: PaidTrainingStatus;
  paidTrainingStartDate?: string;
  paidTrainingNotes?: string;
  paidCertificationStatus?: PaidCertificationStatus;
  paidCertificationDate?: string;
  paidCertificationFeedback?: string;
  paidCertificationTsmId?: number | null;
  paidGoLiveReadiness?: PaidGoLiveStatus;
  paidGoLiveDate?: string;
  paidAssignedSubject?: Subject[] | null;

  // Extended Demo Evaluation
  overallTeachingStyle?: TeachingStyleRating;
  demoConducted?: YesNo;
  demoPaidStatus?: DemoPaidType;
  isRehire?: YesNo;

  // Language & Subject Info
  subjectsPrograms?: string[];

  // Internal Hiring Status
  onboardingEmailSent?: YesNo;
  hireCallMade?: YesNo;
  joinedWhatsAppGroup?: WhatsAppGroupStatus;
  rejectComments?: string;
  rejectEmailSent?: YesNo;
  internalComments?: string;

  // Cross Training (full desired set of entries; backend syncs to this)
  crossTrainings?: CrossTrainingEntry[];

  // Exit Form
  exitTsmLeadName?: string | null;
  exitTeacherName?: string | null;
  exitTeacherContact?: string | null;
  exitTeacherEmail?: string | null;
  exitResignationDate?: string | null;
  exitResignationTicketId?: string | null;
  exitResignationReason?: string | null;
  exitServingNoticePeriod?: YesNo | null;
  exitNoticePeriodReason?: string | null;
  exitPerformance?: ExitPerformance | null;
  exitLossToCompany?: YesNo | null;
  exitRehire?: YesNo | null;
  exitHrNotes?: string | null;
  exitManagementNotes?: string | null;
}

// Constants for dropdown options
export const DEMO_STATUS_OPTIONS = [
  { value: 'all', label: 'All Demo Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'NOT_SELECTED', label: 'Not Selected' },
  { value: 'HOLD', label: 'Hold' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' }
];

export const INDUCTION_OPTIONS = [
  { value: 'all', label: 'All Induction' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' }
];

export const TRAINING_STATUS_OPTIONS = [
  { value: 'all', label: 'All Training Status' },
  { value: 'NOT_JOINED', label: 'Not Joined' },
  { value: 'JOINED', label: 'Joined' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
  { value: 'SHIFTED_TO_NEXT_WEEK', label: 'Shifted to Next Week' },
  { value: 'DROPPED', label: 'Dropped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED_IN_TRAINING', label: 'Rejected in Training' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' }
];

export const CERTIFICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'All Certification' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CLEARED', label: 'Demo + Paid' },
  { value: 'NOT_CLEARED', label: 'Not Cleared' },
  { value: 'DEMO_ONLY', label: 'Demo Only' },
  { value: 'DEMO_SALES', label: 'Demo + Sales' },
  { value: 'NEED_MORE_TRAINING', label: 'Need More Training' },
  { value: 'SECOND_MOCK_REQUIRED', label: 'Second Mock Required' },
  { value: 'JOINING_FORM_SENT', label: 'Joining Form Sent' },
  { value: 'OFFER_LETTER_SENT_PORTAL_CREATED', label: 'Offer Letter Sent / Portal Created' },
  { value: 'PORTAL_HW_SUBMITTED', label: 'Portal HW Submitted' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' }
];

// Demo Certification update dropdown options. This list intentionally diverges
// from CERTIFICATION_STATUS_OPTIONS: it drops the post-clearance statuses
// (Joining Form Sent, Offer Letter Sent / Portal Created, Portal HW Submitted)
// and adds the Demo-only "Calibration Required" status after "Second Mock Required".
// The full CERTIFICATION_STATUS_OPTIONS list above is still used by the Paid
// Certification dropdown and the certification filters.
export const DEMO_CERTIFICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'All Certification' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CLEARED', label: 'Demo + Paid' },
  { value: 'NOT_CLEARED', label: 'Not Cleared' },
  { value: 'DEMO_ONLY', label: 'Demo Only' },
  { value: 'DEMO_SALES', label: 'Demo + Sales' },
  { value: 'NEED_MORE_TRAINING', label: 'Need More Training' },
  { value: 'SECOND_MOCK_REQUIRED', label: 'Second Mock Required' },
  { value: 'CALIBRATION_REQUIRED', label: 'Calibration Required' },
  { value: 'OFFER_LETTER_SENT_PORTAL_CREATED', label: 'Offer Letter Sent / Portal Created' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' }
];

// Paid Certification update dropdown options. Like the Demo list it adds
// "Calibration Required" after "Second Mock Required" and hides "Joining Form
// Sent" and "Portal HW Submitted" — but unlike Demo it KEEPS "Offer Letter Sent
// / Portal Created". The full CERTIFICATION_STATUS_OPTIONS list above is still
// used by the certification filters.
export const PAID_CERTIFICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'All Certification' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CLEARED', label: 'Cleared' },
  { value: 'NOT_CLEARED', label: 'Not Cleared' },
  { value: 'DEMO_ONLY', label: 'Demo Only' },
  { value: 'DEMO_SALES', label: 'Demo + Sales' },
  { value: 'NEED_MORE_TRAINING', label: 'Need More Training' },
  { value: 'SECOND_MOCK_REQUIRED', label: 'Second Mock Required' },
  { value: 'CALIBRATION_REQUIRED', label: 'Calibration Required' },
  { value: 'OFFER_LETTER_SENT_PORTAL_CREATED', label: 'Offer Letter Sent / Portal Created' },
  { value: 'CHESS_OFFER_LETTER_SENT_PORTAL_CREATED', label: 'Chess Offer Letter Sent / Portal Created' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' }
];

export const GO_LIVE_OPTIONS = [
  { value: 'all', label: 'All Go-Live Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'YES', label: 'Yes' },
  { value: 'NEEDS_MORE_TRAINING', label: 'Needs More Training' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' }
];

// Exit filter options for the Applications list. "Exited" means the Exit Form
// has a resignation date recorded (same rule the journey step tracker uses).
export const EXIT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Exit Status' },
  { value: 'exited', label: 'Exited' },
  { value: 'not_exited', label: 'Not Exited' }
];

export const READY_FOR_PAID_CLASS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

export const CROSS_TRAINING_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CLEARED', label: 'Cleared' },
  { value: 'NOT_CLEARED', label: 'Not Cleared' },
  { value: 'RE_TRAINING', label: 'Re-training' },
  { value: 'ABSENT', label: 'Absent' }
];

export const CROSS_TRAINING_TYPE_OPTIONS = [
  { value: 'PAID_TRAINING', label: 'Paid Training' },
  { value: 'DEMO_TRAINING', label: 'Demo Training' }
];

// Exit Form options — mirror the "Exit Form" Google Form exactly.
// TSM Lead is a fixed list on the form; add a name here when the form's list changes.
export const EXIT_TSM_LEAD_OPTIONS = [
  { value: 'Kanishka', label: 'Kanishka' },
  { value: 'Mriduta', label: 'Mriduta' },
  { value: 'Swagata', label: 'Swagata' }
];

export const EXIT_PERFORMANCE_OPTIONS = [
  { value: 'EXCEEDED_EXPECTATIONS', label: 'Exceeded Expectations' },
  { value: 'MET_EXPECTATIONS', label: 'Met Expectations' },
  { value: 'DID_NOT_MEET_EXPECTATIONS', label: 'Did Not Meet Expectations' }
];

export const EXIT_YES_NO_OPTIONS = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

export const CERTIFICATION_TRAINING_COUNT_OPTIONS = [
  { value: 1, label: '1 Lesson' },
  { value: 2, label: '2 Lessons' },
  { value: 3, label: '3 Lessons' },
  { value: 4, label: '4 Lessons' },
  { value: 5, label: '5 Lessons' },
  { value: 6, label: '6 Lessons' },
  { value: 7, label: '7 Lessons' },
  { value: 8, label: '8 Lessons' },
  { value: 9, label: '9 Lessons' },
  { value: 10, label: '10 Lessons' },
];

export const ONBOARDING_OPTIONS = [
  { value: 'all', label: 'All Onboarding' },
  { value: 'YES', label: 'Email Sent' },
  { value: 'NO', label: 'Email Not Sent' }
];

export const SUBJECT_OPTIONS = [
  { value: 'all', label: 'All Subjects' },
  { value: 'LITTLE_YOGI', label: 'Little Yogi' },
  { value: 'UNBOX_7_PLUS', label: 'Unbox English 7+' },
  { value: 'UNBOX_SCIENCE', label: 'Unbox Science' },
  { value: 'PHONICS', label: 'Phonics' },
  { value: 'ALPHA_MATH', label: 'Alpha Math' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'Artificial Intelligence' },
  { value: 'CHESS', label: 'Chess' },
  { value: 'UNBOX_KANNADA', label: 'Unbox Kannada' },
  { value: 'UNBOX_CHESS', label: 'Unbox Chess' },
  { value: 'UNBOX_AI', label: 'Unbox AI' }
];

export const SUBJECT_OPTIONS_FOR_UPDATE = [
  { value: 'NONE', label: 'Not Assigned' },
  { value: 'LITTLE_YOGI', label: 'Little Yogi' },
  { value: 'UNBOX_7_PLUS', label: 'Unbox English 7+' },
  { value: 'UNBOX_SCIENCE', label: 'Unbox Science' },
  { value: 'PHONICS', label: 'Phonics' },
  { value: 'ALPHA_MATH', label: 'Alpha Math' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'Artificial Intelligence' },
  { value: 'CHESS', label: 'Chess' },
  { value: 'UNBOX_KANNADA', label: 'Unbox Kannada' },
  { value: 'UNBOX_CHESS', label: 'Unbox Chess' },
  { value: 'UNBOX_AI', label: 'Unbox AI' }
];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'demoStatus', label: 'Demo Status' },
  { value: 'trainingStatus', label: 'Training Status' },
  { value: 'certificationStatus', label: 'Certification' },
  { value: 'goLiveReadiness', label: 'Go-Live Status' }
];

// Helper functions for display
export const getDemoStatusLabel = (status: DemoStatus): string => {
  const labels: Record<DemoStatus, string> = {
    'PENDING': 'Pending',
    'SCHEDULED': 'Scheduled',
    'SELECTED': 'Selected',
    'NOT_SELECTED': 'Not Selected',
    'HOLD': 'Hold',
    'NOT_INTERESTED': 'Not Interested'
  };
  return labels[status] || status;
};

export const getInductionLabel = (status: InductionStatus): string => {
  const labels: Record<InductionStatus, string> = {
    'PENDING': 'Pending',
    'YES': 'Yes',
    'NO': 'No',
    'NOT_INTERESTED': 'Not Interested'
  };
  return labels[status] || status;
};

export const getTrainingStatusLabel = (status: TrainingStatus): string => {
  const labels: Record<TrainingStatus, string> = {
    'NOT_JOINED': 'Not Joined',
    'JOINED': 'Joined',
    'INCOMPLETE': 'Incomplete',
    'SHIFTED_TO_NEXT_WEEK': 'Shifted to Next Week',
    'DROPPED': 'Dropped',
    'COMPLETED': 'Completed',
    'REJECTED_IN_TRAINING': 'Rejected in Training',
    'NOT_INTERESTED': 'Not Interested'
  };
  return labels[status] || status;
};

export const getCertificationLabel = (status: CertificationStatus): string => {
  const labels: Record<CertificationStatus, string> = {
    'PENDING': 'Pending',
    'CLEARED': 'Demo + Paid',
    'NOT_CLEARED': 'Not Cleared',
    'DEMO_ONLY': 'Demo Only',
    'DEMO_SALES': 'Demo + Sales',
    'NEED_MORE_TRAINING': 'Need More Training',
    'SECOND_MOCK_REQUIRED': 'Second Mock Required',
    'CALIBRATION_REQUIRED': 'Calibration Required',
    'JOINING_FORM_SENT': 'Joining Form Sent',
    'OFFER_LETTER_SENT_PORTAL_CREATED': 'Offer Letter Sent / Portal Created',
    'CHESS_OFFER_LETTER_SENT_PORTAL_CREATED': 'Chess Offer Letter Sent / Portal Created',
    'PORTAL_HW_SUBMITTED': 'Portal HW Submitted',
    'NOT_INTERESTED': 'Not Interested'
  };
  return labels[status] || status;
};

export const getGoLiveLabel = (status: GoLiveStatus): string => {
  const labels: Record<GoLiveStatus, string> = {
    'PENDING': 'Pending',
    'YES': 'Yes',
    'NEEDS_MORE_TRAINING': 'Needs More Training',
    'NOT_INTERESTED': 'Not Interested'
  };
  return labels[status] || status;
};

export const getReadyForPaidClassLabel = (status: ReadyForPaidClassStatus): string => {
  const labels: Record<ReadyForPaidClassStatus, string> = {
    'PENDING': 'Pending',
    'YES': 'Yes',
    'NO': 'No'
  };
  return labels[status] || status;
};

export const getSubjectLabel = (subject: Subject | Subject[] | null): string => {
  if (!subject) return 'Not Assigned';

  const labels: Record<Subject, string> = {
    'LITTLE_YOGI': 'Little Yogi',
    'UNBOX_7_PLUS': 'Unbox English 7+',
    'UNBOX_SCIENCE': 'Unbox Science',
    'PHONICS': 'Phonics',
    'ALPHA_MATH': 'Alpha Math',
    'ARTIFICIAL_INTELLIGENCE': 'Artificial Intelligence',
    'CHESS': 'Chess',
    'UNBOX_KANNADA': 'Unbox Kannada',
    'UNBOX_CHESS': 'Unbox Chess',
    'UNBOX_AI': 'Unbox AI'
  };

  if (Array.isArray(subject)) {
    if (subject.length === 0) return 'Not Assigned';
    return subject.map(s => labels[s] || s).join(', ');
  }

  return labels[subject] || subject;
};

