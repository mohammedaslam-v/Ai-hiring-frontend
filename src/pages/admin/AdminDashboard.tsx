import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import ApplicantDetailsModal from "@/components/admin/ApplicantDetailsModal";
import FeedbackModal from "@/components/admin/FeedbackModal";
import BulkEmailDialog from "@/components/admin/BulkEmailDialog";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import SystemStatus from "@/components/admin/SystemStatus";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import TrendsChart from "@/components/admin/analytics/TrendsChart";
import FunnelChart from "@/components/admin/analytics/FunnelChart";
import AlertsBanner from "@/components/admin/AlertsBanner";
import AuditLog from "@/components/admin/AuditLog";
import { useApplicationsPagination } from "@/hooks/useApplicationsPagination";
import PaginatedApplicationsTable from "@/components/admin/PaginatedApplicationsTable";

interface ApplicationDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  availability: string[];
  application_status: string;
  application_date: string;
  application_date_iso?: string;
  interview_status?: string;
  score?: number;
  interview_started?: string;
  interview_completed?: string;
  interview_scheduled?: string;
  session_id?: string;
  evaluation?: Record<string, unknown>;
  strengths?: string[];
  areas_for_improvement?: string[];
  feedback?: string;
  email_status?: string;
  applicationId?: string;
}

interface DetailedStats {
  totalRegistered: number;
  totalStartedInterview: number;
  totalCompletedInterview: number;
  totalLeftMidway: number;
  neverStartedInterview: number;
  totalPassed: number;
  totalFailed: number;
  interviewStartRate: number;
  interviewCompletionRate: number;
  passRate: number;
  failRate: number;
  leftMidwayRate: number;
}

