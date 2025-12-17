import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus,
  Pencil,
  X,
  Save,
  Calendar,
  User,
  Award,
  Rocket,
  AlertTriangle,
  Lock,
  Brain,
  Globe
} from "lucide-react";
import { teacherJourneyService } from '@/services/teacherJourney.service';
import { 
  TeacherJourney, 
  DemoStatus, 
  InductionStatus, 
  TrainingStatus, 
  CertificationStatus, 
  GoLiveStatus,
  Subject,
  TeachingStyleRating,
  YesNo,
  DemoPaidType,
  TimeSlot,
  EmploymentType,
  TrainingBatch,
  WhatsAppGroupStatus
} from '@/types/teacherJourney';
import { toast } from 'react-toastify';

// ============================================
// TYPES
// ============================================
type TabKey = 'aiRound' | 'demo' | 'induction' | 'training' | 'certification' | 'goLive';

interface TeacherJourneySectionProps {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  // AI Round data passed from parent (interview results)
  aiRoundStatus?: string;
  aiRoundScore?: number | null;
  aiRoundCompletedAt?: string | null;
  // AI Round feedback
  aiRoundStrengths?: string[];
  aiRoundAreasForImprovement?: string[];
  aiRoundEvaluation?: Record<string, unknown>;
}

// ============================================
// TAB CONFIGURATION
// ============================================
const TABS: { key: TabKey; label: string; icon: React.ElementType; gradient: string }[] = [
  { key: 'aiRound', label: 'AI Round', icon: Brain, gradient: 'from-purple-500 to-pink-500' },
  { key: 'demo', label: 'Demo', icon: User, gradient: 'from-blue-500 to-indigo-500' },
  { key: 'induction', label: 'Induction', icon: Calendar, gradient: 'from-violet-500 to-purple-500' },
  { key: 'training', label: 'Training', icon: GraduationCap, gradient: 'from-amber-500 to-orange-500' },
  { key: 'certification', label: 'Certification', icon: Award, gradient: 'from-emerald-500 to-teal-500' },
  { key: 'goLive', label: 'Go Live', icon: Rocket, gradient: 'from-teal-500 to-cyan-500' },
];

