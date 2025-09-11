import axios from 'axios';
import { log, error as logError } from '@/utils/logger';

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

// Enhanced Tough Tongue API service for fetching interview results
export class ToughTongueService {
  private baseURL = import.meta.env.VITE_API_URL;

  /**
   * Fetch interview score and evaluation from Tough Tongue using sessionId
   * Uses improved polling system with better error handling and fallbacks
   * @param sessionId - The session ID from our database
   * @returns Promise with score and evaluation data
   */
  async getInterviewResults(sessionId: string) {
    try {
      log('🔍 Frontend: Getting Tough Tongue results for session');
      
      // Start processing
      const startResponse = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/results`, {
        timeout: 45000, // Increased timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if ((startResponse.data as ApiResponse).success) {
        log('✅ Frontend: Processing started, beginning polling...');
        
        // Poll for results with improved strategy
        const results = await this.pollForResults(sessionId);
        return results;
      } else {
        throw new Error('Failed to start processing');
      }

    } catch (error) {
      logError('❌ Frontend: Error getting results:', error instanceof Error ? error.message : error);
      throw new Error(`Failed to fetch interview results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Poll for results with improved timing and error handling
   * @param sessionId - The session ID to poll
   * @returns Promise with final results
   */
  private async pollForResults(sessionId: string) {
    // Improved polling strategy: 20s initial wait, then every 15s for up to 6 minutes total
    const initialWaitMs = 20000; // 20 seconds (reduced to be more responsive)
    const perAttemptIntervalMs = 15000; // 15 seconds
    const maxAttempts = 20; // Up to 6 minutes total (20s + 19 × 15s = 305s)

    log(`🔄 Frontend: Starting polling for session ${sessionId}`);

    // Wait before first check to allow backend processing to start
    await new Promise(resolve => setTimeout(resolve, initialWaitMs));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        log(`🔍 Frontend: Polling attempt ${attempt}/${maxAttempts}`);
        
        const response = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/status`, {
          timeout: 45000, // Increased timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if ((response.data as ApiResponse<ProcessingStatus>).success) {
          const data = (response.data as ApiResponse<ProcessingStatus>).data;
          
          log(`🔍 Frontend: Status check ${attempt}/${maxAttempts} - Status: ${data.status}`);
          
          if (data.status === 'completed') {
            log(`✅ Frontend: Results ready on attempt ${attempt}`);
            return data; // Return the full ProcessingStatus object
          } else if (data.status === 'failed') {
            logError(`❌ Frontend: Processing failed:`, data.error);
            throw new Error(`Processing failed: ${data.error || 'Unknown error during evaluation'}`);
          } else if (data.status === 'processing') {
            log(`⏳ Frontend: Still processing... (attempt ${attempt}/${maxAttempts})`);
            
            // Show progress indication for longer waits
            if (attempt > 10) {
              log(`⏰ Frontend: Extended processing time - this may take a few more minutes...`);
            }
            
            if (attempt < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, perAttemptIntervalMs));
            }
          }
        } else {
          logError(`❌ Frontend: Invalid response from server`);
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        logError(`❌ Frontend: Error on attempt ${attempt}:`, error instanceof Error ? error.message : error);
        
        // Handle different types of errors
        if (error instanceof Error) {
          if (error.message.includes('timeout')) {
            log(`⏰ Frontend: Timeout on attempt ${attempt}, retrying...`);
          } else if (error.message.includes('Network Error')) {
            log(`🌐 Frontend: Network error on attempt ${attempt}, retrying...`);
          }
        }
        
        // Fail on last attempt
        if (attempt === maxAttempts) {
          throw new Error(`Failed after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Wait before retry, with exponential backoff for errors
        const retryDelay = error instanceof Error && error.message.includes('timeout') 
          ? perAttemptIntervalMs * 1.5 // Longer delay after timeout
          : perAttemptIntervalMs;
          
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    throw new Error(`Timeout after ${Math.round((initialWaitMs + (maxAttempts - 1) * perAttemptIntervalMs) / 60000)} minutes of polling`);
  }

  /**
   * Check API health with better error reporting
   */
  async checkApiHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/api/session/count/active`, { 
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      log('✅ Frontend: API health check passed');
      return response.status === 200;
    } catch (error) {
      log('❌ Frontend: Health check failed:', error instanceof Error ? error.message : 'Unknown error');
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
      log(`🔍 Frontend: Getting processing status for session: ${sessionId}`);
      
      const response = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/status`, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if ((response.data as ApiResponse<ProcessingStatus>).success) {
        const data = (response.data as ApiResponse<ProcessingStatus>).data;
        log(`📊 Frontend: Status retrieved - ${data.status}`);
        return data;
      } else {
        logError('❌ Frontend: Failed to get status');
        throw new Error('Failed to get status');
      }
    } catch (error) {
      logError('❌ Frontend: Error getting status:', error instanceof Error ? error.message : error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error('Session not found or processing not started yet');
        } else if (error.message.includes('timeout')) {
          throw new Error('Request timed out - server may be busy');
        } else if (error.message.includes('Network Error')) {
          throw new Error('Network connection error');
        }
      }
      
      throw new Error(`Failed to get processing status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed session information (for debugging)
   * @param sessionId - The session ID to get details for
   */
  async getSessionDetails(sessionId: string) {
    try {
      log(`🔍 Frontend: Getting session details for: ${sessionId}`);
      
      const response = await axios.get(`${this.baseURL}/api/session/${sessionId}`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      logError('❌ Frontend: Error getting session details:', error instanceof Error ? error.message : error);
      throw new Error(`Failed to get session details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancel processing for a session (if supported)
   * @param sessionId - The session ID to cancel
   */
  async cancelProcessing(sessionId: string) {
    try {
      log(`🛑 Frontend: Attempting to cancel processing for session: ${sessionId}`);
      
      // This would depend on your backend implementing a cancel endpoint
      const response = await axios.post(`${this.baseURL}/api/session/tough-tongue/${sessionId}/cancel`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      logError('❌ Frontend: Error canceling processing:', error instanceof Error ? error.message : error);
      throw new Error(`Failed to cancel processing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const toughTongueService = new ToughTongueService();