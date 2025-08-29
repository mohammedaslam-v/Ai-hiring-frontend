import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationService } from '@/services/serviceManager';
import { AdminApplicationDetail, ApplicationDetailState } from '@/types/admin';

export const useApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<ApplicationDetailState>({
    application: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await applicationService.getApplicationById(id);
        
        if (response.status && response.data) {
          setState({
            application: response.data as AdminApplicationDetail,
            loading: false,
            error: null
          });
        } else {
          toast.error("Application not found.");
          navigate("/admin/applications");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        const errorMessage = "Failed to load application details.";
        setState({
          application: null,
          loading: false,
          error: errorMessage
        });
        toast.error(errorMessage);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  const handleDownloadResume = async () => {
    try {
      // Mock download logic
      toast.info(`Simulating download of resume for ${state.application?.firstName} ${state.application?.lastName}...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      toast.success(`Resume downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume.');
    }
  };

  return {
    ...state,
    handleDownloadResume
  };
};