// ============================================
// STATUS BADGE HELPER
// ============================================
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
    'COMPLETED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  };
  const config = configs[status] || { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: <Clock className="h-3.5 w-3.5" /> };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}>
      {config.icon}
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// ============================================
// STAR RATING COMPONENT
// ============================================
const StarRating: React.FC<{ value: number; onChange?: (v: number) => void; readonly?: boolean }> = ({ 
  value, onChange, readonly = true 
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star 
        key={star} 
        className={`h-4 w-4 ${star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} ${!readonly ? 'cursor-pointer hover:text-amber-300' : ''}`}
        onClick={() => !readonly && onChange?.(star)}
      />
    ))}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const TeacherJourneySection: React.FC<TeacherJourneySectionProps> = ({ 
  applicationId,
  aiRoundStatus,
  aiRoundScore,
  aiRoundCompletedAt,
  aiRoundStrengths,
  aiRoundAreasForImprovement,
  aiRoundEvaluation
}) => {
  const [journey, setJourney] = useState<TeacherJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('aiRound'); // Start with AI Round
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state - stores temporary edits before saving
  const [editData, setEditData] = useState<Partial<TeacherJourney>>({});

  // Fetch journey data
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
    if (applicationId) fetchJourney();
  }, [applicationId, fetchJourney]);

  // Create new journey
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

  // Enter edit mode - populate editData with current values
  const handleStartEdit = () => {
    if (!journey) return;
    setEditData({ ...journey });
    setEditMode(true);
  };

  // Cancel edit - discard changes
  const handleCancelEdit = () => {
    setEditData({});
    setEditMode(false);
  };

  // Save changes for current section only
  const handleSave = async () => {
    if (!journey?.id) return;
    
    setSaving(true);
    try {
      // Build update payload based on active tab
      const updatePayload = buildUpdatePayload(activeTab, editData);
      
      const response = await teacherJourneyService.updateJourney(journey.id, updatePayload);
      if (response.status) {
        toast.success(`${TABS.find(t => t.key === activeTab)?.label} updated!`);
        fetchJourney();
        setEditMode(false);
        setEditData({});
      } else {
        toast.error(response.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Build payload for specific section
  const buildUpdatePayload = (tab: TabKey, data: Partial<TeacherJourney>) => {
    switch (tab) {
      case 'demo':
        return {
          // Basic demo fields
          demoStatus: data.demoStatus,
          demoDate: data.demoDate,
          demoInterviewerName: data.demoInterviewerName,
          demoFeedback: data.demoFeedback,
          // Demo ratings
          lessonClarity: data.lessonClarity,
          studentEngagement: data.studentEngagement,
          languageCommunication: data.languageCommunication,
          teachingAids: data.teachingAids,
          creativityDelivery: data.creativityDelivery,
          grammarPronunciation: data.grammarPronunciation,
          // Extended Demo Evaluation
          overallTeachingStyle: data.overallTeachingStyle,
          demoConducted: data.demoConducted,
          goodToGo: data.goodToGo,
          demoPaidStatus: data.demoPaidStatus,
          // Language & Subject Info
          languagesSpoken: data.languagesSpoken,
          subjectsPrograms: data.subjectsPrograms,
          // Availability & Preferences
          preferredTimeSlot: data.preferredTimeSlot,
          employmentType: data.employmentType,
          minHoursConfirmed: data.minHoursConfirmed,
          // Training & Onboarding Confirmation
          willingGitaTraining: data.willingGitaTraining,
          trainingBatchPreference: data.trainingBatchPreference,
          salaryStructureAccepted: data.salaryStructureAccepted,
          willingToStartIn2Weeks: data.willingToStartIn2Weeks,
          // Internal Hiring Status
          onboardingEmailSent: data.onboardingEmailSent,
          hireCallMade: data.hireCallMade,
          joinedWhatsAppGroup: data.joinedWhatsAppGroup,
          rejectComments: data.rejectComments,
          rejectEmailSent: data.rejectEmailSent,
          internalComments: data.internalComments,
        };
      case 'induction':
        return {
          inductionAttendance: data.inductionAttendance,
          inductionDate: data.inductionDate,
        };
      case 'training':
        return {
          trainingStatus: data.trainingStatus,
          trainingStartDate: data.trainingStartDate,
          trainingNotes: data.trainingNotes,
        };
      case 'certification':
        return {
          certificationStatus: data.certificationStatus,
          certificationDate: data.certificationDate,
          certificationFeedback: data.certificationFeedback,
        };
      case 'goLive':
        return {
          goLiveReadiness: data.goLiveReadiness,
          goLiveDate: data.goLiveDate,
          assignedSubject: data.assignedSubject,
        };
      default:
        return {};
    }
  };

  // Get status for tab indicator
  const getTabStatus = (tab: TabKey): boolean => {
    switch (tab) {
      // AI Round status comes from props (interview data), not journey
      case 'aiRound': return aiRoundStatus === 'completed' || aiRoundStatus === 'passed';
      // Journey-based statuses
      case 'demo': return journey?.demoStatus === 'SELECTED';
      case 'induction': return journey?.inductionAttendance === 'YES';
      case 'training': return journey?.trainingStatus === 'JOINED' || journey?.trainingStatus === 'COMPLETED';
      case 'certification': return journey?.certificationStatus === 'CLEARED';
      case 'goLive': return journey?.goLiveReadiness === 'YES';
      default: return false;
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading journey...</span>
        </div>
      </div>
    );
  }

  // ============================================
  // NO JOURNEY STATE
  // ============================================
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

  // ============================================
  // MAIN RENDER
  // ============================================
  const currentTab = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="h-full flex flex-col">
      {/* ============================================
          TAB NAVIGATION - Clickable stage indicators
          Tabs are disabled while in edit mode to prevent data loss
          ============================================ */}
      <div className={`px-4 py-4 border-b transition-colors ${
        editMode ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'
      }`}>
        {/* Edit mode warning banner */}
        {editMode && (
          <div className="flex items-center justify-center gap-2 mb-3 text-amber-700 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>You are editing <strong>{currentTab.label}</strong>. Save or cancel to switch sections.</span>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          {TABS.map((tab, i) => {
            const isActive = activeTab === tab.key;
            const isDone = getTabStatus(tab.key);
            const TabIcon = tab.icon;
            // Disable other tabs while editing to prevent accidental data loss
            const isDisabled = editMode && !isActive;
            
            return (
              <React.Fragment key={tab.key}>
                {/* Tab Button */}
                <button
                  onClick={() => {
                    if (isDisabled) return; // Prevent switching while editing
                    setActiveTab(tab.key);
                    setEditMode(false);
                    setEditData({});
                  }}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    isDisabled
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                      : isActive 
                        ? editMode
                          ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300' // Active tab in edit mode
                          : 'bg-teal-50 text-teal-700 ring-2 ring-teal-200' // Active tab in view mode
                        : isDone 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isDisabled
                      ? 'bg-slate-200 text-slate-400'
                      : isActive 
                        ? editMode
                          ? 'bg-amber-500 text-white' // Edit mode indicator
                          : `bg-gradient-to-br ${tab.gradient} text-white`
                        : isDone 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isDisabled ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : isDone && !isActive ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <TabIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
                
                {/* Connector Line */}
                {i < TABS.length - 1 && (
                  <div className={`hidden sm:block w-8 h-0.5 rounded ${
                    editMode 
                      ? 'bg-amber-200'
                      : getTabStatus(TABS[i + 1].key) || isDone 
                        ? 'bg-emerald-300' 
                        : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ============================================
          SECTION CONTENT - Shows active tab's data
          Visual distinction: View mode = white/slate, Edit mode = amber tint
          ============================================ */}
      <div className={`flex-1 p-6 overflow-auto transition-colors ${
        editMode ? 'bg-amber-50/50' : 'bg-slate-50'
      }`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-xl shadow-sm overflow-hidden transition-all ${
            editMode 
              ? 'bg-white border-2 border-amber-300 ring-4 ring-amber-100' 
              : 'bg-white border border-slate-200'
          }`}>
            {/* Section Header - Distinct styling for edit mode */}
            <div className={`px-5 py-4 flex items-center justify-between transition-colors ${
              editMode 
                ? 'bg-amber-100 border-b-2 border-amber-200' 
                : 'bg-white border-b border-slate-100'
            }`}>
          <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  editMode 
                    ? 'bg-amber-500' 
                    : `bg-gradient-to-br ${currentTab.gradient}`
                }`}>
                  {editMode ? (
                    <Pencil className="h-5 w-5 text-white" />
                  ) : (
                    <currentTab.icon className="h-5 w-5 text-white" />
                  )}
            </div>
            <div>
                  <h3 className={`font-semibold text-lg ${editMode ? 'text-amber-900' : 'text-slate-800'}`}>
                    {editMode ? `Editing ${currentTab.label}` : currentTab.label}
                  </h3>
                  <p className={`text-xs ${editMode ? 'text-amber-600' : 'text-slate-500'}`}>
                    {editMode ? 'Make changes and save when done' : `View ${currentTab.label.toLowerCase()} details`}
                  </p>
            </div>
          </div>
              
              {/* Edit / Save / Cancel Buttons - AI Round is read-only (data from interview) */}
              {activeTab === 'aiRound' ? (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Read Only</span>
              ) : !editMode ? (
                <button
                  onClick={handleStartEdit}
                  disabled={!journey}
                  className="p-2.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  title={journey ? "Edit this section" : "Start journey first"}
                >
                  <Pencil className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit} 
                    disabled={saving}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave} 
                    disabled={saving} 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-1" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
                </div>
              )}
        </div>

            {/* Section Content - Render based on active tab */}
            <div className={`p-5 transition-colors ${editMode ? 'bg-amber-50/30' : 'bg-white'}`}>
              {activeTab === 'aiRound' && (
                <AIRoundSection 
                  status={aiRoundStatus} 
                  score={aiRoundScore} 
                  completedAt={aiRoundCompletedAt}
                  strengths={aiRoundStrengths}
                  areasForImprovement={aiRoundAreasForImprovement}
                  evaluation={aiRoundEvaluation}
                />
              )}
              {activeTab === 'demo' && journey && <DemoSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} />}
              {activeTab === 'induction' && journey && <InductionSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} />}
              {activeTab === 'training' && journey && <TrainingSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} />}
              {activeTab === 'certification' && journey && <CertificationSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} />}
              {activeTab === 'goLive' && journey && <GoLiveSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} />}
                  </div>
            
            {/* Edit mode footer hint */}
            {editMode && (
              <div className="px-5 py-3 bg-amber-100/50 border-t border-amber-200 text-center">
                <p className="text-xs text-amber-600">
                  💡 Changes are only saved when you click <strong>Save Changes</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION COMPONENTS - Individual tab content
// ============================================

interface SectionProps {
  journey: TeacherJourney;
  editMode: boolean;
  editData: Partial<TeacherJourney>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<TeacherJourney>>>;
}

// AI ROUND SECTION (Read-only - data from interview, not editable in journey)
interface AIRoundSectionProps {
  status?: string;
  score?: number | null;
  completedAt?: string | null;
  // Feedback from AI interview
  strengths?: string[];
  areasForImprovement?: string[];
  evaluation?: Record<string, unknown>;
}

const AIRoundSection: React.FC<AIRoundSectionProps> = ({ 
  status, 
  score, 
  completedAt,
  strengths,
  areasForImprovement,
  evaluation
}) => {
  // Determine if passed/failed based on score (threshold: 5)
  const isPassed = score !== null && score !== undefined && score >= 5;
  const statusLabel = !status || status === 'no_interview' 
    ? 'Not Started' 
    : status === 'completed' || status === 'passed'
      ? isPassed ? 'Passed' : 'Failed'
      : status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getStatusStyle = () => {
    if (!status || status === 'no_interview') {
      return { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: <Clock className="h-3.5 w-3.5" /> };
    }
    if (status === 'in_progress') {
      return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: <Clock className="h-3.5 w-3.5" /> };
    }
    if (isPassed) {
      return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> };
    }
    return { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> };
  };

  const statusStyle = getStatusStyle();

  // Check if we have any feedback data to display
  const hasFeedback = (strengths && strengths.length > 0) || 
                      (areasForImprovement && areasForImprovement.length > 0) ||
                      (evaluation && Object.keys(evaluation).length > 0);

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
        <span className="text-sm font-medium text-slate-600">Interview Status</span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.icon}
          {statusLabel}
        </span>
      </div>

      {/* Score */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
        <Label className="text-xs text-purple-600 font-medium">AI Interview Score</Label>
        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-4xl font-bold ${
            score === null || score === undefined 
              ? 'text-slate-300' 
              : isPassed 
                ? 'text-emerald-600' 
                : 'text-red-500'
          }`}>
            {score !== null && score !== undefined ? score.toFixed(1) : '—'}
          </span>
          <span className="text-slate-400 text-lg">/10</span>
          {score !== null && score !== undefined && (
            <span className={`ml-2 text-sm font-medium ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
              ({(score * 10).toFixed(0)}%)
            </span>
          )}
        </div>
        {score !== null && score !== undefined && (
          <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${isPassed ? 'bg-emerald-500' : 'bg-red-400'}`}
              style={{ width: `${Math.min(score * 10, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* ============================================
          FEEDBACK SECTION - Strengths & Areas for Improvement
          ============================================ */}
      {hasFeedback && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-500" />
            Interview Feedback
          </h4>

          {/* Strengths */}
          {strengths && strengths.length > 0 && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <Label className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Strengths
              </Label>
              <ul className="space-y-1.5">
                {strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {areasForImprovement && areasForImprovement.length > 0 && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <Label className="text-xs text-amber-700 font-semibold flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                Areas for Improvement
              </Label>
              <ul className="space-y-1.5">
                {areasForImprovement.map((area, index) => (
                  <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Evaluation Scores */}
          {evaluation && Object.keys(evaluation).length > 0 && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <Label className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mb-3">
                <Star className="h-3.5 w-3.5" />
                Evaluation Breakdown
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(evaluation).map(([key, value]) => {
                  // Skip non-display fields
                  if (key === 'overall_score' || key === 'recommendation') return null;
                  
                  const displayKey = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                  
                  // Handle different value types
                  const displayValue = typeof value === 'number' 
                    ? `${value}/10`
                    : typeof value === 'object' && value !== null
                      ? JSON.stringify(value)
                      : String(value || '—');
                  
                  const numValue = typeof value === 'number' ? value : null;
                  
                  return (
                    <div key={key} className="flex items-center justify-between py-1.5 px-2 rounded bg-white">
                      <span className="text-xs text-slate-600">{displayKey}</span>
                      {numValue !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                numValue >= 7 ? 'bg-emerald-500' : 
                                numValue >= 5 ? 'bg-amber-500' : 'bg-red-400'
                              }`}
                              style={{ width: `${numValue * 10}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${
                            numValue >= 7 ? 'text-emerald-600' : 
                            numValue >= 5 ? 'text-amber-600' : 'text-red-500'
                          }`}>
                            {displayValue}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-700">{displayValue}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info note */}
      <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-xs text-purple-600">
          <Brain className="h-3.5 w-3.5 inline mr-1" />
          AI Interview results are automatically populated from the interview system and cannot be edited here.
        </p>
      </div>
    </div>
  );
};

// ============================================
// SHARED HELPER COMPONENTS FOR DEMO SECTION
// Defined outside to prevent re-creation on every render
// ============================================

const FieldContainer: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  editMode?: boolean;
}> = ({ children, className = '', editMode = false }) => (
  <div className={`p-3 rounded-lg transition-colors ${
    editMode ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50/50'
  } ${className}`}>
    {children}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode; editMode?: boolean }> = ({ children, editMode = false }) => (
  <Label className={`text-xs block mb-1 ${
    editMode ? 'text-amber-700 font-medium' : 'text-slate-500'
  }`}>
    {children}
  </Label>
);

const FieldValue: React.FC<{ 
  value: string | number | null | undefined; 
  fallback?: string 
}> = ({ value, fallback = '—' }) => (
  <p className="text-sm text-slate-700 font-medium">
    {value || <span className="text-slate-400 italic font-normal">{fallback}</span>}
  </p>
);

const YesNoBadge: React.FC<{ value?: string | null }> = ({ value }) => {
  if (!value) return <span className="text-slate-400 text-sm">—</span>;
  const isYes = value === 'YES';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isYes ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
    }`}>
      {isYes ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {value}
    </span>
  );
};

const DemoSectionHeader: React.FC<{ 
  title: string; 
  icon: React.ReactNode;
  description?: string;
  editMode?: boolean;
}> = ({ title, icon, description, editMode = false }) => (
  <div className={`flex items-center gap-2 pb-3 mb-4 border-b ${
    editMode ? 'border-amber-200' : 'border-slate-200'
  }`}>
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
      editMode ? 'bg-amber-200 text-amber-700' : 'bg-blue-100 text-blue-600'
    }`}>
      {icon}
    </div>
    <div>
      <h4 className={`text-sm font-semibold ${editMode ? 'text-amber-800' : 'text-slate-700'}`}>
        {title}
      </h4>
      {description && (
        <p className="text-xs text-slate-400">{description}</p>
      )}
    </div>
  </div>
);

// ============================================
// DEMO SECTION - Comprehensive Demo Application Form
// Organized into logical groups: Candidate Info, Evaluation, 
// Language/Subject, Availability, Training, Hiring Status
// ============================================

const DemoSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData }) => {
  const data = editMode ? editData : journey;

  return (
    <div className="space-y-6">
      {/* ============================================
          A. CANDIDATE INFO & DEMO STATUS
          Basic information and current demo status
          ============================================ */}
      <div>
        <DemoSectionHeader editMode={editMode} 
          title="Candidate Info & Demo Status" 
          icon={<User className="h-4 w-4" />}
          description="Basic details and interview status"
        />
        
        {/* Status Row */}
        <div className={`flex items-center justify-between p-3 rounded-lg mb-4 ${
          editMode ? 'bg-amber-100 border border-amber-300' : 'bg-slate-100'
        }`}>
          <span className={`text-sm font-medium ${editMode ? 'text-amber-700' : 'text-slate-600'}`}>
            Demo Status
          </span>
          {editMode ? (
            <Select value={data.demoStatus || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, demoStatus: v as DemoStatus }))}>
              <SelectTrigger className="w-48 bg-white border-amber-300"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="SELECTED">Selected</SelectItem>
                <SelectItem value="NOT_SELECTED">Not Selected</SelectItem>
              </SelectContent>
            </Select>
          ) : getStatusBadge(journey.demoStatus)}
                    </div>

        {/* 2-column grid for candidate info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Timestamp</FieldLabel>
            <FieldValue value={journey.createdAt ? new Date(journey.createdAt).toLocaleString() : null} />
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Full Name</FieldLabel>
            <FieldValue value={`${journey.firstName || ''} ${journey.lastName || ''}`.trim()} fallback="Not provided" />
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Email Address</FieldLabel>
            <FieldValue value={journey.email} />
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Phone Number</FieldLabel>
            <FieldValue value={journey.phoneNumber} />
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Demo Date</FieldLabel>
            {editMode ? (
              <Input type="date" value={data.demoDate?.split('T')[0] || ''} 
                className="mt-1 bg-white border-amber-300"
                onChange={(e) => setEditData(prev => ({ ...prev, demoDate: e.target.value }))} />
            ) : (
              <FieldValue value={journey.demoDate ? new Date(journey.demoDate).toLocaleDateString() : null} />
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Interviewer Name</FieldLabel>
            {editMode ? (
              <Input value={data.demoInterviewerName || ''} placeholder="Enter interviewer name..."
                className="mt-1 bg-white border-amber-300"
                onChange={(e) => setEditData(prev => ({ ...prev, demoInterviewerName: e.target.value }))} />
            ) : (
              <FieldValue value={journey.demoInterviewerName} />
            )}
          </FieldContainer>
                    </div>
      </div>

      {/* ============================================
          B. DEMO EVALUATION
          Performance ratings and evaluation metrics
          ============================================ */}
      <div>
        <DemoSectionHeader editMode={editMode} 
          title="Demo Evaluation" 
          icon={<Star className="h-4 w-4" />}
          description="Performance assessment and feedback"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Overall Teaching Style */}
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Overall Teaching Style</FieldLabel>
            {editMode ? (
              <Select value={data.overallTeachingStyle || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, overallTeachingStyle: v as TeachingStyleRating }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select rating" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BAD">Bad</SelectItem>
                  <SelectItem value="AVERAGE">Average</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                journey.overallTeachingStyle === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-700' :
                journey.overallTeachingStyle === 'GOOD' ? 'bg-blue-100 text-blue-700' :
                journey.overallTeachingStyle === 'AVERAGE' ? 'bg-amber-100 text-amber-700' :
                journey.overallTeachingStyle === 'BAD' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {journey.overallTeachingStyle || '—'}
              </span>
            )}
          </FieldContainer>

          {/* Demo Conducted */}
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Demo Conducted?</FieldLabel>
            {editMode ? (
              <Select value={data.demoConducted || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, demoConducted: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.demoConducted} /></div>
            )}
          </FieldContainer>

          {/* Good to Go */}
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Good to Go?</FieldLabel>
            {editMode ? (
              <Select value={data.goodToGo || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, goodToGo: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.goodToGo} /></div>
            )}
          </FieldContainer>

          {/* Demo / Paid Status */}
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Demo / Paid</FieldLabel>
            {editMode ? (
              <Select value={data.demoPaidStatus || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, demoPaidStatus: v as DemoPaidType }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEMO">Demo</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="NA">N/A</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                journey.demoPaidStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                journey.demoPaidStatus === 'DEMO' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {journey.demoPaidStatus || '—'}
              </span>
            )}
          </FieldContainer>
                    </div>

        {/* Star Ratings Grid */}
        <div className={`mt-4 p-4 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            editMode ? 'text-amber-600' : 'text-slate-400'
          }`}>
            Performance Ratings {editMode && <span className="normal-case font-normal">(click stars to rate)</span>}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {([
              { key: 'lessonClarity', label: 'Lesson Clarity' },
              { key: 'studentEngagement', label: 'Student Engagement' },
              { key: 'languageCommunication', label: 'Language & Communication' },
              { key: 'teachingAids', label: 'Teaching Aids Usage' },
              { key: 'creativityDelivery', label: 'Creativity & Delivery' },
              { key: 'grammarPronunciation', label: 'Grammar & Pronunciation' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-1">
                <span className={`text-sm ${editMode ? 'text-amber-800' : 'text-slate-600'}`}>{label}</span>
                <StarRating 
                  value={(editMode ? editData[key] : journey[key]) || 0} 
                  readonly={!editMode}
                  onChange={(v) => setEditData(prev => ({ ...prev, [key]: v }))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Textarea */}
        <FieldContainer editMode={editMode} className="mt-3">
          <FieldLabel editMode={editMode}>Demo Feedback</FieldLabel>
          {editMode ? (
            <Textarea 
              value={data.demoFeedback || ''} 
              placeholder="Enter detailed feedback about the demo..."
              rows={3}
              className="mt-1 bg-white border-amber-300"
              onChange={(e) => setEditData(prev => ({ ...prev, demoFeedback: e.target.value }))} 
            />
          ) : (
            <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
              {journey.demoFeedback || <span className="text-slate-400 italic">No feedback provided</span>}
            </p>
          )}
        </FieldContainer>
      </div>

      {/* ============================================
          C. LANGUAGE & SUBJECT INFO
          Languages spoken and subjects/programs
          ============================================ */}
      <div>
        <DemoSectionHeader editMode={editMode} 
          title="Language & Subject Info" 
          icon={<Globe className="h-4 w-4" />}
          description="Communication abilities and teaching specializations"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Languages Spoken</FieldLabel>
            {editMode ? (
              <Input 
                value={data.languagesSpoken?.join(', ') || ''} 
                placeholder="e.g., English, Hindi, Tamil"
                className="mt-1 bg-white border-amber-300"
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  languagesSpoken: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                }))} 
              />
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {journey.languagesSpoken?.length ? journey.languagesSpoken.map((lang, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{lang}</span>
                )) : <span className="text-slate-400 text-sm">—</span>}
                    </div>
                  )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Subjects / Programs</FieldLabel>
            {editMode ? (
              <Input 
                value={data.subjectsPrograms?.join(', ') || ''} 
                placeholder="e.g., Math, Phonics, Unbox 7+"
                className="mt-1 bg-white border-amber-300"
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  subjectsPrograms: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                }))} 
              />
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {journey.subjectsPrograms?.length ? journey.subjectsPrograms.map((subj, i) => (
                  <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{subj}</span>
                )) : <span className="text-slate-400 text-sm">—</span>}
                    </div>
                  )}
          </FieldContainer>
                    </div>
      </div>

      {/* ============================================
          D. AVAILABILITY & PREFERENCES
          Time slots and employment type preferences
          ============================================ */}
      <div>
        <DemoSectionHeader editMode={editMode} 
          title="Availability & Preferences" 
          icon={<Clock className="h-4 w-4" />}
          description="Working hours and commitment"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Preferred Time Slot</FieldLabel>
            {editMode ? (
              <Select value={data.preferredTimeSlot || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, preferredTimeSlot: v as TimeSlot }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select time slot" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORNING_6AM">Morning – 6AM onwards</SelectItem>
                  <SelectItem value="AFTERNOON_12PM">Afternoon – 12PM onwards</SelectItem>
                  <SelectItem value="EVENING_6PM">Evening – 6PM onwards</SelectItem>
                  <SelectItem value="NIGHT_10PM">Night – 10PM onwards</SelectItem>
                  <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <FieldValue value={journey.preferredTimeSlot?.replace(/_/g, ' ')} />
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Part-Time or Full-Time?</FieldLabel>
            {editMode ? (
              <Select value={data.employmentType || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, employmentType: v as EmploymentType }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PART_TIME">Part-Time</SelectItem>
                  <SelectItem value="FULL_TIME">Full-Time</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                journey.employmentType === 'FULL_TIME' ? 'bg-emerald-100 text-emerald-700' :
                journey.employmentType === 'PART_TIME' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {journey.employmentType?.replace('_', '-') || '—'}
              </span>
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Minimum Hours Commitment Confirmed?</FieldLabel>
            {editMode ? (
              <Select value={data.minHoursConfirmed || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, minHoursConfirmed: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.minHoursConfirmed} /></div>
            )}
          </FieldContainer>
                </div>
      </div>

      {/* ============================================
          E. TRAINING & ONBOARDING CONFIRMATION
          Training willingness and preferences
          ============================================ */}
      <div>
        <DemoSectionHeader editMode={editMode} 
          title="Training & Onboarding Confirmation" 
          icon={<GraduationCap className="h-4 w-4" />}
          description="Training readiness and batch preferences"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Willing to get trained with Gita?</FieldLabel>
            {editMode ? (
              <Select value={data.willingGitaTraining || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, willingGitaTraining: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.willingGitaTraining} /></div>
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>1-Week Training Batch Preference</FieldLabel>
            {editMode ? (
              <Select value={data.trainingBatchPreference || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, trainingBatchPreference: v as TrainingBatch }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="11AM">11 AM Batch</SelectItem>
                  <SelectItem value="4PM">4 PM Batch</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <FieldValue value={journey.trainingBatchPreference ? `${journey.trainingBatchPreference} Batch` : null} />
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Salary Structure Reviewed & Accepted?</FieldLabel>
            {editMode ? (
              <Select value={data.salaryStructureAccepted || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, salaryStructureAccepted: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.salaryStructureAccepted} /></div>
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Willing to Start Training Within 2 Weeks?</FieldLabel>
            {editMode ? (
              <Select value={data.willingToStartIn2Weeks || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, willingToStartIn2Weeks: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.willingToStartIn2Weeks} /></div>
            )}
          </FieldContainer>
        </div>
            </div>

      {/* ============================================
          F. INTERNAL HIRING STATUS
          Admin tracking fields for hiring process
          ============================================ */}
      <div>
        <DemoSectionHeader editMode={editMode} 
          title="Internal Hiring Status" 
          icon={<Award className="h-4 w-4" />}
          description="Internal tracking and communication status"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Onboarding Email Sent?</FieldLabel>
            {editMode ? (
              <Select value={data.onboardingEmailSent || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, onboardingEmailSent: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.onboardingEmailSent} /></div>
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Hire Call Made?</FieldLabel>
            {editMode ? (
              <Select value={data.hireCallMade || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, hireCallMade: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.hireCallMade} /></div>
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Joined WhatsApp Group?</FieldLabel>
            {editMode ? (
              <Select value={data.joinedWhatsAppGroup || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, joinedWhatsAppGroup: v as WhatsAppGroupStatus }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEMO">Demo Group</SelectItem>
                  <SelectItem value="PAID">Paid Group</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                journey.joinedWhatsAppGroup === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                journey.joinedWhatsAppGroup === 'DEMO' ? 'bg-blue-100 text-blue-700' :
                journey.joinedWhatsAppGroup === 'NO' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {journey.joinedWhatsAppGroup || '—'}
              </span>
            )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Reject Email Sent?</FieldLabel>
            {editMode ? (
              <Select value={data.rejectEmailSent || ''} 
                onValueChange={(v) => setEditData(prev => ({ ...prev, rejectEmailSent: v as YesNo }))}>
                <SelectTrigger className="mt-1 bg-white border-amber-300"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1"><YesNoBadge value={journey.rejectEmailSent} /></div>
            )}
          </FieldContainer>
              </div>

        {/* Full-width textarea fields */}
        <div className="mt-3 space-y-3">
          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Reject Comments</FieldLabel>
            {editMode ? (
              <Textarea 
                value={data.rejectComments || ''} 
                placeholder="Reason for rejection (if applicable)..."
                rows={2}
                className="mt-1 bg-white border-amber-300"
                onChange={(e) => setEditData(prev => ({ ...prev, rejectComments: e.target.value }))} 
              />
            ) : (
              <p className="text-sm text-slate-700 mt-1">
                {journey.rejectComments || <span className="text-slate-400 italic">—</span>}
                </p>
              )}
          </FieldContainer>

          <FieldContainer editMode={editMode}>
            <FieldLabel editMode={editMode}>Internal Comments</FieldLabel>
            {editMode ? (
              <Textarea 
                value={data.internalComments || ''} 
                placeholder="Internal notes and observations..."
                rows={3}
                className="mt-1 bg-white border-amber-300"
                onChange={(e) => setEditData(prev => ({ ...prev, internalComments: e.target.value }))} 
              />
            ) : (
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
                {journey.internalComments || <span className="text-slate-400 italic">No internal comments</span>}
                </p>
              )}
          </FieldContainer>
                </div>
            </div>
    </div>
  );
};

// INDUCTION SECTION
const InductionSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData }) => {
  const data = editMode ? editData : journey;
  
  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-amber-700' : 'text-slate-600'}`}>Attendance</span>
        {editMode ? (
          <Select value={data.inductionAttendance || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, inductionAttendance: v as InductionStatus }))}>
            <SelectTrigger className="w-48 bg-white border-amber-300 focus:ring-amber-400"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="YES">Yes</SelectItem>
              <SelectItem value="NO">No</SelectItem>
            </SelectContent>
          </Select>
        ) : getStatusBadge(journey.inductionAttendance)}
              </div>
      
      <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>Induction Date</Label>
        {editMode ? (
          <Input type="date" value={data.inductionDate?.split('T')[0] || ''} 
            className="mt-1 bg-white border-amber-300 focus:ring-amber-400"
            onChange={(e) => setEditData(prev => ({ ...prev, inductionDate: e.target.value }))} />
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.inductionDate ? new Date(journey.inductionDate).toLocaleDateString() : '—'}</p>
        )}
                </div>
            </div>
  );
};

// TRAINING SECTION
const TrainingSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData }) => {
  const data = editMode ? editData : journey;
  
  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-amber-700' : 'text-slate-600'}`}>Status</span>
        {editMode ? (
          <Select value={data.trainingStatus || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, trainingStatus: v as TrainingStatus }))}>
            <SelectTrigger className="w-48 bg-white border-amber-300 focus:ring-amber-400"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="NOT_JOINED">Not Joined</SelectItem>
              <SelectItem value="JOINED">Joined</SelectItem>
              <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
              <SelectItem value="SHIFTED_TO_NEXT_WEEK">Shifted to Next Week</SelectItem>
              <SelectItem value="DROPPED">Dropped</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        ) : getStatusBadge(journey.trainingStatus)}
          </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>Start Date</Label>
        {editMode ? (
          <Input type="date" value={data.trainingStartDate?.split('T')[0] || ''} 
            className="mt-1 bg-white border-amber-300 focus:ring-amber-400"
            onChange={(e) => setEditData(prev => ({ ...prev, trainingStartDate: e.target.value }))} />
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.trainingStartDate ? new Date(journey.trainingStartDate).toLocaleDateString() : '—'}</p>
        )}
                </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>Notes</Label>
        {editMode ? (
          <Textarea value={data.trainingNotes || ''} rows={3} placeholder="Add training notes..."
            className="mt-1 bg-white border-amber-300 focus:ring-amber-400"
            onChange={(e) => setEditData(prev => ({ ...prev, trainingNotes: e.target.value }))} />
        ) : (
          <p className="text-sm text-slate-700 mt-1">{journey.trainingNotes || <span className="text-slate-400 italic">No notes</span>}</p>
                    )}
                  </div>
                </div>
  );
};

