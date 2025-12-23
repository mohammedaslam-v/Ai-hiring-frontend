import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  User,
  BookOpen,
  Globe,
  Clock,
  MessageCircle,
  ExternalLink,
  Brain,
  Presentation
} from "lucide-react";
import { useApplicationDetail } from "@/hooks/admin/useApplicationDetail";
import { usePermissions } from "@/hooks/admin/usePermissions";
import { getStatusBadge } from "@/components/admin/StatusBadge";
import { TeacherJourneySection } from "@/components/admin/teacher-journey";

export default function AdminApplicationDetail() {
  const navigate = useNavigate();
  const { application, loading, error } = useApplicationDetail();
  const { canSeeEmailWhatsApp } = usePermissions();

  // Score color helper - returns appropriate color class based on score value
  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return { text: 'text-[hsl(214,100%,15%,0.4)]', bg: 'bg-[#F4F6FA]' };
    if (score >= 7) return { text: 'text-[hsl(142,76%,36%)]', bg: 'bg-[hsl(142,76%,36%,0.1)]' };
    if (score >= 5) return { text: 'text-[hsl(38,92%,50%)]', bg: 'bg-[hsl(38,92%,50%,0.1)]' };
    return { text: 'text-[hsl(0,84%,60%)]', bg: 'bg-[hsl(0,84%,60%,0.1)]' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#1E62F2] border-t-transparent rounded-full animate-spin"></div>
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
  const scoreColors = getScoreColor(application.score);

  return (
      <div className="min-h-screen bg-[#F4F6FA]">
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

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* ============================================
              HERO SECTION - Compact, max ~25-30% viewport
              ============================================ */}
          <div className="bg-gradient-to-r from-[#1E62F2] via-[hsl(216,88%,60%)] to-[hsl(216,88%,64%)] px-5 py-4">
            
            {/* ROW 1: Identity + Contact - Single horizontal line */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                  {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                </div>
                <h1 className="text-xl font-semibold text-white">{application.firstName} {application.lastName}</h1>
              </div>
              
              {/* Contact - Inline, minimal */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {canSeeEmailWhatsApp ? (
                  // Limited admin can click email/whatsapp links
                  <>
                    <a href={`mailto:${application.email}`} className="flex items-center gap-1.5 text-white/90 hover:text-white">
                      <Mail className="h-3.5 w-3.5" />{application.email}
                    </a>
                    <span className="text-white/40">•</span>
                    <a href={`https://wa.me/${application.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-1.5 text-white/90 hover:text-white">
                      <Phone className="h-3.5 w-3.5" />{application.phone}
                      <MessageCircle className="h-3 w-3 text-green-300" />
                    </a>
                  </>
                ) : (
                  // Main admin sees contact info as plain text (not clickable)
                  <>
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Mail className="h-3.5 w-3.5" />{application.email}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Phone className="h-3.5 w-3.5" />{application.phone}
                    </span>
                  </>
                )}
                <span className="text-white/40">•</span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <Calendar className="h-3.5 w-3.5" />{new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* ROW 2: Scores + Meta - Compact horizontal layout */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Score Cards - Inline */}
              <div className="flex gap-2">
                {/* AI Interview */}
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
                  <Brain className={`h-4 w-4 ${scoreColors.text}`} />
                  <span className="text-xs text-[hsl(214,100%,15%,0.6)]">AI</span>
                  <span className={`text-lg font-bold ${scoreColors.text}`}>{application.score ?? "—"}</span>
                  <span className="text-xs text-[hsl(214,100%,15%,0.4)]">/10</span>
                  <div className="ml-1">{getStatusBadge(interviewStatus)}</div>
                </div>
                
                {/* Mock Demo */}
                <div className="flex items-center gap-2 bg-white/90 rounded-xl px-3 py-2">
                  <Presentation className="h-4 w-4 text-[hsl(214,100%,15%,0.4)]" />
                  <span className="text-xs text-[hsl(214,100%,15%,0.6)]">Demo</span>
                  <span className="text-lg font-bold text-[hsl(214,100%,15%,0.3)]">—</span>
                  <span className="text-xs text-[hsl(214,100%,15%,0.4)]">/10</span>
                  <Badge variant="outline" className="ml-1 bg-[hsl(240,5%,64.9%,0.1)] text-[hsl(240,5%,64.9%)] border-[hsl(240,5%,64.9%)] text-[10px] px-1.5 py-0 rounded-xl">
                    Pending
                  </Badge>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-white/20"></div>

              {/* Meta Tags - Compact pills */}
              <div className="flex flex-wrap items-center gap-2">
                {Array.isArray(application.subjects) && application.subjects.length > 0 && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-white/50" />
                    {application.subjects.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white/15 rounded text-[11px] text-white">{s}</span>
                    ))}
                  </div>
                )}
                {Array.isArray(application.additionalLanguages) && application.additionalLanguages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3 text-white/50" />
                    {application.additionalLanguages.map((l: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white/15 rounded text-[11px] text-white">{l}</span>
                    ))}
                  </div>
                )}
                {(application.availableDays?.length > 0 || application.timeSlots?.length > 0) && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-white/50" />
                    {application.availableDays?.map((d: string, i: number) => (
                      <span key={`d-${i}`} className="px-2 py-0.5 bg-white/15 rounded text-[11px] text-white">{d}</span>
                    ))}
                    {application.timeSlots?.map((t: string, i: number) => (
                      <span key={`t-${i}`} className="px-2 py-0.5 bg-white/10 rounded text-[11px] text-white/70">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================
              TEACHER JOURNEY SECTION - Full width below hero
              No sidebar, clean single-column layout
              ============================================ */}
          <div className="bg-[#F4F6FA]">
            <TeacherJourneySection
              applicationId={application.applicationId || application.id}
              candidateName={`${application.firstName} ${application.lastName}`}
              candidateEmail={application.email}
              candidatePhone={application.phone}
              // AI Round data from interview
              aiRoundStatus={interviewStatus}
              aiRoundScore={application.score}
              aiRoundCompletedAt={application.interview_completed || application.latest_completed_at}
              // AI Round feedback from interview
              aiRoundStrengths={application.strengths}
              aiRoundAreasForImprovement={application.areas_for_improvement}
              aiRoundEvaluation={application.evaluation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
