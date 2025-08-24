import { useState } from 'react';
import { adminService } from '@/services/serviceManager';
import { ApplicationsServiceFilters } from '@/types';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdminDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getAdminDashboardStats();
      
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

  const getAdminApplications = async (page: number = 1, pageSize: number = 10, filters?: ApplicationsServiceFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getAdminApplications(page, pageSize, filters);
      
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
      const response = await adminService.updateApplicationStatus(id, status);
      
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
      const response = await adminService.deleteApplication(id);
      
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

  const getAdminProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getAdminProfile();
      
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
    getAdminDashboardStats,
    getAdminApplications,
    updateApplicationStatus,
    deleteApplication,
    getAdminProfile
  };
};
