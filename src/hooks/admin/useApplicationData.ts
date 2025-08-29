import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { DetailedStats, SimpleApplicationDetail } from '@/types/admin';
import { calculateDetailedStats } from '@/utils/admin/dashboardUtils';
import { adminService, applicationService } from '@/services/serviceManager';

export const useApplicationData = (applications: SimpleApplicationDetail[]) => {
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [detailedStats, setDetailedStats] = useState<DetailedStats>({
    totalRegistered: 0,
    totalStartedInterview: 0,
    totalCompletedInterview: 0,
    totalLeftMidway: 0,
    neverStartedInterview: 0,
    totalPassed: 0,
    totalFailed: 0,
    interviewStartRate: 0,
    interviewCompletionRate: 0,
    passRate: 0,
    failRate: 0,
    leftMidwayRate: 0
  });



  const fetchApplicationData = useCallback(async () => {
    try {
      // Get total count from backend
              const countResponse = await applicationService.getApplicationsCount();
      
      if (countResponse.status && countResponse.data) {
        setTotalApplicantsCount(countResponse.data.total);
      } else {
        // Fallback to current page data if count fails
        setTotalApplicantsCount(applications.length);
      }

      console.log('📊 Real applications data:', {
        pageDataLength: applications.length,
        totalCount: countResponse.status ? countResponse.data?.total : 'unknown'
      });

      // Calculate detailed statistics from current page
      const stats = calculateDetailedStats(applications);
      setDetailedStats(stats);

    } catch (error) {
      console.error('❌ Error in fetchApplicationData:', error);
      // Fallback to current page data
      setTotalApplicantsCount(applications.length);
      const stats = calculateDetailedStats(applications);
      setDetailedStats(stats);
      
      toast.error("Failed to fetch total count. Using current page data.");
    }
  }, [applications]);

  useEffect(() => {
    fetchApplicationData();
  }, [fetchApplicationData]);

  return {
    totalApplicantsCount,
    detailedStats,
    fetchApplicationData
  };
};
