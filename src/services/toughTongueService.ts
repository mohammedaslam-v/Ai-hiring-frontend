import axios from 'axios';

// Tough Tongue API service for fetching interview results
export class ToughTongueService {
  private baseURL = import.meta.env.VITE_API_URL; // Use our backend instead

  /**
   * Fetch interview score and evaluation from Tough Tongue using sessionId
   * This creates a job and polls for completion using the new job system
   * @param sessionId - The session ID received from Tough Tongue's onSubmit event
   * @returns Promise with score and evaluation data
   */
  async getInterviewResults(sessionId: string) {
    try {
      console.log('🔍 Frontend: Requesting Tough Tongue results through our backend for session:', sessionId);
      
      // Step 1: Create job
      const createResponse = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/results`, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (createResponse.status === 200 && createResponse.data && typeof createResponse.data === 'object' && 'success' in createResponse.data) {
        const responseData = createResponse.data as { 
          success: boolean; 
          data: {
            jobId: string;
            status: string;
            sessionId: string;
            createdAt: string;
            estimatedCompletion: string;
          }
        };
        
        if (responseData.success) {
          console.log('✅ Frontend: Job created successfully:', responseData.data.jobId);
          console.log('📊 Frontend: Job status:', responseData.data.status);
          console.log('⏰ Frontend: Estimated completion:', responseData.data.estimatedCompletion);
          
          // Step 2: Wait for job completion
          console.log('🔄 Frontend: Starting job polling...');
          const results = await this.waitForJobCompletion(responseData.data.jobId);
          
          console.log('✅ Frontend: Job completed with results:', results);
          return results;
        } else {
          throw new Error('Failed to create job for Tough Tongue processing');
        }
      } else {
        throw new Error('Backend returned invalid response format');
      }

    } catch (error) {
      console.error('❌ Frontend: Error fetching Tough Tongue results through backend:', error);
      throw new Error(`Failed to fetch interview results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if our backend Tough Tongue proxy is accessible
   */
  async checkApiHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/api/session/count`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.log('❌ Frontend: Backend Tough Tongue proxy health check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  /**
   * Poll job status for Tough Tongue results
   * @param jobId - The job ID returned from createJob
   * @returns Promise with job status and results
   */
  async pollJobStatus(jobId: string) {
    try {
      console.log('🔍 Frontend: Polling job status for job:', jobId);
      
      const response = await axios.get(`${this.baseURL}/api/session/job/${jobId}/status`, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.status === 200 && response.data && typeof response.data === 'object' && 'success' in response.data) {
        const responseData = response.data as { 
          success: boolean; 
          data: {
            jobId: string;
            status: string;
            results?: Record<string, unknown>;
            error?: string;
            createdAt: string;
            updatedAt: string;
          }
        };
        
        if (responseData.success) {
          const jobData = responseData.data;
          console.log('✅ Frontend: Job status received:', jobData.status);
          
          return {
            jobId: jobData.jobId,
            status: jobData.status,
            results: jobData.results,
            error: jobData.error,
            createdAt: jobData.createdAt,
            updatedAt: jobData.updatedAt
          };
        } else {
          throw new Error('Invalid job status response');
        }
      } else {
        throw new Error('Invalid job status response');
      }
    } catch (error) {
      console.error('❌ Frontend: Error polling job status:', error);
      throw new Error(`Failed to poll job status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Wait for job completion with polling
   * @param jobId - The job ID to poll
   * @param maxAttempts - Maximum polling attempts (default: 40)
   * @param intervalMs - Polling interval in milliseconds (default: 30000)
   * @returns Promise with final results
   */
  async waitForJobCompletion(jobId: string, maxAttempts: number = 40, intervalMs: number = 30000) {
    console.log(`🔄 Frontend: Starting job polling for job ${jobId} (max ${maxAttempts} attempts, ${intervalMs}ms interval)`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const jobStatus = await this.pollJobStatus(jobId);
        
        if (jobStatus.status === 'completed') {
          console.log(`✅ Frontend: Job ${jobId} completed successfully on attempt ${attempt}`);
          return jobStatus.results;
        } else if (jobStatus.status === 'failed') {
          console.error(`❌ Frontend: Job ${jobId} failed:`, jobStatus.error);
          throw new Error(`Job failed: ${jobStatus.error}`);
        } else if (jobStatus.status === 'processing' || jobStatus.status === 'pending') {
          console.log(`⏳ Frontend: Job ${jobId} still ${jobStatus.status} (attempt ${attempt}/${maxAttempts})`);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, intervalMs));
          }
        }
      } catch (error) {
        console.error(`❌ Frontend: Error on attempt ${attempt}:`, error);
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }
    
    throw new Error(`Job ${jobId} did not complete within ${maxAttempts} attempts`);
  }
}

export const toughTongueService = new ToughTongueService();
