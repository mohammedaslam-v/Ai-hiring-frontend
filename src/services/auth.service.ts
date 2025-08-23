import { ServiceResponse, AuthServiceLoginData } from "@/types";

class AuthService {

    async login(phoneNumber: string): Promise<ServiceResponse<AuthServiceLoginData>> {
        try {
            // Mock mode - any phone number works
            const mockResponse: AuthServiceLoginData = {
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