import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock authentication context (no Supabase)
interface User {
  id: string;
  email: string;
  role: 'admin' | 'superadmin' | 'candidate';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication functions
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ALWAYS SUCCESS for admin login - any email/password works
    if (email && password) {
      const mockUser: User = {
        id: `admin-${Date.now()}`,
        email: email,
        role: 'admin',
        name: email.split('@')[0] || 'Admin User'
      };
      setUser(mockUser);
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Please enter both email and password' };
    }
  };

  const signUp = async (email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock signup logic
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: role as 'admin' | 'superadmin' | 'candidate',
      name: email.split('@')[0]
    };
    
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setLoading(false);
    return { success: true };
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    localStorage.removeItem('authUser');
    setLoading(false);
  };

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    signUp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};