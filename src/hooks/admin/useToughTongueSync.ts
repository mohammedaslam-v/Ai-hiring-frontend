import { useState } from 'react';
import { toast } from 'react-toastify';

export const useToughTongueSync = () => {
  const [refreshingSession, setRefreshingSession] = useState<string | null>(null);

  const handleRefreshToughTongueData = async (sessionId: string, applicationId?: string) => {
    if (!sessionId) {
      toast.error("No session ID available to refresh");
      return;
    }

    try {
      setRefreshingSession(sessionId);
      console.log('🔄 Refreshing ToughTongue data for session:', sessionId);

      // TODO: Replace with Node.js API call when backend is ready
      console.log('Session check temporarily disabled - migrating to Node.js');
      toast.info("Session check temporarily disabled - migrating to Node.js");
      return;
    } catch (error) {
      console.error('❌ Error refreshing ToughTongue data:', error);
      toast.error("Failed to refresh ToughTongue data.");
    } finally {
      setRefreshingSession(null);
    }
  };

  return {
    refreshingSession,
    handleRefreshToughTongueData
  };
};
