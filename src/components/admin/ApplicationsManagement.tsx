import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Trash2, ArrowUpDown, ArrowUp, ArrowDown, CalendarDays, CheckCircle2, RefreshCw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PASS_SCORE_THRESHOLD } from '@/constants/admin/availabilityConstants';
import { useFilteredApplications } from '@/hooks/admin/useFilteredApplications';
import { usePermissions } from '@/hooks/admin/usePermissions';
import { STATUS_OPTIONS, SORT_OPTIONS, PAGE_SIZE_OPTIONS } from '@/types/admin/applications';
import { useApplicationTableActions } from '@/hooks/admin/useApplicationTableActions';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { fetchSecondRoundStatus, SecondRoundMap } from '@/services/secondRound.service';
import { teacherJourneyService, JourneyStatusData } from '@/services/teacherJourney.service';
import {
  DEMO_STATUS_OPTIONS,
  ONBOARDING_OPTIONS,
  INDUCTION_OPTIONS,
  TRAINING_STATUS_OPTIONS,
  CERTIFICATION_STATUS_OPTIONS,
  GO_LIVE_OPTIONS
} from '@/types/teacherJourney';
import FeedbackModal from './FeedbackModal';
import { MultiSelectFilter } from './MultiSelectFilter';

// Type for journey progress map
type JourneyProgressMap = Record<string, JourneyStatusData>;

const ApplicationsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const {
    filters,
    applications,
    total,
    loading,
    error,
    updateFilters,
    updatePage,
    updatePageSize,
    updateSort,
    toggleSortOrder,
    resetFilters,
    paginationInfo,
    isEmpty,
    isFiltered
  } = useFilteredApplications();
  const { deletingId, handleDeleteApplication } = useApplicationTableActions(() => updateFilters({ page: 1 }));
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { canDelete } = usePermissions();

  const [secondRoundMap, setSecondRoundMap] = useState<SecondRoundMap>({});
  const [srLoading, setSrLoading] = useState(false);

  // Journey progress state
  const [journeyProgressMap, setJourneyProgressMap] = useState<JourneyProgressMap>({});
  const [journeyLoading, setJourneyLoading] = useState(false);

  // Feedback modal state
  const [selectedFeedback, setSelectedFeedback] = useState<{
    score: number;
    evaluation: Record<string, unknown>;
    strengths: string[];
    improvements: string[];
    feedback?: string;
    sessionId?: string;
    applicationId?: string;
  } | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [refreshingFeedback, setRefreshingFeedback] = useState(false);

  useEffect(() => {
    const emails = Array.from(new Set(applications.map(a => (a.email || '').toLowerCase()).filter(Boolean)));
    if (!emails.length) {
      setSecondRoundMap({});
      return;
    }
    let cancelled = false;
    setSrLoading(true);
    fetchSecondRoundStatus(emails)
      .then(map => { if (!cancelled) setSecondRoundMap(map); })
      .catch(() => { if (!cancelled) setSecondRoundMap({}); })
      .finally(() => { if (!cancelled) setSrLoading(false); });
    return () => { cancelled = true; };
  }, [applications]);

  // Fetch journey progress for all applications
  useEffect(() => {
    // Normalize application IDs: convert to strings and trim whitespace
    const applicationIds = applications
      .map(a => a.applicationId || a.id)
      .filter(Boolean)
      .map(id => String(id).trim());

    if (!applicationIds.length) {
      setJourneyProgressMap({});
      return;
    }

    let cancelled = false;
    setJourneyLoading(true);

    teacherJourneyService.getBatchJourneyStatus(applicationIds)
      .then(response => {
        if (!cancelled && response.status && response.data) {
          // Normalize keys in the response data to ensure exact matching
          const normalizedMap: JourneyProgressMap = {};
          Object.entries(response.data).forEach(([key, value]) => {
            const normalizedKey = String(key).trim();
            normalizedMap[normalizedKey] = value;
          });

          setJourneyProgressMap(normalizedMap);
        } else {
          setJourneyProgressMap({});
        }
      })
      .catch(() => { if (!cancelled) setJourneyProgressMap({}); })
      .finally(() => { if (!cancelled) setJourneyLoading(false); });

    return () => { cancelled = true; };
  }, [applications]);

  // Check if journey filters are active
  const isJourneyFiltered =
    (Array.isArray(filters.demoStatus) ? filters.demoStatus.length > 0 : (filters.demoStatus !== 'all' && filters.demoStatus !== undefined)) ||
    (Array.isArray(filters.onboardingEmailSent) ? filters.onboardingEmailSent.length > 0 : (filters.onboardingEmailSent !== 'all' && filters.onboardingEmailSent !== undefined)) ||
    (Array.isArray(filters.inductionAttendance) ? filters.inductionAttendance.length > 0 : (filters.inductionAttendance !== 'all' && filters.inductionAttendance !== undefined)) ||
    (Array.isArray(filters.trainingStatus) ? filters.trainingStatus.length > 0 : (filters.trainingStatus !== 'all' && filters.trainingStatus !== undefined)) ||
    (Array.isArray(filters.certificationStatus) ? filters.certificationStatus.length > 0 : (filters.certificationStatus !== 'all' && filters.certificationStatus !== undefined)) ||
    (Array.isArray(filters.goLiveReadiness) ? filters.goLiveReadiness.length > 0 : (filters.goLiveReadiness !== 'all' && filters.goLiveReadiness !== undefined));

  // Use applications directly from hook (now server-side filtered)
  const filteredApplications = applications;

  // Update journey filter
  const updateJourneyFilter = (key: string, value: string | string[]) => {
    updateFilters({ [key]: value });
  };

  // Reset all filters including journey filters
  const resetAllFilters = () => {
    resetFilters();
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    const config = getStatusBadgeConfig(status);
    if (config.variant === 'outline') {
      return <Badge variant="outline" className={config.className}>{config.text}</Badge>;
    }
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  // Helper function to render interview status: show only outcome when completed
  const renderInterviewStatusBadge = (status: string, score?: number | null) => {
    const config = getInterviewStatusBadgeConfig(status, score);
    const isCompletedWithScore = status === 'completed' && typeof score === 'number';
    const passed = isCompletedWithScore && score >= PASS_SCORE_THRESHOLD;

    if (isCompletedWithScore) {
      return (
        <Badge variant="outline" className={passed ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}>
          {passed ? 'Passed' : 'Failed'}
        </Badge>
      );
    }

    return <Badge variant="outline" className={config.className}>{config.text}</Badge>;
  };

  // Helper function to render sort icon
  const renderSortIcon = (currentKey: string) => {
    const config = getSortIconConfig(currentKey, filters.sortBy || 'appliedDate', filters.sortOrder || 'desc');
    const IconComponent = config.icon === "ArrowUp" ? ArrowUp :
      config.icon === "ArrowDown" ? ArrowDown : ArrowUpDown;
    return <IconComponent className={config.className} />;
  };

  // Handle Excel export
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      console.log('Export CSV clicked with filters:', filters);

      // Import the export service
      const { exportApplicationsToExcel } = await import('@/services/export.service');

      // Call the export service with current filters
      const result = await exportApplicationsToExcel(filters);

      if (result.status) {
        // Show success message
        console.log('Excel export successful:', result.message);
        // You can add a toast notification here if you have a toast system
      } else {
        // Show error message
        console.error('Excel export failed:', result.message);
        // You can add a toast notification here if you have a toast system
      }
    } catch (error) {
      console.error('Excel export error:', error);
      // You can add a toast notification here if you have a toast system
    } finally {
      setExporting(false);
    }
  };

  // Handle view application details
  const handleViewApplication = (applicationId: string) => {
    console.log('Viewing application:', applicationId);
    navigate(`/admin/applications/${applicationId}`);
  };

  // Handle delete with confirmation
  const handleDeleteWithConfirmation = async (applicationId: string, applicantName: string) => {
    const confirmed = await confirm({
      title: "Delete Application",
      description: `Are you sure you want to delete the application for ${applicantName}? This action cannot be undone and will permanently remove all application data including interview records.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive"
    });

    if (confirmed) {
      await handleDeleteApplication(applicationId, applicantName);
    }
  };

  // Handle view feedback
  const handleViewFeedback = async (applicationId: string) => {
    try {
      console.log('🔍 Feedback Button Clicked!');
      console.log('📋 Application ID:', applicationId);
      console.log('🔄 Opening feedback modal...');

      // Get session data for this application
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/session/by-application/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sessionData = await response.json();

      if (sessionData.success && sessionData.data && sessionData.data.evaluation) {
        const session = sessionData.data;

        // Ensure strengths and improvements are arrays and filter out empty values
        const rawStrengths = session.evaluation?.strengths;
        const rawWeaknesses = session.evaluation?.weaknesses;

        const strengths = Array.isArray(rawStrengths)
          ? rawStrengths.filter(s => s && s.trim() !== '')
          : (rawStrengths && rawStrengths.trim() !== '' ? [rawStrengths] : []);

        const improvements = Array.isArray(rawWeaknesses)
          ? rawWeaknesses.filter(w => w && w.trim() !== '')
          : (rawWeaknesses && rawWeaknesses.trim() !== '' ? [rawWeaknesses] : []);

        console.log('📊 Processed data:', {
          score: session.score,
          strengths,
          improvements,
          hasEvaluation: !!session.evaluation
        });

        setSelectedFeedback({
          score: session.score || 0,
          evaluation: session.evaluation,
          strengths: strengths,
          improvements: improvements,
          feedback: session.evaluation?.detailed_feedback || session.evaluation?.feedback || '',
          sessionId: session.sessionId,
          applicationId: applicationId
        });
        console.log('✅ Setting feedback modal to open');
        setIsFeedbackModalOpen(true);
      } else {
        alert('No ToughTongue feedback available for this application. The interview may not be completed yet.');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      alert('Error loading feedback. Please try again.');
    }
  };

  // Handle refresh feedback
  const handleRefreshFeedback = async (applicationId: string) => {
    try {
      setRefreshingFeedback(true);
      console.log('Refreshing feedback for application:', applicationId);

      // Call the refresh endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/session/refresh-tough-tongue/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Refresh the feedback data
        await handleViewFeedback(applicationId);
        alert('Feedback refreshed successfully!');
      } else {
        alert('Failed to refresh feedback: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error refreshing feedback:', error);
      alert('Error refreshing feedback. Please try again.');
    } finally {
      setRefreshingFeedback(false);
    }
  };

  // Convert dd-mm-yyyy to Date object
  const parseDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString || dateString.length !== 10) return undefined;
    try {
      const [day, month, year] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isNaN(date.getTime())) return undefined;
      return date;
    } catch {
      return undefined;
    }
  };

  // Convert Date object to dd-mm-yyyy format
  const formatDateForFilter = (date: Date | undefined): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString || dateString.trim() === '') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Applications Management</CardTitle>
          <CardDescription>Loading applications...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bambinos-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-blue-600">Applications Management</CardTitle>
            <div className="text-sm text-gray-500 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  Loading...
                </span>
              ) : (
                `Showing ${paginationInfo.startIndex}-${paginationInfo.endIndex} of ${total} applications`
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters - Professional redesigned container */}
        <div className="mb-6 bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">

          {/* AI Interview Filters Section */}
          <div className="p-4 border-b border-gray-200/60">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Interview Filters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="lg:col-span-1">
                <Input
                  placeholder="Search name, email, or phone..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="h-9 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>

              {/* Interview Status */}
              <MultiSelectFilter
                options={STATUS_OPTIONS}
                selectedValues={Array.isArray(filters.status) ? filters.status : []}
                onValuesChange={(values) => updateFilters({ status: values })}
                placeholder="AI Interview Status"
                activeColor="blue"
              />

              {/* Direct Demo Filter */}
              <MultiSelectFilter
                options={[
                  { value: 'all', label: 'All Demo Types' },
                  { value: 'true', label: 'Direct Demo' },
                  { value: 'false', label: 'AI Round' }
                ]}
                selectedValues={Array.isArray(filters.directDemo) ? filters.directDemo : []}
                onValuesChange={(values) => updateFilters({ directDemo: values })}
                placeholder="All Demo Types"
                activeColor="blue"
              />

              {/* Score Range */}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min"
                  value={filters.minScore !== undefined ? filters.minScore : ''}
                  onChange={(e) => updateFilters({ minScore: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="h-9 w-20 bg-white border-gray-200 focus:border-blue-400"
                />
                <span className="text-gray-400 text-sm">—</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max"
                  value={filters.maxScore !== undefined ? filters.maxScore : ''}
                  onChange={(e) => updateFilters({ maxScore: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="h-9 w-20 bg-white border-gray-200 focus:border-blue-400"
                />
                <span className="text-[10px] text-gray-400 uppercase">Score</span>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-[120px] justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50",
                        !filters.fromDate && "text-muted-foreground"
                      )}
                    >
                      {filters.fromDate ? formatDateForFilter(parseDate(filters.fromDate)) : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(filters.fromDate)}
                      onSelect={(date) => {
                        if (date) {
                          updateFilters({ fromDate: formatDateForFilter(date) });
                        } else {
                          updateFilters({ fromDate: '' });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-gray-400 text-sm">—</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-[120px] justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50",
                        !filters.toDate && "text-muted-foreground"
                      )}
                    >
                      {filters.toDate ? formatDateForFilter(parseDate(filters.toDate)) : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(filters.toDate)}
                      onSelect={(date) => {
                        if (date) {
                          updateFilters({ toDate: formatDateForFilter(date) });
                        } else {
                          updateFilters({ toDate: '' });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Teacher Journey Filters Section */}
          <div className="p-4 border-b border-gray-200/60 bg-white/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher Journey Filters</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Demo Status */}
              <MultiSelectFilter
                options={DEMO_STATUS_OPTIONS}
                selectedValues={Array.isArray(filters.demoStatus) ? filters.demoStatus : []}
                onValuesChange={(values) => updateJourneyFilter('demoStatus', values)}
                placeholder="Demo Status"
                activeColor="emerald"
              />

              {/* Onboarding Status */}
              <MultiSelectFilter
                options={ONBOARDING_OPTIONS}
                selectedValues={Array.isArray(filters.onboardingEmailSent) ? filters.onboardingEmailSent : []}
                onValuesChange={(values) => updateJourneyFilter('onboardingEmailSent', values)}
                placeholder="Onboarding"
                activeColor="emerald"
              />

              {/* Induction Status */}
              <MultiSelectFilter
                options={INDUCTION_OPTIONS}
                selectedValues={Array.isArray(filters.inductionAttendance) ? filters.inductionAttendance : []}
                onValuesChange={(values) => updateJourneyFilter('inductionAttendance', values)}
                placeholder="Induction"
                activeColor="emerald"
              />

              {/* Training Status */}
              <MultiSelectFilter
                options={TRAINING_STATUS_OPTIONS}
                selectedValues={Array.isArray(filters.trainingStatus) ? filters.trainingStatus : []}
                onValuesChange={(values) => updateJourneyFilter('trainingStatus', values)}
                placeholder="Demo Training Status"
                activeColor="emerald"
              />

              {/* Certification Status */}
              <MultiSelectFilter
                options={CERTIFICATION_STATUS_OPTIONS}
                selectedValues={Array.isArray(filters.certificationStatus) ? filters.certificationStatus : []}
                onValuesChange={(values) => updateJourneyFilter('certificationStatus', values)}
                placeholder="Demo Certification"
                activeColor="emerald"
              />

              {/* Go-Live Status */}
              <MultiSelectFilter
                options={GO_LIVE_OPTIONS}
                selectedValues={Array.isArray(filters.goLiveReadiness) ? filters.goLiveReadiness : []}
                onValuesChange={(values) => updateJourneyFilter('goLiveReadiness', values)}
                placeholder="Demo Go Live Status"
                activeColor="emerald"
              />
            </div>
          </div>

          {/* Actions Row */}
          <div className="p-4 bg-white/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">{total}</span> total applications
              {(isFiltered || isJourneyFiltered) && (
                <span className="text-blue-600">• Filters active</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                className="h-8 px-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Reset
              </Button>
              <Button
                onClick={handleExportCSV}
                disabled={exporting}
                size="sm"
                className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                {exporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </div>

        {/* Sort & Pagination Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sort</span>
              <Select
                value={filters.sortBy || 'appliedDate'}
                onValueChange={(value) => updateSort(value as 'appliedDate' | 'name' | 'email' | 'interviewStatus' | 'score', filters.sortOrder || 'desc')}
              >
                <SelectTrigger className="h-8 w-36 text-sm bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSortOrder}
                className="h-8 px-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                {filters.sortOrder === 'asc' ? (
                  <><ArrowUp className="h-3.5 w-3.5 mr-1" /> Asc</>
                ) : (
                  <><ArrowDown className="h-3.5 w-3.5 mr-1" /> Desc</>
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Show</span>
            <Select
              value={filters.limit?.toString() || '10'}
              onValueChange={(value) => updatePageSize(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-20 text-sm bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-gray-500">entries</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Active Filters Summary */}
        {(isFiltered || isJourneyFiltered) && (
          <div className="mb-4 px-3 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-blue-600 mr-1">Active:</span>
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white border border-gray-200 text-gray-700">
                    Search: "{filters.search}"
                  </span>
                )}
                {Array.isArray(filters.status) && filters.status.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                    AI: {filters.status.length > 1 ? `${filters.status.length} statuses` : filters.status[0].replace('_', ' ')}
                  </span>
                )}
                {(filters.minScore !== undefined || filters.maxScore !== undefined) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700">
                    Score: {filters.minScore ?? 0}-{filters.maxScore ?? 100}
                  </span>
                )}
                {(filters.fromDate && filters.toDate && filters.fromDate.length === 10 && filters.toDate.length === 10) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-100 text-orange-700">
                    {filters.fromDate} → {filters.toDate}
                  </span>
                )}
                {Array.isArray(filters.demoStatus) && filters.demoStatus.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-100 text-cyan-700">
                    Demo: {filters.demoStatus.length > 1 ? `${filters.demoStatus.length} selected` : filters.demoStatus[0]}
                  </span>
                )}
                {Array.isArray(filters.inductionAttendance) && filters.inductionAttendance.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-100 text-violet-700">
                    Induction: {filters.inductionAttendance.length > 1 ? `${filters.inductionAttendance.length} selected` : filters.inductionAttendance[0]}
                  </span>
                )}
                {Array.isArray(filters.trainingStatus) && filters.trainingStatus.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700">
                    Demo Training: {filters.trainingStatus.length > 1 ? `${filters.trainingStatus.length} selected` : filters.trainingStatus[0].replace(/_/g, ' ')}
                  </span>
                )}
                {Array.isArray(filters.certificationStatus) && filters.certificationStatus.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
                    Demo Cert: {filters.certificationStatus.length > 1 ? `${filters.certificationStatus.length} selected` : filters.certificationStatus[0]}
                  </span>
                )}
                {Array.isArray(filters.goLiveReadiness) && filters.goLiveReadiness.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-100 text-teal-700">
                    Demo Go Live: {filters.goLiveReadiness.length > 1 ? `${filters.goLiveReadiness.length} selected` : filters.goLiveReadiness[0].replace(/_/g, ' ')}
                  </span>
                )}
                {Array.isArray(filters.directDemo) && filters.directDemo.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700">
                    Demo Types: {filters.directDemo.length > 1 ? `${filters.directDemo.length} selected` : (filters.directDemo[0] === 'true' ? 'Direct Demo' : 'AI Round')}
                  </span>
                )}
              </div>
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline shrink-0"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="rounded-lg shadow-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[140px] uppercase tracking-wide text-gray-600 text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSort('appliedDate', filters.sortOrder || 'desc')}
                    className="h-8 flex items-center gap-1 hover:bg-transparent"
                  >
                    Created At
                    {renderSortIcon('appliedDate')}
                  </Button>
                </TableHead>
                <TableHead className="w-[320px] uppercase tracking-wide text-gray-600 text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSort('name', filters.sortOrder || 'desc')}
                    className="h-8 flex items-center gap-1 hover:bg-transparent"
                  >
                    Candidate
                    {renderSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead className="w-[140px] uppercase tracking-wide text-gray-600 text-xs text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSort('interviewStatus', filters.sortOrder || 'desc')}
                    className="h-8 flex items-center gap-1 hover:bg-transparent"
                  >
                    AI Round
                    {renderSortIcon('interviewStatus')}
                  </Button>
                </TableHead>
                <TableHead className="w-[120px] uppercase tracking-wide text-gray-600 text-xs text-center">
                  Direct Demo
                </TableHead>
                <TableHead className="w-[160px] uppercase tracking-wide text-gray-600 text-xs text-center">Mock Demo</TableHead>
                <TableHead className="w-[180px] uppercase tracking-wide text-gray-600 text-xs text-center">Demo Mail</TableHead>
                <TableHead className="w-[180px] uppercase tracking-wide text-gray-600 text-xs text-center">Journey Progress</TableHead>
                <TableHead className="w-[120px] uppercase tracking-wide text-gray-600 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isEmpty || filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bambinos-blue"></div>
                          Loading applications...
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium mb-2">
                            {isFiltered || isJourneyFiltered ? 'No applications found' : 'No applications available'}
                          </p>
                          <p className="text-sm mb-3">
                            {isFiltered || isJourneyFiltered
                              ? (Array.isArray(filters.status) && filters.status.length > 0)
                                ? `No applications found with the selected AI Round statuses. Try selecting a different status or reset the filters.`
                                : (typeof filters.status === 'string' && filters.status !== 'all')
                                  ? `No applications found with AI Round "${filters.status === 'no_interview' ? 'No Interview' : filters.status.replace('_', ' ')}". Try selecting a different status or reset the filters.`
                                  : 'No applications match the current filters. Try adjusting your search criteria or reset the filters.'
                              : 'There are no applications in the system yet.'
                            }
                          </p>
                          {(isFiltered || isJourneyFiltered) && (
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={resetAllFilters}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Reset All Filters
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateFilters({ page: 1 })}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Go to First Page
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application, index) => (
                  <TableRow key={application.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-all duration-200`}>
                    <TableCell className="font-mono text-xs">
                      {formatDate(application.appliedDate)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800">{application.name}</div>
                        <div className="text-sm text-slate-500 truncate">{application.email}</div>
                        <div className="text-xs text-slate-400">{application.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        {renderInterviewStatusBadge(application.interviewStatus, application.score)}
                        {application.score !== null && application.score !== undefined ? (
                          <span className={`text-sm font-semibold ${application.score >= PASS_SCORE_THRESHOLD ? 'text-green-600' : 'text-red-600'}`}>
                            {(application.score * 10)}%
                          </span>
                        ) : null}
                        {application.interviewCompletedAt && (
                          <span className="text-xs text-gray-500">
                            {formatDate(application.interviewCompletedAt)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {application.directDemo ? (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-300" variant="outline">
                          Yes
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const key = (application.email || '').toLowerCase();
                        const data = secondRoundMap[key];
                        if (srLoading && !data) {
                          return <span className="text-gray-400 text-xs">Loading…</span>;
                        }
                        if (!data) {
                          return <span className="text-gray-400">N/A</span>;
                        }

                        // Check if attended status is valid
                        const hasValidAttendedStatus = data.attended === 'Yes' || data.attended === 'No';
                        if (!hasValidAttendedStatus) {
                          return <span className="text-gray-400">N/A</span>;
                        }

                        const isYes = data.attended === 'Yes';
                        return (
                          <div className="flex flex-col gap-1">
                            <Badge className={isYes ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'} variant="outline">
                              {data.attended}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              {formatDate(data.scheduledDate || '')}
                            </span>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const appId = String(application.applicationId || application.id).trim();
                        const journeyData = journeyProgressMap[appId];

                        if (journeyLoading && !journeyData) {
                          return <span className="text-gray-400 text-xs">Loading…</span>;
                        }

                        if (!journeyData || !journeyData.demoEmailSent || journeyData.demoEmailSent === 'NO' || (journeyData.demoEmailSentCount || 0) === 0) {
                          return <span className="text-gray-400 text-xs">Not Sent</span>;
                        }

                        // Email was sent
                        const isSelected = journeyData.demoEmailType === 'SELECTED';
                        const sentDate = journeyData.demoEmailSentAt ? formatDate(journeyData.demoEmailSentAt) : 'N/A';
                        const emailCount = journeyData.demoEmailSentCount || 0;
                        const emailSentBy = journeyData.demoEmailSentBy;

                        return (
                          <div className="flex flex-col gap-1 items-center">
                            <div className="flex items-center gap-1 flex-wrap justify-center">
                              <Badge
                                className={
                                  isSelected
                                    ? 'bg-green-100 text-green-700 border-green-300'
                                    : 'bg-red-100 text-red-700 border-red-300'
                                }
                                variant="outline"
                              >
                                {isSelected ? 'Selected' : 'Not Selected'}
                              </Badge>
                              {emailCount > 1 && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                                  {emailCount}x
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-600">
                              {sentDate}
                            </span>
                            {emailSentBy && (
                              <span className="text-xs text-gray-500" title={`Sent by: ${emailSentBy}`}>
                                By: {emailSentBy.split('@')[0]}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const appId = String(application.applicationId || application.id).trim();
                        const journeyData = journeyProgressMap[appId];

                        if (journeyLoading && !journeyData) {
                          return <span className="text-gray-400 text-xs">Loading…</span>;
                        }

                        if (!journeyData) {
                          return <span className="text-gray-400 text-xs">Not Started</span>;
                        }

                        const stages = [
                          { done: journeyData.demoStatus === 'SELECTED', label: 'D' },
                          { done: journeyData.inductionAttendance === 'YES', label: 'I' },
                          { done: journeyData.trainingStatus === 'JOINED' || journeyData.trainingStatus === 'COMPLETED', label: 'T' },
                          { done: journeyData.certificationStatus === 'CLEARED', label: 'C' },
                          { done: journeyData.goLiveReadiness === 'YES', label: 'G' },
                        ];

                        return (
                          <div className="flex items-center justify-center gap-0.5">
                            {stages.map((stage, idx) => (
                              <div
                                key={idx}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${stage.done
                                  ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-400 border border-gray-200'
                                  }`}
                                title={['Demo', 'Induction', 'Training', 'Certification', 'Go Live'][idx]}
                              >
                                {stage.done ? <CheckCircle2 className="w-3 h-3" /> : stage.label}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewApplication(application.id)}
                          className="h-8 w-8 p-0 transition-all duration-200 hover:shadow-md"
                          title="View Application Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteWithConfirmation(application.id, application.name)}
                            className="h-8 w-8 p-0 transition-all duration-200 hover:shadow-md"
                            disabled={deletingId === application.id}
                            aria-label="Delete"
                            title="Delete Application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Results Summary and Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={filters.limit?.toString() || '10'}
                onValueChange={(value) => updatePageSize(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
              {!loading && (
                <span>
                  Showing {filteredApplications.length} of {total} applications
                  {(isFiltered || isJourneyFiltered) && ' (filtered)'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              {paginationInfo.startIndex} to {paginationInfo.endIndex} of {total}
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePage(paginationInfo.currentPage - 1)}
                disabled={!paginationInfo.hasPrev}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to previous page</span>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePage(paginationInfo.currentPage + 1)}
                disabled={!paginationInfo.hasNext}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to next page</span>
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <ConfirmDialog />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        feedback={selectedFeedback}
        onRefresh={handleRefreshFeedback}
        refreshing={refreshingFeedback}
      />
    </Card>
  );
};

// Helper functions for badge and icon configuration
function getStatusBadgeConfig(status: string) {
  const configs: Record<string, { variant: 'default' | 'outline'; className: string; text: string }> = {
    'Submitted': { variant: 'outline', className: 'bg-blue-100 text-blue-700 border-blue-300', text: 'Submitted' },
    'Pending': { variant: 'outline', className: 'bg-gray-100 text-gray-700 border-gray-300', text: 'Pending' },
    'Under Review': { variant: 'outline', className: 'bg-blue-100 text-blue-700 border-blue-300', text: 'Under Review' },
    'Approved': { variant: 'outline', className: 'bg-green-100 text-green-700 border-green-300', text: 'Approved' },
    'Rejected': { variant: 'outline', className: 'bg-red-100 text-red-700 border-red-300', text: 'Rejected' },
    'On Hold': { variant: 'outline', className: 'bg-yellow-100 text-yellow-700 border-yellow-300', text: 'On Hold' },
    'PENDING': { variant: 'outline', className: 'bg-gray-100 text-gray-700 border-gray-300', text: 'Pending' }, // Legacy
    'submitted': { variant: 'outline', className: 'bg-blue-100 text-blue-700 border-blue-300', text: 'Submitted' } // Legacy
  };
  return configs[status] || configs['Submitted'];
}

function getInterviewStatusBadgeConfig(status: string, score?: number | null) {
  const key = status ? status.replace(/_/g, '').toLowerCase() : 'notstarted';
  const configs: Record<string, { className: string; text: string }> = {
    'notstarted': { className: 'bg-gray-100 text-gray-700 border-gray-300', text: 'No Interview' },
    'inprogress': { className: 'bg-blue-100 text-blue-700 border-blue-300', text: 'In Progress' },
    'completed': { className: 'bg-green-100 text-green-700 border-green-300', text: 'Completed' },
    'failed': { className: 'bg-red-100 text-red-700 border-red-300', text: 'Failed' },
    'leftmidway': { className: 'bg-yellow-100 text-yellow-700 border-yellow-300', text: 'Left Midway' },
    'passed': { className: 'bg-green-100 text-green-800', text: 'Passed' } // Legacy
  };
  return configs[key] || configs['notstarted'];
}

function getSortIconConfig(currentKey: string, sortKey: string, sortDir: string) {
  if (currentKey !== sortKey) {
    return { icon: 'ArrowUpDown', className: 'h-4 w-4 text-gray-400' };
  }
  return {
    icon: sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown',
    className: 'h-4 w-4 text-blue-600'
  };
}

export default ApplicationsManagement;
