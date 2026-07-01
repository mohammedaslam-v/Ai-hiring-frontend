import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Globe,
  Mail,
  ChevronDown,
  Search,
  Video,
  Eye,
  Download,
  FileText,
  ClipboardCheck
} from "lucide-react";
import { teacherJourneyService, MockAssessment } from '@/services/teacherJourney.service';
import {
  TeacherJourney,
  DemoStatus,
  InductionStatus,
  INDUCTION_OPTIONS,
  TrainingStatus,
  TRAINING_STATUS_OPTIONS,
  CertificationStatus,
  DEMO_CERTIFICATION_STATUS_OPTIONS,
  PAID_CERTIFICATION_STATUS_OPTIONS,
  CERTIFICATION_TRAINING_COUNT_OPTIONS,
  GoLiveStatus,
  ReadyForPaidClassStatus,
  PaidTrainingStatus,
  PaidCertificationStatus,
  PaidGoLiveStatus,
  READY_FOR_PAID_CLASS_OPTIONS,
  Subject,
  TeachingStyleRating,
  YesNo,
  WhatsAppGroupStatus
} from '@/types/teacherJourney';
import { toast } from 'react-toastify';
import { getStatusBadgeColors } from '@/constants/teacherJourney/colors';
import { getSortedIndianLanguages } from '@/constants/indianLanguages';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { validateTeacherJourneySection } from '@/utils/yup/teacherJourneyValidation';
import { getEvaluationMedia } from "@/services/evaluationService";
import { useAuth } from '@/contexts/AuthContext';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useInterviewers } from '@/hooks/admin/useInterviewers';
import { useDemoTrainers } from '@/hooks/demo/useDemoTrainers';
import ScorecardGraderDialog from './ScorecardGraderDialog';

// ============================================
// TYPES
// ============================================
type TabKey = 'aiRound' | 'demo' | 'induction' | 'training' | 'certification' | 'goLive' | 'readyForPaidClass' | 'paidTraining' | 'paidCertification' | 'paidGoLive';

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
const TABS: { key: TabKey; label: string; icon: React.ElementType; gradient: string; owner?: 'HR' | 'TSM' | 'Trainer' }[] = [
  { key: 'aiRound', label: 'AI Round', icon: Brain, gradient: 'from-purple-500 to-pink-500' },
  { key: 'demo', label: 'Demo', icon: User, gradient: 'from-blue-500 to-indigo-500', owner: 'HR' },
  { key: 'induction', label: 'Induction', icon: Calendar, gradient: 'from-violet-500 to-purple-500', owner: 'HR' },
  { key: 'training', label: 'Demo Training', icon: GraduationCap, gradient: 'from-[#1E62F2] to-[hsl(216,88%,64%)]', owner: 'Trainer' },
  { key: 'certification', label: 'Demo Certification', icon: Award, gradient: 'from-emerald-500 to-teal-500', owner: 'TSM' },
  { key: 'goLive', label: 'Demo Go Live', icon: Rocket, gradient: 'from-teal-500 to-cyan-500', owner: 'TSM' },
  { key: 'readyForPaidClass', label: 'Ready for Paid Class', icon: CheckCircle2, gradient: 'from-blue-500 to-cyan-500', owner: 'Trainer' },
  { key: 'paidTraining', label: 'Paid Training', icon: GraduationCap, gradient: 'from-violet-500 to-purple-500', owner: 'Trainer' },
  { key: 'paidCertification', label: 'Paid Certification', icon: Award, gradient: 'from-emerald-500 to-teal-500', owner: 'TSM' },
  { key: 'paidGoLive', label: 'Paid Go Live', icon: Rocket, gradient: 'from-teal-500 to-cyan-500', owner: 'TSM' },
];

