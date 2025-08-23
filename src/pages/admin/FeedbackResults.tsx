
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Eye, ArrowLeft } from "lucide-react";
 
import { toast } from 'react-toastify';

interface FeedbackResult {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  good_to_go: string;
  demo_status: string;
  demo_date: string;
  interviewer_name: string;
  lesson_clarity: string;
  student_engagement: string;
  language_communication: string;
  teaching_aids: string;
  creativity_delivery: string;
  grammar_pronunciation: string;
  feedback: string;
  confirmation_email_sent: string;
  onboarding_call_made: string;
  remarks: string;
  created_at: string;
}

const FeedbackResults = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackResults, setFeedbackResults] = useState<FeedbackResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbackResults();
  }, []);

  const fetchFeedbackResults = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with Node.js API call
      // Mock data for now
      const mockData: FeedbackResult[] = [
        {
          id: "1",
          applicant_name: "John Doe",
          applicant_email: "john.doe@example.com",
          applicant_phone: "+1234567890",
          good_to_go: "Yes",
          demo_status: "Completed",
          demo_date: "2024-01-15",
          interviewer_name: "Sarah Johnson",
          lesson_clarity: "excellent",
          student_engagement: "excellent",
          language_communication: "good",
          teaching_aids: "excellent",
          creativity_delivery: "good",
          grammar_pronunciation: "excellent",
          feedback: "Excellent teaching skills and clear communication.",
          confirmation_email_sent: "Yes",
          onboarding_call_made: "Yes",
          remarks: "Ready for onboarding",
          created_at: "2024-01-15T10:00:00Z"
        }
      ];

      setFeedbackResults(mockData);
    } catch (error) {
      console.error('Error in fetchFeedbackResults:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = feedbackResults.filter(result => 
    result.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    result.applicant_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOverallAssessmentBadge = (result: FeedbackResult) => {
    const scores = [
      result.lesson_clarity,
      result.student_engagement,
      result.language_communication,
      result.teaching_aids,
      result.creativity_delivery,
      result.grammar_pronunciation
    ];

    const excellentCount = scores.filter(score => score === 'excellent').length;
    const goodCount = scores.filter(score => score === 'good').length;

    if (excellentCount >= 4) {
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    } else if (excellentCount + goodCount >= 4) {
      return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bambinos-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-bambinos-blue/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
                className="border-bambinos-blue text-bambinos-blue hover:bg-bambinos-blue hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="w-10 h-10 bg-bambinos-blue rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-bambinos-blue">Demo Feedback Results</h1>
                <p className="text-sm text-gray-600">Educator Performance Evaluations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Feedback Results */}
        <Card className="border-bambinos-blue/20">
          <CardHeader>
            <CardTitle className="text-bambinos-blue text-xl">Educator Demo Feedback</CardTitle>
            <CardDescription>
              Comprehensive feedback and evaluation results for all educator demos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by name or email..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue" 
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border border-bambinos-blue/20">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Candidate</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Demo Date</TableHead>
                    <TableHead className="font-semibold">Interviewer</TableHead>
                    <TableHead className="font-semibold">Overall Assessment</TableHead>
                    <TableHead className="font-semibold">Good to Go</TableHead>
                    <TableHead className="font-semibold">Follow-up</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No feedback results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">{result.applicant_name}</div>
                            <div className="text-sm text-gray-600">{result.applicant_email}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-gray-900">{result.applicant_phone}</span>
                        </TableCell>

                        <TableCell>
                          <span className="text-gray-900">
                            {result.demo_date ? new Date(result.demo_date).toLocaleDateString() : 'N/A'}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="text-gray-900">{result.interviewer_name || 'N/A'}</span>
                        </TableCell>

                        <TableCell>
                          {getOverallAssessmentBadge(result)}
                        </TableCell>

                        <TableCell>
                          <Badge className={result.good_to_go === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {result.good_to_go === 'yes' ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-xs">
                              Email: <span className={result.confirmation_email_sent === 'yes' ? 'text-green-600' : 'text-red-600'}>
                                {result.confirmation_email_sent === 'yes' ? 'Sent' : 'Not Sent'}
                              </span>
                            </div>
                            <div className="text-xs">
                              Call: <span className={result.onboarding_call_made === 'yes' ? 'text-green-600' : 'text-red-600'}>
                                {result.onboarding_call_made === 'yes' ? 'Made' : 'Not Made'}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackResults;
