import { ServiceResponse } from "@/types/interface";
import { 
    BackendApiResponse, 
    ApplicationSubmissionData, 
    ApplicationStatusData,
    BackendErrorResponse,
    ValidationErrorDetail,
    AxiosErrorResponse
} from "@/types/api";
import axiosInstance from "./instance";
import { ApplicationData, ProfileData } from "@/types";

class CandidateService {

    async submitApplication(applicationData: ApplicationData): Promise<ServiceResponse> {
        try {
            // Create JSON payload for backend
            const payload = {
                firstName: applicationData.firstName,
                lastName: applicationData.lastName,
                email: applicationData.email,
                phoneNumber: applicationData.phone, // Map 'phone' to 'phoneNumber'
                position: applicationData.position,
                subjects: applicationData.subjects,
                additionalLanguages: applicationData.additionalLanguages || [],
                availableDays: applicationData.availableDays,
                availableTimeSlots: applicationData.timeSlots,
                resumeUrl: applicationData.resume ? `https://example.com/resumes/${Date.now()}-${applicationData.resume.name}` : undefined
            };
            
            // Debug: Log what's being sent
            console.log('🔍 JSON payload being sent to backend:', payload);
            
            // Send request to backend
            const response = await axiosInstance.post('/api/candidate/submit', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            // Type the response data
            const responseData = response.data as BackendApiResponse<ApplicationSubmissionData>;
            
            if (responseData.status) {
                return {
                    status: true,
                    message: responseData.msg || "Application submitted successfully",
                    data: {
                        id: responseData.data?.id,
                        status: responseData.data?.status,
                        message: responseData.msg,
                        applicationId: responseData.data?.applicationId,
                        submittedAt: responseData.data?.submittedAt
                    }
                };
            } else {
                return {
                    status: false,
                    message: responseData.error || "Failed to submit application",
                };
            }
            
        } catch (error: unknown) {
            console.error('❌ Application submission error:', error);
            
            if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
                const responseData = (error as AxiosErrorResponse).response!.data;
                console.error('📊 Backend response:', responseData);
                
                // Log validation details if they exist
                if (responseData.details && Array.isArray(responseData.details)) {
                    console.error('🔍 Validation errors:');
                    responseData.details.forEach((detail: ValidationErrorDetail, index: number) => {
                        console.error(`  ${index + 1}. Field: ${detail.path || detail.field}, Error: ${detail.msg || detail.message}, Value: ${detail.value}`);
                    });
                }
                
                return {
                    status: false,
                    message: responseData.error || "Failed to submit application",
                };
            }
            
            return {
                status: false,
                message: error instanceof Error ? error.message : "Something went wrong",
            };
        }
    }

    async uploadResume(file: File, applicationId: string): Promise<ServiceResponse> {
        try {
            // Resume upload is now handled in submitApplication
            // This method is kept for backward compatibility
            return {
                status: true,
                message: "Resume upload handled during application submission",
                data: {
                    filePath: `resumes/${applicationId}/${Date.now()}-${file.name}`,
                    fileUrl: `http://localhost:5000/uploads/${applicationId}/${Date.now()}-${file.name}`,
                    message: 'Resume uploaded successfully',
                    uploadedAt: new Date().toISOString()
                }
            };
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }

    async getApplicationByPhone(phoneNumber: string): Promise<ServiceResponse> {
        try {
            const response = await axiosInstance.get(`/api/candidate/application/${phoneNumber}`);
            
            // Type the response data
            const responseData = response.data as BackendApiResponse<{
                id: string;
                applicationId: string;
                firstName: string;
                lastName: string;
                email: string;
                phoneNumber: string;
                position: string;
                subjects: string[];
                additionalLanguages: string[];
                availableDays: string[];
                availableTimeSlots: string[];
                resumeUrl?: string;
                status: string;
                interviewStatus: string;
                score?: number;
                submittedAt: string;
                updatedAt: string;
            }>;
            
            if (responseData.status) {
                return {
                    status: true,
                    message: responseData.msg || "Application found successfully",
                    data: responseData.data
                };
            } else {
                return {
                    status: false,
                    message: responseData.msg || "No application found with this phone number",
                };
            }
            
        } catch (error: unknown) {
            console.error('Get application by phone error:', error);
            
            if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
                const responseData = (error as AxiosErrorResponse).response!.data;
                return {
                    status: false,
                    message: responseData.msg || responseData.error || "No application found with this phone number",
                };
            }
            
            return {
                status: false,
                message: "No application found with this phone number",
            };
        }
    }

    async getApplicationStatus(applicationId: string): Promise<ServiceResponse> {
        try {
            const response = await axiosInstance.get(`/api/candidate/applications/${applicationId}`);
            
            // Type the response data
            const responseData = response.data as BackendApiResponse<ApplicationStatusData>;
            
            if (responseData.status) {
                return {
                    status: true,
                    message: "Application status retrieved successfully",
                    data: {
                        id: responseData.data.id,
                        status: responseData.data.status,
                        submittedAt: responseData.data.submittedAt,
                        message: 'Application status retrieved successfully',
                        currentStage: responseData.data.status,
                        estimatedCompletion: '2-3 business days'
                    }
                };
            } else {
                return {
                    status: false,
                    message: responseData.error || "Failed to retrieve application status",
                };
            }
            
        } catch (error: unknown) {
            console.error('Get application status error:', error);
            
            if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
                const responseData = (error as AxiosErrorResponse).response!.data;
                return {
                    status: false,
                    message: responseData.error || "Failed to retrieve application status",
                };
            }
            
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }

    async updateCandidateProfile(profileData: Partial<ProfileData>): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                id: profileData.id || `candidate-${Date.now()}`,
                ...profileData,
                updatedAt: new Date().toISOString(),
                message: 'Profile updated successfully'
            };
            
            return {
                status: true,
                message: "Candidate profile updated successfully",
                data: mockResponse
            };
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }

    async getCandidateProfile(candidateId: string): Promise<ServiceResponse> {
        try {
            // TODO: This endpoint doesn't exist in backend yet - using mock response
            // When backend implements this route, uncomment the API call below
            /*
            const response = await axiosInstance.get(`/api/candidate/profile/${candidateId}`);
            
            if (response.data.success) {
                const data = response.data.data;
                return {
                    status: true,
                    message: "Candidate profile retrieved successfully",
                    data: {
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phoneNumber,
                        position: data.position,
                        subjects: data.subjects,
                        additionalLanguages: data.additionalLanguages,
                        availableDays: data.availableDays,
                        timeSlots: data.availableTimeSlots,
                        status: data.status,
                        createdAt: data.submittedAt,
                        lastUpdated: data.updatedAt
                    }
                };
            } else {
                return {
                    status: false,
                    message: response.data.error || "Failed to retrieve candidate profile",
                };
            }
            */
            
            // Mock response for now
            return {
                status: true,
                message: "Candidate profile retrieved successfully (mock)",
                data: {
                    id: candidateId,
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phone: "+1234567890",
                    position: "Software Engineer",
                    subjects: ["JavaScript", "React"],
                    additionalLanguages: ["Spanish"],
                    availableDays: ["Monday", "Wednesday"],
                    timeSlots: ["9:00 AM", "2:00 PM"],
                    status: "pending",
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                }
            };
        } catch (error: unknown) {
            return {
                status: false,
                message: "Something went wrong",
            };
        }
    }
}

export default CandidateService;
