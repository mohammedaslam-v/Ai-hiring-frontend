import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen, Eye } from "lucide-react";
import { useApplicationDetail } from "@/hooks/admin/useApplicationDetail";
import { getStatusBadge } from "@/components/admin/StatusBadge";

export default function AdminApplicationDetail() {
  const navigate = useNavigate();
  const { application, loading, error } = useApplicationDetail();

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

  if (error || !application) {
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
              onClick={() => navigate(-1)}
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
                    <p className="text-lg font-semibold">{`${application.firstName} ${application.lastName}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                    <p className="font-medium">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                    <p className="font-medium">{application.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Application Date</label>
                    <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Application Status</label>
                    <div className="mt-2">
                      <Badge variant="outline" className="font-medium">{application.status}</Badge>
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
                    {getStatusBadge(application.latest_status || "no_interview")}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Score</label>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-2xl font-bold text-primary">{application.latest_score ?? "—"}</p>
                    {application.latest_score && <span className="text-sm text-muted-foreground">/ 10</span>}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Session ID</label>
                  <p className="font-mono text-sm mt-2 bg-background/50 p-2 rounded border">{application.session_id ?? "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed At</label>
                  <p className="font-medium mt-2">{application.latest_completed_at ? new Date(application.latest_completed_at).toLocaleString() : "—"}</p>
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
                {Array.isArray(application.subjects) && application.subjects.length > 0 ? (
                  application.subjects.map((subject: string, index: number) => (
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
                    {Array.isArray(application.availableDays) && application.availableDays.length > 0 ? (
                      application.availableDays.map((day: string, index: number) => (
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
                    {Array.isArray(application.timeSlots) && application.timeSlots.length > 0 ? (
                      application.timeSlots.map((slot: string, index: number) => (
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


 

        {/* Quick Actions */}
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
                onClick={() => window.open(`/candidate/result?app=${application.id}`, "_blank")}
                className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Candidate Result
              </Button>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 