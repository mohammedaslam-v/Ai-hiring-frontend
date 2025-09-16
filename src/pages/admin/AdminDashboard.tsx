import { useMemo } from "react";
import ApplicantDetailsModal from "@/components/admin/ApplicantDetailsModal";
 
 
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";


import TrendsChart from "@/components/admin/analytics/TrendsChart";
import FunnelChart from "@/components/admin/analytics/FunnelChart";
import AlertsBanner from "@/components/admin/AlertsBanner";

import ApplicationsManagement from "@/components/admin/ApplicationsManagement";

import { DashboardApplicationDetail, DetailedStats } from '@/types/admin';

// Import new hooks and utilities
import { useToughTongueSync } from "@/hooks/admin/useToughTongueSync";
import { useApplicationManagement } from "@/hooks/admin/useApplicationManagement";
import { useDashboardSummary } from "@/hooks/admin/useDashboardSummary";
import { useApplicantDetails } from "@/hooks/admin/useApplicantDetails";
import { useDashboardAnalytics } from "@/hooks/admin/useDashboardAnalytics";
 
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useAdminDashboardData } from "@/hooks/admin/useAdminDashboardData";
import { mapApplicationsToComponentFormat } from "@/utils/admin/dashboardUtils";
import { EMPTY_TRENDS_DATA } from "@/constants/admin/dashboardConstants";

const AdminDashboard = () => {
  // Use the new dashboard analytics hook for real-time data
  const {
    dashboardState,
    refreshAll,
    isLoading: dashboardLoading,
    error: dashboardError,
    clearError
  } = useDashboardAnalytics();

  // Use the new combined dashboard data hook
  const {
    applications,
    currentPage: hookCurrentPage,
    totalPages: hookTotalPages,
    isLoading: hookLoading,
    goToPage,
    nextPage,
    prevPage,
    totalApplicantsCount,
    detailedStats,
    fetchApplicationData
  } = useAdminDashboardData();

  // Use new custom hooks
  const {
    refreshingSession,
    handleRefreshToughTongueData
  } = useToughTongueSync();

  const {
    forcingAll,
    handleDeleteApplication,
    handleExportToExcel,
    handleForceRefreshAll,
    handleTestApi,
    handleBulkSync
  } = useApplicationManagement();

  const {
    summary,
    summaryLoading
  } = useDashboardSummary();

  const {
    selectedApplicant,
    isModalOpen,
    handleViewDetails,
    closeModal
  } = useApplicantDetails();

   
  const {
    handleLogout
  } = useAdminAuth();

  // Use real-time dashboard data only
  const trendsData = useMemo(() => {
    return dashboardState.dailyTrends.length > 0 ? dashboardState.dailyTrends : EMPTY_TRENDS_DATA;
  }, [dashboardState.dailyTrends]);

  // Use real-time funnel data
  const funnelData = useMemo(() => {
    return dashboardState.funnelAnalytics.length > 0 ? dashboardState.funnelAnalytics : [];
  }, [dashboardState.funnelAnalytics]);

  // Map hook data to match component interfaces
  const mappedApplications = mapApplicationsToComponentFormat(applications);

  // Use dashboard analytics data or fallback to old summary
  const dashboardSummary = dashboardState.summary;

  if (hookLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bambinos-blue mx-auto mb-4"></div>
          <p className="text-bambinos-blue">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30">
      <AdminHeader
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <div className="flex justify-end items-center">
            <div className="flex items-center space-x-2">
              {dashboardError && (
                <button
                  onClick={clearError}
                  className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                >
                  Clear Error
                </button>
              )}
              <button
                onClick={refreshAll}
                disabled={dashboardLoading}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
              >
                {dashboardLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
        {dashboardError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
            <strong>Error:</strong> {dashboardError}
          </div>
        )}
        {/* Dashboard Summary - Now using real-time data */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Registered */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-bambinos-blue">
              {dashboardLoading || !dashboardSummary ? "—" : dashboardSummary.totalApplicants}
            </div>
            <div className="text-xs text-gray-600">Applicants filled form</div>
          </div>

          {/* Started AI Interview */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-bambinos-green">
              {dashboardLoading || !dashboardSummary ? "—" : `${dashboardSummary.startedInterview} (${dashboardSummary.startedInterviewPercentage.toFixed(1)}%)`}
            </div>
            <div className="text-xs text-gray-600">Started AI interview</div>
          </div>

          {/* Completed Interview */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-bambinos-purple">
              {dashboardLoading || !dashboardSummary ? "—" : `${dashboardSummary.completedInterview} (${dashboardSummary.completedInterviewPercentage.toFixed(1)}%)`}
            </div>
            <div className="text-xs text-gray-600">Finished full AI interview</div>
          </div>

          {/* Left Midway intentionally hidden */}
          {null}

          {/* Passed */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-600">
              {dashboardLoading || !dashboardSummary ? "—" : `${dashboardSummary.passed} (${dashboardSummary.passedPercentage.toFixed(1)}%)`}
            </div>
            <div className="text-xs text-gray-600">PASSED</div>
          </div>

          {/* Failed */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-600">
              {dashboardLoading || !dashboardSummary ? "—" : `${dashboardSummary.failed} (${dashboardSummary.failedPercentage.toFixed(1)}%)`}
            </div>
            <div className="text-xs text-gray-600">FAILED</div>
          </div>
        </div>

        {/* Summary Text - Now using real-time data */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-bambinos-blue mb-4">Summary</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>{dashboardSummary?.totalApplicants ?? "—"} people filled the application form</li>
            <li>{dashboardSummary ? `${dashboardSummary.startedInterview} people (${dashboardSummary.startedInterviewPercentage.toFixed(1)}%) started the AI interview` : "—"}</li>
            <li>{dashboardSummary ? `${dashboardSummary.neverStartedInterview} people never even started the interview` : "—"}</li>
            {null}
            <li>{dashboardSummary ? `${dashboardSummary.completedInterview} people (${dashboardSummary.completedInterviewPercentage.toFixed(1)}%) completed the full interview` : "—"}</li>
            <li>{dashboardSummary ? `Out of those who completed: ${dashboardSummary.passed} passed (${dashboardSummary.passedPercentage.toFixed(1)}%) and ${dashboardSummary.failed} failed (${dashboardSummary.failedPercentage.toFixed(1)}%)` : "—"}</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendsChart data={trendsData} />
          <FunnelChart data={funnelData} />
        </div>



        <div className="mt-8">
          <ApplicationsManagement />
        </div>

        {null}

        {/* Applicant Details Modal */}
        <ApplicantDetailsModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={closeModal}
          onRefreshToughTongue={handleRefreshToughTongueData}
          refreshingSession={refreshingSession}
        />

      

       


      </div>
    </div>
  );
};

export default AdminDashboard;