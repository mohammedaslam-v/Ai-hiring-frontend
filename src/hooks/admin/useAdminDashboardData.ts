import { useEffect } from 'react';
import { useApplicationData } from './useApplicationData';
import { usePaginatedApplicationsData } from './usePaginatedApplicationsData';

export const useAdminDashboardData = () => {
  // Use the pagination hook that fetches real data from backend
  const {
    rows: applications,
    count: totalItems,
    page: currentPage,
    pageSize,
    loading: isLoading,
    updatePage,
    updatePageSize
  } = usePaginatedApplicationsData();

  // Use application data hook
  const {
    totalApplicantsCount,
    detailedStats,
    fetchApplicationData
  } = useApplicationData(applications);

  // Fetch data when pagination changes
  useEffect(() => {
    fetchApplicationData();
  }, [currentPage, fetchApplicationData]);

  const goToPage = (page: number) => updatePage(page);
  const nextPage = () => updatePage(currentPage + 1);
  const prevPage = () => updatePage(currentPage - 1);
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    applications,
    currentPage,
    totalPages,
    isLoading,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    totalApplicantsCount,
    detailedStats,
    fetchApplicationData
  };
};
