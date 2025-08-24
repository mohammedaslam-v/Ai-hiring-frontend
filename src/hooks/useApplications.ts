import { useState } from 'react';
import { applicationService } from '@/services/serviceManager';
import { ApplicationsServiceFilters } from '@/types';

export const useApplications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApplicationsCount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationService.getApplicationsCount();
      
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

  const getApplicationsPage = async (page: number = 1, pageSize: number = 10, filters?: ApplicationsServiceFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationService.getApplicationsPage(page, pageSize, filters);
      
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

  const getApplicationById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationService.getApplicationById(id);
      
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

  const updateApplicationStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationService.updateApplicationStatus(id, status);
      
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

  const deleteApplication = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationService.deleteApplication(id);
      
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
    getApplicationsCount,
    getApplicationsPage,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication
  };
};
