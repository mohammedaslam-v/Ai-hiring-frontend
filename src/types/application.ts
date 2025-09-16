// Application related interfaces and types
export interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // This will be mapped to phoneNumber in backend
  position: string;
  subjects: string[];
  additionalLanguages: string[];
  availableDays: string[];
  timeSlots: string[]; // This will be mapped to availableTimeSlots in backend
  resume: File | null;
}

export interface ApplicationResponse {
  id: string;
  status: string;
  message: string;
}

// Backend response interface
export interface BackendApplicationResponse {
  success: boolean;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    position: string;
    subjects: string[];
    additionalLanguages: string[];
    availableDays: string[];
    availableTimeSlots: string[];
    status: string;
    submittedAt: string;
    updatedAt: string;
    applicationId: string;
  };
  message: string;
}

// FormData is now an alias for ApplicationData to avoid duplication
export type FormData = ApplicationData;

// Profile data extends ApplicationData with optional id for updates
export interface ProfileData extends ApplicationData {
  id?: string;
}

export interface Position {
  id: string;
  title: string;
  description: string;
}

export interface Day {
  name: string;
  highDemand: boolean;
}

export interface TimeSlot {
  name: string;
  highDemand: boolean;
}

export interface ApplicationDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  subjects: string[];
  additionalLanguages: string[];
  availableDays: string[];
  timeSlots: string[];
  availableTimeSlots: string[]; // Added for backend compatibility
  status: string;
  createdAt: string;
  updatedAt: string;
}