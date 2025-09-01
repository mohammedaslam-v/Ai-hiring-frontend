import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { dashboardAnalyticsService } from '@/services/dashboardAnalyticsService';
import { 
  DashboardState, 
  UseDashboardReturn,
  DashboardAnalytics,
  DashboardAnalyticsSummary,
  InterviewStats,
  DailyTrends,
  FunnelAnalytics
} from '@/types/dashboard';

// Query keys for React Query
const DASHBOARD_QUERY_KEYS = {
  analytics: ['dashboard', 'analytics'] as const,
  summary: ['dashboard', 'summary'] as const,
  interviewStats: ['dashboard', 'interviewStats'] as const,
  dailyTrends: ['dashboard', 'dailyTrends'] as const,
  funnelAnalytics: ['dashboard', 'funnelAnalytics'] as const,
  all: ['dashboard', 'all'] as const,
};

// Custom hook for managing dashboard analytics
export const useDashboardAnalytics = (): UseDashboardReturn => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Initialize dashboard state
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    analytics: null,
    summary: null,
    interviewStats: null,
    dailyTrends: [],
    funnelAnalytics: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  // Fetch dashboard analytics
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.analytics,
    queryFn: dashboardAnalyticsService.getDashboardAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Fetch dashboard summary
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary,
    queryFn: dashboardAnalyticsService.getDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Fetch interview statistics
  const {
    data: interviewStats,
    isLoading: interviewStatsLoading,
    error: interviewStatsError,
    refetch: refetchInterviewStats
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.interviewStats,
    queryFn: dashboardAnalyticsService.getInterviewStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Fetch daily trends
  const {
    data: dailyTrends,
    isLoading: dailyTrendsLoading,
    error: dailyTrendsError,
    refetch: refetchDailyTrends
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.dailyTrends,
    queryFn: () => dashboardAnalyticsService.getDailyTrends(30),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 60 * 1000, // 1 minute
    retry: 3,
    retryDelay: 1000
  });

  // Fetch funnel analytics
  const {
    data: funnelAnalytics,
    isLoading: funnelAnalyticsLoading,
    error: funnelAnalyticsError,
    refetch: refetchFunnelAnalytics
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.funnelAnalytics,
    queryFn: dashboardAnalyticsService.getFunnelAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Update dashboard state when data changes
  useEffect(() => {
    const isLoading = analyticsLoading || summaryLoading || interviewStatsLoading || 
                     dailyTrendsLoading || funnelAnalyticsLoading;
    
    const currentError = analyticsError || summaryError || interviewStatsError || 
                        dailyTrendsError || funnelAnalyticsError;

    setDashboardState(prev => ({
      ...prev,
      analytics: analytics || null,
      summary: summary || null,
      interviewStats: interviewStats || null,
      dailyTrends: dailyTrends || [],
      funnelAnalytics: funnelAnalytics || [],
      isLoading,
      error: currentError ? (currentError as Error).message : null,
      lastUpdated: new Date().toISOString()
    }));

    // Set error state
    if (currentError) {
      setError((currentError as Error).message);
    } else {
      setError(null);
    }
  }, [
    analytics, summary, interviewStats, dailyTrends, funnelAnalytics,
    analyticsLoading, summaryLoading, interviewStatsLoading, dailyTrendsLoading, funnelAnalyticsLoading,
    analyticsError, summaryError, interviewStatsError, dailyTrendsError, funnelAnalyticsError
  ]);

  // Individual fetch functions
  const fetchAnalytics = useCallback(async (): Promise<void> => {
    try {
      await refetchAnalytics();
      toast.success('Dashboard analytics updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
      toast.error(errorMessage);
      throw error;
    }
  }, [refetchAnalytics]);

  const fetchSummary = useCallback(async (): Promise<void> => {
    try {
      await refetchSummary();
      toast.success('Dashboard summary updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch summary';
      toast.error(errorMessage);
      throw error;
    }
  }, [refetchSummary]);

  const fetchInterviewStats = useCallback(async (): Promise<void> => {
    try {
      await refetchInterviewStats();
      toast.success('Interview statistics updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch interview statistics';
      toast.error(errorMessage);
      throw error;
    }
  }, [refetchInterviewStats]);

  const fetchDailyTrends = useCallback(async (days: number = 30): Promise<void> => {
    try {
      await refetchDailyTrends();
      toast.success('Daily trends updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch daily trends';
      toast.error(errorMessage);
      throw error;
    }
  }, [refetchDailyTrends]);

  const fetchFunnelAnalytics = useCallback(async (): Promise<void> => {
    try {
      await refetchFunnelAnalytics();
      toast.success('Funnel analytics updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch funnel analytics';
      toast.error(errorMessage);
      throw error;
    }
  }, [refetchFunnelAnalytics]);

  // Refresh all data
  const refreshAll = useCallback(async (): Promise<void> => {
    try {
      setDashboardState(prev => ({ ...prev, isLoading: true }));
      
      await Promise.all([
        refetchAnalytics(),
        refetchSummary(),
        refetchInterviewStats(),
        refetchDailyTrends(),
        refetchFunnelAnalytics()
      ]);

      toast.success('All dashboard data refreshed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh dashboard data';
      toast.error(errorMessage);
      throw error;
    } finally {
      setDashboardState(prev => ({ ...prev, isLoading: false }));
    }
  }, [refetchAnalytics, refetchSummary, refetchInterviewStats, refetchDailyTrends, refetchFunnelAnalytics]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    setDashboardState(prev => ({ ...prev, error: null }));
  }, []);

  // Invalidate all queries (useful for manual refresh)
  const invalidateAllQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [queryClient]);

  return {
    // State
    dashboardState,
    
    // Actions
    fetchAnalytics,
    fetchSummary,
    fetchInterviewStats,
    fetchDailyTrends,
    fetchFunnelAnalytics,
    refreshAll,
    
    // Utilities
    isLoading: dashboardState.isLoading,
    error: dashboardState.error || error,
    clearError
  };
};
