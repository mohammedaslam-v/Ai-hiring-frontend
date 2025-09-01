import axios from 'axios';
import { 
  DashboardAnalytics, 
  DashboardAnalyticsSummary, 
  InterviewStats, 
  DailyTrends, 
  FunnelAnalytics,
  DashboardApiResponse 
} from '@/types/dashboard';

// Dashboard analytics service for frontend API calls
class DashboardAnalyticsService {
  private readonly baseURL = 'http://localhost:5000/api/admin/dashboard';

  constructor() {
    // Ensure baseURL is properly set
    if (!this.baseURL) {
      console.error('Dashboard Analytics Service: baseURL is undefined');
    }
  }

  /**
   * Get comprehensive dashboard analytics
   */
  getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
    try {
      const response = await axios.get<DashboardApiResponse<DashboardAnalytics>>(`${this.baseURL}/analytics`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw new Error('Failed to fetch dashboard analytics');
    }
  }

  /**
   * Get dashboard summary with percentages
   */
  getDashboardSummary = async (): Promise<DashboardAnalyticsSummary> => {
    try {
      const response = await axios.get<DashboardApiResponse<DashboardAnalyticsSummary>>(`${this.baseURL}/summary`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw new Error('Failed to fetch dashboard summary');
    }
  }

  /**
   * Get interview statistics breakdown
   */
  getInterviewStatistics = async (): Promise<InterviewStats> => {
    try {
      const response = await axios.get<DashboardApiResponse<InterviewStats>>(`${this.baseURL}/interview-stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching interview statistics:', error);
      throw new Error('Failed to fetch interview statistics');
    }
  }

  /**
   * Get daily trends data
   */
  getDailyTrends = async (days: number = 30): Promise<DailyTrends[]> => {
    try {
      const response = await axios.get<DashboardApiResponse<DailyTrends[]>>(`${this.baseURL}/daily-trends`, {
        params: { days }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching daily trends:', error);
      throw new Error('Failed to fetch daily trends');
    }
  }

  /**
   * Get funnel analytics data
   */
  getFunnelAnalytics = async (): Promise<FunnelAnalytics[]> => {
    try {
      const response = await axios.get<DashboardApiResponse<FunnelAnalytics[]>>(`${this.baseURL}/funnel-analytics`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching funnel analytics:', error);
      throw new Error('Failed to fetch funnel analytics');
    }
  }

  /**
   * Refresh dashboard cache
   */
  refreshDashboardCache = async (): Promise<boolean> => {
    try {
      const response = await axios.post<DashboardApiResponse<boolean>>(`${this.baseURL}/refresh-cache`);
      return response.data.data;
    } catch (error) {
      console.error('Error refreshing dashboard cache:', error);
      throw new Error('Failed to refresh dashboard cache');
    }
  }

  /**
   * Get all dashboard data in a single call
   */
  getAllDashboardData = async (): Promise<{
    analytics: DashboardAnalytics;
    summary: DashboardAnalyticsSummary;
    interviewStats: InterviewStats;
    dailyTrends: DailyTrends[];
    funnelAnalytics: FunnelAnalytics[];
  }> => {
    try {
      const [
        analytics,
        summary,
        interviewStats,
        dailyTrends,
        funnelAnalytics
      ] = await Promise.all([
        this.getDashboardAnalytics(),
        this.getDashboardSummary(),
        this.getInterviewStatistics(),
        this.getDailyTrends(),
        this.getFunnelAnalytics()
      ]);

      return {
        analytics,
        summary,
        interviewStats,
        dailyTrends,
        funnelAnalytics
      };
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
}

// Export singleton instance
export const dashboardAnalyticsService = new DashboardAnalyticsService();
export default dashboardAnalyticsService;