type DashboardSummary = {
  total_registered: number;
  started_ai: number;
  completed: number;
  left_midway: number;
  passed: number;
  failed: number;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [refreshingSession, setRefreshingSession] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedApplicantForFeedback, setSelectedApplicantForFeedback] = useState<ApplicationDetail | null>(null);
  const [showBulkEmailDialog, setShowBulkEmailDialog] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [resultFilter, setResultFilter] = useState("all");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [hasSessionOnly, setHasSessionOnly] = useState(false);
  const [forcingAll, setForcingAll] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  // Enhanced pagination with server-side support
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  
  // Use the new pagination hook
  const {
    applications,
    currentPage: hookCurrentPage,
    totalPages: hookTotalPages,
    isLoading: hookLoading,
    goToPage,
    nextPage,
    prevPage
  } = useApplicationsPagination(10);
  
  // Mock dashboard summary data based on your screenshot
  const mockSummary: DashboardSummary = {
    total_registered: 5785,
    started_ai: 2609,
    completed: 1865,
    left_midway: 744,
    passed: 507,
    failed: 1004
  };

  // Trends data calculation - using mock data based on your screenshot
  const trendsData = useMemo(() => {
    // Mock trends data based on the chart in your screenshot
    return [
      { date: '2025-08-21', registered: 40, started: 22, completed: 15, passed: 10, failed: 10 },
      { date: '2025-08-22', registered: 35, started: 18, completed: 12, passed: 9, failed: 9 },
      { date: '2025-08-23', registered: 30, started: 12, completed: 10, passed: 8, failed: 8 },
      { date: '2025-08-24', registered: 38, started: 20, completed: 14, passed: 11, failed: 9 },
      { date: '2025-08-25', registered: 42, started: 25, completed: 18, passed: 12, failed: 10 },
      { date: '2025-08-26', registered: 36, started: 19, completed: 13, passed: 9, failed: 8 },
      { date: '2025-08-27', registered: 39, started: 21, completed: 15, passed: 10, failed: 9 },
    ];
  }, []);

  async function loadSummary() {
    setSummaryLoading(true);
    try {
      // Use mock data instead of Supabase
      setTimeout(() => {
        setSummary(mockSummary);
        setSummaryLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading dashboard summary:', error);
      setSummaryLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
    fetchApplicationData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subjectFilter, resultFilter, fromDate, toDate, scoreRange, hasSessionOnly]);

  // Fetch data when pagination changes
  useEffect(() => {
    fetchApplicationData();
  }, [currentPage, itemsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Realtime updates - temporarily disabled during Node.js migration
  useEffect(() => {
    // TODO: Replace with Node.js WebSocket or Server-Sent Events
    console.log('🔔 Realtime updates temporarily disabled - migrating to Node.js');
  }, []);

  const fetchApplicationData = async () => {
    try {
      console.log('🔍 Using mock applications data...');

      // Use the applications from the hook directly
      const pageData = applications;
      setTotalApplicantsCount(pageData.length);

      console.log('📊 Mock applications data:', {
        page: hookCurrentPage,
        totalPages: hookTotalPages,
        pageDataLength: pageData.length
      });

      // Calculate detailed statistics from current page
      const totalRegistered = pageData.length;
      
      // Interview participation stats (mock data)
      const totalStartedInterview = Math.floor(totalRegistered * 0.7); // 70% start rate
      const neverStartedInterview = totalRegistered - totalStartedInterview;
      
      // Interview completion stats (mock data)
      const totalCompletedInterview = Math.floor(totalStartedInterview * 0.8); // 80% completion rate
      
      // Left midway = started but not completed
      const totalLeftMidway = totalStartedInterview - totalCompletedInterview;
      
      // Pass/Fail from completed interviews (mock data)
      const totalPassed = Math.floor(totalCompletedInterview * 0.6); // 60% pass rate
      const totalFailed = totalCompletedInterview - totalPassed;
      
      // Calculate percentages (note: these are now based on current page data)
      const interviewStartRate = totalRegistered > 0 ? Math.round((totalStartedInterview / totalRegistered) * 100) : 0;
      const interviewCompletionRate = totalStartedInterview > 0 ? Math.round((totalCompletedInterview / totalStartedInterview) * 100) : 0;
      const passRate = totalCompletedInterview > 0 ? Math.round((totalPassed / totalCompletedInterview) * 100) : 0;
      const failRate = totalCompletedInterview > 0 ? Math.round((totalFailed / totalCompletedInterview) * 100) : 0;
      const leftMidwayRate = totalStartedInterview > 0 ? Math.round((totalLeftMidway / totalStartedInterview) * 100) : 0;
      
      setDetailedStats({
        totalRegistered,
        totalStartedInterview,
        totalCompletedInterview,
        totalLeftMidway,
        neverStartedInterview,
        totalPassed,
        totalFailed,
        interviewStartRate,
        interviewCompletionRate,
        passRate,
        failRate,
        leftMidwayRate
      });

    } catch (error) {
      console.error('❌ Fatal error in fetchApplicationData:', error);
      toast.error("Failed to fetch application data. Please refresh the page.");
    }
  };

  const isDateInRange = (dateString: string) => {
    const date = new Date(dateString);
    
    if (fromDate && toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      return date >= fromDate && date <= endDate;
    } else if (fromDate) {
      return date >= fromDate;
    } else if (toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      return date <= endDate;
    }
    
    return true;
  };

  // Map hook data to match component interfaces
  const mappedApplications = applications.map(app => ({
    id: app.id,
    name: `${app.firstName} ${app.lastName}`,
    firstName: app.firstName,
    lastName: app.lastName,
    email: app.email,
    phone: app.phone,
    position: app.position,
    status: app.status,
    createdAt: app.createdAt,
    applicationId: app.applicationId,
    // Add required properties for component interfaces
    subjects: [],
    availability: [],
    application_status: app.status,
    application_date: app.createdAt,
  }));

  const filteredApplicants = mappedApplications.filter(applicant => {
    // Text search filter
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter - using mock data structure
    let matchesStatus = statusFilter === "all";
    if (statusFilter === "pending") {
      matchesStatus = applicant.application_status === "pending";
    } else if (statusFilter === "in_progress") {
      matchesStatus = false; // Mock data doesn't have interview_status
    } else if (statusFilter === "completed") {
      matchesStatus = false; // Mock data doesn't have interview_status
    } else if (statusFilter === "failed") {
      matchesStatus = false; // Mock data doesn't have interview_status
    } else if (statusFilter === "passed") {
      matchesStatus = false; // Mock data doesn't have interview_status
    }
    
    // Result filter - simplified for mock data
    const matchesResult = resultFilter === "all";
    
    // Subject filter - simplified for mock data (no subjects property)
    const matchesSubject = subjectFilter === "all";
    
    // Date filter - using createdAt
    const matchesDate = isDateInRange(applicant.application_date);

    // Score range filter - simplified for mock data
    const [minScore, maxScore] = scoreRange;
    let matchesScore = true;
    if (minScore > 0 || maxScore < 100) {
      matchesScore = true; // Mock data doesn't have scores
    }

    // Has session filter - simplified for mock data
    const matchesSession = hasSessionOnly ? false : true; // Mock data doesn't have session_id

    return matchesSearch && matchesStatus && matchesSubject && matchesResult && matchesDate && matchesScore && matchesSession;
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You have been successfully logged out");
      navigate('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/admin/login');
    }
  };

  const handleViewDetails = (applicant: { id: string; firstName: string; lastName: string; email: string; phone: string; subjects: string[]; status: string; createdAt: string; applicationId: string }) => {
    console.log('👀 Viewing details for applicant:', applicant);
    // Convert ApplicationRow to ApplicationDetail format
    const convertedApplicant: ApplicationDetail = {
      id: applicant.id,
      name: `${applicant.firstName} ${applicant.lastName}`,
      email: applicant.email,
      phone: applicant.phone,
      subjects: applicant.subjects || [],
      availability: [],
      application_status: applicant.status,
      application_date: applicant.createdAt,
      applicationId: applicant.applicationId,
    };
    setSelectedApplicant(convertedApplicant);
    setIsModalOpen(true);
  };

  const handleRefreshToughTongueData = async (sessionId: string, applicationId?: string) => {
    if (!sessionId) {
      toast.error("No session ID available to refresh");
      return;
    }
    
    try {
      setRefreshingSession(sessionId);
      console.log('🔄 Refreshing ToughTongue data for session:', sessionId);
      
      // TODO: Replace with Node.js API call when backend is ready
      console.log('Session check temporarily disabled - migrating to Node.js');
      toast.info("Session check temporarily disabled - migrating to Node.js");
      return;
    } catch (error) {
      console.error('❌ Error refreshing ToughTongue data:', error);
      toast.error("Failed to refresh ToughTongue data.");
    } finally {
      setRefreshingSession(null);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      // TODO: Replace with Node.js API call when backend is ready
      toast.info("Delete function temporarily disabled - migrating to Node.js");
    } catch (error) {
      console.error('❌ Error deleting application:', error);
      toast.error("Failed to delete application.");
    }
  };

  const handleExportToExcel = async () => {
    try {
      // TODO: Replace with Node.js API call when backend is ready
      toast.info("Export function temporarily disabled - migrating to Node.js");
    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      toast.error("Failed to export to Excel.");
    }
  };

  const handleForceRefreshAll = async () => {
    try {
      setForcingAll(true);
      console.log('🔄 Force refreshing all data...');
      
      // TODO: Replace with Node.js API call when backend is ready
      console.log('Force refresh temporarily disabled - migrating to Node.js');
      toast.info('Force refresh temporarily disabled - migrating to Node.js');
      return;
    } catch (error) {
      console.error('❌ Force refresh error:', error);
      toast.error("Unexpected error occurred during force refresh.");
    } finally {
      setForcingAll(false);
    }
  };

  const handleTestApi = async () => {
    // TODO: Replace with Node.js API call when backend is ready
    toast.info("API test temporarily disabled - migrating to Node.js");
  };

  const handleBulkSync = async () => {
    // TODO: Replace with Node.js API call when backend is ready
    toast.info("Bulk sync temporarily disabled - migrating to Node.js");
  };

  const clearDateFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleOpenBulkEmail = () => {
    setShowBulkEmailDialog(true);
  };

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
        onOpenBulkEmail={handleOpenBulkEmail}
        onDeleteComplete={fetchApplicationData}
      />

      <div className="container mx-auto px-4 py-8">
        <div style={{padding:'8px 10px',background:'#FFF3CD',border:'1px solid #FFEC99',borderRadius:8,marginBottom:12}}>
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
              {summaryLoading || !summary ? "—" : `${summary.started_ai} (${Math.round((summary.started_ai / Math.max(summary.total_registered,1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">Started AI interview</div>
          </div>

          {/* Completed Interview */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-bambinos-purple">
              {summaryLoading || !summary ? "—" : `${summary.completed} (${Math.round((summary.completed / Math.max(summary.started_ai,1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">Finished full AI interview</div>
          </div>

          {/* Left Midway */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {summaryLoading || !summary ? "—" : `${summary.left_midway} (${Math.round((summary.left_midway / Math.max(summary.started_ai,1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">Started but didn't finish</div>
          </div>

          {/* Passed */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {summaryLoading || !summary ? "—" : `${summary.passed} (${Math.round((summary.passed / Math.max(summary.completed,1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">PASSED</div>
          </div>

          {/* Failed */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {summaryLoading || !summary ? "—" : `${summary.failed} (${Math.round((summary.failed / Math.max(summary.completed,1)) * 100)}%)`}
            </div>
            <div className="text-sm text-gray-600">FAILED</div>
          </div>
        </div>

        {/* Summary Text */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-bambinos-blue mb-4">Summary</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>{summary?.total_registered ?? "—"} people filled the application form</li>
            <li>{summary ? `${summary.started_ai} people (${Math.round((summary.started_ai / Math.max(summary.total_registered,1)) * 100)}%) started the AI interview` : "—"}</li>
            <li>{summary ? `${(summary.total_registered - summary.started_ai)} people never even started the interview` : "—"}</li>
            <li>{summary ? `${summary.left_midway} people (${Math.round((summary.left_midway / Math.max(summary.started_ai,1)) * 100)}%) started but left without finishing` : "—"}</li>
            <li>{summary ? `${summary.completed} people (${Math.round((summary.completed / Math.max(summary.started_ai,1)) * 100)}%) completed the full interview` : "—"}</li>
            <li>{summary ? `Out of those who completed: ${summary.passed} passed (${Math.round((summary.passed / Math.max(summary.completed,1)) * 100)}%) and ${summary.failed} failed (${Math.round((summary.failed / Math.max(summary.completed,1)) * 100)}%)` : "—"}</li>
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
          <h2 className="text-xl font-semibold mb-3 text-bambinos-blue">Applications (Paginated)</h2>
          <div style={{padding:'6px 10px', background:'#eef6ff', border:'1px solid #cde3ff', borderRadius:8, marginTop:12, marginBottom:16}}>
            <small>Loaded <strong>PaginatedApplicationsTable</strong> ✅</small>
          </div>
          <PaginatedApplicationsTable />
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
          onClose={() => setIsModalOpen(false)}
          onRefreshToughTongue={handleRefreshToughTongueData}
          refreshingSession={refreshingSession}
        />

        {/* Feedback Modal */}
        <FeedbackModal
          applicationId={selectedApplicantForFeedback?.applicationId}
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />

        {/* Bulk Email Dialog */}
        <BulkEmailDialog
          isOpen={showBulkEmailDialog}
          onClose={() => setShowBulkEmailDialog(false)}
          applicants={mappedApplications}
          filteredApplicants={filteredApplicants}
          statusFilter={statusFilter}
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