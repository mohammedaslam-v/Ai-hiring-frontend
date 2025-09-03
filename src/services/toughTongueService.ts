import axios from 'axios';

// Tough Tongue API service for fetching interview results
export class ToughTongueService {
  private baseURL = import.meta.env.VITE_API_URL; // Use our backend instead

  /**
   * Fetch interview score and evaluation from Tough Tongue using sessionId
   * This calls our backend which then calls Tough Tongue to avoid CORS issues
   * @param sessionId - The session ID received from Tough Tongue's onSubmit event
   * @returns Promise with score and evaluation data
   */
  async getInterviewResults(sessionId: string) {
    try {
      console.log('🔍 Frontend: Requesting Tough Tongue results through our backend for session:', sessionId);
      
      // Call our backend endpoint which will proxy the request to Tough Tongue
      // The backend will wait for evaluation to complete before returning results
      const response = await axios.get(`${this.baseURL}/api/session/tough-tongue/${sessionId}/results`, {
        timeout: 210000, // 3.5 minutes timeout to allow for evaluation processing
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.status === 200 && response.data && typeof response.data === 'object' && 'success' in response.data) {
        const responseData = response.data as { 
          success: boolean; 
          data: Record<string, unknown>; 
          extractedScore?: number | null;
        };
        
        if (responseData.success) {
          console.log('✅ Frontend: Successfully received results from backend:', responseData.data);
          console.log('✅ Frontend: Extracted score from backend:', responseData.extractedScore);
          console.log('🔍 Frontend: Full response data:', JSON.stringify(responseData, null, 2));
          
          // Return data with extracted score for easier access
          return {
            ...responseData.data,
            score: responseData.extractedScore
          };
        } else {
          throw new Error('Backend returned unsuccessful response');
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
}

export const toughTongueService = new ToughTongueService();
