import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AuthService from '@/services/auth.service';

// JWT authentication context
import { User } from '@/types/auth';
import { AuthContextType } from '@/types/auth';
import { AuthProviderProps } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('authUser', null);
  const [loading, setLoading] = useState<boolean>(true);
  const authService = useMemo(() => new AuthService(), []);

  // JWT authentication functions
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      const response = await authService.adminLogin(email, password);
      
      if (response.status && response.data?.success) {
        // Get role from backend response (defaults to 'admin' for backwards compatibility)
        const adminRole = response.data.admin?.role || 'admin';
        
        const adminUser: User = {
          id: `admin-${Date.now()}`,
          email: response.data.admin?.email || email,
          role: adminRole,
          name: email.split('@')[0] || 'Admin User'
        };
        setUser(adminUser);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    // Signup not supported for admin authentication
    return { success: false, error: 'Admin signup not supported' };
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Verify token with backend
          const response = await authService.verifyToken();
          if (response.status && response.data?.valid) {
            // Token is valid, restore user session with role from backend
            const adminRole = response.data.admin?.role || 'admin';
            
            const adminUser: User = {
              id: `admin-${Date.now()}`,
              email: response.data.admin?.email || 'admin@bambinos.com',
              role: adminRole,
              name: response.data.admin?.email?.split('@')[0] || 'Admin User'
            };
            setUser(adminUser);
          } else {
            // Token is invalid, clear it
            authService.removeToken();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array - only run once on mount

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

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};