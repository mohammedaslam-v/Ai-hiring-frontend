import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/utils/constants/navigation";
import { TOAST_MESSAGES } from "@/utils/constants/messages";

/**
 * Custom hook for admin login functionality using JWT authentication
 */
export function useAdminLogin() {
  const [validationError, setValidationError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Main login handler using JWT authentication
  async function handleLogin(email: string, password: string) {
    setValidationError("");
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Show success message
        toast.success(TOAST_MESSAGES.SUCCESS.LOGIN);
        
        // Navigate to admin dashboard
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        setValidationError(result.error || 'Login failed');
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      setValidationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const clearError = () => {
    setValidationError("");
  };

  return {
    // Loading and error states
    isLoading,
    validationError,
    
    // Operations
    handleLogin,
    clearError,
  };
}
