import { useMemo, useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Users, Play, CheckCircle, Award, Rocket, Settings, GraduationCap } from "lucide-react";
import ApplicantDetailsModal from "@/components/admin/ApplicantDetailsModal";
import { InterviewerManagementModal } from "@/components/admin/teacher-journey/InterviewerManagementModal";
import { DemoTrainerManagementModal } from "@/components/demo/DemoTrainerManagementModal";

import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import AlertsBanner from "@/components/admin/AlertsBanner";
import ApplicationsManagement from "@/components/admin/ApplicationsManagement";

import { DashboardApplicationDetail, DetailedStats } from '@/types/admin';
import { TeacherJourneyStats } from '@/types/teacherJourney';

// Import new hooks and utilities
import { useToughTongueSync } from "@/hooks/admin/useToughTongueSync";
import { useApplicationManagement } from "@/hooks/admin/useApplicationManagement";
import { useDashboardSummary } from "@/hooks/admin/useDashboardSummary";
import { useApplicantDetails } from "@/hooks/admin/useApplicantDetails";
import { useDashboardAnalytics } from "@/hooks/admin/useDashboardAnalytics";

import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/admin/usePermissions";
import { useAdminDashboardData } from "@/hooks/admin/useAdminDashboardData";
import { mapApplicationsToComponentFormat } from "@/utils/admin/dashboardUtils";
import { teacherJourneyService } from "@/services/teacherJourney.service";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { canManageInterviewers } = usePermissions();
  const [isInterviewerModalOpen, setIsInterviewerModalOpen] = useState(false);
  const [isDemoTrainerModalOpen, setIsDemoTrainerModalOpen] = useState(false);

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

  // State for collapsible summary
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // State for teacher journey stats
  const [journeyStats, setJourneyStats] = useState<TeacherJourneyStats | null>(null);
  const [journeyStatsLoading, setJourneyStatsLoading] = useState(true);

  // Fetch teacher journey stats
  useEffect(() => {
    const fetchJourneyStats = async () => {
      try {
        setJourneyStatsLoading(true);
        const response = await teacherJourneyService.getStats();
        if (response.status && response.data) {
          setJourneyStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching journey stats:', error);
      } finally {
        setJourneyStatsLoading(false);
      }
    };

    fetchJourneyStats();
  }, []);

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
              {canManageInterviewers && (
                <>
                  <button
                    onClick={() => setIsInterviewerModalOpen(true)}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-xs hover:bg-emerald-200 flex items-center gap-1.5 transition-colors border border-emerald-200"
                  >
                    <Settings className="h-3 w-3" />
                    Manage Interviewers
                  </button>
                  <button
                    onClick={() => setIsDemoTrainerModalOpen(true)}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 flex items-center gap-1.5 transition-colors border border-purple-200"
                  >
                    <GraduationCap className="h-3 w-3" />
                    Manage Demo Trainers
                  </button>
                </>
              )}
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
        {/* AI Interview Metrics */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">AI Interview Stage</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {/* Total Registered */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-bambinos-blue">
              {dashboardLoading || !dashboardSummary ? "—" : dashboardSummary.totalApplicants}
            </div>
            <div className="text-xs text-gray-600">Applicants filled form</div>
          </div>

          {/* Started AI Interview */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-amber-600">
              {dashboardLoading || !dashboardSummary ? "—" : `${dashboardSummary.startedInterview} (${dashboardSummary.startedInterviewPercentage.toFixed(1)}%)`}
            </div>
            <div className="text-xs text-gray-600">Started AI interview</div>
          </div>

          {/* Completed Interview */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-purple-600">
              {dashboardLoading || !dashboardSummary ? "—" : `${dashboardSummary.completedInterview} (${dashboardSummary.completedInterviewPercentage.toFixed(1)}%)`}
            </div>
            <div className="text-xs text-gray-600">Finished full AI interview</div>
          </div>

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

        {/* Teacher Journey Metrics */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Teacher Journey Stages</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Demo Stage */}
          <div className="bg-white rounded-lg shadow p-4 border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">DEMO</span>
            </div>
            <div className="text-xl font-bold text-blue-700">
              {journeyStatsLoading ? "—" : journeyStats?.demoStats.selected ?? 0}
            </div>
            <div className="text-xs text-gray-600">Selected</div>
            <div className="mt-2 text-xs text-gray-500">
              Pending: {journeyStats?.demoStats.pending ?? 0} | Not Selected: {journeyStats?.demoStats.notSelected ?? 0}
            </div>
          </div>

          {/* Induction Stage */}
          <div className="bg-white rounded-lg shadow p-4 border border-violet-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-violet-600" />
              <span className="text-xs font-medium text-violet-600">INDUCTION</span>
            </div>
            <div className="text-xl font-bold text-violet-700">
              {journeyStatsLoading ? "—" : journeyStats?.inductionStats.yes ?? 0}
            </div>
            <div className="text-xs text-gray-600">Attended</div>
            <div className="mt-2 text-xs text-gray-500">
              Pending: {journeyStats?.inductionStats.pending ?? 0} | No: {journeyStats?.inductionStats.no ?? 0}
            </div>
          </div>

          {/* Training Stage */}
          <div className="bg-white rounded-lg shadow p-4 border border-amber-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-600">TRAINING</span>
            </div>
            <div className="text-xl font-bold text-amber-700">
              {journeyStatsLoading ? "—" : journeyStats?.trainingStats.completed ?? 0}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
            <div className="mt-2 text-xs text-gray-500">
              Joined: {journeyStats?.trainingStats.joined ?? 0} | Dropped: {journeyStats?.trainingStats.dropped ?? 0}
            </div>
          </div>

          {/* Certification Stage */}
          <div className="bg-white rounded-lg shadow p-4 border border-emerald-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">CERTIFICATION</span>
            </div>
            <div className="text-xl font-bold text-emerald-700">
              {journeyStatsLoading ? "—" : journeyStats?.certificationStats.cleared ?? 0}
            </div>
            <div className="text-xs text-gray-600">Cleared</div>
            <div className="mt-2 text-xs text-gray-500">
              Pending: {journeyStats?.certificationStats.pending ?? 0} | Not Cleared: {journeyStats?.certificationStats.notCleared ?? 0}
            </div>
          </div>

          {/* Go Live Stage */}
          <div className="bg-white rounded-lg shadow p-4 border border-teal-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-medium text-teal-600">GO LIVE</span>
            </div>
            <div className="text-xl font-bold text-teal-700">
              {journeyStatsLoading ? "—" : journeyStats?.goLiveStats.yes ?? 0}
            </div>
            <div className="text-xs text-gray-600">Live Teachers</div>
            <div className="mt-2 text-xs text-gray-500">
              Pending: {journeyStats?.goLiveStats.pending ?? 0} | Needs Training: {journeyStats?.goLiveStats.needsMoreTraining ?? 0}
            </div>
          </div>
        </div>

        {/* Summary Text - Collapsible - CLOSED by default */}
        <Collapsible open={isSummaryOpen} onOpenChange={setIsSummaryOpen} className="mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg">
              <h3 className="text-lg font-semibold text-bambinos-blue">Summary</h3>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isSummaryOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6">
                {/* AI Interview Summary */}
                <h4 className="font-semibold text-gray-700 mb-2">AI Interview</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
                  <li>{dashboardSummary?.totalApplicants ?? "—"} people filled the application form</li>
                  <li>{dashboardSummary ? `${dashboardSummary.startedInterview} people (${dashboardSummary.startedInterviewPercentage.toFixed(1)}%) started the AI interview` : "—"}</li>
                  <li>{dashboardSummary ? `${dashboardSummary.neverStartedInterview} people never even started the interview` : "—"}</li>
                  <li>{dashboardSummary ? `${dashboardSummary.completedInterview} people (${dashboardSummary.completedInterviewPercentage.toFixed(1)}%) completed the full interview` : "—"}</li>
                  <li>{dashboardSummary ? `Out of those who completed: ${dashboardSummary.passed} passed (${dashboardSummary.passedPercentage.toFixed(1)}%) and ${dashboardSummary.failed} failed (${dashboardSummary.failedPercentage.toFixed(1)}%)` : "—"}</li>
                </ul>

                {/* Teacher Journey Summary */}
                <h4 className="font-semibold text-gray-700 mb-2">Teacher Journey</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Demo: {journeyStats?.demoStats.selected ?? 0} selected, {journeyStats?.demoStats.pending ?? 0} pending, {journeyStats?.demoStats.notSelected ?? 0} not selected</li>
                  <li>Induction: {journeyStats?.inductionStats.yes ?? 0} attended, {journeyStats?.inductionStats.pending ?? 0} pending</li>
                  <li>Training: {journeyStats?.trainingStats.completed ?? 0} completed, {journeyStats?.trainingStats.joined ?? 0} joined, {journeyStats?.trainingStats.dropped ?? 0} dropped</li>
                  <li>Certification: {journeyStats?.certificationStats.cleared ?? 0} cleared, {journeyStats?.certificationStats.pending ?? 0} pending, {journeyStats?.certificationStats.notCleared ?? 0} not cleared</li>
                  <li>Go Live: {journeyStats?.goLiveStats.yes ?? 0} live teachers, {journeyStats?.goLiveStats.pending ?? 0} pending</li>
                </ul>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>




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

        {canManageInterviewers && (
          <>
            <InterviewerManagementModal
              isOpen={isInterviewerModalOpen}
              onClose={() => setIsInterviewerModalOpen(false)}
            />
            <DemoTrainerManagementModal
              isOpen={isDemoTrainerModalOpen}
              onClose={() => setIsDemoTrainerModalOpen(false)}
            />
          </>
        )}






      </div>
    </div>
  );
};

export default AdminDashboard;