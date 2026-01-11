import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Download, Users, Clock, TrendingUp } from 'lucide-react';
import AdminService from '@/services/admin.service';
import { toast } from 'react-toastify';

interface UserReport {
  email: string;
  firstName: string;
  lastName: string;
  applicationId: string;
  interviewMinutes: number;
  interviewSeconds: number;
}

interface ReportsData {
  totalApplications: number;
  totalInterviewMinutes: number;
  totalInterviewSeconds: number;
  averageMinutesPerUser: number;
  users: UserReport[];
}

const AdminReports: React.FC = () => {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const adminService = new AdminService();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReportsAnalytics();
      
      if (response.status && response.data) {
        setData(response.data as ReportsData);
      } else {
        toast.error(response.message || 'Failed to load reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const handleExportCSV = () => {
    if (!data || !data.users || data.users.length === 0) {
      toast.warning('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['Email', 'Name', 'Application ID', 'Interview Minutes'];
    const rows = data.users.map(user => [
      user.email,
      `${user.firstName} ${user.lastName}`,
      user.applicationId,
      user.interviewMinutes.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `interview-reports-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exported successfully');
  };

  const formatMinutes = (minutes: number): string => {
    if (minutes < 1) {
      return '< 1 min';
    }
    if (minutes < 60) {
      return `${minutes.toFixed(2)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <AdminHeader />
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <AdminHeader />
      <div className="container mx-auto p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive interview analytics and user reports
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExportCSV}
                disabled={!data || !data.users || data.users.length === 0}
                variant="default"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalApplications}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All candidate applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interview Minutes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatMinutes(data.totalInterviewMinutes)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalInterviewSeconds.toLocaleString()} seconds total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Minutes per User</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatMinutes(data.averageMinutesPerUser)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average interview duration
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Table */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Interview Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {!data || !data.users || data.users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No interview data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Application ID</TableHead>
                      <TableHead className="text-right">Interview Minutes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.users.map((user, index) => (
                      <TableRow key={`${user.email}-${index}`}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.applicationId}</TableCell>
                        <TableCell className="text-right">
                          {formatMinutes(user.interviewMinutes)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;




