// Candidate related interfaces and types
export interface PositionSectionProps {
  selectedPosition: string;
  onPositionChange: (value: string) => void;
  error?: string;
}

export interface SubjectsSectionProps {
  selectedSubjects: string[];
  selectedLanguages: string[];
  onSubjectChange: (subject: string, checked: boolean) => void;
  onLanguageChange: (language: string, checked: boolean) => void;
  subjectError?: string;
}

export interface AvailabilitySectionProps {
  selectedDays: string[];
  selectedTimeSlots: string[];
  onDayChange: (day: string, checked: boolean) => void;
  onTimeSlotChange: (slot: string, checked: boolean) => void;
  dayError?: string;
  timeSlotError?: string;
}

export interface ResumeSectionProps {
  resume: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  duplicateWarnings: {
    email: boolean;
    phone: boolean;
  };
  fieldErrors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface WhatsAppHelpButtonProps {
  phone?: string;
}

export interface InterviewResults {
  id: string;
  candidateName: string;
  email: string;
  interviewDate: string;
  score: number;
  status: 'passed' | 'failed' | 'pending';
  feedback: string;
  videoUrl?: string;
}

export interface CandidateResult {
  id: string;
  name: string;
  email: string;
  position: string;
  interviewScore: number;
  status: 'approved' | 'rejected' | 'pending';
  feedback: string;
  createdAt: string;
}

export interface InterviewResult {
  sessionId?: string | null;
  score?: number;
  status?: string;
  completedAt?: string;
}

export interface SessionData {
  id: string;
  startedAt?: string;
  status: string;
  applicationId: string;
  completedAt?: string;
}

export interface InterviewResultData {
  score?: number;
  sessionId?: string;
  status?: string;
  completedAt?: string;
}

// Salary structure interfaces
export interface ClassPayment {
  type: string;
  day: string;
  night: string;
  icon: React.ReactElement;
}

export interface RenewalBonus {
  rate: string;
  bonus: string;
  color: string;
}

export interface SessionMilestone {
  sessions: number;
  increment: string;
}

// Candidate login and application response interfaces
export interface MockLoginResponse {
  refreshToken: string;
  accessToken: string;
  phoneNumber: string;
}

export interface ApplicationSubmissionResponse {
  id: string;
  status: string;
  submittedAt: string;
  applicationNumber: string;
}

// Additional candidate response interfaces
export interface ResumeUploadResponse {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

export interface ApplicationStatusResponse {
  id: string;
  status: string;
  currentStage: string;
  nextStage?: string;
  lastUpdated: string;
  feedback?: string;
}

export interface CandidateProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  subjects: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}