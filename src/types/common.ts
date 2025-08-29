// Common types used across the application

// Generic form field types
export interface FormFieldError {
  [key: string]: string | undefined;
}

// Common UI component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Route protection props
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

// API-related interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UseApiState {
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T = unknown> extends UseApiState {
  execute: (...args: unknown[]) => Promise<ApiResponse<T>>;
  clearError: () => void;
  setError: (error: string) => void;
}

export interface UseApiConfig<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

// Application-related interfaces
export interface ApplicationCountResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApplicationsPageResponse {
  applications: unknown[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
