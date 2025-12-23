import axios from 'axios';

export interface EvaluationMedia {
  recordingUrl?: string | null;
  transcriptUrl?: string | null;
  duration?: number | null;
}

const baseURL = import.meta.env.VITE_API_URL;

export async function getEvaluationMedia(sessionId: string): Promise<EvaluationMedia> {
  try {
    const response = await axios.get<{ success: boolean; message?: string; data?: EvaluationMedia }>(
      `${baseURL}/api/session/${sessionId}/media`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to fetch evaluation media');
    }
    
    return response.data.data || {};
  } catch (error) {
    console.error('Error fetching evaluation media:', error);
    throw new Error(`Failed to fetch evaluation media: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
