import { useState, useEffect } from 'react';
import { DashboardSummary } from '@/constants/admin/dashboardConstants';
import { EMPTY_SUMMARY } from '@/constants/admin/dashboardConstants';
import { dashboardAnalyticsService } from '@/services/dashboardAnalyticsService';

export const useDashboardSummary = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      // Use real API data
      const apiSummary = await dashboardAnalyticsService.getDashboardSummary();
      
      // Map API data to component format
      const mappedSummary: DashboardSummary = {
        total_registered: apiSummary.totalApplicants,
        started_ai: apiSummary.startedInterview,
        completed: apiSummary.completedInterview,
        left_midway: apiSummary.leftMidway,
        passed: apiSummary.passed,
        failed: apiSummary.failed
      };
      
      setSummary(mappedSummary);
      setSummaryLoading(false);
    } catch (error) {
      console.error('Error loading dashboard summary:', error);
      setSummary(EMPTY_SUMMARY);
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return {
    summary,
    summaryLoading,
    loadSummary
  };
};
