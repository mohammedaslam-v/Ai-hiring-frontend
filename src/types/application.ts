// Application related interfaces and types
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
  resume: File | null;
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
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFilters {
  searchTerm?: string;
  statusFilter?: string;
  subjectFilter?: string;
  resultFilter?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ApplicationsServiceFilters {
  status?: string;
  position?: string;
  search?: string;
}
