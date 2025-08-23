import { ServiceResponse, ApplicationData, ApplicationResponse } from "@/types";

class ApplicationService {

  async submitApplication(applicationData: ApplicationData): Promise<ServiceResponse<ApplicationResponse>> {
    try {
      // For now, simulate successful submission (ready for Node.js backend)
      console.log('Submitting application to backend:', applicationData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockResponse: ApplicationResponse = {
        id: crypto.randomUUID(),
        status: 'submitted',
        message: 'Application submitted successfully'
      };

      return {
        status: true,
        message: mockResponse.message,
        data: mockResponse
      };
      
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        status: false,
        message: "Failed to submit application. Please try again.",
      }
    }
  }

  async uploadResume(file: File, applicationId: string): Promise<ServiceResponse<{ filePath: string; fileUrl: string; message: string }>> {
    try {
      // For now, simulate successful file upload (ready for Node.js backend)
      console.log('Uploading resume file:', file.name, 'for application:', applicationId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful response
      const mockResponse = {
        filePath: `resumes/${applicationId}/${Date.now()}-${file.name}`,
        fileUrl: `https://api.example.com/resumes/${applicationId}/${Date.now()}-${file.name}`,
        message: 'Resume uploaded successfully'
      };

      return {
        status: true,
        message: mockResponse.message,
        data: mockResponse
      };
      
    } catch (error) {
      console.error('Error uploading resume:', error);
      return {
        status: false,
        message: "Failed to upload resume. Please try again.",
      }
    }
  }

  async getApplicationStatus(applicationId: string): Promise<ServiceResponse<{ id: string; status: string; submittedAt: string; message: string }>> {
    try {
      // For now, simulate getting application status (ready for Node.js backend)
      console.log('Getting application status for:', applicationId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock successful response
      const mockResponse = {
        id: applicationId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        message: 'Application status retrieved successfully'
      };

      return {
        status: true,
        message: mockResponse.message,
        data: mockResponse
      };
      
    } catch (error) {
      console.error('Error getting application status:', error);
      return {
        status: false,
        message: "Failed to get application status. Please try again.",
      }
    }
  }
}

export default ApplicationService;
