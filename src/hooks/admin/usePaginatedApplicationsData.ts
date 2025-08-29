import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '@/services/serviceManager';
import { SimpleApplicationDetail, PaginationData } from '@/types/admin';

// Define a proper type for the application data from the API
interface ApiApplication {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  position?: string;
  subjects?: string[];
  status?: string;
  createdAt?: string;
  submittedAt?: string;
  applicationId?: string;
}

export const usePaginatedApplicationsData = () => {
  const [paginationData, setPaginationData] = useState<PaginationData>({
    rows: [],
    count: 0,
    page: 1,
    pageSize: 10,
    loading: false
  });

  const loadApplications = useCallback(async (page: number, pageSize: number) => {
    try {
      setPaginationData(prev => ({ ...prev, loading: true }));
      
      const response = await applicationService.getApplicationsPage(page, pageSize);
      
      if (response.status && response.data) {
        const { applications, total, pagination } = response.data;
        
        // Transform applications to match SimpleApplicationDetail interface
        const validApplications: SimpleApplicationDetail[] = applications.map((app: ApiApplication) => ({
          id: app.id || app._id || `app-${Date.now()}`,
          firstName: app.firstName || 'Unknown',
          lastName: app.lastName || 'Unknown',
          email: app.email || 'No email',
          phone: app.phone || app.phoneNumber || 'No phone',
          position: app.position || 'No position',
          subjects: Array.isArray(app.subjects) ? app.subjects : [],
          status: app.status || 'pending',
          createdAt: app.createdAt || app.submittedAt || new Date().toISOString(),
          applicationId: app.applicationId || app.id || `APP-${Date.now()}`
        }));

        setPaginationData({
          rows: validApplications,
          count: total || validApplications.length,
          page,
          pageSize,
          loading: false
        });
      } else {
        console.error('Failed to load applications:', response.message);
        setPaginationData(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setPaginationData(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const updatePage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(paginationData.count / paginationData.pageSize)) {
      setPaginationData(prev => ({ ...prev, page: newPage }));
      loadApplications(newPage, paginationData.pageSize);
    }
  }, [paginationData.count, paginationData.pageSize, loadApplications]);

  const updatePageSize = useCallback((newPageSize: number) => {
    if (newPageSize > 0 && newPageSize <= 1000) {
      setPaginationData(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
      loadApplications(1, newPageSize);
    }
  }, [loadApplications]);

  // Load applications on mount
  useEffect(() => {
    loadApplications(paginationData.page, paginationData.pageSize);
  }, [paginationData.page, paginationData.pageSize, loadApplications]);

  return {
    rows: paginationData.rows,
    count: paginationData.count,
    page: paginationData.page,
    pageSize: paginationData.pageSize,
    loading: paginationData.loading,
    updatePage,
    updatePageSize,
    loadApplications: () => loadApplications(paginationData.page, paginationData.pageSize)
  };
};
