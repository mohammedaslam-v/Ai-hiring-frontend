import { LocalStorageKeys } from "@/types/enum";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../useLocalStorage";
import axiosInstance from "@/services/instance";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/constants/navigation";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { MOCK_DATA, STORAGE_KEYS, TIMEOUTS } from "@/utils/constants/data";

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
                refreshToken: MOCK_DATA.TOKEN_PREFIX.REFRESH + Date.now(),
                accessToken: MOCK_DATA.TOKEN_PREFIX.ACCESS + Date.now(),
            };
            
            setRefreshToken(mockTokens.refreshToken);
            setAccessToken(mockTokens.accessToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${mockTokens.accessToken}`;
            axiosInstance.defaults.headers.common['refreshToken'] = mockTokens.refreshToken;
            
            // Store phone number for application form
            localStorage.setItem(STORAGE_KEYS.LOGIN_PHONE_NUMBER, phoneNumber);
            
            toast.success(TOAST_MESSAGES.SUCCESS.LOGIN);
            
            navigate(ROUTES.CANDIDATE.APPLICATION);
        }, TIMEOUTS.LOGIN_DELAY);
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