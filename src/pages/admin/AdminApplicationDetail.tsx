import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen, Download, Eye } from "lucide-react";
import { applicationService } from "@/services/serviceManager";

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    subjects: string[];
    additionalLanguages: string[];
    availableDays: string[];
    timeSlots: string[];
    status: string;
    createdAt: string;
    applicationId: string;
    // Add missing properties that the JSX expects
    name?: string;
    created_at?: string;
    application_status?: string;
    latest_status?: string;
    latest_score?: number;
    session_id?: string;
    latest_completed_at?: string;
    resume_filename?: string;
    availability?: string[];
    feedback?: string;
    strengths?: string[];
    areas_for_improvement?: string[];
    evaluation?: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      
      setLoading(true);
          try {
      const response = await applicationService.getApplicationById(id);
        
        if (response.status && response.data) {
          setRow(response.data);
        } else {
          toast.error("Application not found.");
          navigate("/admin/applications");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      no_interview: { label: "No Interview", variant: "secondary" as const, icon: Eye },
      in_progress: { label: "In Progress", variant: "default" as const, icon: BookOpen },
      completed: { label: "Completed", variant: "default" as const, icon: Eye },
      failed: { label: "Failed", variant: "destructive" as const, icon: Eye },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const, icon: Eye };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1.5">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleDownloadResume = async () => {
    try {
      // Mock download logic
      toast.info(`Simulating download of resume for ${row?.firstName} ${row?.lastName}...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      toast.success(`Resume downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-pulse w-8 h-8 bg-primary/20 rounded-full mx-auto"></div>
              <p className="text-muted-foreground">Loading application details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">Application not found</p>
              <p className="text-muted-foreground">The requested application could not be located.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/admin/applications")}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Application Details
              </h1>
              <p className="text-muted-foreground mt-1">Comprehensive candidate evaluation</p>
            </div>
          </div>
          {row.resume_filename && (
            <Button 
              onClick={handleDownloadResume}
              variant="outline"
              className="shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Candidate Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                Candidate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                                 <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                   <User className="h-4 w-4 text-muted-foreground" />
                   <div>
                     <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
                     <p className="text-lg font-semibold">{`${row.firstName} ${row.lastName}`}</p>
                   </div>
                 </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                    <p className="font-medium">{row.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                    <p className="font-medium">{row.phone}</p>
                  </div>
                </div>
                                 <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                   <Calendar className="h-4 w-4 text-muted-foreground" />
                   <div>
                     <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Application Date</label>
                     <p className="font-medium">{new Date(row.createdAt).toLocaleDateString()}</p>
                   </div>
                 </div>
                                 <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                   <Eye className="h-4 w-4 text-muted-foreground" />
                   <div>
                     <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Application Status</label>
                     <div className="mt-2">
                       <Badge variant="outline" className="font-medium">{row.status}</Badge>
                     </div>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                Interview Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                  <div className="mt-2">
                    {getStatusBadge(row.latest_status || "no_interview")}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Score</label>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-2xl font-bold text-primary">{row.latest_score ?? "—"}</p>
                    {row.latest_score && <span className="text-sm text-muted-foreground">/ 100</span>}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Session ID</label>
                  <p className="font-mono text-sm mt-2 bg-background/50 p-2 rounded border">{row.session_id ?? "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed At</label>
                  <p className="font-medium mt-2">{row.latest_completed_at ? new Date(row.latest_completed_at).toLocaleString() : "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Teaching Subjects */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                Teaching Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(row.subjects) && row.subjects.length > 0 ? (
                  row.subjects.map((subject: string, index: number) => (
                    <Badge key={index} variant="outline" className="px-3 py-1.5 font-medium shadow-sm">
                      {subject}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No subjects specified</p>
                )}
              </div>
            </CardContent>
          </Card>

                     {/* Position & Languages */}
           <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
             <CardHeader className="pb-4">
               <CardTitle className="flex items-center gap-3 text-xl">
                 <div className="p-2 rounded-lg bg-primary/10">
                   <BookOpen className="h-5 w-5 text-primary" />
                 </div>
                 Position & Languages
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <h4 className="text-sm font-medium text-gray-700 mb-2">Position:</h4>
                 <Badge variant="default" className="px-3 py-1.5 font-medium shadow-sm">
                   {row.position}
                 </Badge>
               </div>
               <div>
                 <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Languages:</h4>
                 <div className="flex flex-wrap gap-3">
                   {Array.isArray(row.additionalLanguages) && row.additionalLanguages.length > 0 ? (
                     row.additionalLanguages.slice(0, 4).map((lang: string, index: number) => (
                       <Badge key={index} variant="outline" className="px-3 py-1.5 font-medium shadow-sm">
                         {lang}
                       </Badge>
                     ))
                   ) : (
                     <p className="text-muted-foreground italic">No additional languages specified</p>
                   )}
                 </div>
               </div>
             </CardContent>
           </Card>

           {/* Availability */}
           <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
             <CardHeader className="pb-4">
               <CardTitle className="flex items-center gap-3 text-xl">
                 <div className="p-2 rounded-lg bg-primary/10">
                   <Calendar className="h-5 w-5 text-primary" />
                 </div>
                 Availability
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div>
                   <h4 className="text-sm font-medium text-gray-700 mb-2">Available Days:</h4>
                   <div className="flex flex-wrap gap-3">
                     {Array.isArray(row.availableDays) && row.availableDays.length > 0 ? (
                       row.availableDays.map((day: string, index: number) => (
                         <Badge key={index} variant="secondary" className="px-3 py-1.5 font-medium shadow-sm">
                           {day}
                         </Badge>
                       ))
                     ) : (
                       <p className="text-muted-foreground italic">No days specified</p>
                     )}
                   </div>
                 </div>
                 <div>
                   <h4 className="text-sm font-medium text-gray-700 mb-2">Time Slots:</h4>
                   <div className="flex flex-wrap gap-3">
                     {Array.isArray(row.timeSlots) && row.timeSlots.length > 0 ? (
                       row.timeSlots.map((slot: string, index: number) => (
                         <Badge key={index} variant="outline" className="px-3 py-1.5 font-medium shadow-sm">
                           {slot}
                         </Badge>
                       ))
                     ) : (
                       <p className="text-muted-foreground italic">No time slots specified</p>
                     )}
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Application Information */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              Application Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Application ID</label>
              <p className="font-mono text-lg mt-2 bg-background/50 p-3 rounded border">{row.applicationId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="default"
                onClick={() => window.open(`/candidate/result?app=${row.id}`, "_blank")}
                className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Candidate Result
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadResume}
                className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}