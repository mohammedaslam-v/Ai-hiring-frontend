import { useState } from 'react';
import { candidateService } from '@/services/serviceManager';
import { ApplicationData, ProfileData } from '@/types';

export const useCandidate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const submitApplication = async (applicationData: ApplicationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await candidateService.submitApplication(applicationData);
      
      if (response.status) {
        setLoading(false);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        setLoading(false);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = "Something went wrong";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const uploadResume = async (file: File, applicationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await candidateService.uploadResume(file, applicationId);
      
      if (response.status) {
        setLoading(false);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        setLoading(false);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = "Something went wrong";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const getApplicationStatus = async (applicationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await candidateService.getApplicationStatus(applicationId);
      
      if (response.status) {
        setLoading(false);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        setLoading(false);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = "Something went wrong";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const updateCandidateProfile = async (profileData: Partial<ProfileData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await candidateService.updateCandidateProfile(profileData);
      
      if (response.status) {
        setLoading(false);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        setLoading(false);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = "Something went wrong";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const getCandidateProfile = async (candidateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await candidateService.getCandidateProfile(candidateId);
      
      if (response.status) {
        setLoading(false);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        setLoading(false);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = "Something went wrong";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    loading,
    error,
    submitApplication,
    uploadResume,
    getApplicationStatus,
    updateCandidateProfile,
    getCandidateProfile
  };
};
