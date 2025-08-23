import { LocalStorageKeys } from "@/types/enum";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../useLocalStorage";
import axiosInstance from "@/services/instance";
import { toast } from "react-toastify";

export function useCandidateLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string>("");
    const navigate = useNavigate();
    const [refreshToken, setRefreshToken] = useLocalStorage(LocalStorageKeys.REFRESH_TOKEN, "");
    const [accessToken, setAccessToken] = useLocalStorage(LocalStorageKeys.ACCESS_TOKEN, "");

    async function handleLogin(phoneNumber: string) {
        setIsLoading(true);
        setValidationError("");

        // Bypass service - always succeed for any phone number
        setTimeout(() => {
            setIsLoading(false);
            const mockTokens = {
                refreshToken: "mock-refresh-token-" + Date.now(),
                accessToken: "mock-access-token-" + Date.now(),
            };
            
            setRefreshToken(mockTokens.refreshToken);
            setAccessToken(mockTokens.accessToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${mockTokens.accessToken}`;
            axiosInstance.defaults.headers.common['refreshToken'] = mockTokens.refreshToken;
            
            // Store phone number for application form
            localStorage.setItem('loginPhoneNumber', phoneNumber);
            
            toast.success("Login successful! Redirecting to application form...");
            
            navigate('/candidate/application');
        }, 1000);
    }

    const clearError = () => {
        setValidationError("");
    };

    return {
        isLoading,
        validationError,
        handleLogin,
        clearError,
    }
}