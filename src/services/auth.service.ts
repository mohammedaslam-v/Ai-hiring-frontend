import { ServiceResponse } from "@/types/interface";

interface LoginData {
    refreshToken: string;
    accessToken: string;
    phoneNumber: string;
}

class AuthService {

    async login(phoneNumber: string): Promise<ServiceResponse<LoginData>> {
        try {
            // Mock mode - any phone number works
            const mockResponse: LoginData = {
                refreshToken: "mock-refresh-token-" + Date.now(),
                accessToken: "mock-access-token-" + Date.now(),
                phoneNumber: phoneNumber
            };

            return {
                status: true,
                message: "Login successful",
                data: mockResponse
            };
            
        } catch (error: unknown) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }
}

export default AuthService;