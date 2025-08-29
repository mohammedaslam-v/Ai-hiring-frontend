import { useMemo } from "react";
import ApplicantDetailsModal from "@/components/admin/ApplicantDetailsModal";
 
 
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import SystemStatus from "@/components/admin/SystemStatus";

import TrendsChart from "@/components/admin/analytics/TrendsChart";
import FunnelChart from "@/components/admin/analytics/FunnelChart";
import AlertsBanner from "@/components/admin/AlertsBanner";
import AuditLog from "@/components/admin/AuditLog";
import PaginatedApplicationsTable from "@/components/admin/PaginatedApplicationsTable";
import ApplicationsManagement from "@/components/admin/ApplicationsManagement";

import { DashboardApplicationDetail, DetailedStats } from '@/types/admin';

// Import new hooks and utilities
import { useToughTongueSync } from "@/hooks/admin/useToughTongueSync";
import { useApplicationManagement } from "@/hooks/admin/useApplicationManagement";
import { useDashboardSummary } from "@/hooks/admin/useDashboardSummary";
import { useApplicantDetails } from "@/hooks/admin/useApplicantDetails";
 
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useAdminDashboardData } from "@/hooks/admin/useAdminDashboardData";
import { MOCK_TRENDS_DATA } from "@/constants/admin/dashboardConstants";
import { mapApplicationsToComponentFormat } from "@/utils/admin/dashboardUtils";

const AdminDashboard = () => {
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

  // Trends data calculation - using mock data from constants
  const trendsData = useMemo(() => MOCK_TRENDS_DATA, []);

  // Map hook data to match component interfaces
  const mappedApplications = mapApplicationsToComponentFormat(applications);

  if (hookLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bambinos-blue mx-auto mb-4"></div>
          <p className="text-bambinos-blue">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20">
      <AdminHeader
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div style={{ padding: '8px 10px', background: '#FFF3CD', border: '1px solid #FFEC99', borderRadius: 8, marginBottom: 12 }}>
          <strong>DEBUG:</strong> You are editing <code>AdminDashboard.tsx</code> ✅
        </div>
        {/* Dashboard Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Registered */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-bambinos-blue">
              {summaryLoading || !summary ? "—" : summary.total_registered}
            </div>
            <div className="text-sm text-gray-600">Applicants filled form</div>
          </div>

          {/* Started AI Interview */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-bambinos-green">
              {summaryLoading || !summary ? "—" : `${summary.started_ai} (${Math.round((summary.started_ai / Math.max(summary.total_registered, 1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">Started AI interview</div>
          </div>

          {/* Completed Interview */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-bambinos-purple">
              {summaryLoading || !summary ? "—" : `${summary.completed} (${Math.round((summary.completed / Math.max(summary.started_ai, 1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">Finished full AI interview</div>
          </div>

          {/* Left Midway */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {summaryLoading || !summary ? "—" : `${summary.left_midway} (${Math.round((summary.left_midway / Math.max(summary.started_ai, 1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">Started but didn't finish</div>
          </div>

          {/* Passed */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {summaryLoading || !summary ? "—" : `${summary.passed} (${Math.round((summary.passed / Math.max(summary.completed, 1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">PASSED</div>
          </div>

          {/* Failed */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {summaryLoading || !summary ? "—" : `${summary.failed} (${Math.round((summary.failed / Math.max(summary.completed, 1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">FAILED</div>
          </div>
        </div>

        {/* Summary Text */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-bambinos-blue mb-4">Summary</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>{summary?.total_registered ?? "—"} people filled the application form</li>
            <li>{summary ? `${summary.started_ai} people (${Math.round((summary.started_ai / Math.max(summary.total_registered, 1)) * 100)}%) started the AI interview` : "—"}</li>
            <li>{summary ? `${(summary.total_registered - summary.started_ai)} people never even started the interview` : "—"}</li>
            <li>{summary ? `${summary.left_midway} people (${Math.round((summary.left_midway / Math.max(summary.started_ai, 1)) * 100)}%) started but left without finishing` : "—"}</li>
            <li>{summary ? `${summary.completed} people (${Math.round((summary.completed / Math.max(summary.started_ai, 1)) * 100)}%) completed the full interview` : "—"}</li>
            <li>{summary ? `Out of those who completed: ${summary.passed} passed (${Math.round((summary.passed / Math.max(summary.completed, 1)) * 100)}%) and ${summary.failed} failed (${Math.round((summary.failed / Math.max(summary.completed, 1)) * 100)}%)` : "—"}</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendsChart data={trendsData} />
          <FunnelChart detailedStats={detailedStats} />
        </div>

        <SystemStatus
          applicants={applications}
          onRefreshData={fetchApplicationData}
          onForceRefresh={handleForceRefreshAll}
          onTestApi={handleTestApi}
          onBulkSync={handleBulkSync}
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-bambinos-blue">Applications Management</h2>
          <div style={{ padding: '6px 10px', background: '#eef6ff', border: '1px solid #cde3ff', borderRadius: 8, marginTop: 12, marginBottom: 16 }}>
            <small>Loaded <strong>ApplicationsManagement</strong> ✅</small>
          </div>
          <ApplicationsManagement />
        </div>

        {/* Keep existing legacy table for comparison - remove this section once satisfied */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 mt-6">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Legacy Table (for comparison)</h3>
          <p className="text-xs text-yellow-700">This old table will be removed once the new paginated table is verified to work correctly.</p>
        </div>

        {/* Applicant Details Modal */}
        <ApplicantDetailsModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={closeModal}
          onRefreshToughTongue={handleRefreshToughTongueData}
          refreshingSession={refreshingSession}
        />

      

       

        {/* Audit Log */}
        <div className="mt-8">
          <AuditLog />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;