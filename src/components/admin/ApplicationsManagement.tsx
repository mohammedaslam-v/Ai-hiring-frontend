import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Calendar, MessageSquare } from "lucide-react";
import { PASS_SCORE_THRESHOLD } from '@/constants/admin/availabilityConstants';
import { useFilteredApplications } from '@/hooks/admin/useFilteredApplications';
import { STATUS_OPTIONS, SORT_OPTIONS, PAGE_SIZE_OPTIONS } from '@/types/admin/applications';
import { useApplicationTableActions } from '@/hooks/admin/useApplicationTableActions';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { fetchSecondRoundStatus, SecondRoundMap } from '@/services/secondRound.service';
import FeedbackModal from './FeedbackModal';

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

  const [secondRoundMap, setSecondRoundMap] = useState<SecondRoundMap>({});
  const [srLoading, setSrLoading] = useState(false);
  
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
        {/* Filters - redesigned container */}
        <div className="mb-6 space-y-4 bg-white border border-gray-200 rounded-2xl shadow-md p-5">
          {/* First Row: Search, Status, Score Range, Date Range, Page Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search name or email..."
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full transition-all duration-200 hover:shadow-md"
              />
            </div>

            {/* Interview Status */}
            <div>
              <Select
                value={filters.status || 'all'}
                                 onValueChange={(value) => updateFilters({ status: value as 'all' | 'no_interview' | 'in_progress' | 'completed' | 'failed' | 'leftMidway' })}
              >
                <SelectTrigger className="transition-all duration-200 hover:shadow-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>



                         {/* Score Range */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                value={filters.minScore !== undefined ? filters.minScore : ''}
                onChange={(e) => updateFilters({ minScore: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-20 transition-all duration-200 hover:shadow-md"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                value={filters.maxScore !== undefined ? filters.maxScore : ''}
                onChange={(e) => updateFilters({ maxScore: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-20 transition-all duration-200 hover:shadow-md"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilters({ minScore: undefined, maxScore: undefined })}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Clear
              </Button>
            </div>

            {/* Page Size placeholder removed from filter rows */}
            {null}
          </div>

          {/* Second Row: Date Range, Export/Reset */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                   {/* Date Range */}
              <div className="flex flex-wrap items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  value={filters.fromDate || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('📅 Date Input - fromDate changed:', { value, length: value.length });
                    updateFilters({ fromDate: value });
                  }}
                  className="w-32 transition-all duration-200 hover:shadow-md"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  value={filters.toDate || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('📅 Date Input - toDate changed:', { value, length: value.length });
                    updateFilters({ toDate: value });
                  }}
                  className="w-32 transition-all duration-200 hover:shadow-md"
                />
                {/* Date format hint placed before action buttons */}
                <span className="text-xs text-gray-500 ml-2 shrink-0 whitespace-normal md:whitespace-nowrap">
                  Format: dd-mm-yyyy
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('📅 Date Filter - Clear clicked');
                    updateFilters({ fromDate: '', toDate: '' });
                  }}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Clear
                </Button>
              </div>
              {null}

            {/* Sort controls removed from here; moved to top controls below */}
            {null}

                         {/* Export Button */}
             <div className="flex justify-between gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={resetFilters}
                 className="text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md"
               >
                 <span className="mr-1">🔄</span> Reset Filters
               </Button>
                               <Button
                  onClick={handleExportCSV}
                  disabled={exporting}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 rounded-full transition-all duration-200 hover:shadow-md"
                >
                  <span className="mr-2">📤</span>
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </Button>
             </div>
          </div>
        </div>

        {/* Top controls: Sort, Order, Items per page */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select
              value={filters.sortBy || 'appliedDate'}
                               onValueChange={(value) => updateSort(value as 'appliedDate' | 'name' | 'email' | 'interviewStatus' | 'score', filters.sortOrder || 'desc')}
            >
              <SelectTrigger className="w-40 transition-all duration-200 hover:shadow-md">
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
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-2 transition-all duration-200 hover:shadow-md"
            >
              {filters.sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </Button>
            <Select
              value={filters.limit?.toString() || '10'}
              onValueChange={(value) => updatePageSize(parseInt(value))}
            >
              <SelectTrigger className="w-[160px] transition-all duration-200 hover:shadow-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.value} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

                 {/* Error Display */}
         {error && (
           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
             <p className="text-red-700 text-sm">{error}</p>
           </div>
         )}

         {/* Active Filters Summary */}
         {isFiltered && (
           <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 flex-wrap">
                 <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                 {filters.search && (
                   <Badge variant="outline" className="text-xs">
                     Search: "{filters.search}"
                   </Badge>
                 )}
                                   {filters.status && filters.status !== 'all' && (
                    <Badge variant="outline" className="text-xs">
                      Interview Status: {filters.status === 'no_interview' ? 'No Interview' : filters.status?.replace('_', ' ') || ''}
                    </Badge>
                  )}

                 {(filters.minScore !== undefined || filters.maxScore !== undefined) && (
                   <Badge variant="outline" className="text-xs">
                     Score: {filters.minScore !== undefined ? `≥${filters.minScore}` : '≥0'} 
                     {filters.maxScore !== undefined ? ` ≤${filters.maxScore}` : ' ≤100'}
                   </Badge>
                 )}
                                   {(filters.fromDate && filters.toDate && filters.fromDate.length === 10 && filters.toDate.length === 10) && (
                    <Badge variant="outline" className="text-xs">
                      Date: {filters.fromDate} to {filters.toDate}
                    </Badge>
                  )}
                  {(filters.fromDate || filters.toDate) && (!filters.fromDate || !filters.toDate || filters.fromDate.length < 10 || filters.toDate.length < 10) && (
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                      Date: Incomplete (need both dates)
                    </Badge>
                  )}
                 {filters.sortBy && (
                   <Badge variant="outline" className="text-xs">
                     Sort: {filters.sortBy?.replace(/([A-Z])/g, ' $1').toLowerCase() || ''} ({filters.sortOrder})
                   </Badge>
                 )}
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={resetFilters}
                 className="text-blue-600 hover:text-blue-700 text-xs"
               >
                 Clear All
               </Button>
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
                    Interview Status
                    {renderSortIcon('interviewStatus')}
                  </Button>
                </TableHead>
                <TableHead className="w-[160px] uppercase tracking-wide text-gray-600 text-xs text-center">Second Round</TableHead>
                <TableHead className="w-[120px] uppercase tracking-wide text-gray-600 text-xs text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSort('score', filters.sortOrder || 'desc')}
                    className="h-8 flex items-center gap-1 hover:bg-transparent"
                  >
                    Score
                    {renderSortIcon('score')}
                  </Button>
                </TableHead>
                <TableHead className="w-[120px] uppercase tracking-wide text-gray-600 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                             {isEmpty ? (
                 <TableRow>
                   <TableCell colSpan={6} className="text-center py-8">
                     <div className="text-gray-500">
                       {loading ? (
                         <div className="flex items-center justify-center gap-2">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bambinos-blue"></div>
                           Loading applications...
                         </div>
                       ) : (
                         <div>
                           <p className="text-lg font-medium mb-2">
                             {isFiltered ? 'No applications found' : 'No applications available'}
                           </p>
                           <p className="text-sm mb-3">
                             {isFiltered 
                               ? filters.status && filters.status !== 'all' 
                                 ? `No applications found with status "${filters.status === 'no_interview' ? 'No Interview' : filters.status?.replace('_', ' ') || ''}". Try selecting a different status or reset the filters.`
                                 : 'No applications match the current filters. Try adjusting your search criteria or reset the filters.'
                               : 'There are no applications in the system yet.'
                             }
                           </p>
                           {isFiltered && (
                             <div className="flex gap-2 justify-center">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={resetFilters}
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
                                 applications.map((application, index) => (
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
                      {renderInterviewStatusBadge(application.interviewStatus, application.score)}
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
                      {application.score !== null && application.score !== undefined ? (
                        <span className={`font-medium ${application.score >= PASS_SCORE_THRESHOLD ? 'text-green-600' : 'text-red-600'}`}>
                          {(application.score * 10)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFeedback(application.id)}
                          className="h-8 w-8 p-0 transition-all duration-200 hover:shadow-md"
                          title="View ToughTongue Feedback"
                          disabled={application.interviewStatus === 'no_interview' || application.interviewStatus === 'not_started'}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
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
                   Showing {applications.length} of {total} applications
                   {isFiltered && ' (filtered)'}
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
