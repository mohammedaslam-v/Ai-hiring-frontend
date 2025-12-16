import { useState, useEffect, useCallback } from 'react';
import teacherJourneyService from '@/services/teacherJourney.service';
import { 
  TeacherJourney, 
  TeacherJourneyFilters, 
  TeacherJourneyStats,
  SubmitDemoFeedbackData,
  UpdateTeacherJourneyData
} from '@/types/teacherJourney';

export const useTeacherJourney = (initialFilters: TeacherJourneyFilters = {}) => {
  const [journeys, setJourneys] = useState<TeacherJourney[]>([]);
  const [stats, setStats] = useState<TeacherJourneyStats | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TeacherJourneyFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  // Pagination info
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch journeys
  const fetchJourneys = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await teacherJourneyService.getAllJourneys(filters);
      
      if (response.status && response.data) {
        setJourneys(response.data.journeys);
        setTotal(response.data.total);
        setPagination(response.data.pagination);
      } else {
        setError(response.message);
        setJourneys([]);
      }
    } catch (err) {
      setError('Failed to fetch teacher journeys');
      setJourneys([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);

    try {
      const response = await teacherJourneyService.getStats();
      
      if (response.status && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TeacherJourneyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1 // Reset to page 1 unless explicitly set
    }));
  }, []);

  // Update page
  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Update page size
  const updatePageSize = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Update sort
  const updateSort = useCallback((sortBy: TeacherJourneyFilters['sortBy'], sortOrder?: 'asc' | 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder ?? prev.sortOrder
    }));
  }, []);

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, []);

  // Update journey
  const updateJourney = useCallback(async (id: number, data: UpdateTeacherJourneyData): Promise<boolean> => {
    try {
      const response = await teacherJourneyService.updateJourney(id, data);
      
      if (response.status) {
        // Refresh the list
        await fetchJourneys();
        await fetchStats();
        return true;
      }
      
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to update teacher journey');
      return false;
    }
  }, [fetchJourneys, fetchStats]);

  // Submit demo feedback
  const submitDemoFeedback = useCallback(async (data: SubmitDemoFeedbackData): Promise<boolean> => {
    try {
      const response = await teacherJourneyService.submitDemoFeedback(data);
      
      if (response.status) {
        // Refresh the list
        await fetchJourneys();
        await fetchStats();
        return true;
      }
      
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to submit demo feedback');
      return false;
    }
  }, [fetchJourneys, fetchStats]);

  // Create journey from candidate
  const createJourneyFromCandidate = useCallback(async (applicationId: string): Promise<boolean> => {
    try {
      const response = await teacherJourneyService.createJourneyFromCandidate(applicationId);
      
      if (response.status) {
        // Refresh the list
        await fetchJourneys();
        await fetchStats();
        return true;
      }
      
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to create teacher journey');
      return false;
    }
  }, [fetchJourneys, fetchStats]);

  // Delete journey
  const deleteJourney = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await teacherJourneyService.deleteJourney(id);
      
      if (response.status) {
        // Refresh the list
        await fetchJourneys();
        await fetchStats();
        return true;
      }
      
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to delete teacher journey');
      return false;
    }
  }, [fetchJourneys, fetchStats]);

  // Calculate pagination info
  const paginationInfo = {
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    startIndex: total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1,
    endIndex: Math.min(pagination.page * pagination.limit, total),
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev
  };

  // Check if filters are applied
  const isFiltered = Boolean(
    filters.search ||
    (filters.demoStatus && filters.demoStatus !== 'all') ||
    (filters.inductionAttendance && filters.inductionAttendance !== 'all') ||
    (filters.trainingStatus && filters.trainingStatus !== 'all') ||
    (filters.certificationStatus && filters.certificationStatus !== 'all') ||
    (filters.goLiveReadiness && filters.goLiveReadiness !== 'all') ||
    (filters.assignedSubject && filters.assignedSubject !== 'all') ||
    filters.fromDate ||
    filters.toDate
  );

  return {
    journeys,
    stats,
    total,
    loading,
    statsLoading,
    error,
    filters,
    pagination: paginationInfo,
    isFiltered,
    isEmpty: journeys.length === 0,
    
    // Actions
    updateFilters,
    updatePage,
    updatePageSize,
    updateSort,
    toggleSortOrder,
    resetFilters,
    refreshJourneys: fetchJourneys,
    refreshStats: fetchStats,
    
    // CRUD operations
    updateJourney,
    submitDemoFeedback,
    createJourneyFromCandidate,
    deleteJourney,
    
    // Clear error
    clearError: () => setError(null)
  };
};

export default useTeacherJourney;

