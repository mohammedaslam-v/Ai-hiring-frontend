
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Calendar, Clock, BookOpen, Download, RefreshCw } from "lucide-react";
import DetailedEvaluationDisplay from "./DetailedEvaluationDisplay";
import { ApplicantDetailsModalProps, DashboardApplicationDetail } from '@/types/admin';

const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onRefreshToughTongue,
  refreshingSession
}) => {
  const [loading, setLoading] = useState(false);

  if (!applicant) return null;

  const getStatusBadge = (applicationStatus: string, interviewStatus?: string) => {
    if (interviewStatus === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    } else if (interviewStatus === 'failed') {
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    } else if (interviewStatus === 'in_progress') {
      return <Badge className="bg-yellow-100 text-yellow-800">In Interview</Badge>;
    } else if (applicationStatus === 'pending') {
      return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    } else {
      return <Badge variant="outline">{applicationStatus}</Badge>;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getAvailableDays = (availability: string[]) => {
    const dayMap: { [key: string]: string } = {
      'monday': 'Monday',
      'tuesday': 'Tuesday', 
      'wednesday': 'Wednesday',
      'thursday': 'Thursday',
      'friday': 'Friday',
      'saturday': 'Saturday',
      'sunday': 'Sunday'
    };
    
    return availability.map(day => dayMap[day.toLowerCase()] || day).join(', ');
  };

  const getTimeSlots = (availability: string[]) => {
    const timeSlots = availability.filter(item => 
      item.includes('morning') || item.includes('afternoon') || item.includes('evening') || item.includes('night')
    );
    return timeSlots.length > 0 ? timeSlots.join(', ') : 'Not specified';
  };

  const handleViewResume = async () => {
    if (!applicant.id) {
      toast.error("Application ID not found");
      return;
    }

    try {
      // Mock resume viewing for now
      toast.info("Opening resume...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Open mock resume in new tab
      window.open('https://example.com/resume.pdf', '_blank');
      toast.success("Resume opened in a new tab");
      
    } catch (error) {
      console.error('Error viewing resume:', error);
      toast.error("Failed to open resume. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-bambinos-blue flex items-center">
            <User className="h-5 w-5 mr-2" />
            {applicant.name} - Detailed Analysis
          </DialogTitle>
          <DialogDescription>
            Complete application and interview assessment details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Personal Information Section */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Name:</span>
                    <span>{applicant.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Email:</span>
                    <span>{applicant.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Phone:</span>
                    <span>{applicant.phone}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Applied:</span>
                    <span>{applicant.application_date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Interviewed:</span>
                    <span>{formatDateTime(applicant.interview_started)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    {getStatusBadge(applicant.application_status, applicant.interview_status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Information Section */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Teaching Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {applicant.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Available Days</h4>
                  <p className="text-sm text-green-700">
                    {getAvailableDays(applicant.availability)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Available Time Slots</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeSlots(applicant.availability)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Details Section */}
          {(applicant.interview_started || applicant.session_id) && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Interview Started:</strong> {formatDateTime(applicant.interview_started)}</p>
                    <p><strong>Interview Completed:</strong> {formatDateTime(applicant.interview_completed)}</p>
                    <p><strong>Session ID:</strong> 
                      <span className="font-mono text-xs ml-2">{applicant.session_id || 'N/A'}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> {getStatusBadge(applicant.application_status, applicant.interview_status)}</p>
                    {typeof applicant.score === 'number' ? (
                      <p><strong>Final Total Score:</strong> 
                        <span className={`ml-2 font-semibold ${applicant.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                          {applicant.score}%
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
                {applicant.session_id && (
                  <Button
                    size="sm"
                    className="mt-4 bg-bambinos-blue hover:bg-bambinos-blue/90"
                    onClick={() => onRefreshToughTongue(applicant.session_id!, applicant.id)}
                    disabled={refreshingSession === applicant.session_id}
                  >
                    {refreshingSession === applicant.session_id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Syncing Data...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh ToughTongue Data
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Session Metadata */}
          {applicant.evaluation?.session_metadata && (
            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <CardTitle className="text-indigo-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Session Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Scenario:</strong> {applicant.evaluation.session_metadata.scenario_name || applicant.evaluation.session_metadata.scenario_id || 'N/A'}</p>
                    <p><strong>Status:</strong> {applicant.evaluation.session_metadata.status || 'N/A'}</p>
                    <p><strong>Duration:</strong> {applicant.evaluation.session_metadata.duration ? `${Math.round(applicant.evaluation.session_metadata.duration / 60)} min` : 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>User Name:</strong> {applicant.evaluation.session_metadata.user_name || 'N/A'}</p>
                    <p><strong>User Email:</strong> {applicant.evaluation.session_metadata.user_email || 'N/A'}</p>
                    <p><strong>Updated:</strong> {applicant.evaluation.session_metadata.updated_at ? new Date(applicant.evaluation.session_metadata.updated_at).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resume Section */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700">
                    Resume uploaded with application
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Applied on {applicant.application_date}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                  onClick={handleViewResume}
                >
                  <Download className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ToughTongue Evaluation Section */}
          {applicant.score || applicant.evaluation ? (
            <>
              <DetailedEvaluationDisplay
                score={applicant.score || 0}
                evaluation={applicant.evaluation}
                strengths={applicant.strengths}
                areas_for_improvement={applicant.areas_for_improvement}
                feedback={applicant.feedback}
              />

              {/* Transcript */}
              {Array.isArray((applicant.evaluation?.transcript) || (applicant.evaluation?.raw_session_data?.messages)) &&
                ((applicant.evaluation?.transcript || applicant.evaluation?.raw_session_data?.messages).length > 0) && (
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-bambinos-blue">Interview Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-80 overflow-y-auto space-y-2 text-sm">
                      {(applicant.evaluation?.transcript || applicant.evaluation?.raw_session_data?.messages).map((msg: any, idx: number) => {
                        const role = (msg && (msg.role || msg.speaker || msg.sender)) || 'Message';
                        const text = (msg && (msg.text || msg.content || msg.message)) || (typeof msg === 'string' ? msg : JSON.stringify(msg));
                        const time = msg && (msg.timestamp || msg.time);
                        return (
                          <div key={idx} className="flex gap-2">
                            <span className="font-medium text-gray-700">{role}:</span>
                            <span className="text-gray-800">{text}</span>
                            {time ? <span className="ml-auto text-gray-400">{String(time)}</span> : null}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600 mb-2">No ToughTongue evaluation available yet.</p>
                <p className="text-sm text-gray-500 mb-4">
                  This could mean the interview hasn't been completed or analysis is still processing.
                </p>
                {applicant.session_id && (
                  <Button
                    onClick={() => onRefreshToughTongue(applicant.session_id!, applicant.id)}
                    className="bg-bambinos-blue hover:bg-bambinos-blue/90"
                    disabled={refreshingSession === applicant.session_id}
                  >
                    {refreshingSession === applicant.session_id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Sync Again
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantDetailsModal;
