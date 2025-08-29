import { useState, useEffect } from 'react';
import { DashboardSummary } from '@/constants/admin/dashboardConstants';
import { MOCK_SUMMARY } from '@/constants/admin/dashboardConstants';

export const useDashboardSummary = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      // Use mock data instead of Supabase
      setTimeout(() => {
        setSummary(MOCK_SUMMARY);
        setSummaryLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading dashboard summary:', error);
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
