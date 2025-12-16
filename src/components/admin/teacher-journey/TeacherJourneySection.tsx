import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus,
  Edit2,
  Calendar,
  User,
  MessageSquare,
  Award,
  Rocket
} from "lucide-react";
import { teacherJourneyService } from '@/services/teacherJourney.service';
import { TeacherJourney } from '@/types/teacherJourney';
import { toast } from 'react-toastify';
import { DemoFeedbackModal, UpdateJourneyModal } from './index';

interface TeacherJourneySectionProps {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
}

const TeacherJourneySection: React.FC<TeacherJourneySectionProps> = ({
  applicationId,
}) => {
  const [journey, setJourney] = useState<TeacherJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchJourney = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teacherJourneyService.getJourneyByApplicationId(applicationId);
      if (response.status && response.data) {
        setJourney(response.data);
      } else {
        setJourney(null);
      }
    } catch (error) {
      console.error('Error fetching journey:', error);
      setJourney(null);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    if (applicationId) {
      fetchJourney();
    }
  }, [applicationId, fetchJourney]);

  const handleCreateJourney = async () => {
    try {
      setCreating(true);
      const response = await teacherJourneyService.createJourneyFromCandidate(applicationId);
      if (response.status && response.data) {
        setJourney(response.data);
        toast.success('Teacher journey created successfully!');
      } else {
        toast.error(response.message || 'Failed to create journey');
      }
    } catch (error) {
      console.error('Error creating journey:', error);
      toast.error('Failed to create journey');
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      'PENDING': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: <Clock className="h-3.5 w-3.5" /> },
      'SCHEDULED': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: <Clock className="h-3.5 w-3.5" /> },
      'SELECTED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
      'NOT_SELECTED': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
      'YES': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
      'NO': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
      'JOINED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
      'NOT_JOINED': { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: <Clock className="h-3.5 w-3.5" /> },
      'INCOMPLETE': { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: <Clock className="h-3.5 w-3.5" /> },
      'SHIFTED_TO_NEXT_WEEK': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: <Calendar className="h-3.5 w-3.5" /> },
      'DROPPED': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
      'CLEARED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <Award className="h-3.5 w-3.5" /> },
      'NOT_CLEARED': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
      'NEEDS_MORE_TRAINING': { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: <Clock className="h-3.5 w-3.5" /> },
    };
    const config = configs[status] || { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: <Clock className="h-3.5 w-3.5" /> };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}>
        {config.icon}
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const renderStars = (rating: number | null | undefined) => {
    if (!rating) return null;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading journey...</span>
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <GraduationCap className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Journey Started</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            Start tracking this candidate's journey from demo to going live
          </p>
          <Button onClick={handleCreateJourney} disabled={creating} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            {creating ? 'Creating...' : 'Start Teacher Journey'}
          </Button>
        </div>
      </div>
    );
  }

  const stages = [
    { label: 'Demo', done: journey.demoStatus === 'SELECTED', icon: User },
    { label: 'Induction', done: journey.inductionAttendance === 'YES', icon: Calendar },
    { label: 'Training', done: journey.trainingStatus === 'JOINED', icon: GraduationCap },
    { label: 'Certification', done: journey.certificationStatus === 'CLEARED', icon: Award },
    { label: 'Go Live', done: journey.goLiveReadiness === 'YES', icon: Rocket },
  ];

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-sm">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Teacher Journey</h2>
              <p className="text-xs text-slate-500">Track progress from demo to go-live</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowUpdateModal(true)}
            className="border-slate-300 hover:bg-slate-50"
          >
            <Edit2 className="h-4 w-4 mr-2" /> Update
          </Button>
        </div>

        {/* Progress Pipeline */}
        <div className="px-6 py-6 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {stages.map((stage, i) => (
              <React.Fragment key={stage.label}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    stage.done 
                      ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200' 
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}>
                    {stage.done ? <CheckCircle2 className="h-6 w-6" /> : <stage.icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-semibold ${stage.done ? 'text-teal-600' : 'text-slate-500'}`}>
                    {stage.label}
                  </span>
                </div>
                {i < stages.length - 1 && (
                  <div className={`flex-1 h-1 mx-3 rounded-full ${
                    stages[i + 1].done || stage.done ? 'bg-gradient-to-r from-teal-400 to-emerald-400' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Top Row - Demo Interview full width */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 text-lg">Demo Interview</h3>
              </div>
              {getStatusBadge(journey.demoStatus)}
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-6 text-sm text-slate-600 mb-4">
                {journey.demoDate && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(journey.demoDate).toLocaleDateString()}
                  </span>
                )}
                {journey.demoInterviewerName && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    {journey.demoInterviewerName}
                  </span>
                )}
              </div>
              
              {(journey.lessonClarity || journey.studentEngagement) && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Performance Ratings</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
                    {journey.lessonClarity && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Lesson Clarity</span>
                        {renderStars(journey.lessonClarity)}
                      </div>
                    )}
                    {journey.studentEngagement && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Engagement</span>
                        {renderStars(journey.studentEngagement)}
                      </div>
                    )}
                    {journey.languageCommunication && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Communication</span>
                        {renderStars(journey.languageCommunication)}
                      </div>
                    )}
                    {journey.teachingAids && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Teaching Aids</span>
                        {renderStars(journey.teachingAids)}
                      </div>
                    )}
                    {journey.creativityDelivery && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Creativity</span>
                        {renderStars(journey.creativityDelivery)}
                      </div>
                    )}
                    {journey.grammarPronunciation && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Grammar</span>
                        {renderStars(journey.grammarPronunciation)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {journey.demoStatus === 'PENDING' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => setShowDemoModal(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Add Feedback
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Row - 3 Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Induction Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Induction</h3>
                </div>
                {getStatusBadge(journey.inductionAttendance)}
              </div>
              <div className="p-4">
                {journey.inductionDate ? (
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(journey.inductionDate).toLocaleDateString()}
                  </span>
                ) : (
                  <p className="text-sm text-slate-400 italic">No date scheduled</p>
                )}
              </div>
            </div>

            {/* Training Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Training</h3>
                </div>
                {getStatusBadge(journey.trainingStatus)}
              </div>
              <div className="p-4">
                {journey.trainingStartDate && (
                  <span className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Started {new Date(journey.trainingStartDate).toLocaleDateString()}
                  </span>
                )}
                {journey.trainingNotes && (
                  <div className={journey.trainingStartDate ? "pt-3 border-t border-slate-100" : ""}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm text-slate-600">{journey.trainingNotes}</p>
                  </div>
                )}
                {!journey.trainingStartDate && !journey.trainingNotes && (
                  <p className="text-sm text-slate-400 italic">Not started</p>
                )}
              </div>
            </div>

            {/* Certification Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Certification</h3>
                </div>
                {getStatusBadge(journey.certificationStatus)}
              </div>
              <div className="p-4">
                {journey.certificationDate && (
                  <span className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(journey.certificationDate).toLocaleDateString()}
                  </span>
                )}
                {journey.certificationFeedback && (
                  <div className={journey.certificationDate ? "pt-3 border-t border-slate-100" : ""}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Feedback</p>
                    <p className="text-sm text-slate-600">{journey.certificationFeedback}</p>
                  </div>
                )}
                {!journey.certificationDate && !journey.certificationFeedback && (
                  <p className="text-sm text-slate-400 italic">Pending</p>
                )}
              </div>
            </div>
          </div>

          {/* Go Live Section */}
          <div className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-md overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Go-Live Readiness</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    {journey.goLiveDate && (
                      <span className="flex items-center gap-1.5 text-sm text-white/80">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(journey.goLiveDate).toLocaleDateString()}
                      </span>
                    )}
                    {journey.assignedSubject && (
                      <span className="flex items-center gap-1.5 text-sm text-white/80">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {journey.assignedSubject.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                journey.goLiveReadiness === 'YES' 
                  ? 'bg-white text-emerald-600' 
                  : 'bg-white/20 text-white'
              }`}>
                {journey.goLiveReadiness === 'YES' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                {journey.goLiveReadiness.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DemoFeedbackModal
        isOpen={showDemoModal}
        journey={journey}
        onClose={() => setShowDemoModal(false)}
        onSubmit={async (data) => {
          const response = await teacherJourneyService.submitDemoFeedback(data);
          if (response.status) {
            toast.success('Demo feedback submitted!');
            fetchJourney();
            return true;
          } else {
            toast.error(response.message || 'Failed to submit feedback');
            return false;
          }
        }}
      />

      <UpdateJourneyModal
        isOpen={showUpdateModal}
        journey={journey}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={async (id, data) => {
          const response = await teacherJourneyService.updateJourney(id, data);
          if (response.status) {
            toast.success('Journey updated!');
            fetchJourney();
            return true;
          } else {
            toast.error(response.message || 'Failed to update');
            return false;
          }
        }}
      />
    </>
  );
};

export default TeacherJourneySection;