// CERTIFICATION SECTION
const CertificationSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData }) => {
  const data = editMode ? editData : journey;
  
  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-amber-700' : 'text-slate-600'}`}>Status</span>
        {editMode ? (
          <Select value={data.certificationStatus || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, certificationStatus: v as CertificationStatus }))}>
            <SelectTrigger className="w-48 bg-white border-amber-300 focus:ring-amber-400"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CLEARED">Cleared</SelectItem>
              <SelectItem value="NOT_CLEARED">Not Cleared</SelectItem>
            </SelectContent>
          </Select>
        ) : getStatusBadge(journey.certificationStatus)}
              </div>
      
      <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>Certification Date</Label>
        {editMode ? (
          <Input type="date" value={data.certificationDate?.split('T')[0] || ''} 
            className="mt-1 bg-white border-amber-300 focus:ring-amber-400"
            onChange={(e) => setEditData(prev => ({ ...prev, certificationDate: e.target.value }))} />
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.certificationDate ? new Date(journey.certificationDate).toLocaleDateString() : '—'}</p>
        )}
            </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>Feedback</Label>
        {editMode ? (
          <Textarea value={data.certificationFeedback || ''} rows={3} placeholder="Add certification feedback..."
            className="mt-1 bg-white border-amber-300 focus:ring-amber-400"
            onChange={(e) => setEditData(prev => ({ ...prev, certificationFeedback: e.target.value }))} />
        ) : (
          <p className="text-sm text-slate-700 mt-1">{journey.certificationFeedback || <span className="text-slate-400 italic">No feedback</span>}</p>
        )}
          </div>
        </div>
  );
};

