
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ExternalLink, Laptop } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DarkModeToggle from "@/components/DarkModeToggle";

interface InterviewResults {
  score: number;
  feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  status: string;
  interview_completed: boolean;
}

const CandidateResult = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const candidateName = localStorage.getItem('candidateName') || 'Candidate';
  const sessionId = localStorage.getItem('toughTongueSessionId');

  useEffect(() => {
    const loadResults = async () => {
      const applicationId = localStorage.getItem('applicationId');
      if (!applicationId) {
        setError('No application ID found. Please restart the application process.');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading results for application:', applicationId);
        
        // TODO: Replace with Node.js API call
        toast.info("Feature temporarily disabled - migrating to Node.js");
        setLoading(false);
        return;
        
      } catch (error: unknown) {
        console.error('Error loading results:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        setLoading(false);
        toast.error("Failed to load interview results. Please contact support.");
      }
    };

    loadResults();
    
    // Prevent going back
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, "", window.location.href);
    };
    
    return () => {
      window.onpopstate = null;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        {/* Dark Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bambinos-blue mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-bambinos-blue dark:text-bambinos-blue mb-2">Processing Your Interview</h3>
            <p className="text-gray-600 dark:text-gray-300">Analyzing your responses and generating evaluation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        {/* Dark Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Results</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        {/* Dark Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bambinos-blue mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-bambinos-blue dark:text-bambinos-blue mb-2">Results Not Ready</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Your interview results are still being processed. Please check back later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPassed = results.score >= 60;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-left mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
            </div>
            <h1 className="text-2xl font-bold text-bambinos-blue dark:text-bambinos-blue">Bambinos.live</h1>
          </div>
        </div>

        {/* Results Card */}
        <Card className="border-bambinos-blue/20 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 mb-6">
          <CardHeader className="text-center">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              isPassed ? 'bg-green-100 border border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-100 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              {isPassed ? 
                <CheckCircle className="h-10 w-10 text-green-600" /> : 
                <XCircle className="h-10 w-10 text-red-600" />
              }
            </div>
            <CardTitle className="text-3xl text-bambinos-blue dark:text-bambinos-blue mb-2">Interview Results</CardTitle>
            <CardDescription className="text-lg dark:text-gray-300">
              {candidateName}, here's your interview outcome
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 text-center">
            {/* Simple Pass/Fail Section */}
            <div className="text-center py-6">
              <Badge className={`text-lg px-4 py-2 ${
                isPassed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {isPassed ? 'PASSED' : 'NOT PASSED'}
              </Badge>
              {/* Final Total Score */}
              <p className="mt-4 text-base">
                <strong>Final Total Score:</strong>
                <span className={`ml-2 font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {results.score}%
                </span>
              </p>
              <div className="mt-8">
                {isPassed ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-medium text-green-700 dark:text-green-400 mb-3">🎉 Congratulations!</h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                        Welcome to the Bambinos.live family! We're excited to have you join our team of dedicated educators.
                      </p>
                      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 max-w-lg mx-auto">
                        <h4 className="font-semibold text-bambinos-blue dark:text-bambinos-blue mb-3">Your Next Step</h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Please schedule your final round interview to complete the hiring process.
                        </p>
                        
                        {/* Important Note about Laptop */}
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center justify-center text-blue-700 dark:text-blue-300 mb-2">
                            <Laptop className="h-4 w-4 mr-2" />
                            <span className="font-semibold text-sm">Important Note</span>
                          </div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            The Mock Demo must be conducted using a laptop only. Please ensure you have access to a laptop for your scheduled session.
                          </p>
                        </div>

                        {/* Program Selection Note */}
                        <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            <strong>Please note:</strong> Select one program as your primary subject of expertise and book only one demo session. If you're interested in teaching additional courses, you will be cross-trained in those programs later.
                          </p>
                        </div>

                        <Button 
                          onClick={() => window.open('https://book.bambinos.live/mock-demo', '_blank')}
                          className="bg-bambinos-blue hover:bg-bambinos-blue/90 text-white w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Schedule Final Round Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 max-w-lg mx-auto">
                    <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">Thank You for Your Interest</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      We appreciate your time and interest in joining Bambinos.live as an educator.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      While we won't be moving forward with your application at this time, we encourage you to continue developing your teaching skills and consider applying again in the future.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateResult;
