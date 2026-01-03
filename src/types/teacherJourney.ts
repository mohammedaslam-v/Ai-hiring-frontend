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
  
  goLiveReadiness: GoLiveStatus;
  goLiveDate: string | null;
  
  assignedSubject: Subject[] | null;
  
  // Extended Demo Evaluation
  overallTeachingStyle: TeachingStyleRating | null;
  demoConducted: YesNo | null;
  demoPaidStatus: DemoPaidType | null;
  
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
  
  createdAt: string;
  updatedAt: string;
}

export type DemoStatus = 'PENDING' | 'SCHEDULED' | 'SELECTED' | 'NOT_SELECTED';
export type InductionStatus = 'PENDING' | 'YES' | 'NO';
export type TrainingStatus = 'NOT_JOINED' | 'JOINED' | 'INCOMPLETE' | 'SHIFTED_TO_NEXT_WEEK' | 'DROPPED' | 'COMPLETED';
export type CertificationStatus = 'PENDING' | 'CLEARED' | 'NOT_CLEARED';
export type GoLiveStatus = 'PENDING' | 'YES' | 'NEEDS_MORE_TRAINING';
export type Subject = 'LITTLE_YOGI' | 'UNBOX_7_PLUS' | 'PHONICS' | 'ALPHA_MATH';

// New types for extended fields
export type TeachingStyleRating = 'BAD' | 'AVERAGE' | 'GOOD' | 'EXCELLENT';
export type YesNo = 'YES' | 'NO';
export type DemoPaidType = 'DEMO' | 'PAID' | 'NA';
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
    phonics: number;
    alphaMath: number;
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
  goLiveReadiness?: GoLiveStatus;
  goLiveDate?: string;
  assignedSubject?: Subject[] | null;
  
  // Extended Demo Evaluation
  overallTeachingStyle?: TeachingStyleRating;
  demoConducted?: YesNo;
  demoPaidStatus?: DemoPaidType;
  
  // Language & Subject Info
  subjectsPrograms?: string[];
  
  // Internal Hiring Status
  onboardingEmailSent?: YesNo;
  hireCallMade?: YesNo;
  joinedWhatsAppGroup?: WhatsAppGroupStatus;
  rejectComments?: string;
  rejectEmailSent?: YesNo;
  internalComments?: string;
}

// Constants for dropdown options
export const DEMO_STATUS_OPTIONS = [
  { value: 'all', label: 'All Demo Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'NOT_SELECTED', label: 'Not Selected' }
];

export const INDUCTION_OPTIONS = [
  { value: 'all', label: 'All Induction' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

export const TRAINING_STATUS_OPTIONS = [
  { value: 'all', label: 'All Training Status' },
  { value: 'NOT_JOINED', label: 'Not Joined' },
  { value: 'JOINED', label: 'Joined' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
  { value: 'SHIFTED_TO_NEXT_WEEK', label: 'Shifted to Next Week' },
  { value: 'DROPPED', label: 'Dropped' },
  { value: 'COMPLETED', label: 'Completed' }
];

export const CERTIFICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'All Certification' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CLEARED', label: 'Cleared' },
  { value: 'NOT_CLEARED', label: 'Not Cleared' }
];

export const GO_LIVE_OPTIONS = [
  { value: 'all', label: 'All Go-Live Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'YES', label: 'Yes' },
  { value: 'NEEDS_MORE_TRAINING', label: 'Needs More Training' }
];

export const ONBOARDING_OPTIONS = [
  { value: 'all', label: 'All Onboarding' },
  { value: 'YES', label: 'Email Sent' },
  { value: 'NO', label: 'Email Not Sent' }
];

export const SUBJECT_OPTIONS = [
  { value: 'all', label: 'All Subjects' },
  { value: 'LITTLE_YOGI', label: 'Little Yogi' },
  { value: 'UNBOX_7_PLUS', label: 'Unbox 7+' },
  { value: 'PHONICS', label: 'Phonics' },
  { value: 'ALPHA_MATH', label: 'Alpha Math' }
];

export const SUBJECT_OPTIONS_FOR_UPDATE = [
  { value: 'NONE', label: 'Not Assigned' },
  { value: 'LITTLE_YOGI', label: 'Little Yogi' },
  { value: 'UNBOX_7_PLUS', label: 'Unbox 7+' },
  { value: 'PHONICS', label: 'Phonics' },
  { value: 'ALPHA_MATH', label: 'Alpha Math' }
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
    'NOT_SELECTED': 'Not Selected'
  };
  return labels[status] || status;
};

export const getInductionLabel = (status: InductionStatus): string => {
  const labels: Record<InductionStatus, string> = {
    'PENDING': 'Pending',
    'YES': 'Yes',
    'NO': 'No'
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
    'COMPLETED': 'Completed'
  };
  return labels[status] || status;
};

export const getCertificationLabel = (status: CertificationStatus): string => {
  const labels: Record<CertificationStatus, string> = {
    'PENDING': 'Pending',
    'CLEARED': 'Cleared',
    'NOT_CLEARED': 'Not Cleared'
  };
  return labels[status] || status;
};

export const getGoLiveLabel = (status: GoLiveStatus): string => {
  const labels: Record<GoLiveStatus, string> = {
    'PENDING': 'Pending',
    'YES': 'Yes',
    'NEEDS_MORE_TRAINING': 'Needs More Training'
  };
  return labels[status] || status;
};

export const getSubjectLabel = (subject: Subject | Subject[] | null): string => {
  if (!subject) return 'Not Assigned';
  
  const labels: Record<Subject, string> = {
    'LITTLE_YOGI': 'Little Yogi',
    'UNBOX_7_PLUS': 'Unbox 7+',
    'PHONICS': 'Phonics',
    'ALPHA_MATH': 'Alpha Math'
  };

  if (Array.isArray(subject)) {
    if (subject.length === 0) return 'Not Assigned';
    return subject.map(s => labels[s] || s).join(', ');
  }
  
  return labels[subject] || subject;
};

