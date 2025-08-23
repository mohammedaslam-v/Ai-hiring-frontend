
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { Star, Send } from "lucide-react";
import { FeedbackModalProps } from '@/types/admin';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, applicationId }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock feedback submission
    const feedbackId = `feedback-${Date.now()}`;
    
    // Store in localStorage for demo purposes
    const existingFeedback = JSON.parse(localStorage.getItem('adminFeedback') || '[]');
    existingFeedback.push({
      id: feedbackId,
      applicationId,
      ...formData,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('adminFeedback', JSON.stringify(existingFeedback));

    toast.success("Feedback submitted successfully!");
    onClose();
    
    // Reset form
    setFormData({
      rating: 5,
      message: "",
      category: "general"
    });
    
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>
            {applicationId ? `Feedback for Application: ${applicationId}` : "General Feedback"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex items-center space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`p-1 transition-colors ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter your feedback..."
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackModal;