// ============================================
// STATUS BADGE HELPER
// ============================================
const getStatusBadge = (status: string) => {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    'PENDING': { bg: 'bg-[hsl(240,5%,64.9%,0.1)] border-[hsl(240,5%,64.9%)]', text: 'text-[hsl(240,5%,64.9%)]', icon: <Clock className="h-3.5 w-3.5" /> },
    'SCHEDULED': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: <Clock className="h-3.5 w-3.5" /> },
    'SELECTED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    'NOT_SELECTED': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
    'HOLD': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: <Clock className="h-3.5 w-3.5" /> },
    'YES': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    'NO': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
    'JOINED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    'NOT_JOINED': { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: <Clock className="h-3.5 w-3.5" /> },
    'INCOMPLETE': { bg: 'bg-[hsl(38,92%,50%,0.1)] border-[hsl(38,92%,50%)]', text: 'text-[hsl(38,92%,50%)]', icon: <Clock className="h-3.5 w-3.5" /> },
    'SHIFTED_TO_NEXT_WEEK': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: <Calendar className="h-3.5 w-3.5" /> },
    'DROPPED': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
    'CLEARED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <Award className="h-3.5 w-3.5" /> },
    'NOT_CLEARED': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
    'NOT_INTERESTED': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="h-3.5 w-3.5" /> },
    'OFFER_LETTER_SENT': { bg: 'bg-[hsl(38,92%,50%,0.1)] border-[hsl(38,92%,50%)]', text: 'text-[hsl(38,92%,50%)]', icon: <Mail className="h-3.5 w-3.5" /> },
    'OFFER_LETTER_SENT_PORTAL_CREATED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <Globe className="h-3.5 w-3.5" /> },
    'PORTAL_HW_SUBMITTED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <Globe className="h-3.5 w-3.5" /> },
    'JOINING_FORM_SENT': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <FileText className="h-3.5 w-3.5" /> },
    'PORTAL_CREATED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <Globe className="h-3.5 w-3.5" /> },
    'NEEDS_MORE_TRAINING': { bg: 'bg-[hsl(38,92%,50%,0.1)] border-[hsl(38,92%,50%)]', text: 'text-[hsl(38,92%,50%)]', icon: <Clock className="h-3.5 w-3.5" /> },
    'SECOND_MOCK_REQUIRED': { bg: 'bg-[hsl(38,92%,50%,0.1)] border-[hsl(38,92%,50%)]', text: 'text-[hsl(38,92%,50%)]', icon: <Clock className="h-3.5 w-3.5" /> },
    'CALIBRATION_REQUIRED': { bg: 'bg-[hsl(38,92%,50%,0.1)] border-[hsl(38,92%,50%)]', text: 'text-[hsl(38,92%,50%)]', icon: <Clock className="h-3.5 w-3.5" /> },
    'COMPLETED': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  };
  const config = configs[status] || { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: <Clock className="h-3.5 w-3.5" /> };

  if (!status) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}>
      {config.icon}
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const TeacherJourneySection: React.FC<TeacherJourneySectionProps> = ({
  applicationId,
  candidateName,
  candidateEmail,
  candidatePhone,
  aiRoundStatus,
  aiRoundScore,
  aiRoundCompletedAt,
  aiRoundStrengths,
  aiRoundAreasForImprovement,
  aiRoundEvaluation
}) => {
  const { user } = useAuth();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { interviewers } = useInterviewers();
  const { trainers: demoTrainers } = useDemoTrainers();

  const [journey, setJourney] = useState<TeacherJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('aiRound'); // Start with AI Round
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showHoldEmailModal, setShowHoldEmailModal] = useState(false);

  // Edit form state - stores temporary edits before saving
  const [editData, setEditData] = useState<Partial<TeacherJourney>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  // Handler for sending demo result email
  const handleSendDemoEmail = useCallback(async (overrideStatus?: string) => {
    if (!applicationId || !journey) return;

    // Use overrideStatus if provided (for automation), otherwise use current journey status
    const status = overrideStatus || journey.demoStatus;
    const isSelected = status === 'SELECTED';
    const actionText = isSelected ? 'Selection' : 'Rejection';

    const confirmed = await confirm({
      title: `Send ${actionText} Email?`,
      description: `Are you sure you want to send the ${actionText.toLowerCase()} email to ${candidateName}? This will notify the candidate about their demo result.`,
      confirmText: `Send ${actionText} Mail`,
      cancelText: "Cancel",
      variant: isSelected ? 'default' : 'destructive'
    });

    if (!confirmed) return;

    setSendingEmail(true);
    try {
      const response = await teacherJourneyService.sendDemoResultEmail(applicationId);
      if (response.status) {
        toast.success('Demo result email sent successfully!');
        // Refresh journey data to get updated email status
        await fetchJourney();
      } else {
        toast.error(`Failed to send email: ${response.message}`);
      }
    } catch (error) {
      console.error('Error sending demo email:', error);
      toast.error('Failed to send demo result email');
    } finally {
      setSendingEmail(false);
    }
  }, [applicationId, journey, fetchJourney, confirm, candidateName]);

  // Fetch session ID from applicationId
  useEffect(() => {
    const fetchSession = async () => {
      if (!applicationId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/session/by-application/${applicationId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSessionId(data.data.sessionId);
          }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, [applicationId]);

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
    setFieldErrors({});
  };

  // Save changes for current section only
  const handleSave = async () => {
    if (!journey?.id) return;

    // Skip validation for aiRound tab (read-only)
    if (activeTab === 'aiRound') {
      toast.info('AI Round is read-only');
      return;
    }

    // Certification Email Confirmation Guard
    // Check if certificationStatus is changing to a status that triggers automated emails
    if (activeTab === 'certification') {
      const isChangingToGoLive =
        editData.certificationStatus === 'CLEARED' &&
        journey.certificationStatus !== 'CLEARED';

      const isChangingToNotCleared =
        editData.certificationStatus === 'NOT_CLEARED' &&
        journey.certificationStatus !== 'NOT_CLEARED';

      const isChangingToNeedMoreTraining =
        editData.certificationStatus === 'NEED_MORE_TRAINING' &&
        journey.certificationStatus !== 'NEED_MORE_TRAINING';

      const isChangingToOfferLetterSent =
        editData.certificationStatus === 'OFFER_LETTER_SENT_PORTAL_CREATED' &&
        journey.certificationStatus !== 'OFFER_LETTER_SENT_PORTAL_CREATED';

      if (isChangingToGoLive || isChangingToNotCleared || isChangingToNeedMoreTraining || isChangingToOfferLetterSent) {
        const emailType = isChangingToGoLive
          ? 'Go Live'
          : isChangingToNotCleared
            ? 'Not Cleared'
            : isChangingToNeedMoreTraining
              ? 'Need More Training'
              : 'Offer Letter';

        const emailDescription = isChangingToGoLive
          ? 'A congratulations email with offer letter details and portal access information will be sent to the candidate.'
          : isChangingToNotCleared
            ? 'A rejection email notifying the candidate that they did not clear certification will be sent.'
            : isChangingToNeedMoreTraining
              ? 'An email informing the educator about refresher training and re-mock requirements will be sent. Lezniak from HR will be mentioned as the contact person.'
              : 'A welcome email with 5 PDF attachments (Offer Letter, Salary Structure, Terms & Conditions, Leave Policy, POSH) and a mandatory POSH training link will be sent to the educator. The email includes a Google Form link for offer acceptance confirmation.';

        const confirmed = await confirm({
          title: `📧 Confirm ${emailType} Email`,
          description: `You are about to change the certification status to \"${isChangingToGoLive
            ? 'Cleared'
            : isChangingToNotCleared
              ? 'Not Cleared'
              : isChangingToNeedMoreTraining
                ? 'Need More Training'
                : 'Offer Letter Sent / Portal Created'
            }\". ${emailDescription}\n\n⚠️ This email cannot be recalled once sent.\n\nAre you sure you want to proceed?`,
          confirmText: 'Confirm & Send Email',
          cancelText: 'Cancel',
          variant: isChangingToGoLive || isChangingToOfferLetterSent ? 'default' : 'destructive'
        });

        if (!confirmed) {
          setSaving(false);
          return;
        }
      }
    }

    // Training Rejection Email Confirmation Guard
    // Check if trainingStatus is changing to REJECTED_IN_TRAINING
    if (activeTab === 'training') {
      const isChangingToRejectedInTraining =
        editData.trainingStatus === 'REJECTED_IN_TRAINING' &&
        journey.trainingStatus !== 'REJECTED_IN_TRAINING';

      if (isChangingToRejectedInTraining) {
        const confirmed = await confirm({
          title: '📧 Confirm Training Rejection Email',
          description: 'You are about to change the training status to "Rejected in Training". An automated rejection email will be sent to the educator informing them that the Subject Matter Expert was unable to clear them during training.\n\n⚠️ This email cannot be recalled once sent.\n\nAre you sure you want to proceed?',
          confirmText: 'Confirm & Send Email',
          cancelText: 'Cancel',
          variant: 'destructive'
        });

        if (!confirmed) {
          setSaving(false);
          return;
        }
      }
    }

    // Paid Certification Email Confirmation Guard
    if (activeTab === 'paidCertification') {
      const isChangingToPaidGoLive =
        editData.paidCertificationStatus === 'CLEARED' &&
        journey.paidCertificationStatus !== 'CLEARED';

      const isChangingToPaidOfferLetter =
        editData.paidCertificationStatus === 'OFFER_LETTER_SENT_PORTAL_CREATED' &&
        journey.paidCertificationStatus !== 'OFFER_LETTER_SENT_PORTAL_CREATED';

      if (isChangingToPaidGoLive || isChangingToPaidOfferLetter) {
        const confirmed = await confirm({
          title: isChangingToPaidOfferLetter ? '📧 Confirm Offer Letter Email' : '📧 Confirm Paid Go Live Email',
          description: isChangingToPaidOfferLetter
            ? 'You are about to change the Paid Certification status to "Offer Letter Sent / Portal Created". A welcome email with 5 PDF attachments (Offer Letter, Salary Structure, Terms & Conditions, Leave Policy, POSH) and a mandatory POSH training link will be sent to the educator. The email includes a Google Form link for offer acceptance confirmation.\n\n⚠️ This email cannot be recalled once sent.\n\nAre you sure you want to proceed?'
            : 'You are about to change the Paid Certification status to "Cleared". A congratulations email with offer letter details and portal access information will be sent to the candidate.\n\n⚠️ This email cannot be recalled once sent.\n\nAre you sure you want to proceed?',
          confirmText: 'Confirm & Send Email',
          cancelText: 'Cancel',
          variant: 'default'
        });

        if (!confirmed) {
          setSaving(false);
          return;
        }
      }
    }

    setSaving(true);
    setFieldErrors({});

    try {
      // Build update payload based on active tab
      const updatePayload = buildUpdatePayload(activeTab, editData);

      // Check if status is changing to SELECTED, NOT_SELECTED, or HOLD for automation
      const isStatusChangingToResult = activeTab === 'demo' &&
        editData.demoStatus !== journey.demoStatus &&
        (editData.demoStatus === 'SELECTED' || editData.demoStatus === 'NOT_SELECTED' || editData.demoStatus === 'HOLD');

      // Validate the section data
      const validation = await validateTeacherJourneySection(activeTab, updatePayload);

      if (!validation.isValid) {
        // Set field errors for display
        setFieldErrors(validation.errors);

        // Show first error in toast
        const firstError = Object.values(validation.errors)[0];
        toast.error(`Validation failed: ${firstError}`);

        return;
      }

      const response = await teacherJourneyService.updateJourney(journey.id, updatePayload);
      if (response.status) {
        // Check if offer letter email was sent (free or paid certification tab)
        const isOfferLetterSent =
          (activeTab === 'certification' &&
            editData.certificationStatus === 'OFFER_LETTER_SENT_PORTAL_CREATED') ||
          (activeTab === 'paidCertification' &&
            editData.paidCertificationStatus === 'OFFER_LETTER_SENT_PORTAL_CREATED');

        if (isOfferLetterSent) {
          toast.success('✅ Status updated! Offer letter email sent with 5 PDFs (incl. POSH) and POSH training link.');
        } else {
          toast.success(`${TABS.find(t => t.key === activeTab)?.label} updated!`);
        }

        await fetchJourney();
        setEditMode(false);
        setEditData({});
        setFieldErrors({});

        // Automatically trigger email sending logic if status changed to a final result
        if (isStatusChangingToResult) {
          if (editData.demoStatus === 'HOLD') {
            setShowHoldEmailModal(true);
          } else {
            // Pass the new status explicitly to avoid stale state issues
            handleSendDemoEmail(editData.demoStatus);
          }
        }
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
          // Extended Demo Evaluation
          overallTeachingStyle: data.overallTeachingStyle,
          demoConducted: data.demoConducted,
          demoPaidStatus: data.demoPaidStatus,
          subjectsPrograms: data.subjectsPrograms,
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
          demoTrainerIds: data.demoTrainerIds,
        };
      case 'certification':
        return {
          certificationStatus: data.certificationStatus,
          certificationDate: data.certificationDate,
          certificationFeedback: data.certificationFeedback,
          certificationTrainingCount: data.certificationTrainingCount,
          certificationTsmId: data.certificationTsmId,
        };
      case 'goLive':
        return {
          goLiveReadiness: data.goLiveReadiness,
          goLiveDate: data.goLiveDate,
          assignedSubject: data.assignedSubject,
        };
      case 'readyForPaidClass':
        return {
          readyForPaidClass: data.readyForPaidClass,
        };
      case 'paidTraining':
        return {
          paidTrainingStatus: data.paidTrainingStatus,
          paidTrainingStartDate: data.paidTrainingStartDate,
          paidTrainingNotes: data.paidTrainingNotes,
          paidDemoTrainerIds: data.paidDemoTrainerIds,
        };
      case 'paidCertification':
        return {
          paidCertificationStatus: data.paidCertificationStatus,
          paidCertificationDate: data.paidCertificationDate,
          paidCertificationFeedback: data.paidCertificationFeedback,
        };
      case 'paidGoLive':
        return {
          paidGoLiveReadiness: data.paidGoLiveReadiness,
          paidGoLiveDate: data.paidGoLiveDate,
          paidAssignedSubject: data.paidAssignedSubject,
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
      case 'certification': return journey?.certificationStatus === 'CLEARED' || journey?.certificationStatus === 'JOINING_FORM_SENT' || journey?.certificationStatus === 'OFFER_LETTER_SENT_PORTAL_CREATED' || journey?.certificationStatus === 'PORTAL_HW_SUBMITTED';
      case 'goLive': return journey?.goLiveReadiness === 'YES';
      case 'readyForPaidClass': return journey?.readyForPaidClass === 'YES';
      case 'paidTraining': return journey?.paidTrainingStatus === 'JOINED' || journey?.paidTrainingStatus === 'COMPLETED';
      case 'paidCertification': return journey?.paidCertificationStatus === 'CLEARED' || journey?.paidCertificationStatus === 'PORTAL_HW_SUBMITTED';
      case 'paidGoLive': return journey?.paidGoLiveReadiness === 'YES';
      default: return false;
    }
  };

  // ============================================
  // BUSINESS LOGIC: Rejection Status & Validation
  // ============================================
  /**
   * Determines if candidate is rejected based on business rules:
   * - Candidate is rejected if demoStatus is NOT_SELECTED and reject email has been sent
   */
  const isRejected = useMemo(() => {
    if (!journey) return false;
    const currentDemoStatus = editMode ? editData.demoStatus : journey.demoStatus;
    const currentRejectEmailSent = editMode ? editData.rejectEmailSent : journey.rejectEmailSent;

    return (
      currentDemoStatus === 'NOT_SELECTED' &&
      currentRejectEmailSent === 'YES'
    );
  }, [journey, editMode, editData.demoStatus, editData.rejectEmailSent]);


  /**
   * Get filtered tabs based on rejection status
   * - If rejected, only show tabs up to and including Demo
   * - Change Demo label to "Rejected" and icon to XCircle when rejected
   */
  const visibleTabs = useMemo(() => {
    if (isRejected) {
      // Only show: AI Round and Demo (but label Demo as "Rejected" with XCircle icon)
      return TABS.filter(tab =>
        tab.key === 'aiRound' ||
        tab.key === 'demo'
      ).map(tab =>
        tab.key === 'demo'
          ? { ...tab, label: 'Rejected', icon: XCircle, gradient: 'from-red-500 to-red-600' }
          : tab
      );
    }
    return TABS;
  }, [isRejected]);

  // Auto-switch to a valid tab if current activeTab is filtered out
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.find(tab => tab.key === activeTab)) {
      // Current activeTab is not in visibleTabs, switch to demo (last visible tab when rejected)
      setActiveTab('demo');
      setEditMode(false);
      setEditData({});
    }
  }, [visibleTabs, activeTab]);

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
  const currentTab = visibleTabs.find(t => t.key === activeTab) || TABS.find(t => t.key === activeTab)!;

  return (
    <div className="h-full flex flex-col">
      {/* ============================================
          TAB NAVIGATION - Clickable stage indicators
          Tabs are disabled while in edit mode to prevent data loss
          ============================================ */}
      <div className={`px-4 py-4 border-b transition-colors ${editMode ? 'bg-white border-[#1E62F2]' : 'bg-white border-[#F4F6FA]'}`}>
        {/* Edit mode warning banner */}
        {editMode && (
          <div className="flex items-center justify-center gap-2 mb-3 text-[#1E62F2] text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>You are editing <strong>{currentTab.label}</strong>. Save or cancel to switch sections.</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto">
            {visibleTabs.filter(t => ['aiRound', 'demo', 'induction', 'training', 'certification', 'goLive'].includes(t.key)).map((tab, i, arr) => {
              const isActive = activeTab === tab.key;
              const isDone = getTabStatus(tab.key);
              const TabIcon = tab.icon;

              const isPreviousDone = i === 0 || TABS.findIndex(x => x.key === tab.key) === 0 || getTabStatus(visibleTabs[visibleTabs.findIndex(vt => vt.key === tab.key) - 1]?.key);
              const isLocked = !isPreviousDone;
              const isDisabled = editMode && !isActive;

              return (
                <div key={tab.key} className="flex items-center">
                  <button
                    onClick={() => {
                      if (isDisabled) return;
                      setActiveTab(tab.key);
                      setEditMode(false);
                      setEditData({});
                    }}
                    disabled={isDisabled}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${isDisabled
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                      : isActive
                        ? editMode
                          ? 'bg-[#1E62F2]/10 text-[#1E62F2] ring-2 ring-[#1E62F2]/20'
                          : 'bg-teal-50 text-teal-700 ring-2 ring-teal-200'
                        : isLocked
                          ? 'bg-slate-50 text-slate-400 cursor-default opacity-70'
                          : isDone
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDisabled
                        ? 'bg-slate-200 text-slate-400'
                        : isActive
                          ? editMode
                            ? 'bg-[#1E62F2] text-white'
                            : `bg-gradient-to-br ${tab.gradient} text-white`
                          : isLocked
                            ? 'bg-slate-200 text-slate-400'
                            : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                        }`}>
                        {isDisabled ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : isLocked ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : isDone && !isActive ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <TabIcon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{tab.label}</span>
                    </div>
                    {tab.owner && (
                      <span className={`text-[10px] font-normal ${isDisabled
                        ? 'text-slate-400'
                        : isActive
                          ? editMode
                            ? 'text-[#1E62F2]/70'
                            : 'text-teal-600/70'
                          : isDone
                            ? 'text-emerald-600/70'
                            : 'text-slate-500/70'
                        }`}>
                        {tab.owner}
                      </span>
                    )}
                  </button>
                  {i < arr.length - 1 && (
                    <div className={`hidden sm:block w-8 h-0.5 rounded ${editMode ? 'bg-[#1E62F2]/20' : getTabStatus(arr[i + 1].key) || isDone ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto">
            {visibleTabs.filter(t => !['aiRound', 'demo', 'induction', 'training', 'certification', 'goLive'].includes(t.key)).map((tab, i, arr) => {
              const isActive = activeTab === tab.key;
              const isDone = getTabStatus(tab.key);
              const TabIcon = tab.icon;

              const isPreviousDone = getTabStatus(visibleTabs[visibleTabs.findIndex(vt => vt.key === tab.key) - 1]?.key);
              const isLocked = !isPreviousDone;
              const isDisabled = editMode && !isActive;

              return (
                <div key={tab.key} className="flex items-center">
                  <button
                    onClick={() => {
                      if (isDisabled) return;
                      setActiveTab(tab.key);
                      setEditMode(false);
                      setEditData({});
                    }}
                    disabled={isDisabled}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${isDisabled
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                      : isActive
                        ? editMode
                          ? 'bg-[#1E62F2]/10 text-[#1E62F2] ring-2 ring-[#1E62F2]/20'
                          : 'bg-teal-50 text-teal-700 ring-2 ring-teal-200'
                        : isLocked
                          ? 'bg-slate-50 text-slate-400 cursor-default opacity-70'
                          : isDone
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDisabled
                        ? 'bg-slate-200 text-slate-400'
                        : isActive
                          ? editMode
                            ? 'bg-[#1E62F2] text-white'
                            : `bg-gradient-to-br ${tab.gradient} text-white`
                          : isLocked
                            ? 'bg-slate-200 text-slate-400'
                            : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                        }`}>
                        {isDisabled ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : isLocked ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : isDone && !isActive ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <TabIcon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{tab.label}</span>
                    </div>
                    {tab.owner && (
                      <span className={`text-[10px] font-normal ${isDisabled
                        ? 'text-slate-400'
                        : isActive
                          ? editMode
                            ? 'text-[#1E62F2]/70'
                            : 'text-teal-600/70'
                          : isDone
                            ? 'text-emerald-600/70'
                            : 'text-slate-500/70'
                        }`}>
                        {tab.owner}
                      </span>
                    )}
                  </button>
                  {i < arr.length - 1 && (
                    <div className={`hidden sm:block w-8 h-0.5 rounded ${editMode ? 'bg-[#1E62F2]/20' : getTabStatus(arr[i + 1].key) || isDone ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* ============================================
          SECTION CONTENT - Shows active tab's data
          Visual distinction: View mode = white/slate, Edit mode = amber tint
          ============================================ */}
      <div className={`flex-1 p-4 overflow-auto transition-colors ${editMode ? 'bg-white' : 'bg-[#F4F6FA]'
        }`}>
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-xl shadow-sm overflow-hidden transition-all ${editMode
            ? 'bg-white border-2 border-[#1E62F2] ring-4 ring-[#1E62F2]/10'
            : 'bg-white border border-slate-200'
            }`}>
            {/* Section Header - Distinct styling for edit mode */}
            <div className={`px-4 py-3 flex items-center justify-between transition-colors ${editMode
              ? 'bg-white border-b-2 border-[#1E62F2]'
              : 'bg-white border-b border-slate-100'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${editMode
                  ? 'bg-[#1E62F2]'
                  : `bg-gradient-to-br ${currentTab.gradient}`
                  }`}>
                  {editMode ? (
                    <Pencil className="h-4 w-4 text-white" />
                  ) : (
                    <currentTab.icon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold text-base ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%)]'}`}>
                    {editMode ? `Editing ${currentTab.label}` : currentTab.label}
                  </h3>
                  <p className={`text-[10px] ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>
                    {editMode ? 'Make changes and save when done' : `View ${currentTab.label.toLowerCase()} details`}
                  </p>
                </div>
              </div>

              {/* Edit / Save / Cancel Buttons - AI Round is read-only (data from interview) */}
              {activeTab === 'aiRound' ? (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Read Only</span>
              ) : !editMode ? (
                (() => {
                  const currentTabIndex = visibleTabs.findIndex(t => t.key === activeTab);
                  // Demo section is always editable
                  const isLocked = currentTabIndex > 0 && activeTab !== 'demo' && !getTabStatus(visibleTabs[currentTabIndex - 1].key);
                  const prevStageLabel = currentTabIndex > 0 ? visibleTabs[currentTabIndex - 1].label : '';

                  return (
                    <button
                      onClick={handleStartEdit}
                      disabled={!journey || isLocked}
                      className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
                      title={!journey ? "Start journey first" : isLocked ? `Complete ${prevStageLabel} to edit this section` : "Edit this section"}
                    >
                      {isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  );
                })()
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="h-8 border-[#1E62F2] text-[#1E62F2] hover:bg-[#1E62F2]/10 rounded-xl text-xs"
                  >
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-8 bg-[#1E62F2] hover:bg-[hsl(216,88%,50%)] text-white rounded-xl text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" /> {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>

            {/* Section Content - Render based on active tab */}
            <div className={`p-4 transition-colors ${editMode ? 'bg-white' : 'bg-white'}`}>
              {activeTab === 'aiRound' && (
                <AIRoundSection
                  status={aiRoundStatus}
                  score={aiRoundScore}
                  completedAt={aiRoundCompletedAt}
                  strengths={aiRoundStrengths}
                  areasForImprovement={aiRoundAreasForImprovement}
                  evaluation={aiRoundEvaluation}
                  sessionId={sessionId || undefined}
                />
              )}
              {activeTab === 'demo' && journey && (
                <DemoSection
                  journey={journey}
                  editMode={editMode}
                  editData={editData}
                  setEditData={setEditData}
                  fieldErrors={fieldErrors}
                  onSendDemoEmail={handleSendDemoEmail}
                  sendingEmail={sendingEmail}
                  onSendHoldEmail={() => setShowHoldEmailModal(true)}
                />
              )}
              {activeTab === 'induction' && journey && !isRejected && (
                <InductionSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} />
              )}
              {activeTab === 'training' && journey && !isRejected && (
                <TrainingSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} demoTrainers={demoTrainers} />
              )}
              {activeTab === 'certification' && journey && !isRejected && (
                <CertificationSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} interviewers={interviewers} candidateName={candidateName} />
              )}
              {activeTab === 'goLive' && journey && !isRejected && (
                <GoLiveSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} />
              )}
              {activeTab === 'readyForPaidClass' && journey && !isRejected && (
                <ReadyForPaidClassSection journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} />
              )}
              {activeTab === 'paidTraining' && journey && !isRejected && (
                <PaidTrainingSectionImpl journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} demoTrainers={demoTrainers} />
              )}
              {activeTab === 'paidCertification' && journey && !isRejected && (
                <PaidCertificationSectionImpl journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} />
              )}
              {activeTab === 'paidGoLive' && journey && !isRejected && (
                <PaidGoLiveSectionImpl journey={journey} editMode={editMode} editData={editData} setEditData={setEditData} fieldErrors={fieldErrors} />
              )}
            </div>

            {/* Edit mode footer hint */}
            {editMode && (
              <div className="px-5 py-3 bg-[#1E62F2]/10 border-t border-[#1E62F2] text-center">
                <p className="text-xs text-[#1E62F2]">
                  💡 Changes are only saved when you click <strong>Save Changes</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog />

      {/* Hold Email Preview Modal */}
      <Dialog open={showHoldEmailModal} onOpenChange={setShowHoldEmailModal}>
        <DialogContent className="max-w-md bg-white rounded-lg p-6 shadow-xl border border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 text-lg font-semibold border-b pb-2">
              <Mail className="h-5 w-5 animate-pulse" />
              Send Hold Email?
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-2">
              Please review the email content below which will be sent to the candidate:
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-[13px] space-y-3 text-slate-700 leading-relaxed font-sans shadow-inner">
            <div className="font-semibold text-slate-900 border-b pb-2 mb-2 flex justify-between items-center">
              <span>Subject: Application Status Update - Bambinos.live</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Preview</span>
            </div>
            <p>Dear Candidate,</p>
            <p>Thank you for applying for the Online Teacher's role at Bambinos.live. Your application is currently on hold as we review the next steps in our selection process.</p>
            <p>We will get back to you with an update soon. We appreciate your patience and interest in joining our team.</p>
            <p className="pt-2">Best regards,<br/><strong>Team HR Bambinos.live</strong></p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowHoldEmailModal(false)}
              disabled={sendingEmail}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setSendingEmail(true);
                try {
                  const response = await teacherJourneyService.sendDemoResultEmail(applicationId);
                  if (response.status) {
                    toast.success('Hold email sent successfully!');
                    setShowHoldEmailModal(false);
                    await fetchJourney();
                  } else {
                    toast.error(`Failed to send email: ${response.message}`);
                  }
                } catch (error) {
                  console.error('Error sending hold email:', error);
                  toast.error('Failed to send hold email');
                } finally {
                  setSendingEmail(false);
                }
              }}
              disabled={sendingEmail}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {sendingEmail ? (
                <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />Sending...</>
              ) : (
                'Send Email'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  fieldErrors?: Record<string, string>;
  demoTrainers?: { id: number; name: string }[];
  interviewers?: { id: number; name: string }[];
  candidateName?: string;
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
  sessionId?: string;
}

// Helper function to parse markdown-style text
const parseMarkdownText = (text: string): React.ReactNode => {
  // Remove markdown headers like "#### Key Strengths"
  if (text.startsWith('#')) return null;

  // Remove leading "- " if present
  const cleanText = text.replace(/^-\s*/, '');

  // Parse **bold** text
  const parts = cleanText.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Report Card Item Component
interface ReportCardItem {
  topic: string;
  score: number;
  score_str: string;
  note: string;
  weight: number;
  requires_video?: boolean;
}

const ReportCardSkillBar: React.FC<{ item: ReportCardItem; index: number }> = ({ item, index }) => {
  const score = item.score;
  const getScoreColor = () => {
    if (score >= 9) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 7) return { bar: 'bg-teal-500', text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' };
    if (score >= 5) return { bar: 'bg-[hsl(38,92%,50%)]', text: 'text-[hsl(38,92%,50%)]', bg: 'bg-[hsl(38,92%,50%,0.1)]', border: 'border-[hsl(38,92%,50%)]' };
    return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const colors = getScoreColor();

  return (
    <div
      className={`p-4 rounded-xl border ${colors.border} ${colors.bg} transition-all duration-300 hover:shadow-md hover:scale-[1.01]`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-4">
          <h5 className="font-semibold text-slate-800 text-sm leading-tight">{item.topic}</h5>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Weight: {item.weight}%</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${colors.bg} border ${colors.border}`}>
          <span className={`text-lg font-bold ${colors.text}`}>{item.score_str?.split('/')[0] || score}</span>
          <span className="text-slate-400 text-sm font-medium">/10</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out`}
          style={{ width: `${score * 10}%` }}
        />
      </div>

      {/* Note - Collapsible */}
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
        {item.note}
      </p>
    </div>
  );
};

// Interview Recording Component
const InterviewRecording: React.FC<{ sessionId?: string }> = ({ sessionId }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [transcriptUrl, setTranscriptUrl] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (sec?: number | null) => {
    if (typeof sec !== 'number' || !isFinite(sec)) return null;
    const total = Math.max(0, Math.round(sec));
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      if (!sessionId) {
        setUrl(null);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        const media = await getEvaluationMedia(sessionId);
        if (!cancelled) {
          setUrl(media?.recordingUrl ?? null);
          setTranscriptUrl(media?.transcriptUrl ?? null);
          if (typeof media?.duration === 'number') setDurationSec(media.duration);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setUrl(null);
          setTranscriptUrl(null);
          setError('Unable to load recording');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    go();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-semibold text-gray-900">Interview Recording</div>
          {typeof durationSec === 'number' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {formatDuration(durationSec)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-gray-700 hover:bg-gray-50">
              <Eye className="w-3.5 h-3.5 mr-1" /> Open
            </a>
          )}
          {url && (
            <a href={url} download className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-gray-700 hover:bg-gray-50">
              <Download className="w-3.5 h-3.5 mr-1" /> Download
            </a>
          )}
          {transcriptUrl && (
            <a href={transcriptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-gray-700 hover:bg-gray-50">
              <FileText className="w-3.5 h-3.5 mr-1" /> Transcript
            </a>
          )}
        </div>
      </div>

      <div className="p-3">
        {loading && (
          <div className="h-48 flex items-center justify-center text-sm text-gray-500">Loading recording…</div>
        )}
        {!loading && error && (
          <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
        )}
        {!loading && !error && !url && (
          <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg px-3 py-8 text-center">No interview recording available</div>
        )}
        {!loading && url && (
          <div className="relative w-full rounded-lg overflow-hidden bg-black">
            <div className="relative w-full pb-[56.25%]">
              <video
                controls
                src={url}
                className="absolute inset-0 w-full h-full"
                preload="metadata"
                onLoadedMetadata={(e) => {
                  if (!durationSec && e.currentTarget?.duration && isFinite(e.currentTarget.duration)) {
                    setDurationSec(Math.round(e.currentTarget.duration));
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AIRoundSection: React.FC<AIRoundSectionProps> = ({
  status,
  score,
  strengths,
  areasForImprovement,
  evaluation,
  sessionId
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
      return { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600', icon: <Clock className="h-4 w-4" />, glow: '' };
    }
    if (status === 'in_progress') {
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <Clock className="h-4 w-4" />, glow: 'shadow-blue-100' };
    }
    if (isPassed) {
      return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-4 w-4" />, glow: 'shadow-emerald-100' };
    }
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <XCircle className="h-4 w-4" />, glow: 'shadow-red-100' };
  };

  const statusStyle = getStatusStyle();

  // Filter out header lines from strengths and areas
  const filteredStrengths = strengths?.filter(s => !s.startsWith('#') && s.trim().length > 0) || [];
  const filteredAreas = areasForImprovement?.filter(s => !s.startsWith('#') && s.trim().length > 0) || [];

  // Extract report card from evaluation
  const reportCard = (evaluation?.report_card as ReportCardItem[]) || [];

  // Check if we have any feedback data to display
  const hasFeedback = filteredStrengths.length > 0 ||
    filteredAreas.length > 0 ||
    reportCard.length > 0;

  return (
    <div className="space-y-6">
      {/* ============================================
          TOP SECTION - Hero Score Card and Interview Recording (Side by Side)
          ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Score Card - Takes 2 columns on large screens */}
        <div className={`lg:col-span-2 relative overflow-hidden rounded-2xl p-6 shadow-xl ${isPassed
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-red-900 via-red-800 to-red-900'
          }`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            {isPassed ? (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
              </>
            ) : (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400 to-red-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-500 to-red-700 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
              </>
            )}
          </div>

          <div className="relative z-10">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${statusStyle.bg} ${statusStyle.border} border ${statusStyle.glow} shadow-lg`}>
                  {statusStyle.icon}
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Interview Status</p>
                  <p className={`font-bold text-lg ${statusStyle.text}`}>{statusLabel}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full border-2 ${statusStyle.border} ${statusStyle.bg} shadow-lg ${statusStyle.glow}`}>
                <span className={`font-bold text-sm ${statusStyle.text}`}>
                  {isPassed ? '✓ Qualified' : status === 'in_progress' ? '◷ In Progress' : status === 'no_interview' ? '○ Pending' : '✗ Not Qualified'}
                </span>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex items-end gap-4">
              <div className="flex items-baseline">
                <span className={`text-7xl font-black tracking-tight ${score === null || score === undefined
                  ? 'text-slate-600'
                  : isPassed
                    ? 'text-emerald-400'
                    : 'text-red-400'
                  }`}>
                  {score !== null && score !== undefined ? score.toFixed(1) : '—'}
                </span>
                <span className="text-3xl text-slate-500 font-light ml-1">/10</span>
              </div>

              {score !== null && score !== undefined && (
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl font-bold ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(score * 10).toFixed(0)}%
                    </span>
                    <span className="text-slate-400 text-sm">Overall Performance</span>
                  </div>
                  <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${isPassed
                        ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400'
                        : 'bg-gradient-to-r from-[hsl(0,84%,60%)] via-[hsl(0,84%,55%)] to-[hsl(38,92%,50%)]'
                        }`}
                      style={{ width: `${Math.min(score * 10, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interview Recording - Takes 1 column on large screens, positioned top right */}
        {sessionId && (
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Interview Recording</h3>
                <p className="text-slate-500 text-xs">Watch the complete AI interview recording</p>
              </div>
            </div>

            <InterviewRecording sessionId={sessionId} />
          </div>
        )}
      </div>

      {/* ============================================
          FEEDBACK CARDS - Strengths & Areas for Improvement
          ============================================ */}
      {hasFeedback && (
        <div className="space-y-5">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-200">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Performance Analysis</h3>
              <p className="text-slate-500 text-xs">Detailed feedback from AI interview evaluation</p>
            </div>
          </div>

          {/* Strengths & Improvements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Strengths Card */}
            {filteredStrengths.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-lg shadow-emerald-100/50">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-emerald-500 shadow-md shadow-emerald-200">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-bold text-emerald-800">Key Strengths</h4>
                    <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {filteredStrengths.length} points
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {filteredStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm">
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                          {parseMarkdownText(strength)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Areas for Improvement Card */}
            {filteredAreas.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#1E62F2]/20 bg-gradient-to-br from-white via-white to-[#1E62F2]/5 p-5 shadow-lg shadow-[#1E62F2]/10">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1E62F2]/20 to-transparent rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-[#1E62F2] shadow-md shadow-[#1E62F2]/20">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-bold text-[#1E62F2]">Areas for Improvement</h4>
                    <span className="ml-auto text-xs font-semibold text-[#1E62F2] bg-[#1E62F2]/10 px-2 py-0.5 rounded-full">
                      {filteredAreas.length} points
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {filteredAreas.map((area, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1E62F2] text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm">
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                          {parseMarkdownText(area)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ============================================
              REPORT CARD - Skill Breakdown
              ============================================ */}
          {reportCard.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg">
                  <Star className="h-5 w-5 text-[#FFCC00]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Skills Report Card</h3>
                  <p className="text-slate-500 text-xs">Detailed breakdown by evaluation criteria</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportCard.map((item, index) => (
                  <ReportCardSkillBar key={item.topic} item={item} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info note */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
        <div className="p-2 rounded-lg bg-purple-100">
          <Brain className="h-4 w-4 text-purple-600" />
        </div>
        <p className="text-sm text-purple-700">
          AI Interview results are automatically populated from the interview system and cannot be edited here.
        </p>
      </div>
    </div>
  );
};

// ============================================
// MULTI-SELECT COMPONENTS
// ============================================

// Languages Multi-Select Component with Search
interface LanguagesMultiSelectProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

const LanguagesMultiSelect: React.FC<LanguagesMultiSelectProps> = ({ selectedLanguages, onLanguagesChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const allLanguages = getSortedIndianLanguages();
  const filteredLanguages = allLanguages.filter(lang =>
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleLanguage = (language: string) => {
    const updated = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    onLanguagesChange(updated);
  };

  const handleRemoveLanguage = (language: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onLanguagesChange(selectedLanguages.filter(l => l !== language));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full mt-1 justify-between bg-white border-[#1E62F2] hover:bg-[#F4F6FA] rounded-xl min-h-[40px] h-auto py-2"
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {selectedLanguages.length > 0 ? (
              selectedLanguages.slice(0, 2).map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1E62F2]/10 text-[#1E62F2] rounded-lg text-xs"
                >
                  {lang}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-[#1E62F2]"
                    onClick={(e) => handleRemoveLanguage(lang, e)}
                  />
                </span>
              ))
            ) : (
              <span className="text-sm text-[hsl(214,100%,15%,0.6)]">Select languages</span>
            )}
            {selectedLanguages.length > 2 && (
              <span className="px-2 py-0.5 bg-[#1E62F2]/10 text-[#1E62F2] rounded-lg text-xs">
                +{selectedLanguages.length - 2} more
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 rounded-xl" align="start">
        <div className="p-3 border-b border-[#F4F6FA]">
          <h4 className="font-semibold text-sm text-[hsl(214,100%,15%)] mb-2">Select Languages</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(214,100%,15%,0.4)]" />
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-[#F4F6FA] rounded-xl"
            />
          </div>
          {selectedLanguages.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedLanguages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1E62F2]/10 text-[#1E62F2] rounded-lg text-xs"
                >
                  {lang}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-[#1E62F2]"
                    onClick={() => handleToggleLanguage(lang)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          <div className="space-y-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => {
                const isSelected = selectedLanguages.includes(language);
                return (
                  <div
                    key={language}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#F4F6FA] cursor-pointer transition-colors"
                    onClick={() => handleToggleLanguage(language)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleLanguage(language)}
                      className="rounded"
                    />
                    <label className="text-sm text-[hsl(214,100%,15%)] cursor-pointer flex-1">
                      {language}
                    </label>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-[hsl(214,100%,15%,0.6)]">
                No languages found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
        {selectedLanguages.length > 0 && (
          <div className="p-3 border-t border-[#F4F6FA]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-[hsl(0,84%,60%)] hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%,0.1)]"
              onClick={() => {
                onLanguagesChange([]);
                setSearchQuery('');
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// Subjects Multi-Select Component
interface SubjectsMultiSelectProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
}

const SUBJECT_OPTIONS = [
  'Unbox English',
  'Little Yogi',
  'Alpha Maths',
  'Phonics',
  'Science',
  'Kannada'
] as const;

const SubjectsMultiSelect: React.FC<SubjectsMultiSelectProps> = ({ selectedSubjects, onSubjectsChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSubject = (subject: string) => {
    const updated = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    onSubjectsChange(updated);
  };

  const handleRemoveSubject = (subject: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSubjectsChange(selectedSubjects.filter(s => s !== subject));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full mt-1 justify-between bg-white border-[#1E62F2] hover:bg-[#F4F6FA] rounded-xl min-h-[40px] h-auto py-2"
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {selectedSubjects.length > 0 ? (
              selectedSubjects.map((subj) => (
                <span
                  key={subj}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[hsl(217,91%,60%,0.1)] text-[hsl(217,91%,60%)] rounded-lg text-xs"
                >
                  {subj}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-[hsl(217,91%,60%)]"
                    onClick={(e) => handleRemoveSubject(subj, e)}
                  />
                </span>
              ))
            ) : (
              <span className="text-sm text-[hsl(214,100%,15%,0.6)]">Select subjects</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xl" align="start">
        <div className="p-3 border-b border-[#F4F6FA]">
          <h4 className="font-semibold text-sm text-[hsl(214,100%,15%)]">Select Subjects</h4>
          <p className="text-xs text-[hsl(214,100%,15%,0.6)] mt-1">
            Choose all subjects/programs
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          <div className="space-y-1">
            {SUBJECT_OPTIONS.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              return (
                <div
                  key={subject}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#F4F6FA] cursor-pointer transition-colors"
                  onClick={() => handleToggleSubject(subject)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleSubject(subject)}
                    className="rounded"
                  />
                  <label className="text-sm text-[hsl(214,100%,15%)] cursor-pointer flex-1">
                    {subject}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        {selectedSubjects.length > 0 && (
          <div className="p-3 border-t border-[#F4F6FA]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-[hsl(0,84%,60%)] hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%,0.1)]"
              onClick={() => onSubjectsChange([])}
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
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
  <div className={`p-3 rounded-lg transition-colors ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-[#F4F6FA]'
    } ${className}`}>
    {children}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode; editMode?: boolean }> = ({ children, editMode = false }) => (
  <Label className={`text-xs block mb-1 ${editMode ? 'text-[#1E62F2] font-medium' : 'text-[hsl(214,100%,15%,0.6)]'
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

const FieldError: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mt-1 text-xs text-[hsl(0,84%,60%)] flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      <span>{error}</span>
    </div>
  );
};

const YesNoBadge: React.FC<{ value?: string | null }> = ({ value }) => {
  if (!value) return <span className="text-slate-400 text-sm">—</span>;
  const isYes = value === 'YES';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isYes ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}>
      {isYes ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {value}
    </span>
  );
};

// Reject Email Badge - Inverted colors (YES = red, NO = gray)
const RejectEmailBadge: React.FC<{ value?: string | null }> = ({ value }) => {
  if (!value) return <span className="text-slate-400 text-sm">—</span>;
  const isYes = value === 'YES';
  // For reject email: YES = rejected (red), NO = not rejected (gray)
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isYes ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
      }`}>
      {isYes ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
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
  <div className={`flex items-center gap-2 pb-3 mb-4 border-b ${editMode ? 'border-[#1E62F2]' : 'border-[#F4F6FA]'
    }`}>
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${editMode ? 'bg-[#1E62F2]/10 text-[#1E62F2]' : 'bg-[#1E62F2]/10 text-[#1E62F2]'
      }`}>
      {icon}
    </div>
    <div>
      <h4 className={`text-sm font-semibold ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%)]'}`}>
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

interface DemoSectionProps extends SectionProps {
  onSendDemoEmail?: () => void;
  sendingEmail?: boolean;
  onSendHoldEmail?: () => void;
}

const DemoSection: React.FC<DemoSectionProps> = ({
  journey,
  editMode,
  editData,
  setEditData,
  fieldErrors = {},
  onSendDemoEmail,
  sendingEmail = false,
  onSendHoldEmail
}) => {
  const { user } = useAuth();
  const { interviewers } = useInterviewers();
  const data = editMode ? editData : journey;

  // Check if user is hire@bambinos.live
  const isHireEmail = user?.email === 'hire@bambinos.live';

  return (
    <div className="space-y-2.5">
      {/* Status Row */}
      <div className={`flex items-center justify-between p-2 rounded-lg mb-2 ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-[#F4F6FA]'
        }`}>
        <span className={`text-sm font-medium ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>
          Demo Status
        </span>
        {editMode ? (
          <div className="flex flex-col items-end">
            <Select value={data.demoStatus || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, demoStatus: v as DemoStatus }))}>
              <SelectTrigger className={`w-48 h-8 bg-white ${fieldErrors.demoStatus ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="SELECTED">Selected</SelectItem>
                <SelectItem value="NOT_SELECTED">Not Selected</SelectItem>
                <SelectItem value="HOLD">Hold</SelectItem>
                <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.demoStatus} />
          </div>
        ) : getStatusBadge(journey.demoStatus)}
      </div>

      {/* Consolidated Demo Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        <FieldContainer editMode={editMode} className="p-2">
          <FieldLabel editMode={editMode}>Created Date</FieldLabel>
          <FieldValue value={journey.createdAt ? new Date(journey.createdAt).toLocaleString() : null} />
        </FieldContainer>

        <FieldContainer editMode={editMode} className="p-2">
          <FieldLabel editMode={editMode}>Demo Date</FieldLabel>
          {editMode ? (
            <>
              <Input type="date" value={data.demoDate?.split('T')[0] || ''}
                className={`mt-1 h-7 text-xs bg-white ${fieldErrors.demoDate ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'}`}
                onChange={(e) => setEditData(prev => ({ ...prev, demoDate: e.target.value }))} />
              <FieldError error={fieldErrors.demoDate} />
            </>
          ) : (
            <FieldValue value={journey.demoDate ? new Date(journey.demoDate).toLocaleDateString() : null} />
          )}
        </FieldContainer>

        <FieldContainer editMode={editMode} className="p-2">
          <FieldLabel editMode={editMode}>Interviewer Name</FieldLabel>
          {editMode ? (
            <>
              <Select value={data.demoInterviewerName || ''}
                onValueChange={(v) => setEditData(prev => ({ ...prev, demoInterviewerName: v }))}>
                <SelectTrigger className={`mt-1 h-7 text-xs bg-white ${fieldErrors.demoInterviewerName ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'}`}>
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {interviewers.map((interviewer) => (
                    <SelectItem key={interviewer.id} value={interviewer.name}>
                      {interviewer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={fieldErrors.demoInterviewerName} />
            </>
          ) : (
            <FieldValue value={journey.demoInterviewerName} />
          )}
        </FieldContainer>

        <FieldContainer editMode={editMode} className="p-2">
          <FieldLabel editMode={editMode}>Overall Teaching Style</FieldLabel>
          {editMode ? (
            <>
              <Select value={data.overallTeachingStyle || ''}
                onValueChange={(v) => setEditData(prev => ({ ...prev, overallTeachingStyle: v as TeachingStyleRating }))}>
                <SelectTrigger className={`mt-1 h-7 text-xs bg-white ${fieldErrors.overallTeachingStyle ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'}`}>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BAD">Bad</SelectItem>
                  <SelectItem value="AVERAGE">Average</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={fieldErrors.overallTeachingStyle} />
            </>
          ) : (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${journey.overallTeachingStyle === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-700' :
              journey.overallTeachingStyle === 'GOOD' ? 'bg-blue-100 text-blue-700' :
                journey.overallTeachingStyle === 'AVERAGE' ? 'bg-[hsl(38,92%,50%,0.1)] text-[hsl(38,92%,50%)]' :
                  journey.overallTeachingStyle === 'BAD' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-500'
              }`}>
              {journey.overallTeachingStyle || '—'}
            </span>
          )}
        </FieldContainer>

        <FieldContainer editMode={editMode} className="p-2">
          <FieldLabel editMode={editMode}>Subjects / Programs</FieldLabel>
          {editMode ? (
            <>
              <SubjectsMultiSelect
                selectedSubjects={data.subjectsPrograms || []}
                onSubjectsChange={(subjects) => {
                  setEditData((prev) => ({
                    ...prev,
                    subjectsPrograms: subjects,
                  }));
                }}
              />
              <FieldError error={fieldErrors.subjectsPrograms} />
            </>
          ) : (
            <div className="flex flex-wrap gap-1 mt-1">
              {journey.subjectsPrograms?.length ? journey.subjectsPrograms.map((subj, i) => (
                <span key={i} className="px-2 py-0.5 bg-[hsl(217,91%,60%,0.1)] text-[hsl(217,91%,60%)] rounded-xl text-[10px]">{subj}</span>
              )) : <span className="text-[hsl(214,100%,15%,0.4)] text-xs">—</span>}
            </div>
          )}
        </FieldContainer>

        <FieldContainer editMode={editMode} className="p-2">
          <FieldLabel editMode={editMode}>Email Status</FieldLabel>
          {(() => {
            const emailSent = journey.demoEmailSent;
            const emailSentAt = journey.demoEmailSentAt;
            const emailType = journey.demoEmailType;
            const emailSentCount = journey.demoEmailSentCount || 0;
            const emailSentBy = journey.demoEmailSentBy;

            if (!emailSent || emailSent === 'NO' || emailSentCount === 0) {
              return (
                <div className="mt-1">
                  <Badge variant="outline" className="h-5 text-[10px] bg-gray-100 text-gray-600 border-gray-300">
                    Not Sent
                  </Badge>
                </div>
              );
            }

            const isSelected = emailType === 'SELECTED';
            const isHold = emailType === 'HOLD';
            const formattedDateTime = emailSentAt
              ? new Date(emailSentAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
              : 'N/A';

            return (
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className={`h-5 text-[10px] ${
                    isHold 
                      ? 'bg-amber-100 text-amber-700 border-amber-300' 
                      : isSelected 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : 'bg-red-100 text-red-700 border-red-300'
                  }`}
                >
                  {isHold ? 'Hold' : isSelected ? 'Selected' : 'Not Selected'}
                </Badge>
                {emailSentCount > 1 && (
                  <Badge variant="outline" className="h-5 text-[10px] bg-blue-100 text-blue-700 border-blue-300">
                    {emailSentCount}x
                  </Badge>
                )}
                <div className="text-[9px] text-gray-500 flex items-center gap-1 ml-0.5">
                  <span className="flex items-center gap-0.5"><Clock className="h-2 w-2" />{formattedDateTime.split(',')[0]}</span>
                  {emailSentBy && <span className="flex items-center gap-0.5"><Mail className="h-2 w-2" />{emailSentBy.split('@')[0]}</span>}
                </div>
              </div>
            );
          })()}
        </FieldContainer>
      </div>

      {/* Action Row for Email */}
      {!isHireEmail && ((!editMode && (journey.demoStatus === 'SELECTED' || journey.demoStatus === 'NOT_SELECTED' || journey.demoStatus === 'HOLD')) ||
        (editMode && (data.demoStatus === 'SELECTED' || data.demoStatus === 'NOT_SELECTED' || data.demoStatus === 'HOLD'))) && onSendDemoEmail && (
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                if ((!editMode && journey.demoStatus === 'HOLD') || (editMode && data.demoStatus === 'HOLD')) {
                  onSendHoldEmail?.();
                } else {
                  onSendDemoEmail?.();
                }
              }}
              disabled={sendingEmail || editMode}
              className={`text-white shadow-sm h-7 px-3 text-[10px] ${((!editMode && journey.demoStatus === 'SELECTED') || (editMode && data.demoStatus === 'SELECTED'))
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : ((!editMode && journey.demoStatus === 'HOLD') || (editMode && data.demoStatus === 'HOLD'))
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-slate-600 hover:bg-slate-700'
                }`}
            >
              {sendingEmail ? (
                <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />Sending...</>
              ) : (
                <><Mail className="h-3 w-3 mr-1.5" />Send Mail</>
              )}
            </Button>
            {editMode && (
              <p className="text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                💡 Save changes first to enable sending email
              </p>
            )}
          </div>
        )}

      {/* Feedback Textarea */}
      <FieldContainer editMode={editMode} className="mt-2 p-2">
        <FieldLabel editMode={editMode}>Demo Feedback</FieldLabel>
        {editMode ? (
          <>
            <Textarea
              value={data.demoFeedback || ''}
              placeholder="Enter detailed feedback about the demo..."
              rows={2}
              className={`mt-1 text-xs bg-white ${fieldErrors.demoFeedback ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'}`}
              onChange={(e) => setEditData(prev => ({ ...prev, demoFeedback: e.target.value }))}
            />
            <FieldError error={fieldErrors.demoFeedback} />
          </>
        ) : (
          <p className="text-xs text-slate-700 mt-0.5 whitespace-pre-wrap leading-tight">
            {journey.demoFeedback || <span className="text-slate-400 italic">No feedback provided</span>}
          </p>
        )}
      </FieldContainer>
    </div>
  );
};

// INDUCTION SECTION
const InductionSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {} }) => {
  const data = editMode ? editData : journey;

  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>Attendance</span>
        {editMode ? (
          <div className="flex flex-col items-end">
            <Select value={data.inductionAttendance || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, inductionAttendance: v as InductionStatus }))}>
              <SelectTrigger className={`w-48 bg-white ${fieldErrors.inductionAttendance ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDUCTION_OPTIONS.filter(o => o.value !== 'all').map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.inductionAttendance} />
          </div>
        ) : getStatusBadge(journey.inductionAttendance)}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Induction Date</Label>
        {editMode ? (
          <>
            <Input type="date" value={data.inductionDate?.split('T')[0] || ''}
              className={`mt-1 bg-white ${fieldErrors.inductionDate ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}
              onChange={(e) => setEditData(prev => ({ ...prev, inductionDate: e.target.value }))} />
            <FieldError error={fieldErrors.inductionDate} />
          </>
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.inductionDate ? new Date(journey.inductionDate).toLocaleDateString() : '—'}</p>
        )}
      </div>
    </div>
  );
};

