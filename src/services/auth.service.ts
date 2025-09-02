import { ServiceResponse } from "@/types/interface";
import axiosInstance from "./instance";

interface AdminLoginRequest {
    email: string;
    password: string;
}

interface AdminLoginResponse {
    success: boolean;
    token?: string;
    message: string;
    admin?: {
        email: string;
    };
}

interface VerifyResponse {
    valid: boolean;
    admin?: {
        email: string;
    };
}

class AuthService {
    private readonly API_BASE_URL = '/api/auth';

    /**
     * Admin login with JWT token
     */
    async adminLogin(email: string, password: string): Promise<ServiceResponse<AdminLoginResponse>> {
        try {
            const response = await axiosInstance.post(`${this.API_BASE_URL}/admin/login`, {
                email,
                password
            });

            if (response.data.success && response.data.token) {
                // Store token in localStorage
                localStorage.setItem('adminToken', response.data.token);
                
                return {
                    status: true,
                    message: response.data.message,
                    data: response.data
                };
            } else {
                return {
                    status: false,
                    message: response.data.message || 'Login failed'
                };
            }
        } catch (error: any) {
            console.error('Admin login error:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    }

    /**
     * Verify JWT token
     */
    async verifyToken(): Promise<ServiceResponse<VerifyResponse>> {
        try {
            const token = this.getToken();
            if (!token) {
                return {
                    status: false,
                    message: 'No token found'
                };
            }

            const response = await axiosInstance.get(`${this.API_BASE_URL}/verify`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return {
                status: true,
                message: 'Token verified',
                data: response.data
            };
        } catch (error: any) {
            console.error('Token verification error:', error);
            // Remove invalid token
            this.removeToken();
            return {
                status: false,
                message: 'Token verification failed'
            };
        }
    }

    /**
     * Logout admin
     */
    async logout(): Promise<ServiceResponse<{ success: boolean }>> {
        try {
            const token = this.getToken();
            if (token) {
                await axiosInstance.post(`${this.API_BASE_URL}/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            
            // Remove token from localStorage
            this.removeToken();
            
            return {
                status: true,
                message: 'Logout successful',
                data: { success: true }
            };
        } catch (error: any) {
            console.error('Logout error:', error);
            // Still remove token even if API call fails
            this.removeToken();
            return {
                status: true,
                message: 'Logout successful',
                data: { success: true }
            };
        }
    }

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem('adminToken');
    }

    /**
     * Remove stored token
     */
    removeToken(): void {
        localStorage.removeItem('adminToken');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Legacy method for backward compatibility
     */
    async login(phoneNumber: string): Promise<ServiceResponse<any>> {
        // This method is kept for backward compatibility but not used for admin login
        return {
            status: false,
            message: 'Use adminLogin method for admin authentication'
        };
    }
}

export default AuthService;