import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../useLocalStorage";
import { useAuth } from "../useAuth";
import { toast } from "react-toastify";

interface AdminLoginFormData {
    email: string;
    password: string;
}

export function useAdminLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn, signOut, user } = useAuth();
    const [, , , clearAllStorage] = useLocalStorage('authUser', null);

    const handleClearSession = useCallback(async () => {
        try {
            await signOut();
            clearAllStorage();
            toast.info("Session cleared. You can now log in.");
        } catch (error) {
            toast.error("Error clearing session");
        }
    }, [signOut, clearAllStorage]);

    // Check for force logout parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout') === 'true') {
            handleClearSession();
        }
    }, [handleClearSession]);

    // Redirect if already authenticated
    useEffect(() => {
        if (user) {
            toast.info("You're already logged in! Redirecting to dashboard...");
            const timer = setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [user, navigate]);

    const handleLogin = async (formData: AdminLoginFormData) => {
        setIsLoading(true);

        try {
            // Any email/password combination will work now
            const result = await signIn(formData.email, formData.password);

            if (result.success) {
                toast.success("Welcome to the admin dashboard!");
                navigate('/admin/dashboard');
            } else {
                toast.error(result.error || "Login failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToSignup = () => {
        navigate('/admin/signup');
    };

    const navigateToHome = () => {
        navigate('/');
    };

    return {
        isLoading,
        user,
        handleLogin,
        handleClearSession,
        navigateToSignup,
        navigateToHome,
    };
}
