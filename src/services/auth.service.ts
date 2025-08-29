import { ServiceResponse } from "@/types/interface";
import axiosInstance from "./instance";
import { AuthServiceLoginData } from "@/types";
import { MOCK_DATA } from "@/utils/constants/data";
import { TOAST_MESSAGES } from "@/utils/constants/messages";

class AuthService {

    async login(phoneNumber: string): Promise<ServiceResponse<AuthServiceLoginData>> {
        try {
            // Mock mode - any phone number works
            const mockResponse: AuthServiceLoginData = {
                refreshToken: MOCK_DATA.TOKEN_PREFIX.REFRESH + Date.now(),
                accessToken: MOCK_DATA.TOKEN_PREFIX.ACCESS + Date.now(),
                phoneNumber: phoneNumber
            };

            return {
                status: true,
                message: TOAST_MESSAGES.SUCCESS.LOGIN,
                data: mockResponse
            };
            
        } catch (error: unknown) {
            return {
                status: false,
                message: TOAST_MESSAGES.ERROR.GENERAL_ERROR,
            }
        }
    }
}

export default AuthService;