import { useState, useEffect } from 'react';
import { applicationService } from '@/services/serviceManager';
import { ApplicationDetail } from '@/types';

export const useApplications = () => {
  const [applications, setApplications] = useState<ApplicationDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationService.getApplicationsPage(1, 100);
      
      if (response.status && response.data) {
        const { applications: apps } = response.data;
        setApplications(apps || []);
      } else {
        setError(response.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('An error occurred while fetching applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications
  };
};
