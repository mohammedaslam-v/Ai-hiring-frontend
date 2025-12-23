import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeacherJourney, SubmitDemoFeedbackData } from '@/types/teacherJourney';
import { Star } from 'lucide-react';
import { getSortedInterviewers } from '@/constants/admin/interviewers';

interface DemoFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: TeacherJourney | null;
  onSubmit: (data: SubmitDemoFeedbackData) => Promise<boolean>;
}

const DemoFeedbackModal: React.FC<DemoFeedbackModalProps> = ({
  isOpen,
  onClose,
  journey,
  onSubmit
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubmitDemoFeedbackData>({
    applicationId: '',
    demoStatus: 'SELECTED',
    demoDate: new Date().toISOString().split('T')[0],
    demoInterviewerName: '',
    demoFeedback: '',
    lessonClarity: 3,
    studentEngagement: 3,
    languageCommunication: 3,
    teachingAids: 3,
    creativityDelivery: 3,
    grammarPronunciation: 3
  });

  useEffect(() => {
    if (journey) {
      setFormData({
        applicationId: journey.applicationId,
        demoStatus: journey.demoStatus === 'SELECTED' || journey.demoStatus === 'NOT_SELECTED' 
          ? journey.demoStatus 
          : 'SELECTED',
        demoDate: journey.demoDate 
          ? new Date(journey.demoDate).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
        demoInterviewerName: journey.demoInterviewerName || '',
        demoFeedback: journey.demoFeedback || '',
        lessonClarity: journey.lessonClarity || 3,
        studentEngagement: journey.studentEngagement || 3,
        languageCommunication: journey.languageCommunication || 3,
        teachingAids: journey.teachingAids || 3,
        creativityDelivery: journey.creativityDelivery || 3,
        grammarPronunciation: journey.grammarPronunciation || 3
      });
    }
  }, [journey]);

  const handleSubmit = async () => {
    if (!formData.demoInterviewerName.trim()) {
      alert('Please enter interviewer name');
      return;
    }

    setLoading(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const RatingStars: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
  }> = ({ label, value, onChange }) => (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value 
                  ? 'fill-[#1E62F2] text-[#1E62F2]' 
                  : 'text-[hsl(240,5%,64.9%,0.5)] fill-[hsl(240,5%,64.9%,0.1)]'
              } hover:text-[#1E62F2] hover:fill-[#1E62F2]/30 transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (!journey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Demo Feedback - {journey.firstName} {journey.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Demo Status</Label>
              <Select
                value={formData.demoStatus}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  demoStatus: value as 'SELECTED' | 'NOT_SELECTED' 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SELECTED">Selected</SelectItem>
                  <SelectItem value="NOT_SELECTED">Not Selected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Demo Date</Label>
              <Input
                type="date"
                value={formData.demoDate}
                onChange={(e) => setFormData(prev => ({ ...prev, demoDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Interviewer Name *</Label>
            <Select
              value={formData.demoInterviewerName}
              onValueChange={(value) => setFormData(prev => ({ ...prev, demoInterviewerName: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interviewer" />
              </SelectTrigger>
              <SelectContent>
                {getSortedInterviewers().map((interviewer) => (
                  <SelectItem key={interviewer} value={interviewer}>
                    {interviewer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ratings Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[hsl(214,100%,15%)] border-b border-[#F4F6FA] pb-2">Performance Ratings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <RatingStars
                label="Lesson Clarity"
                value={formData.lessonClarity}
                onChange={(value) => setFormData(prev => ({ ...prev, lessonClarity: value }))}
              />
              <RatingStars
                label="Student Engagement"
                value={formData.studentEngagement}
                onChange={(value) => setFormData(prev => ({ ...prev, studentEngagement: value }))}
              />
              <RatingStars
                label="Language & Communication"
                value={formData.languageCommunication}
                onChange={(value) => setFormData(prev => ({ ...prev, languageCommunication: value }))}
              />
              <RatingStars
                label="Teaching Aids"
                value={formData.teachingAids}
                onChange={(value) => setFormData(prev => ({ ...prev, teachingAids: value }))}
              />
              <RatingStars
                label="Creativity & Delivery"
                value={formData.creativityDelivery}
                onChange={(value) => setFormData(prev => ({ ...prev, creativityDelivery: value }))}
              />
              <RatingStars
                label="Grammar & Pronunciation"
                value={formData.grammarPronunciation}
                onChange={(value) => setFormData(prev => ({ ...prev, grammarPronunciation: value }))}
              />
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <Label>Additional Feedback</Label>
            <Textarea
              value={formData.demoFeedback || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, demoFeedback: e.target.value }))}
              placeholder="Enter detailed feedback about the demo..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemoFeedbackModal;

