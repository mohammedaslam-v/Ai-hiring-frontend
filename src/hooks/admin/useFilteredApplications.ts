import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from '../useDebounce';
import ApplicationsFilteredService from '@/services/applicationsFiltered.service';
import { AppListFilters, AppListResponse, ApplicantRow, DEFAULT_FILTERS } from '@/types/admin/applications';

const applicationsService = new ApplicationsFilteredService();

export const useFilteredApplications = () => {
  const [filters, setFilters] = useState<AppListFilters>(DEFAULT_FILTERS);
  const [applications, setApplications] = useState<ApplicantRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  // Memoized debounced filters to trigger API calls
  const debouncedFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch
  }), [filters, debouncedSearch]);

  // Fetch applications based on filters
  const fetchApplications = useCallback(async (currentFilters: AppListFilters) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Hook - Calling service with filters:', currentFilters);
      console.log('📅 Hook - Date filter status:', {
        fromDate: currentFilters.fromDate,
        toDate: currentFilters.toDate,
        fromLength: currentFilters.fromDate?.length,
        toLength: currentFilters.toDate?.length,
        bothComplete: currentFilters.fromDate && currentFilters.toDate && currentFilters.fromDate.length === 10 && currentFilters.toDate.length === 10
      });
      
      const response = await applicationsService.getFilteredApplications(currentFilters);
      console.log('🔍 Hook - Service response:', response);
      
      if (response.status && response.data) {
        console.log('🔍 Hook - Setting applications:', response.data.applications);
  
        setApplications(response.data.applications || []);
        setTotal(response.data.pagination?.total || 0);
      } else {
        console.log('🔍 Hook - Error response:', response);
 
        setError(response.message || 'Failed to fetch applications');
        setApplications([]);
        setTotal(0);
      }
    } catch (err) {
      setError('An error occurred while fetching applications');
      setApplications([]);
      setTotal(0);
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters and trigger fetch
  const updateFilters = useCallback((newFilters: Partial<AppListFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Reset to page 1 when filters change
      if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  // Update page
  const updatePage = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  // Update page size
  const updatePageSize = useCallback((limit: number) => {
    updateFilters({ limit, page: 1 });
  }, [updateFilters]);

  // Update sort
  const updateSort = useCallback((sortBy: AppListFilters['sortBy'], sortOrder: AppListFilters['sortOrder']) => {
    updateFilters({ sortBy, sortOrder });
  }, [updateFilters]);

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Fetch applications when debounced filters change
  useEffect(() => {
    fetchApplications(debouncedFilters);
  }, [debouncedFilters, fetchApplications]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const currentPage = filters.page || 1;
    const currentLimit = filters.limit || 10;
    const startIndex = (currentPage - 1) * currentLimit + 1;
    const endIndex = Math.min(currentPage * currentLimit, total);
    
    return {
      currentPage,
      currentLimit,
      startIndex,
      endIndex,
      totalPages: Math.ceil(total / currentLimit),
      hasNext: currentPage < Math.ceil(total / currentLimit),
      hasPrev: currentPage > 1
    };
  }, [filters.page, filters.limit, total]);

  return {
    // State
    filters,
    applications,
    total,
    loading,
    error,
    
    // Actions
    updateFilters,
    updatePage,
    updatePageSize,
    updateSort,
    toggleSortOrder,
    resetFilters,
    
    // Pagination info
    paginationInfo,
    
    // Computed values
    isEmpty: applications?.length === 0 && !loading,
    isFiltered: Object.keys(filters).some(key => 
      key !== 'page' && key !== 'limit' && 
      filters[key as keyof AppListFilters] !== DEFAULT_FILTERS[key as keyof AppListFilters]
    )
  };
};
