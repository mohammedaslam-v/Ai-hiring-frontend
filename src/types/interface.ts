

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

