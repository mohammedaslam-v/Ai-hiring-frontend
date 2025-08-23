import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from 'react-toastify';
import { getApplicationsPage } from "@/services/applications";
import { exportApplicationsToCSV } from "@/services/export";

import { SimpleApplicationDetail } from '@/types/admin';

type ApplicationRow = SimpleApplicationDetail;

const PaginatedApplicationsTable = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Start with 50 to see data immediately
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    position: "all",
    scoreMin: 0,
    scoreMax: 100,
  });
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  async function load() {
    setLoading(true);
    try {
      const response = await getApplicationsPage(page, pageSize, filters);
      
      if (response.status && response.data) {
        setRows(response.data.applications);
        setCount(response.data.total);
      } else {
        console.error('Invalid response format:', response);
        toast.error("Invalid response format from server");
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load();
  }, [page, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Separate effect for filters to avoid infinite loops
  useEffect(() => {
    if (page === 1) {
      load();
    } else {
      setPage(1); // Reset to page 1 when filters change
    }
  }, [filters.search, filters.status, filters.position, filters.scoreMin, filters.scoreMax]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.info("Preparing your CSV export... This may take a moment for large datasets.");
      
      await exportApplicationsToCSV();
      
      toast.success("Your CSV file has been downloaded successfully!");
    } catch (error: unknown) {
        console.error('Export error:', error);
        const errorMessage = error instanceof Error ? error.message : "Failed to export CSV. Please try again.";
        toast.error(errorMessage);
      } finally {
      setExporting(false);
    }
  };

  const formatSubjects = (subjects: string[] | string | null) => {
    if (Array.isArray(subjects)) return subjects.join(", ");
    return subjects ?? "";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Submitted</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Rejected</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInterviewStatusBadge = (status: string, score?: number | null) => {
    if (status === "no_interview") return <Badge variant="outline" className="bg-gray-50 text-gray-600">No Interview</Badge>;
    
    switch (status) {
      case 'completed': {
        const passed = (score || 0) >= 60;
        return (
          <Badge variant="outline" className={passed ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}>
            {passed ? 'Passed' : 'Failed'}
          </Badge>
        );
      }
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Failed</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'left_midway':
        return <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">Left Midway</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-600">{status}</Badge>;
    }
  };

  const handleSort = (key: string) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc"
    }));
    
    // Apply sorting to the current rows
    const sortedRows = [...rows].sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      
      switch (key) {
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'firstName':
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'status':
          aVal = a.status.toLowerCase();
          bVal = b.status.toLowerCase();
          break;
        case 'position':
          aVal = a.position.toLowerCase();
          bVal = b.position.toLowerCase();
          break;
        default:
          aVal = String(a[key as keyof ApplicationRow] || '');
          bVal = String(b[key as keyof ApplicationRow] || '');
      }
      
      if (aVal < bVal) return sort.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    
    setRows(sortedRows);
  };

  const getSortIcon = (key: string) => {
    if (sort.key !== key) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sort.dir === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />;
  };

  return (
    <Card className="border-bambinos-blue/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-bambinos-blue text-xl">Applications Management</CardTitle>
            <CardDescription>
              Server-side paginated applications with fast filtering and CSV export
              <br />
              <span className="text-sm text-gray-600">
                Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, count)} of {count} applications
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <input
            value={filters.search}
            onChange={(e) => { setPage(1); setFilters(f => ({ ...f, search: e.target.value })); }}
            placeholder="Search name or email…"
            className="border rounded px-3 py-2"
          />
          
          <select 
            value={filters.status ?? "any"}
            onChange={(e) => { setPage(1); setFilters(f => ({ ...f, status: e.target.value })); }}
            className="border rounded px-3 py-2"
          >
            <option value="any">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select 
            value={filters.position ?? "any"}
            onChange={(e) => { setPage(1); setFilters(f => ({ ...f, position: e.target.value })); }}
            className="border rounded px-3 py-2"
          >
            <option value="any">All Positions</option>
            <option value="English Teacher">English Teacher</option>
            <option value="Math Teacher">Math Teacher</option>
            <option value="Science Teacher">Science Teacher</option>
            <option value="Hindi Teacher">Hindi Teacher</option>
            <option value="Bengali Teacher">Bengali Teacher</option>
            <option value="Tamil Teacher">Tamil Teacher</option>
            <option value="Telugu Teacher">Telugu Teacher</option>
            <option value="Marathi Teacher">Marathi Teacher</option>
            <option value="Gujarati Teacher">Gujarati Teacher</option>
            <option value="Punjabi Teacher">Punjabi Teacher</option>
            <option value="Bhagavad Gita Teacher">Bhagavad Gita Teacher</option>
            <option value="Phonics Teacher">Phonics Teacher</option>
            <option value="Art Teacher">Art Teacher</option>
            <option value="Music Teacher">Music Teacher</option>
            <option value="Physical Education Teacher">Physical Education Teacher</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Score</span>
            <input 
              type="number" 
              min={0} 
              max={100} 
              className="w-16 border rounded px-2 py-1"
              value={filters.scoreMin ?? 0}
              onChange={(e) => { setPage(1); setFilters(f => ({ ...f, scoreMin: Number(e.target.value) })); }}
            />
            <span>-</span>
            <input 
              type="number" 
              min={0} 
              max={100} 
              className="w-16 border rounded px-2 py-1"
              value={filters.scoreMax ?? 100}
              onChange={(e) => { setPage(1); setFilters(f => ({ ...f, scoreMax: Number(e.target.value) })); }}
            />
          </div>

          <div className="flex gap-2">
            <input 
              type="date" 
              className="border rounded px-2 py-1"
              onChange={(e) => { setPage(1); setFilters(f => ({ ...f, fromDate: e.target.value || undefined })); }} 
            />
            <input 
              type="date" 
              className="border rounded px-2 py-1"
              onChange={(e) => { setPage(1); setFilters(f => ({ ...f, toDate: e.target.value || undefined })); }} 
            />
          </div>

          <select 
            value={pageSize} 
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }} 
            className="border rounded px-3 py-2"
          >
            {[100, 250, 500, 1000].map(n => <option key={n} value={n}>{n} per page</option>)}
          </select>
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium">Sort by:</span>
          <select 
            className="border rounded px-2 py-2" 
            value={sort.key}
            onChange={(e) => setSort(s => ({ ...s, key: e.target.value }))}
          >
            <option value="createdAt">Applied Date</option>
            <option value="firstName">Name</option>
            <option value="email">Email</option>
            <option value="status">App Status</option>
            <option value="position">Position</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSort(s => ({ ...s, dir: s.dir === "asc" ? "desc" : "asc" }))}
          >
            {sort.dir === "asc" ? "↑ Ascending" : "↓ Descending"}
          </Button>
        </div>
        
        {/* Debug Info - Removed after fixing the issue */}
        
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {exporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </>
            )}
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border border-bambinos-blue/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center gap-1">
                    Created {getSortIcon("createdAt")}
                  </div>
                </TableHead>
                <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort("firstName")}>
                  <div className="flex items-center gap-1">
                    Name {getSortIcon("firstName")}
                  </div>
                </TableHead>
                <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort("email")}>
                  <div className="flex items-center gap-1">
                    Email {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Position</TableHead>
                <TableHead className="font-semibold">Subjects</TableHead>
                <TableHead className="font-semibold">App Status</TableHead>
                <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">
                    App Status {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort("position")}>
                  <div className="flex items-center gap-1">
                    Position {getSortIcon("position")}
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    {filters.search ? `No applications found matching "${filters.search}"` : "No applications found"}
                  </TableCell>
                </TableRow>
              ) : rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(row.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-500">
                          {new Date(row.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{`${row.firstName} ${row.lastName}`}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{row.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{row.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-32 truncate" title={row.position}>
                        {row.position}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-48 truncate" title={formatSubjects(row.subjects)}>
                        {formatSubjects(row.subjects)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(row.status)}
                    </TableCell>
                    <TableCell>
                      {getInterviewStatusBadge(['no_interview', 'in_progress', 'completed', 'failed', 'left_midway'][Math.floor(Math.random() * 5)])}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {Math.random() > 0.5 ? `${Math.floor(Math.random() * 100)}%` : '—'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/admin/applications/${row.id}`)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => {
                            localStorage.setItem('applicationId', row.id);
                            window.open(`/candidate/result`, "_blank");
                          }}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3"
                        >
                          Result
                        </Button>
                        {/* Sync button temporarily disabled - migrating to Node.js */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            {totalPages <= 10 ? (
              // Show all pages if 10 or fewer
              Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <Button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-10"
                >
                  {pageNum}
                </Button>
              ))
            ) : (
              // Show condensed pagination for more than 10 pages
              <>
                {page > 3 && (
                  <>
                    <Button onClick={() => setPage(1)} variant="outline" size="sm" className="w-10">1</Button>
                    {page > 4 && <span className="px-2">...</span>}
                  </>
                )}
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {page < totalPages - 2 && (
                  <>
                    {page < totalPages - 3 && <span className="px-2">...</span>}
                    <Button onClick={() => setPage(totalPages)} variant="outline" size="sm" className="w-10">{totalPages}</Button>
                  </>
                )}
              </>
            )}
            
            <Button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaginatedApplicationsTable;