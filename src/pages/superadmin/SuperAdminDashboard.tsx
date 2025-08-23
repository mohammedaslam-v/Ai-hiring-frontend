
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Users, BarChart3, Settings, Shield, TrendingUp, Clock, Award, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
 
import ApplicationFilters from "@/components/admin/ApplicationFilters";
import PaginationControls from "@/components/admin/PaginationControls";

interface ApplicationDetail {
  id: string;
  name: string;
  email: string;
  application_status: string;
  interview_status?: string;
  score?: number;
  application_date: string;
}

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<ApplicationDetail[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplicants: 0,
    passRate: 0,
    avgInterviewTime: 18,
    activeAdmins: 8
  });

  // Analytics filters state
  const [analyticsSearchTerm, setAnalyticsSearchTerm] = useState("");
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState("all");
  const [analyticsSubjectFilter, setAnalyticsSubjectFilter] = useState("all");
  const [analyticsResultFilter, setAnalyticsResultFilter] = useState("all");
  const [analyticsFromDate, setAnalyticsFromDate] = useState<Date | undefined>();
  const [analyticsToDate, setAnalyticsToDate] = useState<Date | undefined>();
  const [analyticsScoreRange, setAnalyticsScoreRange] = useState<[number, number]>([0, 100]);
  const [analyticsHasSessionOnly, setAnalyticsHasSessionOnly] = useState(false);

  // Analytics pagination state
  const [analyticsCurrentPage, setAnalyticsCurrentPage] = useState(1);
  const [analyticsItemsPerPage, setAnalyticsItemsPerPage] = useState(25);

  // Mock admin users data (would come from a separate admin_users table in real implementation)
  const adminUsers = [
    {
      id: 1,
      name: "Sarah Admin",
      email: "sarah@bambinos.live",
      role: "Admin",
      lastLogin: "2024-01-15 14:30",
      status: "active"
    },
    {
      id: 2,
      name: "Mike Manager",
      email: "mike@bambinos.live", 
      role: "Admin",
      lastLogin: "2024-01-14 09:15",
      status: "active"
    },
    {
      id: 3,
      name: "Lisa Lead",
      email: "lisa@bambinos.live",
      role: "Admin", 
      lastLogin: "2024-01-10 16:45",
      status: "inactive"
    }
  ];

  const [recentActivity, setRecentActivity] = useState([
    { time: "2 min ago", user: "Admin Sarah", action: "Reviewed application from John Smith" },
    { time: "15 min ago", user: "Admin Mike", action: "Updated evaluation rubric weights" },
    { time: "1 hour ago", user: "System", action: "Processed new applications" },
    { time: "2 hours ago", user: "Admin Lisa", action: "Exported monthly analytics report" }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter applicants for analytics based on filters
  useEffect(() => {
    let filtered = [...applicants];

    // Search filter
    if (analyticsSearchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(analyticsSearchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(analyticsSearchTerm.toLowerCase())
      );
    }

    // Status filter
    if (analyticsStatusFilter !== "all") {
      filtered = filtered.filter(app => app.interview_status === analyticsStatusFilter);
    }

    // Result filter
    if (analyticsResultFilter !== "all") {
      if (analyticsResultFilter === "passed") {
        filtered = filtered.filter(app => (app.score || 0) >= 60);
      } else if (analyticsResultFilter === "failed") {
        filtered = filtered.filter(app => (app.score || 0) < 60);
      }
    }

    // Date range filter
    if (analyticsFromDate || analyticsToDate) {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.application_date);
        if (analyticsFromDate && appDate < analyticsFromDate) return false;
        if (analyticsToDate && appDate > analyticsToDate) return false;
        return true;
      });
    }

    // Score range filter
    filtered = filtered.filter(app => {
      const score = app.score || 0;
      return score >= analyticsScoreRange[0] && score <= analyticsScoreRange[1];
    });

    // Has session filter
    if (analyticsHasSessionOnly) {
      filtered = filtered.filter(app => app.interview_status && app.interview_status !== 'pending');
    }

    setFilteredApplicants(filtered);
    setAnalyticsCurrentPage(1); // Reset to first page when filters change
  }, [
    applicants,
    analyticsSearchTerm,
    analyticsStatusFilter,
    analyticsResultFilter,
    analyticsFromDate,
    analyticsToDate,
    analyticsScoreRange,
    analyticsHasSessionOnly
  ]);

  // Clear analytics date filters
  const clearAnalyticsDateFilters = () => {
    setAnalyticsFromDate(undefined);
    setAnalyticsToDate(undefined);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch application details
      const { data: applications, error } = await supabase
        .from('application_details')
        .select('*');

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      const applicantData = applications?.map(app => ({
        id: app.id,
        name: app.name,
        email: app.email,
        application_status: app.application_status,
        interview_status: app.interview_status,
        score: app.score,
        application_date: new Date(app.application_date).toLocaleDateString()
      })) || [];

      setApplicants(applicantData);
      setFilteredApplicants(applicantData);

      // Calculate statistics
      const totalApplicants = applicantData.length;
      const completedInterviews = applicantData.filter(app => app.interview_status === 'completed' || app.interview_status === 'failed');
      const passedInterviews = applicantData.filter(app => app.interview_status === 'completed' && (app.score || 0) >= 70);
      const passRate = completedInterviews.length > 0 ? Math.round((passedInterviews.length / completedInterviews.length) * 100) : 0;

      setStats(prev => ({
        ...prev,
        totalApplicants,
        passRate
      }));

      // Update recent activity with real data
      if (applicantData.length > 0) {
        const recentApps = applicantData.slice(0, 3);
        const newActivity = [
          ...recentApps.map((app, index) => ({
            time: `${index + 1} hour${index === 0 ? '' : 's'} ago`,
            user: "System",
            action: `New application received from ${app.name}`
          })),
          { time: "2 hours ago", user: "Admin System", action: "Exported monthly analytics report" }
        ];
        setRecentActivity(newActivity);
      }

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/superadmin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bambinos-blue"></div>
      </div>
    );
  }

  const statsCards = [
    { title: "Total Applicants", value: stats.totalApplicants.toString(), icon: Users, color: "text-bambinos-blue", change: "+12%" },
    { title: "Pass Rate", value: `${stats.passRate}%`, icon: TrendingUp, color: "text-green-600", change: "+5%" },
    { title: "Avg Interview Time", value: `${stats.avgInterviewTime}m`, icon: Clock, color: "text-bambinos-orange", change: "-2m" },
    { title: "Active Admins", value: stats.activeAdmins.toString(), icon: Shield, color: "text-bambinos-pink", change: "+2" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-bambinos-blue/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-bambinos-blue to-bambinos-pink rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-bambinos-blue">Super Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Bambinos.live Master Control Panel</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-bambinos-blue text-bambinos-blue hover:bg-bambinos-blue hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border-bambinos-blue/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admins">Admin Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-bambinos-blue/20">
                <CardHeader>
                  <CardTitle className="text-bambinos-blue">Recent Activity</CardTitle>
                  <CardDescription>Latest system and admin actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 text-sm">
                        <div className="w-2 h-2 bg-bambinos-blue rounded-full mt-2"></div>
                        <div>
                          <p className="text-gray-900">{activity.action}</p>
                          <p className="text-gray-500">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-bambinos-blue/20">
                <CardHeader>
                  <CardTitle className="text-bambinos-blue">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-bambinos-blue hover:bg-bambinos-blue/90 justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Admin
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-bambinos-blue text-bambinos-blue">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Analytics Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-bambinos-blue text-bambinos-blue">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Evaluation Rubric
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admins">
            <Card className="border-bambinos-blue/20">
              <CardHeader>
                <CardTitle className="text-bambinos-blue">Admin User Management</CardTitle>
                <CardDescription>Manage administrator accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-bambinos-blue/20">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{admin.role}</Badge>
                          </TableCell>
                          <TableCell>{admin.lastLogin}</TableCell>
                          <TableCell>
                            <Badge className={admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {admin.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="border-bambinos-blue text-bambinos-blue">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border-bambinos-blue/20">
              <CardHeader>
                <CardTitle className="text-bambinos-blue">Analytics Dashboard</CardTitle>
                <CardDescription>Detailed analytics with filtering and pagination</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Analytics Summary Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-bambinos-blue/10 to-bambinos-blue/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Filtered Applications</p>
                    <p className="text-2xl font-bold text-bambinos-blue">{filteredApplicants.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Passed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {filteredApplicants.filter(a => (a.score || 0) >= 60).length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-red-600">
                      {filteredApplicants.filter(a => (a.score || 0) < 60 && a.score !== undefined).length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-bambinos-orange/10 to-bambinos-orange/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-bambinos-orange">
                      {filteredApplicants.filter(a => a.score !== undefined).length > 0
                        ? Math.round(
                            filteredApplicants
                              .filter(a => a.score !== undefined)
                              .reduce((sum, a) => sum + (a.score || 0), 0) /
                            filteredApplicants.filter(a => a.score !== undefined).length
                          )
                        : 0}%
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <ApplicationFilters
                  searchTerm={analyticsSearchTerm}
                  setSearchTerm={setAnalyticsSearchTerm}
                  statusFilter={analyticsStatusFilter}
                  setStatusFilter={setAnalyticsStatusFilter}
                  subjectFilter={analyticsSubjectFilter}
                  setSubjectFilter={setAnalyticsSubjectFilter}
                  resultFilter={analyticsResultFilter}
                  setResultFilter={setAnalyticsResultFilter}
                  fromDate={analyticsFromDate}
                  setFromDate={setAnalyticsFromDate}
                  toDate={analyticsToDate}
                  setToDate={setAnalyticsToDate}
                  onClearDateFilters={clearAnalyticsDateFilters}
                  scoreRange={analyticsScoreRange}
                  setScoreRange={setAnalyticsScoreRange}
                  hasSessionOnly={analyticsHasSessionOnly}
                  setHasSessionOnly={setAnalyticsHasSessionOnly}
                />

                {/* Applications Table */}
                <div className="rounded-md border border-bambinos-blue/20">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Application Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Interview Status</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplicants
                        .slice(
                          (analyticsCurrentPage - 1) * analyticsItemsPerPage,
                          analyticsCurrentPage * analyticsItemsPerPage
                        )
                        .map((applicant) => (
                          <TableRow key={applicant.id}>
                            <TableCell className="font-medium">{applicant.name}</TableCell>
                            <TableCell>{applicant.email}</TableCell>
                            <TableCell>{applicant.application_date}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{applicant.application_status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  applicant.interview_status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : applicant.interview_status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : applicant.interview_status === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {applicant.interview_status || 'pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {applicant.score !== undefined ? (
                                <span className={
                                  applicant.score >= 60 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                                }>
                                  {applicant.score}%
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <PaginationControls
                  currentPage={analyticsCurrentPage}
                  totalPages={Math.ceil(filteredApplicants.length / analyticsItemsPerPage)}
                  itemsPerPage={analyticsItemsPerPage}
                  totalItems={filteredApplicants.length}
                  startIndex={(analyticsCurrentPage - 1) * analyticsItemsPerPage}
                  endIndex={Math.min(analyticsCurrentPage * analyticsItemsPerPage, filteredApplicants.length)}
                  onPageChange={setAnalyticsCurrentPage}
                  onItemsPerPageChange={(value) => {
                    setAnalyticsItemsPerPage(parseInt(value));
                    setAnalyticsCurrentPage(1);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-bambinos-blue/20">
              <CardHeader>
                <CardTitle className="text-bambinos-blue">System Settings</CardTitle>
                <CardDescription>Configure evaluation criteria and system parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-bambinos-skin/30 rounded-lg">
                    <h3 className="font-semibold text-bambinos-blue mb-2">Evaluation Rubric</h3>
                    <p className="text-sm text-gray-600 mb-4">Configure scoring weights for different assessment areas</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Communication Skills: <span className="font-semibold">25%</span></div>
                      <div>Teaching Methodology: <span className="font-semibold">30%</span></div>
                      <div>Child Development Knowledge: <span className="font-semibold">25%</span></div>
                      <div>Problem Solving: <span className="font-semibold">20%</span></div>
                    </div>
                  </div>
                  
                  <Button className="bg-bambinos-blue hover:bg-bambinos-blue/90">
                    Update Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
