import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TeacherJourney,
  UpdateTeacherJourneyData,
  DEMO_STATUS_OPTIONS,
  INDUCTION_OPTIONS,
  TRAINING_STATUS_OPTIONS,
  CERTIFICATION_STATUS_OPTIONS,

  GO_LIVE_OPTIONS,
  READY_FOR_PAID_CLASS_OPTIONS,
  SUBJECT_OPTIONS_FOR_UPDATE
} from '@/types/teacherJourney';
import { useInterviewers } from '@/hooks/admin/useInterviewers';

interface UpdateJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: TeacherJourney | null;
  onSubmit: (id: number, data: UpdateTeacherJourneyData) => Promise<boolean>;
}

const UpdateJourneyModal: React.FC<UpdateJourneyModalProps> = ({
  isOpen,
  onClose,
  journey,
  onSubmit
}) => {
  const { interviewers } = useInterviewers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateTeacherJourneyData>({});
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmailType, setPendingEmailType] = useState<'go_live' | 'not_cleared' | null>(null);

  useEffect(() => {
    if (journey) {
      setFormData({
        demoStatus: journey.demoStatus,
        demoDate: journey.demoDate ? new Date(journey.demoDate).toISOString().split('T')[0] : undefined,
        demoInterviewerName: journey.demoInterviewerName || undefined,
        demoFeedback: journey.demoFeedback || undefined,
        inductionAttendance: journey.inductionAttendance,
        inductionDate: journey.inductionDate ? new Date(journey.inductionDate).toISOString().split('T')[0] : undefined,
        trainingStatus: journey.trainingStatus,
        trainingStartDate: journey.trainingStartDate ? new Date(journey.trainingStartDate).toISOString().split('T')[0] : undefined,
        trainingNotes: journey.trainingNotes || undefined,
        certificationStatus: journey.certificationStatus,
        certificationDate: journey.certificationDate ? new Date(journey.certificationDate).toISOString().split('T')[0] : undefined,
        certificationFeedback: journey.certificationFeedback || undefined,
        goLiveReadiness: journey.goLiveReadiness,
        goLiveDate: journey.goLiveDate ? new Date(journey.goLiveDate).toISOString().split('T')[0] : undefined,

        assignedSubject: journey.assignedSubject,
        readyForPaidClass: journey.readyForPaidClass,

        // Paid Journey
        paidTrainingStatus: journey.paidTrainingStatus,
        paidTrainingStartDate: journey.paidTrainingStartDate ? new Date(journey.paidTrainingStartDate).toISOString().split('T')[0] : undefined,
        paidTrainingNotes: journey.paidTrainingNotes || undefined,
        paidCertificationStatus: journey.paidCertificationStatus,
        paidCertificationDate: journey.paidCertificationDate ? new Date(journey.paidCertificationDate).toISOString().split('T')[0] : undefined,
        paidCertificationFeedback: journey.paidCertificationFeedback || undefined,
        paidGoLiveReadiness: journey.paidGoLiveReadiness,
        paidGoLiveDate: journey.paidGoLiveDate ? new Date(journey.paidGoLiveDate).toISOString().split('T')[0] : undefined,
        paidAssignedSubject: journey.paidAssignedSubject
      });
    }
  }, [journey]);

  const handleSubmit = async () => {
    if (!journey) return;

    // Debug logging
    console.log('=== DEBUG: handleSubmit ===');
    console.log('formData.certificationStatus:', formData.certificationStatus);
    console.log('journey.certificationStatus:', journey.certificationStatus);

    // Check if certificationStatus is changing to a status that triggers automated emails
    const isChangingToGoLive =
      formData.certificationStatus === 'OFFER_LETTER_SENT_PORTAL_CREATED' &&
      journey.certificationStatus !== 'OFFER_LETTER_SENT_PORTAL_CREATED';

    const isChangingToNotCleared =
      formData.certificationStatus === 'NOT_CLEARED' &&
      journey.certificationStatus !== 'NOT_CLEARED';

    console.log('isChangingToGoLive:', isChangingToGoLive);
    console.log('isChangingToNotCleared:', isChangingToNotCleared);

    // If changing to a status that triggers emails, show confirmation modal first
    if (isChangingToGoLive || isChangingToNotCleared) {
      console.log('🔔 SHOWING CONFIRMATION MODAL');
      setPendingEmailType(isChangingToGoLive ? 'go_live' : 'not_cleared');
      setShowEmailConfirmation(true);
      return;
    }

    console.log('✅ No email trigger - proceeding with normal submit');
    // Otherwise proceed with normal submission
    await performSubmit();
  };

  const performSubmit = async () => {
    if (!journey) return;

    setLoading(true);
    try {
      // Clean up undefined/empty values
      const cleanData: UpdateTeacherJourneyData = {};

      if (formData.demoStatus) cleanData.demoStatus = formData.demoStatus;
      if (formData.demoDate) cleanData.demoDate = formData.demoDate;
      if (formData.demoInterviewerName !== undefined) cleanData.demoInterviewerName = formData.demoInterviewerName;
      if (formData.demoFeedback !== undefined) cleanData.demoFeedback = formData.demoFeedback;
      if (formData.inductionAttendance) cleanData.inductionAttendance = formData.inductionAttendance;
      if (formData.inductionDate) cleanData.inductionDate = formData.inductionDate;
      if (formData.trainingStatus) cleanData.trainingStatus = formData.trainingStatus;
      if (formData.trainingStartDate) cleanData.trainingStartDate = formData.trainingStartDate;
      if (formData.trainingNotes !== undefined) cleanData.trainingNotes = formData.trainingNotes;
      if (formData.certificationStatus) cleanData.certificationStatus = formData.certificationStatus;
      if (formData.certificationDate) cleanData.certificationDate = formData.certificationDate;
      if (formData.certificationFeedback !== undefined) cleanData.certificationFeedback = formData.certificationFeedback;
      if (formData.goLiveReadiness) cleanData.goLiveReadiness = formData.goLiveReadiness;
      if (formData.goLiveDate) cleanData.goLiveDate = formData.goLiveDate;

      cleanData.assignedSubject = formData.assignedSubject || null;
      if (formData.readyForPaidClass) cleanData.readyForPaidClass = formData.readyForPaidClass;

      // Paid Journey
      if (formData.paidTrainingStatus) cleanData.paidTrainingStatus = formData.paidTrainingStatus;
      if (formData.paidTrainingStartDate) cleanData.paidTrainingStartDate = formData.paidTrainingStartDate;
      if (formData.paidTrainingNotes !== undefined) cleanData.paidTrainingNotes = formData.paidTrainingNotes;
      if (formData.paidCertificationStatus) cleanData.paidCertificationStatus = formData.paidCertificationStatus;
      if (formData.paidCertificationDate) cleanData.paidCertificationDate = formData.paidCertificationDate;
      if (formData.paidCertificationFeedback !== undefined) cleanData.paidCertificationFeedback = formData.paidCertificationFeedback;
      if (formData.paidGoLiveReadiness) cleanData.paidGoLiveReadiness = formData.paidGoLiveReadiness;
      if (formData.paidGoLiveDate) cleanData.paidGoLiveDate = formData.paidGoLiveDate;
      cleanData.paidAssignedSubject = formData.paidAssignedSubject || null;

      const success = await onSubmit(journey.id, cleanData);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmail = async () => {
    setShowEmailConfirmation(false);
    setPendingEmailType(null);
    await performSubmit();
  };

  const handleCancelEmail = () => {
    setShowEmailConfirmation(false);
    setPendingEmailType(null);
  };

  if (!journey) return null;

  // Completion checks
  const isDemoDone = journey.demoStatus === 'SELECTED';
  const isInductionDone = journey.inductionAttendance === 'YES';
  const isTrainingDone = journey.trainingStatus === 'JOINED' || journey.trainingStatus === 'COMPLETED';

  const isCertificationDone = journey.certificationStatus === 'CLEARED';
  const isGoLiveDone = journey.goLiveReadiness === 'YES';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Update Journey - {journey.firstName} {journey.lastName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="induction" disabled={!isDemoDone} title={!isDemoDone ? "Complete Demo first" : ""}>
              Induction {!isDemoDone && "🔒"}
            </TabsTrigger>
            <TabsTrigger value="training" disabled={!isInductionDone} title={!isInductionDone ? "Complete Induction first" : ""}>
              Demo Training {!isInductionDone && "🔒"}
            </TabsTrigger>
            <TabsTrigger value="certification" disabled={!isTrainingDone} title={!isTrainingDone ? "Complete Training first" : ""}>
              Demo Certification {!isTrainingDone && "🔒"}
            </TabsTrigger>
            <TabsTrigger value="golive" disabled={!isCertificationDone} title={!isCertificationDone ? "Complete Certification first" : ""}>
              Demo Go Live {!isCertificationDone && "🔒"}
            </TabsTrigger>
            <TabsTrigger value="readyForPaidClass" disabled={!isGoLiveDone} title={!isGoLiveDone ? "Complete Go Live first" : ""}>
              Ready for Paid Class {!isGoLiveDone && "🔒"}
            </TabsTrigger>
            <TabsTrigger value="paidTraining">
              Paid Training
            </TabsTrigger>
            <TabsTrigger value="paidCertification">
              Paid Certification
            </TabsTrigger>
            <TabsTrigger value="paidGoLive">
              Paid Go Live
            </TabsTrigger>
          </TabsList>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Demo Status</Label>
                <Select
                  value={formData.demoStatus || 'PENDING'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    demoStatus: value as any
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Demo Date</Label>
                <Input
                  type="date"
                  value={formData.demoDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, demoDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Demo Interviewer Name</Label>
              <Select
                value={formData.demoInterviewerName || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, demoInterviewerName: value }))}
              >
                <SelectTrigger>
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
            </div>
            <div>
              <Label>Demo Feedback</Label>
              <Textarea
                value={formData.demoFeedback || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, demoFeedback: e.target.value }))}
                placeholder="Enter demo feedback..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Induction Tab */}
          <TabsContent value="induction" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Induction Attendance</Label>
                <Select
                  value={formData.inductionAttendance || 'PENDING'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    inductionAttendance: value as any
                  }))}
                >
                  <SelectTrigger>
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
              </div>
              <div>
                <Label>Induction Date</Label>
                <Input
                  type="date"
                  value={formData.inductionDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, inductionDate: e.target.value }))}
                />
              </div>
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Demo Training Status</Label>
                <Select
                  value={formData.trainingStatus || 'NOT_JOINED'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    trainingStatus: value as any
                  }))}
                >
                  <SelectTrigger>
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
              </div>
              <div>
                <Label>Demo Training Start Date</Label>
                <Input
                  type="date"
                  value={formData.trainingStartDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingStartDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Demo Training Notes</Label>
              <Textarea
                value={formData.trainingNotes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, trainingNotes: e.target.value }))}
                placeholder="Enter any notes about the training..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Certification Tab */}
          <TabsContent value="certification" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Demo Certification Status</Label>
                <Select
                  value={formData.certificationStatus || 'PENDING'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    certificationStatus: value as any
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICATION_STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Demo Certification Date</Label>
                <Input
                  type="date"
                  value={formData.certificationDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificationDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Demo Certification Feedback</Label>
              <Textarea
                value={formData.certificationFeedback || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, certificationFeedback: e.target.value }))}
                placeholder="Enter feedback for the certification..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Go-Live Tab */}
          <TabsContent value="golive" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Demo Go Live Readiness</Label>
                <Select
                  value={formData.goLiveReadiness || 'PENDING'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    goLiveReadiness: value as any
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GO_LIVE_OPTIONS.filter(o => o.value !== 'all').map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Demo Go Live Date</Label>
                <Input
                  type="date"
                  value={formData.goLiveDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, goLiveDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Assigned Subjects</Label>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                {SUBJECT_OPTIONS_FOR_UPDATE.filter(o => o.value !== 'NONE').map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`modal-${option.value}`}
                      checked={Array.isArray(formData.assignedSubject) && formData.assignedSubject.includes(option.value as any)}
                      onCheckedChange={(checked) => {
                        const current = Array.isArray(formData.assignedSubject) ? formData.assignedSubject : [];
                        let updated: any[];
                        if (checked) {
                          updated = [...current, option.value];
                        } else {
                          updated = current.filter(s => s !== option.value);
                        }
                        setFormData(prev => ({ ...prev, assignedSubject: updated.length > 0 ? updated : null }));
                      }}
                    />
                    <Label htmlFor={`modal-${option.value}`} className="text-sm cursor-pointer font-normal">{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Ready For Paid Class Tab */}
          <TabsContent value="readyForPaidClass" className="space-y-4 pt-4">
            <div className="space-y-4">
              <Label>Is this candidate ready for paid class training?</Label>
              <Select
                value={formData.readyForPaidClass || 'PENDING'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  readyForPaidClass: value as any
                }))}
              >
                <SelectTrigger className="w-full">
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
            </div>
          </TabsContent>

          {/* Paid Training Tab */}
          <TabsContent value="paidTraining" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Paid Training Status</Label>
                <Select
                  value={formData.paidTrainingStatus || 'NOT_JOINED'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    paidTrainingStatus: value as any
                  }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRAINING_STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={formData.paidTrainingStartDate || ''} onChange={(e) => setFormData(prev => ({ ...prev, paidTrainingStartDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={formData.paidTrainingNotes || ''} onChange={(e) => setFormData(prev => ({ ...prev, paidTrainingNotes: e.target.value }))} />
            </div>
          </TabsContent>

          {/* Paid Certification Tab */}
          <TabsContent value="paidCertification" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={formData.paidCertificationStatus || 'PENDING'} onValueChange={(v) => setFormData(prev => ({ ...prev, paidCertificationStatus: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CERTIFICATION_STATUS_OPTIONS.filter(o => o.value !== 'all').map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={formData.paidCertificationDate || ''} onChange={(e) => setFormData(prev => ({ ...prev, paidCertificationDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Feedback</Label>
              <Textarea value={formData.paidCertificationFeedback || ''} onChange={(e) => setFormData(prev => ({ ...prev, paidCertificationFeedback: e.target.value }))} />
            </div>
          </TabsContent>

          {/* Paid Go Live Tab */}
          <TabsContent value="paidGoLive" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Readiness</Label>
                <Select value={formData.paidGoLiveReadiness || 'PENDING'} onValueChange={(v) => setFormData(prev => ({ ...prev, paidGoLiveReadiness: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NEEDS_MORE_TRAINING">Needs More Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={formData.paidGoLiveDate || ''} onChange={(e) => setFormData(prev => ({ ...prev, paidGoLiveDate: e.target.value }))} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update Journey'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Email Confirmation Modal */}
      <AlertDialog open={showEmailConfirmation} onOpenChange={setShowEmailConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>📧 Confirm Email Notification</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              {pendingEmailType === 'go_live' && (
                <>
                  <p>
                    You are about to change the certification status to{' '}
                    <strong>Offer Letter Sent / Portal Created</strong>.
                  </p>
                  <p>
                    An automated <strong className="text-green-600">congratulations email</strong> will be sent to the candidate with:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Offer letter details</li>
                    <li>Portal access information</li>
                    <li>Next steps for going live</li>
                  </ul>
                  <p className="text-orange-600 font-semibold">
                    ⚠️ This email cannot be recalled once sent.
                  </p>
                </>
              )}
              {pendingEmailType === 'not_cleared' && (
                <>
                  <p>
                    You are about to change the certification status to{' '}
                    <strong>Not Cleared</strong>.
                  </p>
                  <p>
                    An automated <strong className="text-red-600">rejection email</strong> will be sent to the candidate with:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Notification that they did not clear certification</li>
                    <li>Encouragement to re-apply after the cooling-off period</li>
                  </ul>
                  <p className="text-orange-600 font-semibold">
                    ⚠️ This email cannot be recalled once sent.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelEmail}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmEmail}
              className={pendingEmailType === 'go_live' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              Confirm & Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default UpdateJourneyModal;

