// API Response Types for Backend Integration

export interface BackendApiResponse<T = any> {
  status: boolean;
  msg: string;
  data?: T;
  error?: string;
  details?: ValidationErrorDetail[];
  timestamp?: Date;
}

export interface ApplicationSubmissionData {
  id: string;
  applicationId: string;
  status: string;
  submittedAt: Date;
}

export interface ApplicationStatusData {
  id: string;
  status: string;
  submittedAt: Date;
}

// Error response interfaces
export interface BackendErrorResponse {
  status: false;
  error: string;
  msg?: string;
  details?: ValidationErrorDetail[];
  timestamp?: Date;
}

export interface ValidationErrorDetail {
  path?: string;
  field?: string;
  msg?: string;
  message?: string;
  value?: string | number | boolean | null;
  code?: string;
}

// Axios error response interface
export interface AxiosErrorResponse {
  response?: {
    data: BackendErrorResponse;
    status: number;
    statusText: string;
  };
  message: string;
  code?: string;
}
