
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, RefreshCw, Trash2, Mail, CheckCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";
import { File } from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
// TODO: Replace with Node.js API calls when backend is ready
import ApplicationFilters from "./ApplicationFilters";
import SavedFilters from "./SavedFilters";
import PaginationControls from "./PaginationControls";
import { logAuditEvent } from "@/utils/auditLogger";

import { AdminApplicationDetail } from '@/types/admin';

import { ApplicationsTableProps } from '@/types/admin';

const ApplicationsTable = ({
  applicants,
  filteredApplicants,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  subjectFilter,
  setSubjectFilter,
  resultFilter,
  setResultFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  clearDateFilters,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  onViewDetails,
  onRefreshData,
  scoreRange,
  setScoreRange,
  hasSessionOnly,
  setHasSessionOnly
}: ApplicationsTableProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingData, setExportingData] = useState(false);

  // Get total items from props (now from database count)
  const totalItems = applicants.length; // This should be the filtered total from database

  // Enhanced pagination logic for server-side pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // For server-side pagination, we use filteredApplicants directly (already paginated)
  const paginatedApplicants = filteredApplicants;

  console.log('Pagination Debug:', {
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedCount: paginatedApplicants.length,
    serverSidePagination: true
  });

  const handlePageChange = (page: number) => {
    console.log('Page change requested:', page);
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    // Scroll to top of table when page changes
    document.querySelector('.admin-table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    console.log('Items per page change:', newItemsPerPage);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusBadge = (applicationStatus: string, interviewStatus?: string) => {
    if (interviewStatus === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800">Interviewed</Badge>;
    } else if (interviewStatus === 'failed') {
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    } else if (interviewStatus === 'in_progress') {
      return <Badge className="bg-bambinos-yellow text-gray-800">In Interview</Badge>;
    } else if (applicationStatus === 'pending') {
      return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    } else {
      return <Badge variant="outline">{applicationStatus}</Badge>;
    }
  };

  const getPassFailBadge = (score?: number, interviewStatus?: string) => {
    if (interviewStatus === 'completed' && score !== null && score !== undefined) {
      if (score >= 60) {
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Pass</Badge>;
      } else {
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>;
      }
    } else if (interviewStatus === 'failed') {
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>;
    }
    return <Badge variant="outline" className="text-gray-500">Pending</Badge>;
  };

  const formatInterviewDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteApplication = async (applicationId: string, applicantName: string) => {
    try {
      setDeletingId(applicationId);
      console.log('🗑️ Deleting application:', applicationId);

      // TODO: Replace with Node.js API calls when backend is ready
      console.log('Application deletion temporarily disabled - migrating to Node.js');
      toast({
        title: "Info",
        description: "Application deletion temporarily disabled - migrating to Node.js",
      });
      return;
      
      // Note: application_details is now a secure function, not a direct table
      // application_details data comes from applications + interview_sessions tables
      // So deleting from applications table handles the cleanup automatically
      console.log('Note: application_details is now a secure function, cleanup handled by applications table deletion');
      
      // Also check and delete from candidate_journey records via secure function if needed
      // Note: candidate_journey is now a secure function, not a direct table
      // The function will only return data for authenticated admins
      // TODO: Replace with Node.js API call when backend is ready
      console.log('Candidate journey check temporarily disabled - migrating to Node.js');

console.log('✅ Application deleted successfully');
      toast({
        title: "Success",
        description: `Application for ${applicantName} has been deleted successfully.`
      });

      // Secure audit log - using utility function
      const auditResult = await logAuditEvent('DELETE', 'applications', applicationId, {}, {}, 'admin');
      if (!auditResult.status) {
        console.error('⚠️ Failed to create audit log:', auditResult.message);
        // Don't fail the operation if audit logging fails
      }

      // Refresh the data
      await onRefreshData();
    } catch (error) {
      console.error('❌ Error deleting application:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the application.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportToExcel = async () => {
    try {
      setExportingData(true);
      
      // Import CSV utilities
      const { generateCsvData, downloadCsv } = await import('@/utils/csvExport');
      
      // Prepare current filters for export
      const filters = {
        searchTerm: searchTerm || undefined,
        statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
        subjectFilter: subjectFilter !== 'all' ? subjectFilter : undefined,
        resultFilter: resultFilter !== 'all' ? resultFilter : undefined,
        fromDate,
        toDate,
        scoreRange,
        hasSessionOnly: hasSessionOnly || undefined
      };

      // For now, use client-side generation for all datasets
      // Map ApplicationDetail to CSV format
      const csvData = filteredApplicants.map(app => ({
        id: app.id,
        firstName: app.name.split(' ')[0] || app.name,
        lastName: app.name.split(' ').slice(1).join(' ') || '',
        email: app.email,
        phone: app.phone,
        position: app.subjects?.join(', ') || '',
        status: app.application_status || 'pending',
        createdAt: app.application_date || new Date().toISOString()
      }));
      
      const csvContent = generateCsvData(csvData);
      const filename = `applications-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCsv(csvContent, filename);
      
      toast({
        title: "Export Successful",
        description: `${filteredApplicants.length} applicant records exported successfully.`
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExportingData(false);
    }
  };

  const handleOpenWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <Card className="border-bambinos-blue/20 mb-6 admin-table-container" id="admin-table-container">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-bambinos-blue text-xl">Candidate Applications</CardTitle>
            <CardDescription>
              Complete application and interview management with ToughTongue integration
              <br />
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {totalItems} applicants
                {totalItems !== applicants.length && (
                  <span className="text-blue-600"> (server-side pagination active)</span>
                )}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select 
                value={itemsPerPage.toString()} 
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
            <Button
              onClick={handleExportToExcel}
              disabled={exportingData || totalItems === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {exportingData ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <File className="h-4 w-4 mr-2" />
              )}
              Export CSV {totalItems > 1000 && '(Streaming)'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ApplicationFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          resultFilter={resultFilter}
          setResultFilter={setResultFilter}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          onClearDateFilters={clearDateFilters}
          scoreRange={scoreRange}
          setScoreRange={setScoreRange}
          hasSessionOnly={hasSessionOnly}
          setHasSessionOnly={setHasSessionOnly}
        />

        <SavedFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          resultFilter={resultFilter}
          setResultFilter={setResultFilter}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />


        {/* Clean Table Layout */}
        <div className="rounded-md border border-bambinos-blue/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Candidate</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Applied Date</TableHead>
                <TableHead className="font-semibold">Interview Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Final Total Score</TableHead>
                <TableHead className="font-semibold">Result</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {filteredApplicants.length === 0 
                      ? "No applicants found matching your criteria"
                      : "No applicants to display on this page"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">{applicant.name}</div>
                        <div className="text-sm text-gray-600">{applicant.subjects.join(', ')}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="text-gray-900 flex items-center">
                          {applicant.phone}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="ml-1 h-6 w-6 p-0 text-green-600 hover:text-white hover:bg-green-600"
                            onClick={() => handleOpenWhatsApp(applicant.phone)}
                            title="Contact via WhatsApp"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp"><path d="M12 2a10 10 0 0 1 8.6 15l.5 3-2.9-.7a10 10 0 1 1-6.2-17.3"/><path d="M16.7 14c-.3 0-1.5-.7-1.7-.8-.3-.1-.5-.1-.7.1-.2.2-.8.8-.9 1-.2.1-.3.1-.6 0-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.3-.5 0-.2 0-.4-.1-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.6-.5h-.5c-.2 0-.5.1-.8.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.2 2.1 3.3 5.1 4.5.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.1-1.3-.1-.2-.3-.3-.6-.4"/></svg>
                          </Button>
                        </div>
                        <div className="text-gray-900 flex items-center">
                          {applicant.email}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="ml-1 h-6 w-6 p-0 text-blue-600 hover:text-white hover:bg-blue-600"
                            onClick={() => handleSendEmail(applicant.email)}
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Email Status: {applicant.email_status === 'sent' ? 
                            <span className="text-green-600">Sent</span> : 
                            <span className="text-gray-500">Not Sent</span>}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-gray-900">{applicant.application_date}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {applicant.interview_started ? (
                          <>
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatInterviewDateTime(applicant.interview_started)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(applicant.application_status, applicant.interview_status)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {applicant.score !== null && applicant.score !== undefined ? (
                          <>
                            <span className="font-semibold text-yellow-600">⭐</span>
                            <span className={`font-semibold ${applicant.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                              {applicant.score}%
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-yellow-600">⭐</span>
                            <span className="text-gray-400">N/A</span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {getPassFailBadge(applicant.score, applicant.interview_status)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                          onClick={() => onViewDetails(applicant)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              disabled={deletingId === applicant.id}
                            >
                              {deletingId === applicant.id ? (
                                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the application for <strong>{applicant.name}</strong>? 
                                This action cannot be undone and will also delete all related interview data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApplication(applicant.id, applicant.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </CardContent>
    </Card>
  );
};

export default ApplicationsTable;
