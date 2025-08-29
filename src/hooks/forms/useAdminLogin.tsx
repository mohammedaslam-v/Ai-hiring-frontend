import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminService } from "@/services/serviceManager";
import { ROUTES } from "@/utils/constants/navigation";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { TIMEOUTS } from "@/utils/constants/data";
import { useApi } from "../useApi";
import { AdminLoginResponse } from "@/types/admin";

/**
 * Custom hook for admin login functionality
 * Uses the base useApi hook for consistent error handling and loading states
 */
export function useAdminLogin() {
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();

  // Mock admin login operation using the base useApi hook
  const adminLogin = useApi<AdminLoginResponse>(
    async (email: string, password: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, TIMEOUTS.LOGIN_DELAY));
      
      // Mock response - any email/password combination works
      return {
        status: true,
        data: {
          refreshToken: `mock-admin-refresh-${Date.now()}`,
          accessToken: `mock-admin-access-${Date.now()}`,
          email: email,
          role: 'admin',
          adminId: `admin-${Date.now()}`
        },
        message: "Admin login successful"
      };
    },
    {
      onSuccess: (data) => {
        // Store admin data in localStorage
        localStorage.setItem('adminEmail', data.email);
        localStorage.setItem('adminRole', data.role);
        localStorage.setItem('adminId', data.adminId);
        localStorage.setItem('adminRefreshToken', data.refreshToken);
        localStorage.setItem('adminAccessToken', data.accessToken);

        // Show success message
        toast.success(TOAST_MESSAGES.SUCCESS.LOGIN);
        
        // Navigate to admin dashboard
        navigate(ROUTES.ADMIN.DASHBOARD);
      },
      onError: (error) => {
        setValidationError(error);
        toast.error(error);
      }
    }
  );

  // Main login handler
  async function handleLogin(email: string, password: string) {
    setValidationError("");
    await adminLogin.execute(email, password);
  }

  const clearError = () => {
    setValidationError("");
    adminLogin.clearError();
  };

  return {
    // Loading and error states
    isLoading: adminLogin.loading,
    validationError: validationError || adminLogin.error,
    
    // Operations
    handleLogin,
    clearError,
    
    // Individual operation states
    login: {
      loading: adminLogin.loading,
      error: adminLogin.error,
      clearError: adminLogin.clearError,
    },
  };
}