// GO LIVE SECTION
const GoLiveSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData }) => {
  const data = editMode ? editData : journey;
  
  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-amber-700' : 'text-slate-600'}`}>Readiness</span>
        {editMode ? (
          <Select value={data.goLiveReadiness || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, goLiveReadiness: v as GoLiveStatus }))}>
            <SelectTrigger className="w-48 bg-white border-amber-300 focus:ring-amber-400"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="YES">Yes</SelectItem>
              <SelectItem value="NEEDS_MORE_TRAINING">Needs More Training</SelectItem>
            </SelectContent>
          </Select>
        ) : getStatusBadge(journey.goLiveReadiness)}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>Go-Live Date</Label>
        {editMode ? (
          <Input type="date" value={data.goLiveDate?.split('T')[0] || ''} 
            className="mt-1 bg-white border-amber-300 focus:ring-amber-400"
            onChange={(e) => setEditData(prev => ({ ...prev, goLiveDate: e.target.value }))} />
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.goLiveDate ? new Date(journey.goLiveDate).toLocaleDateString() : '—'}</p>
        )}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-200' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>Assigned Subject</Label>
        {editMode ? (
          <Select value={data.assignedSubject || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, assignedSubject: v === '' ? null : v as Subject }))}>
            <SelectTrigger className="mt-1 bg-white border-amber-300 focus:ring-amber-400"><SelectValue placeholder="Select subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LITTLE_YOGI">Little Yogi</SelectItem>
              <SelectItem value="UNBOX_7_PLUS">Unbox 7+</SelectItem>
              <SelectItem value="PHONICS">Phonics</SelectItem>
              <SelectItem value="ALPHA_MATH">Alpha Math</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.assignedSubject?.replace(/_/g, ' ') || <span className="text-slate-400 italic">Not assigned</span>}</p>
        )}
      </div>
    </div>
  );
};

export default TeacherJourneySection;
