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

// Interview results interface
export interface InterviewResults {
  score: number;
  feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  status: 'passed' | 'failed' | 'pending';
  interview_completed: boolean;
}
