import { LocalStorageKeys } from "@/types/enum";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../useLocalStorage";
import axiosInstance from "@/services/instance";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/constants/navigation";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { MOCK_DATA, STORAGE_KEYS, TIMEOUTS } from "@/utils/constants/data";
import { useApi } from "../useApi";
import { MockLoginResponse } from "@/types/candidate";
import CandidateService from "@/services/candidate.service";

/**
 * Custom hook for candidate login functionality
 * Uses the base useApi hook for consistent error handling and loading states
 */
export function useCandidateLogin() {
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = useLocalStorage(LocalStorageKeys.REFRESH_TOKEN, "");
  const [accessToken, setAccessToken] = useLocalStorage(LocalStorageKeys.ACCESS_TOKEN, "");
  const candidateService = new CandidateService();

  // Mock login operation using the base useApi hook
  const mockLogin = useApi<MockLoginResponse>(
    async (phoneNumber: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, TIMEOUTS.LOGIN_DELAY));
      
      // Mock response
      return {
        status: true,
        data: {
          refreshToken: MOCK_DATA.TOKEN_PREFIX.REFRESH + Date.now(),
          accessToken: MOCK_DATA.TOKEN_PREFIX.ACCESS + Date.now(),
          phoneNumber: phoneNumber
        },
        message: "Login successful"
      };
    },
    {
      onSuccess: (data) => {
        // Set tokens in localStorage
        setRefreshToken(data.refreshToken);
        setAccessToken(data.accessToken);
        
        // Set axios headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        axiosInstance.defaults.headers.common['refreshToken'] = data.refreshToken;
        
        // Store phone number for application form
        localStorage.setItem(STORAGE_KEYS.LOGIN_PHONE_NUMBER, data.phoneNumber);
        
        // Show success message
        toast.success(TOAST_MESSAGES.SUCCESS.LOGIN);
        
        // Navigate to application form
        navigate(ROUTES.CANDIDATE.APPLICATION);
      },
      onError: (error) => {
        setValidationError(error);
        toast.error(error);
      }
    }
  );

  // Check for existing application by phone number
  async function checkExistingApplication(phoneNumber: string) {
    try {
      const response = await candidateService.getApplicationByPhone(phoneNumber);
      return response.status ? response.data : null;
    } catch (error) {
      console.error('Error checking existing application:', error);
      return null;
    }
  }

  // Main login handler
  async function handleLogin(phone: string) {
    setValidationError("");
    
    try {
      // First, check if application exists
      const existingApp = await checkExistingApplication(phone);
      
      if (existingApp) {
        // Application exists - set localStorage and navigate based on interview status
        localStorage.setItem('applicationId', existingApp.applicationId);
       localStorage.setItem('candidateName', JSON.stringify(`${existingApp.firstName} ${existingApp.lastName}`));
        localStorage.setItem('candidateEmail', JSON.stringify(existingApp.email));
        
        // Store phone number for reference
        localStorage.setItem(STORAGE_KEYS.LOGIN_PHONE_NUMBER, phone);
        
        // Check interview status and navigate accordingly
        if (existingApp.interviewStatus === 'not_started') {
          toast.success("Welcome back! You can now proceed to your interview.");
          navigate('/candidate/interview');
        } else if (existingApp.interviewStatus === 'completed' || existingApp.interviewStatus === 'failed') {
          toast.success("Welcome back! Your interview has been completed.");
          navigate('/candidate/result');
        } else if (existingApp.interviewStatus === 'in_progress') {
          toast.success("Welcome back! You can resume your interview.");
          navigate('/candidate/interview');
        } else {
          // Default to interview page for any other status
          toast.success("Welcome back! You can proceed to your interview.");
          navigate('/candidate/interview');
        }
      } else {
        // No application found - proceed with normal flow (mock login)
        await mockLogin.execute(phone);
      }
    } catch (error) {
      console.error('Login error:', error);
      setValidationError("Login failed. Please try again.");
      toast.error("Login failed. Please try again.");
    }
  }

  const clearError = () => {
    setValidationError("");
    mockLogin.clearError();
  };

  return {
    // Loading and error states
    isLoading: mockLogin.loading,
    validationError: validationError || mockLogin.error,
    
    // Operations
    handleLogin,
    clearError,
    
    // Individual operation states
    login: {
      loading: mockLogin.loading,
      error: mockLogin.error,
      clearError: mockLogin.clearError,
    },
  };
}