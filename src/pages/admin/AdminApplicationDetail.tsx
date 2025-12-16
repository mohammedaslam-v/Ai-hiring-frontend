import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  User,
  BookOpen,
  Globe,
  Clock
} from "lucide-react";
import { useApplicationDetail } from "@/hooks/admin/useApplicationDetail";
import { getStatusBadge } from "@/components/admin/StatusBadge";
import { TeacherJourneySection } from "@/components/admin/teacher-journey";

export default function AdminApplicationDetail() {
  const navigate = useNavigate();
  const { application, loading, error } = useApplicationDetail();

  const getScoreStyle = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'text-slate-400';
    if (score >= 7) return 'text-emerald-600';
    if (score >= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">Loading application...</span>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">Application not found</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const interviewStatus = application.latest_status || application.interview_status || "no_interview";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="text-slate-600 hover:text-slate-900 hover:bg-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications
        </Button>

        {/* Main Container - Single Unified Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{application.firstName} {application.lastName}</h1>
                  <p className="text-white/80 flex items-center gap-2 mt-1">
                    <Briefcase className="h-4 w-4" />
                    {application.position || "Educator"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-3 py-1.5">
                  {application.status}
                </Badge>
                <code className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-lg font-mono">
                  {application.applicationId || application.id}
                </code>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Panel - Candidate Details */}
            <div className="lg:w-80 lg:border-r border-slate-200 flex-shrink-0">
              
              {/* Contact Information */}
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-700 truncate flex-1">{application.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-700">{application.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-700">{new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Interview Result */}
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Interview Result</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${getScoreStyle(application.score)}`}>
                      {application.score ?? "—"}
                    </span>
                    <span className="text-slate-400 text-lg">/10</span>
                  </div>
                  {getStatusBadge(interviewStatus)}
                </div>
              </div>

              {/* Teaching Subjects */}
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  Teaching Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(application.subjects) && application.subjects.length > 0 ? (
                    application.subjects.map((s: string, i: number) => (
                      <Badge key={i} className="bg-teal-50 text-teal-700 border-teal-200 font-medium">{s}</Badge>
                    ))
                  ) : <span className="text-sm text-slate-400">Not specified</span>}
                </div>
              </div>

              {/* Languages */}
              {Array.isArray(application.additionalLanguages) && application.additionalLanguages.length > 0 && (
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.additionalLanguages.map((l: string, i: number) => (
                      <Badge key={i} className="bg-cyan-50 text-cyan-700 border-cyan-200 font-medium">{l}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {(application.availableDays?.length > 0 || application.timeSlots?.length > 0) && (
                <div className="p-5">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.availableDays?.map((d: string, i: number) => (
                      <Badge key={`d-${i}`} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">{d}</Badge>
                    ))}
                    {application.timeSlots?.map((t: string, i: number) => (
                      <Badge key={`t-${i}`} variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 font-medium text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Teacher Journey */}
            <div className="flex-1 min-w-0 bg-slate-50/50">
              <TeacherJourneySection
                applicationId={application.applicationId || application.id}
                candidateName={`${application.firstName} ${application.lastName}`}
                candidateEmail={application.email}
                candidatePhone={application.phone}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
