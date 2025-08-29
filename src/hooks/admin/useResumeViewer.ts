import { useState } from 'react';
import { toast } from 'react-toastify';
import { DEFAULT_RESUME_URL } from '@/constants/admin/availabilityConstants';

export const useResumeViewer = () => {
  const [loading, setLoading] = useState(false);

  const handleViewResume = async (applicantId?: string) => {
    if (!applicantId) {
      toast.error("Application ID not found");
      return;
    }

    try {
      setLoading(true);
      // Mock resume viewing for now
      toast.info("Opening resume...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Open mock resume in new tab
      window.open(DEFAULT_RESUME_URL, '_blank');
      toast.success("Resume opened in a new tab");
      
    } catch (error) {
      console.error('Error viewing resume:', error);
      toast.error("Failed to open resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleViewResume
  };
};
