import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, MessageSquare, RefreshCw } from "lucide-react";
import DetailedEvaluationDisplay from './DetailedEvaluationDisplay';

interface FeedbackData {
  score: number;
  evaluation: Record<string, unknown>;
  strengths: string[];
  improvements: string[];
  feedback?: string;
  sessionId?: string;
  applicationId?: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackData | null;
  onRefresh?: (applicationId: string) => Promise<void>;
  refreshing?: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  feedback,
  onRefresh,
  refreshing = false
}) => {
  if (!feedback) return null;

  const handleRefresh = async () => {
    if (onRefresh && feedback.applicationId) {
      await onRefresh(feedback.applicationId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-bambinos-blue">
              ToughTongue Feedback
            </DialogTitle>
            <div className="flex items-center gap-2">
              {onRefresh && feedback.applicationId && (
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  {refreshing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Detailed Evaluation Display */}
          <DetailedEvaluationDisplay
            score={feedback.score}
            evaluation={feedback.evaluation}
            strengths={feedback.strengths}
            areas_for_improvement={feedback.improvements}
          />

          {/* Additional Feedback if available */}
          {feedback.feedback && (
            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center text-xl">
                  <MessageSquare className="h-6 w-6 mr-3" />
                  Additional Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