// TRAINING SECTION
const TrainingSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {}, demoTrainers = [] }) => {
  const data = editMode ? editData : journey;

  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>Status</span>
        {editMode ? (
          <div className="flex flex-col items-end">
            <Select value={data.trainingStatus || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, trainingStatus: v as TrainingStatus }))}>
              <SelectTrigger className={`w-48 bg-white ${fieldErrors.trainingStatus ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRAINING_STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.trainingStatus} />
          </div>
        ) : getStatusBadge(journey.trainingStatus)}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Start Date</Label>
        {editMode ? (
          <>
            <Input type="date" value={data.trainingStartDate?.split('T')[0] || ''}
              className={`mt-1 bg-white ${fieldErrors.trainingStartDate ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}
              onChange={(e) => setEditData(prev => ({ ...prev, trainingStartDate: e.target.value }))} />
            <FieldError error={fieldErrors.trainingStartDate} />
          </>
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.trainingStartDate ? new Date(journey.trainingStartDate).toLocaleDateString() : '—'}</p>
        )}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Notes</Label>
        {editMode ? (
          <Textarea value={data.trainingNotes || ''} rows={3} placeholder="Add training notes..."
            className="mt-1 bg-white border-[#1E62F2] focus:ring-[#1E62F2]"
            onChange={(e) => setEditData(prev => ({ ...prev, trainingNotes: e.target.value }))} />
        ) : (
          <p className="text-sm text-slate-700 mt-1">{journey.trainingNotes || <span className="text-slate-400 italic">No notes</span>}</p>
        )}
      </div>

      {/* Demo Trainers Multi-Select - Required Field */}
      <div className={`p-3 rounded-lg ${editMode ? 'bg-blue-50 border border-blue-300' : 'bg-blue-50 border border-blue-200'}`}>
        <Label className={`text-xs ${editMode ? 'text-blue-700 font-medium' : 'text-blue-600'}`}>
          Demo Trainers {editMode && <span className="text-red-500">*</span>}
        </Label>
        {editMode ? (
          <>
            <div className="mt-2 space-y-2">
              {/* Multi-select checkboxes */}
              <div className="max-h-40 overflow-y-auto space-y-1.5 bg-white p-2 rounded border border-blue-300">
                {demoTrainers.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-2">No trainers available</p>
                ) : (
                  demoTrainers.map((trainer) => {
                    const isSelected = (editData.demoTrainerIds || []).includes(trainer.id);
                    return (
                      <label
                        key={trainer.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-purple-50 border border-purple-300' : 'hover:bg-slate-50 border border-transparent'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const currentIds = editData.demoTrainerIds || [];
                            const newIds = e.target.checked
                              ? [...currentIds, trainer.id]
                              : currentIds.filter(id => id !== trainer.id);
                            setEditData(prev => ({ ...prev, demoTrainerIds: newIds }));
                          }}
                          className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                        />
                        <span className={`text-sm ${isSelected ? 'text-purple-700 font-medium' : 'text-slate-700'}`}>
                          {trainer.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-purple-600" />
                        )}
                      </label>
                    );
                  })
                )}
              </div>

              {/* Selected trainers preview */}
              {(editData.demoTrainerIds || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editData.demoTrainerIds!.map(trainerId => {
                    const trainer = demoTrainers.find(t => t.id === trainerId);
                    if (!trainer) return null;
                    return (
                      <Badge key={trainerId} variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                        {trainer.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            <FieldError error={fieldErrors.demoTrainerIds} />
          </>
        ) : (
          <div className="mt-1">
            {journey.demoTrainerIds && journey.demoTrainerIds.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {journey.demoTrainerIds.map(trainerId => {
                  const trainer = demoTrainers.find(t => t.id === trainerId);
                  if (!trainer) return null;
                  return (
                    <Badge key={trainerId} variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      {trainer.name}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No trainers selected</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// CERTIFICATION SECTION
const CertificationSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {}, interviewers = [], candidateName }) => {
  const data = editMode ? editData : journey;
  const [scorecardOpen, setScorecardOpen] = useState(false);
  const [latestScorecard, setLatestScorecard] = useState<MockAssessment | null>(null);

  // Load the latest submitted scorecard so we can show a badge / change the button label
  const loadScorecard = useCallback(() => {
    if (!journey.applicationId) return;
    teacherJourneyService.getMockAssessments(journey.applicationId).then(res => {
      setLatestScorecard(res.status && res.data && res.data.length > 0 ? res.data[0] : null);
    });
  }, [journey.applicationId]);

  useEffect(() => { loadScorecard(); }, [loadScorecard]);

  const scorecardResult = latestScorecard?.overallResult;
  const scorecardBadgeClass = scorecardResult === 'SELECTED'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : scorecardResult === 'REJECTED'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';
  const scorecardBadgeLabel = scorecardResult === 'SELECTED'
    ? 'Scored · Selected'
    : scorecardResult === 'REJECTED'
      ? 'Scored · Rejected'
      : 'Scored';

  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>Status</span>
        {editMode ? (
          <div className="flex flex-col items-end">
            <Select value={data.certificationStatus || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, certificationStatus: v as CertificationStatus }))}>
              <SelectTrigger className={`w-48 bg-white ${fieldErrors.certificationStatus ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEMO_CERTIFICATION_STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.certificationStatus} />
          </div>
        ) : getStatusBadge(journey.certificationStatus)}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Certification Date</Label>
        {editMode ? (
          <>
            <Input type="date" value={data.certificationDate?.split('T')[0] || ''}
              className={`mt-1 bg-white ${fieldErrors.certificationDate ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}
              onChange={(e) => setEditData(prev => ({ ...prev, certificationDate: e.target.value }))} />
            <FieldError error={fieldErrors.certificationDate} />
          </>
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.certificationDate ? new Date(journey.certificationDate).toLocaleDateString() : '—'}</p>
        )}
      </div>

      {/* Name of the TSM - Dropdown */}
      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Name of the TSM</Label>
        {editMode ? (
          <>
            <Select value={data.certificationTsmId?.toString() || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, certificationTsmId: parseInt(v) }))}>
              <SelectTrigger className={`mt-1 bg-white ${fieldErrors.certificationTsmId ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}>
                <SelectValue placeholder="Select TSM" />
              </SelectTrigger>
              <SelectContent>
                {interviewers.map((interviewer) => (
                  <SelectItem key={interviewer.id} value={interviewer.id.toString()}>
                    {interviewer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.certificationTsmId} />
          </>
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">
            {journey.certificationTsmId
              ? interviewers.find(i => i.id === journey.certificationTsmId)?.name || '—'
              : '—'
            }
          </p>
        )}
      </div>

      {/* Mock-assessment scorecard launcher */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-700">Mock Assessment Scorecard</p>
            {latestScorecard && (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${scorecardBadgeClass}`}>
                {scorecardResult === 'SELECTED' ? <CheckCircle2 className="w-3 h-3" />
                  : scorecardResult === 'REJECTED' ? <XCircle className="w-3 h-3" />
                    : <ClipboardCheck className="w-3 h-3" />}
                {scorecardBadgeLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {latestScorecard ? "Scorecard submitted — view or update the candidate's scores." : "Open the rubric grader to score this candidate's demo."}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="h-8 rounded-xl text-xs bg-[#1E62F2] hover:bg-[#1751cc]"
          onClick={() => setScorecardOpen(true)}
        >
          <ClipboardCheck className="w-3.5 h-3.5 mr-1.5" /> {latestScorecard ? 'View / Edit Score' : 'Score'}
        </Button>
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Feedback</Label>
        {editMode ? (
          <>
            <Textarea value={data.certificationFeedback || ''} rows={3} placeholder="Add certification feedback..."
              className={`mt-1 bg-white ${fieldErrors.certificationFeedback ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}
              onChange={(e) => setEditData(prev => ({ ...prev, certificationFeedback: e.target.value }))} />
            <FieldError error={fieldErrors.certificationFeedback} />
          </>
        ) : (
          <p className="text-sm text-slate-700 mt-1">{journey.certificationFeedback || <span className="text-slate-400 italic">No feedback</span>}</p>
        )}
      </div>

      <ScorecardGraderDialog
        open={scorecardOpen}
        onOpenChange={setScorecardOpen}
        defaultCandidateName={candidateName}
        applicationId={journey.applicationId}
        onSaved={loadScorecard}
      />

      {/* Conditional Training Count - Only shown when "Need More Training" is selected */}
      {((editMode ? editData.certificationStatus : journey.certificationStatus) === 'NEED_MORE_TRAINING') && (
        <div className={`p-3 rounded-lg ${editMode ? 'bg-amber-50 border border-amber-300' : 'bg-amber-50 border border-amber-200'}`}>
          <Label className={`text-xs ${editMode ? 'text-amber-700 font-medium' : 'text-amber-600'}`}>
            Number of Lessons Needed {editMode && <span className="text-red-500">*</span>}
          </Label>
          {editMode ? (
            <>
              <Select
                value={data.certificationTrainingCount?.toString() || ''}
                onValueChange={(v) => setEditData(prev => ({ ...prev, certificationTrainingCount: parseInt(v) }))}
              >
                <SelectTrigger className={`mt-1 bg-white ${fieldErrors.certificationTrainingCount ? 'border-red-500' : 'border-amber-400'} focus:ring-amber-400`}>
                  <SelectValue placeholder="Select number of lessons" />
                </SelectTrigger>
                <SelectContent>
                  {CERTIFICATION_TRAINING_COUNT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={fieldErrors.certificationTrainingCount} />
            </>
          ) : (
            <p className="text-sm text-amber-700 mt-1 font-semibold">
              {journey.certificationTrainingCount ? `${journey.certificationTrainingCount} ${journey.certificationTrainingCount === 1 ? 'Lesson' : 'Lessons'}` : <span className="text-amber-600 italic">Not specified</span>}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// GO LIVE SECTION
const GoLiveSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {} }) => {
  const data = editMode ? editData : journey;

  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>Readiness</span>
        {editMode ? (
          <div className="flex flex-col items-end">
            <Select value={data.goLiveReadiness || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, goLiveReadiness: v as GoLiveStatus }))}>
              <SelectTrigger className={`w-48 bg-white ${fieldErrors.goLiveReadiness ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="YES">Yes</SelectItem>
                <SelectItem value="NEEDS_MORE_TRAINING">Needs More Training</SelectItem>
                <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.goLiveReadiness} />
          </div>
        ) : getStatusBadge(journey.goLiveReadiness)}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Go-Live Date</Label>
        {editMode ? (
          <>
            <Input type="date" value={data.goLiveDate?.split('T')[0] || ''}
              className={`mt-1 bg-white ${fieldErrors.goLiveDate ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}
              onChange={(e) => setEditData(prev => ({ ...prev, goLiveDate: e.target.value }))} />
            <FieldError error={fieldErrors.goLiveDate} />
          </>
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">{journey.goLiveDate ? new Date(journey.goLiveDate).toLocaleDateString() : '—'}</p>
        )}
      </div>

      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className={`text-xs ${editMode ? 'text-[#1E62F2] font-medium' : 'text-slate-500'}`}>Assigned Subjects</Label>
        {editMode ? (
          <>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
              {[
                { id: 'LITTLE_YOGI', label: 'Little Yogi' },
                { id: 'UNBOX_7_PLUS', label: 'Unbox 7+' },
                { id: 'PHONICS', label: 'Phonics' },
                { id: 'ALPHA_MATH', label: 'Alpha Math' },
              ].map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.id}
                    checked={Array.isArray(data.assignedSubject) && data.assignedSubject.includes(subject.id as Subject)}
                    onCheckedChange={(checked) => {
                      const current = Array.isArray(data.assignedSubject) ? data.assignedSubject : [];
                      let updated: Subject[];
                      if (checked) {
                        updated = [...current, subject.id as Subject];
                      } else {
                        updated = current.filter(s => s !== subject.id);
                      }
                      setEditData(prev => ({ ...prev, assignedSubject: updated.length > 0 ? updated : null }));
                    }}
                  />
                  <Label htmlFor={subject.id} className="text-sm cursor-pointer font-normal">{subject.label}</Label>
                </div>
              ))}
            </div>
            <FieldError error={fieldErrors.assignedSubject} />
          </>
        ) : (
          <p className="text-sm text-slate-700 mt-1 font-medium">
            {Array.isArray(journey.assignedSubject) && journey.assignedSubject.length > 0
              ? journey.assignedSubject.map(s => s.replace(/_/g, ' ')).join(', ')
              : <span className="text-slate-400 italic">Not assigned</span>}
          </p>
        )}
      </div>
    </div>
  );
};

// READY FOR PAID CLASS SECTION
const ReadyForPaidClassSection: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {} }) => {
  const data = editMode ? editData : journey;

  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>
          Is this candidate ready for paid class training?
        </span>
        {editMode ? (
          <div className="flex flex-col items-end">
            <Select value={data.readyForPaidClass || ''} onValueChange={(v) => setEditData(prev => ({ ...prev, readyForPaidClass: v as ReadyForPaidClassStatus }))}>
              <SelectTrigger className={`w-48 bg-white ${fieldErrors.readyForPaidClass ? 'border-[hsl(0,84%,60%)]' : 'border-[#1E62F2]'} focus:ring-[#1E62F2]`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {READY_FOR_PAID_CLASS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.readyForPaidClass} />
          </div>
        ) : getStatusBadge(journey.readyForPaidClass)}
      </div>
    </div>
  );
};

const PaidTrainingSectionImpl: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {}, demoTrainers = [] }) => {
  const data = editMode ? editData : journey;
  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className={`text-sm font-medium ${editMode ? 'text-[#1E62F2]' : 'text-[hsl(214,100%,15%,0.6)]'}`}>Status</span>
        {editMode ? (
          <div className="flex flex-col items-end">
            <Select value={data.paidTrainingStatus || 'NOT_JOINED'} onValueChange={(v) => setEditData(prev => ({ ...prev, paidTrainingStatus: v as PaidTrainingStatus }))}>
              <SelectTrigger className="w-48 bg-white border-[#1E62F2]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRAINING_STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : getStatusBadge(journey.paidTrainingStatus || 'NOT_JOINED')}
      </div>
      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label className="text-xs text-slate-500">Training Start Date</Label>
        {editMode ? (
          <Input type="date" value={data.paidTrainingStartDate ? new Date(data.paidTrainingStartDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setEditData(prev => ({ ...prev, paidTrainingStartDate: e.target.value }))}
            className="mt-1 bg-white border-[#1E62F2]" />
        ) : (
          <p className="text-sm font-medium">{data.paidTrainingStartDate ? new Date(data.paidTrainingStartDate).toLocaleDateString() : '—'}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <Label className="text-xs text-slate-500">Training Notes</Label>
        {editMode ? (
          <Textarea value={data.paidTrainingNotes || ''} onChange={(e) => setEditData(prev => ({ ...prev, paidTrainingNotes: e.target.value }))} placeholder="Add notes..." className="mt-1 bg-white border-[#1E62F2]" />
        ) : (
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{journey.paidTrainingNotes || '—'}</p>
        )}
      </div>

      {/* Demo Trainers Multi-Select - Required Field */}
      <div className={`p-3 rounded-lg ${editMode ? 'bg-blue-50 border border-blue-300' : 'bg-blue-50 border border-blue-200'}`}>
        <Label className={`text-xs ${editMode ? 'text-blue-700 font-medium' : 'text-blue-600'}`}>
          Demo Trainers {editMode && <span className="text-red-500">*</span>}
        </Label>
        {editMode ? (
          <>
            <div className="mt-2 space-y-2">
              {/* Multi-select checkboxes */}
              <div className="max-h-40 overflow-y-auto space-y-1.5 bg-white p-2 rounded border border-blue-300">
                {demoTrainers.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-2">No trainers available</p>
                ) : (
                  demoTrainers.map((trainer) => {
                    const isSelected = (editData.paidDemoTrainerIds || []).includes(trainer.id);
                    return (
                      <label
                        key={trainer.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-purple-50 border border-purple-300' : 'hover:bg-slate-50 border border-transparent'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const currentIds = editData.paidDemoTrainerIds || [];
                            const newIds = e.target.checked
                              ? [...currentIds, trainer.id]
                              : currentIds.filter(id => id !== trainer.id);
                            setEditData(prev => ({ ...prev, paidDemoTrainerIds: newIds }));
                          }}
                          className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                        />
                        <span className={`text-sm ${isSelected ? 'text-purple-700 font-medium' : 'text-slate-700'}`}>
                          {trainer.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-purple-600" />
                        )}
                      </label>
                    );
                  })
                )}
              </div>

              {/* Selected trainers preview */}
              {(editData.paidDemoTrainerIds || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editData.paidDemoTrainerIds!.map(trainerId => {
                    const trainer = demoTrainers.find(t => t.id === trainerId);
                    if (!trainer) return null;
                    return (
                      <Badge key={trainerId} variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                        {trainer.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            <FieldError error={fieldErrors.paidDemoTrainerIds} />
          </>
        ) : (
          <div className="mt-1">
            {journey.paidDemoTrainerIds && journey.paidDemoTrainerIds.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {journey.paidDemoTrainerIds.map(trainerId => {
                  const trainer = demoTrainers.find(t => t.id === trainerId);
                  if (!trainer) return null;
                  return (
                    <Badge key={trainerId} variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      {trainer.name}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No trainers selected</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PaidCertificationSectionImpl: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {} }) => {
  const data = editMode ? editData : journey;
  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className="text-sm font-medium">Status</span>
        {editMode ? (
          <Select value={data.paidCertificationStatus || 'PENDING'} onValueChange={(v) => setEditData(prev => ({ ...prev, paidCertificationStatus: v as PaidCertificationStatus }))}>
            <SelectTrigger className="w-48 bg-white border-[#1E62F2]"><SelectValue /></SelectTrigger>
            <SelectContent>{PAID_CERTIFICATION_STATUS_OPTIONS.filter(o => o.value !== 'all').map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        ) : getStatusBadge(journey.paidCertificationStatus || 'PENDING')}
      </div>
      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label>Certification Date</Label>
        {editMode ? <Input type="date" value={data.paidCertificationDate ? new Date(data.paidCertificationDate).toISOString().split('T')[0] : ''} onChange={e => setEditData(prev => ({ ...prev, paidCertificationDate: e.target.value }))} className="mt-1 bg-white border-[#1E62F2]" /> : <p>{data.paidCertificationDate ? new Date(data.paidCertificationDate).toLocaleDateString() : '—'}</p>}
      </div>
      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <Label>Feedback</Label>
        {editMode ? <Textarea value={data.paidCertificationFeedback || ''} onChange={e => setEditData(prev => ({ ...prev, paidCertificationFeedback: e.target.value }))} className="mt-1 bg-white border-[#1E62F2]" /> : <p>{journey.paidCertificationFeedback || '—'}</p>}
      </div>
    </div>
  );
};

const PaidGoLiveSectionImpl: React.FC<SectionProps> = ({ journey, editMode, editData, setEditData, fieldErrors = {} }) => {
  const data = editMode ? editData : journey;
  return (
    <div className="space-y-5">
      <div className={`flex items-center justify-between p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : 'bg-slate-50'}`}>
        <span className="text-sm font-medium">Readiness</span>
        {editMode ? (
          <Select value={data.paidGoLiveReadiness || 'PENDING'} onValueChange={(v) => setEditData(prev => ({ ...prev, paidGoLiveReadiness: v as PaidGoLiveStatus }))}>
            <SelectTrigger className="w-48 bg-white border-[#1E62F2]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="YES">Yes</SelectItem>
              <SelectItem value="NEEDS_MORE_TRAINING">Needs More Training</SelectItem>
            </SelectContent>
          </Select>
        ) : getStatusBadge(journey.paidGoLiveReadiness || 'PENDING')}
      </div>
      <div className={`p-3 rounded-lg ${editMode ? 'bg-white border border-[#1E62F2]' : ''}`}>
        <Label>Go Live Date</Label>
        {editMode ? <Input type="date" value={data.paidGoLiveDate ? new Date(data.paidGoLiveDate).toISOString().split('T')[0] : ''} onChange={e => setEditData(prev => ({ ...prev, paidGoLiveDate: e.target.value }))} className="mt-1 bg-white border-[#1E62F2]" /> : <p>{data.paidGoLiveDate ? new Date(data.paidGoLiveDate).toLocaleDateString() : '—'}</p>}
      </div>
    </div>
  );
};

export default TeacherJourneySection;
