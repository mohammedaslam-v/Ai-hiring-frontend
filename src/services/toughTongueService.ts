import axios from 'axios';

// API Response interfaces
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface ProcessingStatus {
  sessionId: string;
  status: 'processing' | 'completed' | 'failed';
  results?: unknown;
  error?: string;
  startTime: Date;
}

// Simplified Tough Tongue API service for fetching interview results
export class ToughTongueService {
  private baseURL = import.meta.env.VITE_API_URL;

  /**
   * Fetch interview score and evaluation from Tough Tongue using sessionId
   * Uses simplified polling system (15 seconds, max 3 minutes)
   * @param sessionId - The session ID from our database
   * @returns Promise with score and evaluation data
   */
  async getInterviewResults(sessionId: string) {
    try {
      console.log('🔍 Frontend: Getting Tough Tongue results for session:', sessionId);
      
      // Start processing
      const startResponse = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/results`, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if ((startResponse.data as ApiResponse).success) {
        console.log('✅ Frontend: Processing started, beginning polling...');
        
        // Poll for results
        const results = await this.pollForResults(sessionId);
        return results;
      } else {
        throw new Error('Failed to start processing');
      }

    } catch (error) {
      console.error('❌ Frontend: Error getting results:', error);
      throw new Error(`Failed to fetch interview results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Poll for results with delayed first check: wait 40s, then every 20s
   * @param sessionId - The session ID to poll
   * @returns Promise with final results
   */
  private async pollForResults(sessionId: string) {
    // First check only after 40s, then every 20s.
    // Total cap ≈ 3 minutes: 40s initial + 7 × 20s = 180s
    const initialWaitMs = 40000; // 40 seconds
    const perAttemptIntervalMs = 20000; // 20 seconds
    const maxAttempts = 8; // first check + 7 more = 3 minutes total

    console.log(`🔄 Frontend: Starting polling for session ${sessionId} (first check after 40s, then every 20s, max ${maxAttempts} attempts)`);

    // Wait before first check to reduce unnecessary calls
    await new Promise(resolve => setTimeout(resolve, initialWaitMs));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔍 Frontend: Polling attempt ${attempt}/${maxAttempts}`);
        
        const response = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/status`, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if ((response.data as ApiResponse<ProcessingStatus>).success) {
          const data = (response.data as ApiResponse<ProcessingStatus>).data;
          
          if (data.status === 'completed') {
            console.log(`✅ Frontend: Results ready on attempt ${attempt}`);
            return data; // Return the full ProcessingStatus object, not just results
          } else if (data.status === 'failed') {
            console.error(`❌ Frontend: Processing failed:`, data.error);
            throw new Error(`Processing failed: ${data.error}`);
          } else if (data.status === 'processing') {
            console.log(`⏳ Frontend: Still processing... (attempt ${attempt}/${maxAttempts})`);
            
            if (attempt < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, perAttemptIntervalMs));
            }
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error(`❌ Frontend: Error on attempt ${attempt}:`, error);
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, perAttemptIntervalMs));
      }
    }
    
    throw new Error('Timeout after 3 minutes of polling');
  }

  /**
   * Check API health
   */
  async checkApiHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/api/session/count/active`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.log('❌ Frontend: Health check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  /**
   * Get processing status for a session (one-time check)
   * @param sessionId - The session ID to check
   * @returns Promise with current status
   */
  async getProcessingStatus(sessionId: string) {
    try {
      const response = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/status`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if ((response.data as ApiResponse<ProcessingStatus>).success) {
        return (response.data as ApiResponse<ProcessingStatus>).data;
      } else {
        throw new Error('Failed to get status');
      }
    } catch (error) {
      console.error('❌ Frontend: Error getting status:', error);
      throw new Error(`Failed to get processing status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const toughTongueService = new ToughTongueService();