import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { useFilteredApplications } from '@/hooks/admin/useFilteredApplications';
import { STATUS_OPTIONS, SORT_OPTIONS, PAGE_SIZE_OPTIONS } from '@/types/admin/applications';
import { useApplicationTableActions } from '@/hooks/admin/useApplicationTableActions';

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

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    const config = getStatusBadgeConfig(status);
    if (config.variant === 'outline') {
      return <Badge variant="outline" className={config.className}>{config.text}</Badge>;
    }
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  // Helper function to render interview status badge
  const renderInterviewStatusBadge = (status: string, score?: number | null) => {
    const config = getInterviewStatusBadgeConfig(status, score);
    return <Badge variant="outline" className={config.className}>{config.text}</Badge>;
  };

  // Helper function to render sort icon
  const renderSortIcon = (currentKey: string) => {
    const config = getSortIconConfig(currentKey, filters.sortBy || 'appliedDate', filters.sortOrder || 'desc');
    const IconComponent = config.icon === "ArrowUp" ? ArrowUp : 
                         config.icon === "ArrowDown" ? ArrowDown : ArrowUpDown;
    return <IconComponent className={config.className} />;
  };

  // Handle CSV export
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      console.log('Export CSV clicked with filters:', filters);
      
      // Import the export service
      const { exportApplicationsToCSV } = await import('@/services/export.service');
      
      // Call the export service with current filters
      const result = await exportApplicationsToCSV(filters);
      
      if (result.status) {
        // Show success message
        console.log('CSV export successful:', result.message);
        // You can add a toast notification here if you have a toast system
      } else {
        // Show error message
        console.error('CSV export failed:', result.message);
        // You can add a toast notification here if you have a toast system
      }
    } catch (error) {
      console.error('CSV export error:', error);
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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '—';
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
            <CardDescription className="text-gray-600">
              Server-side paginated applications with fast filtering and CSV export
            </CardDescription>
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
        {/* Filter Controls */}
        <div className="mb-6 space-y-4">
          {/* First Row: Search, Status, Score Range, Date Range, Page Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search name or email..."
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Interview Status */}
            <div>
              <Select
                value={filters.status || 'all'}
                                 onValueChange={(value) => updateFilters({ status: value as 'all' | 'no_interview' | 'in_progress' | 'completed' | 'failed' | 'leftMidway' })}
              >
                <SelectTrigger>
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
                 className="w-20"
               />
               <span className="text-gray-500">to</span>
               <Input
                 type="number"
                 min="0"
                 max="100"
                 placeholder="Max"
                 value={filters.maxScore !== undefined ? filters.maxScore : ''}
                 onChange={(e) => updateFilters({ maxScore: e.target.value ? parseInt(e.target.value) : undefined })}
                 className="w-20"
               />
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => updateFilters({ minScore: undefined, maxScore: undefined })}
                 className="text-xs text-gray-500 hover:text-gray-700"
               >
                 Clear
               </Button>
             </div>

            {/* Page Size */}
            <div>
              <Select
                value={filters.limit?.toString() || '500'}
                onValueChange={(value) => updatePageSize(parseInt(value))}
              >
                <SelectTrigger>
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

          {/* Second Row: Date Range, Sort Controls, Export Button */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                   {/* Date Range */}
              <div className="flex items-center gap-2">
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
                  className="w-32"
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
                  className="w-32"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('📅 Date Filter - Submit clicked with dates:', { 
                      fromDate: filters.fromDate, 
                      toDate: filters.toDate,
                      fromLength: filters.fromDate?.length,
                      toLength: filters.toDate?.length
                    });
                    // Force a refresh to trigger the API call
                    updateFilters({ page: 1 });
                  }}
                  disabled={!filters.fromDate || !filters.toDate || filters.fromDate.length < 10 || filters.toDate.length < 10}
                  className="text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Apply Dates
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('📅 Date Filter - Clear clicked');
                    updateFilters({ fromDate: '', toDate: '' });
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              </div>
              <div className="text-xs text-gray-500 -mt-1">
                💡 Format: dd-mm-yyyy (e.g., 27-08-2025)
              </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select
                value={filters.sortBy || 'appliedDate'}
                                 onValueChange={(value) => updateSort(value as 'appliedDate' | 'name' | 'email' | 'interviewStatus' | 'score', filters.sortOrder || 'desc')}
              >
                <SelectTrigger className="w-40">
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
                className="flex items-center gap-2"
              >
                {filters.sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </Button>
            </div>

                         {/* Export Button */}
             <div className="flex justify-end gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={resetFilters}
                 className="text-gray-600 hover:text-gray-800"
               >
                 Reset All Filters
               </Button>
                               <Button
                  onClick={handleExportCSV}
                  disabled={exporting}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </Button>
             </div>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
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
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSort('name', filters.sortOrder || 'desc')}
                    className="h-8 flex items-center gap-1 hover:bg-transparent"
                  >
                    Name
                    {renderSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSort('email', filters.sortOrder || 'desc')}
                    className="h-8 flex items-center gap-1 hover:bg-transparent"
                  >
                    Email
                    {renderSortIcon('email')}
                  </Button>
                </TableHead>
                <TableHead className="w-[150px]">Phone</TableHead>
                <TableHead className="w-[200px]">Subjects</TableHead>
                <TableHead className="w-[120px]">
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
                <TableHead className="w-[100px]">
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
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                             {isEmpty ? (
                 <TableRow>
                   <TableCell colSpan={9} className="text-center py-8">
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
                   <TableRow key={application.id}>
                     <TableCell className="font-mono text-xs">
                       {formatDate(application.appliedDate)}
                     </TableCell>
                     <TableCell>
                       <div>
                         <div className="font-medium">{application.name}</div>
                       </div>
                     </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate">{application.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate">{application.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {application.subjects.join(', ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderInterviewStatusBadge(application.interviewStatus, application.score)}
                    </TableCell>
                    <TableCell>
                      {application.score !== null ? (
                        <span className={`font-medium ${application.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                          {application.score}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewApplication(application.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('View result:', application.id)}
                          className="h-8 px-2 text-xs"
                        >
                          Result
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteApplication(application.id, application.name)}
                          className="h-8 px-2 text-xs"
                          disabled={deletingId === application.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deletingId === application.id ? 'Deleting...' : 'Delete'}
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
                 value={filters.limit?.toString() || '500'}
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
  const configs: Record<string, { className: string; text: string }> = {
    'not_started': { className: 'bg-gray-100 text-gray-700 border-gray-300', text: 'No Interview' },
    'in_progress': { className: 'bg-blue-100 text-blue-700 border-blue-300', text: 'In Progress' },
    'completed': { className: 'bg-green-100 text-green-700 border-green-300', text: 'Completed' },
    'failed': { className: 'bg-red-100 text-red-700 border-red-300', text: 'Failed' },
    'left_midway': { className: 'bg-yellow-100 text-yellow-700 border-yellow-300', text: 'Left Midway' },
    'passed': { className: 'bg-green-100 text-green-800', text: 'Passed' } // Legacy
  };
  return configs[status] || configs['not_started'];
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
