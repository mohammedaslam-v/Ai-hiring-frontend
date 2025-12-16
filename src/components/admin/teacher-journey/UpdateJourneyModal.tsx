import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TeacherJourney, 
  UpdateTeacherJourneyData,
  DEMO_STATUS_OPTIONS,
  INDUCTION_OPTIONS,
  TRAINING_STATUS_OPTIONS,
  CERTIFICATION_STATUS_OPTIONS,
  GO_LIVE_OPTIONS,
  SUBJECT_OPTIONS_FOR_UPDATE
} from '@/types/teacherJourney';

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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateTeacherJourneyData>({});

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
        assignedSubject: journey.assignedSubject
      });
    }
  }, [journey]);

  const handleSubmit = async () => {
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

      const success = await onSubmit(journey.id, cleanData);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!journey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Update Journey - {journey.firstName} {journey.lastName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="induction">Induction</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="certification">Certification</TabsTrigger>
            <TabsTrigger value="golive">Go-Live</TabsTrigger>
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
              <Input
                value={formData.demoInterviewerName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, demoInterviewerName: e.target.value }))}
                placeholder="Enter interviewer name..."
              />
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
                <Label>Training Status</Label>
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
                <Label>Training Start Date</Label>
                <Input
                  type="date"
                  value={formData.trainingStartDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingStartDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Training Notes</Label>
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
                <Label>Certification Status</Label>
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
                <Label>Certification Date</Label>
                <Input
                  type="date"
                  value={formData.certificationDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificationDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Certification Feedback</Label>
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
                <Label>Go-Live Readiness</Label>
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
                <Label>Go-Live Date</Label>
                <Input
                  type="date"
                  value={formData.goLiveDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, goLiveDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Assigned Subject</Label>
              <Select
                value={formData.assignedSubject || 'NONE'}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  assignedSubject: value === 'NONE' ? null : value as any 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_OPTIONS_FOR_UPDATE.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </Dialog>
  );
};

export default UpdateJourneyModal;

