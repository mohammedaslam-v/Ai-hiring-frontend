import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock authentication context (no Supabase)
import { User } from '@/types/auth';

import { AuthContextType } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);



import { AuthProviderProps } from '@/types/auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('authUser', null);
  const [loading, setLoading] = useLocalStorage<boolean>('authLoading', true);

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
              role: role as 'admin' | 'candidate',
      name: email.split('@')[0]
    };
    
    setUser(mockUser);
    setLoading(false);
    return { success: true };
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setLoading(false);
  };

  // Check for existing user on mount
  useEffect(() => {
    // The useLocalStorage hook automatically handles reading from localStorage
    // and setting the initial value, so we just need to set loading to false
    setLoading(false);
  }, []);

  const hasRole = async (requiredRole: string): Promise<boolean> => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};