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
  resume: File | null;
}

export interface ApplicationResponse {
  id: string;
  status: string;
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
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Main application filters interface
export interface ApplicationFilters {
  searchTerm?: string;
  statusFilter?: string;
  subjectFilter?: string;
  resultFilter?: string;
  fromDate?: string;
  toDate?: string;
  // Service-specific filters
  status?: string;
  position?: string;
  search?: string;
}

// Alias for backward compatibility
export type ApplicationsServiceFilters = Pick<ApplicationFilters, 'status' | 'position' | 'search'>;
