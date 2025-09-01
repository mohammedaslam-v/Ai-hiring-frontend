// Authentication related interfaces and types
export interface User {
  id: string;
  email: string;
  role: 'candidate' | 'admin';
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  hasRole: (requiredRole: string) => Promise<boolean>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthServiceLoginData {
  refreshToken: string;
  accessToken: string;
  phoneNumber: string;
}


