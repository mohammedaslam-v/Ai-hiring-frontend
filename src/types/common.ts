// Common types used across the application
export interface ServiceResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
}

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
