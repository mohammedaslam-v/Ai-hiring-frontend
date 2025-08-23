

export interface ServiceResponse<T = unknown> {
    status: boolean;
    message: string;
    data?: T;
}

// Application related interfaces
export interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  subjects: string[];
  additionalLanguages: string[];
  availableDays: string[];
  timeSlots: string[];
  resume: File;
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

export interface ApplicationResponse {
  id: string;
  status: string;
  message: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  subjects: string[];
  additionalLanguages: string[];
  availableDays: string[];
  timeSlots: string[];
  resume: File | null;
}

