import { ServiceResponse } from "@/types/interface";
import axiosInstance from "./instance";
import { ApplicationData, ProfileData } from "@/types";

class CandidateService {

    async submitApplication(applicationData: ApplicationData): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                id: `app-${Date.now()}`,
                status: 'submitted',
                message: 'Application submitted successfully',
                applicationId: `APP-${String(Date.now()).padStart(8, '0')}`,
                submittedAt: new Date().toISOString()
            };
            
            return {
                status: true,
                message: "Application submitted successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async uploadResume(file: File, applicationId: string): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                filePath: `resumes/${applicationId}/${Date.now()}-${file.name}`,
                fileUrl: `https://api.example.com/resumes/${applicationId}/${Date.now()}-${file.name}`,
                message: 'Resume uploaded successfully',
                uploadedAt: new Date().toISOString()
            };
            
            return {
                status: true,
                message: "Resume uploaded successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async getApplicationStatus(applicationId: string): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                id: applicationId,
                status: 'submitted',
                submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                message: 'Application status retrieved successfully',
                currentStage: 'under_review',
                estimatedCompletion: '2-3 business days'
            };
            
            return {
                status: true,
                message: "Application status retrieved successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
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
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }

    async getCandidateProfile(candidateId: string): Promise<ServiceResponse> {
        try {
            // For now, simulate successful response (ready for Node.js backend)
            const mockResponse = {
                id: candidateId,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "+919876543210",
                position: "English Teacher",
                subjects: ["English", "Literature"],
                additionalLanguages: ["Hindi", "Bengali"],
                availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                timeSlots: ["Morning", "Afternoon"],
                status: "active",
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            return {
                status: true,
                message: "Candidate profile retrieved successfully",
                data: mockResponse
            }
            
        } catch (error) {
            return {
                status: false,
                message: "Something went wrong",
            }
        }
    }
}

export default CandidateService;
