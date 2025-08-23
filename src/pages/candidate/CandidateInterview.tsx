import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Video, Clock, CheckCircle, Square, AlertTriangle, Play, Eye, Camera, Mic, MapPin } from "lucide-react";
import { toast } from 'react-toastify';
import WhatsAppHelpButton from "@/components/candidate/WhatsAppHelpButton";

const CandidateInterview = () => {
  const [interviewStatus, setInterviewStatus] = useState<"loading" | "video-required" | "ready" | "in-progress" | "completed">("loading");
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [interviewSessionId, setInterviewSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get user info from localStorage
  const candidateName = localStorage.getItem('candidateName') || 'Candidate Name';
  const candidateEmail = localStorage.getItem('candidateEmail') || 'candidate@email.com';
  const applicationId = localStorage.getItem('applicationId');

  // Check if we have all required data
  useEffect(() => {
    if (!applicationId) {
      // Admin testing mode - check if we're coming from admin dashboard
      const currentPath = window.location.pathname;
      const referer = document.referrer;
      const isAdminTesting = currentPath.includes('/candidate/interview') && 
                           (referer.includes('/admin') || referer.includes('admin'));
      
      if (isAdminTesting) {
        localStorage.setItem('applicationId', 'admin-test-id');
        localStorage.setItem('candidateName', 'Admin Test User');
        localStorage.setItem('candidateEmail', 'admin@test.com');
        setInterviewStatus("video-required");
        return;
      }
      
      toast.error("Please complete the application first.");
      navigate('/candidate/application');
      return;
    }
    
    setInterviewStatus("video-required");
  }, [applicationId, candidateName, candidateEmail, navigate]);

  // Timer effect for tracking video duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (videoStarted && !videoWatched && interviewStatus === "video-required") {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoStarted, videoWatched, interviewStatus]);

  const handleVideoPlay = () => {
    setVideoStarted(true);
    toast.info("Please watch the complete video to proceed with the interview.");
  };

  const handleVideoEnd = () => {
    setVideoWatched(true);
    toast.success("You can now proceed to the AI interview.");
  };

  const handleInterviewStart = async () => {
    try {
      // Mock interview session creation (no database calls)
      const mockSessionId = crypto.randomUUID();
      setInterviewSessionId(mockSessionId);
      setInterviewStatus("in-progress");
      
      // Store session info in localStorage for tracking
      localStorage.setItem('currentInterviewSession', JSON.stringify({
        id: mockSessionId,
        startedAt: new Date().toISOString(),
        status: 'in-progress',
        applicationId: applicationId
      }));
      
      toast.success("Your AI interview session has begun. Good luck!");
      
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error("There was an error starting your interview. Please try again.");
    }
  };

  const handleInterviewComplete = async (resultData: { score?: number; sessionId?: string; status?: string } = {}) => {
    try {
      // Mock interview completion (no database calls)
      setInterviewStatus("completed");
      
      // Store mock result in localStorage
      localStorage.setItem('interviewResult', JSON.stringify({
        sessionId: interviewSessionId,
        score: resultData?.score || 85,
        completedAt: new Date().toISOString(),
        status: 'completed'
      }));
      
      toast.success("Congratulations! Your interview has been completed successfully.");
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate('/candidate/result');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error("There was an error completing your interview. Please try again.");
    }
  };

  const handleEndInterview = () => {
    try {
      // Update session status in localStorage
      const currentSession = localStorage.getItem('currentInterviewSession');
      if (currentSession) {
        const sessionData = JSON.parse(currentSession);
        sessionData.status = 'completed';
        sessionData.completedAt = new Date().toISOString();
        localStorage.setItem('currentInterviewSession', JSON.stringify(sessionData));
      }
      
      setInterviewStatus("completed");
      
      toast.info("Your interview session has been completed. Processing results...");
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate('/candidate/result');
      }, 3000);
      
    } catch (error) {
      console.error('Error ending interview:', error);
      toast.error("There was an error ending your interview. Please try again.");
    }
  };

  const handleSkipVideo = () => {
    setVideoWatched(true);
    toast.info("You can now proceed to the AI interview.");
  };

  const handleProceedToInterview = () => {
    if (!videoWatched) {
      toast.error("Please watch the complete video before proceeding.");
      return;
    }
    
    setInterviewStatus("ready");
    toast.info("You can now begin your AI interview session.");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (interviewStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Interview...</h2>
        </div>
      </div>
    );
  }

  // Video required state - EXACTLY as shown in your first image
  if (interviewStatus === "video-required") {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info - EXACTLY as shown */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs">
            <p><strong>Debug:</strong> Application ID: {applicationId || 'Not found'}</p>
            <p><strong>Interview Session ID:</strong> {interviewSessionId || 'Not created'}</p>
            <p><strong>Candidate:</strong> {candidateName} ({candidateEmail})</p>
            <p><strong>Video Status:</strong> {videoWatched ? 'Completed' : videoStarted ? 'In Progress' : 'Not Started'}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-blue-600/20 p-12">
            {/* Mandatory Video Section - EXACTLY as shown */}
            <div className="text-center mb-12">
              <div className="mx-auto w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border-2 border-red-200">
                <Play className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">Mandatory Instructions Video</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                <strong>IMPORTANT:</strong> You MUST watch this complete instructional video before proceeding to the AI interview. 
                This video contains essential guidelines that will help you succeed in your interview.
              </p>
              
              {/* Video Alert Box - EXACTLY as shown */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Required Before Interview</h4>
                    <ul className="text-red-700 space-y-1">
                      <li>• Watch the complete video (no skipping allowed)</li>
                      <li>• Take notes of important instructions</li>
                      <li>• Ensure you understand all guidelines</li>
                      <li>• Only then you can proceed to the AI interview</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* YouTube Video Embed - EXACTLY as shown */}
              <div className="relative w-full max-w-4xl mx-auto mb-8">
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg border-2 border-blue-600/20">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/Ey0Gey_Y2lI?rel=0&modestbranding=1&showinfo=0"
                    title="Interview Instructions Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoPlay}
                  ></iframe>
                </div>
              </div>

              {/* Video Status Indicators - EXACTLY as shown */}
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className={`flex items-center space-x-2 ${videoStarted ? 'text-blue-600' : 'text-gray-400'}`}>
                  <Eye className="h-5 w-5" />
                  <span className="font-medium">Video Started</span>
                  {videoStarted && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                <div className={`flex items-center space-x-2 ${videoWatched ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Video Completed</span>
                  {videoWatched && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
              </div>

              {/* Manual Completion Checkbox - EXACTLY as shown */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <input
                    type="checkbox"
                    id="videoCompleted"
                    checked={videoWatched}
                    onChange={(e) => setVideoWatched(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600"
                  />
                  <label htmlFor="videoCompleted" className="text-gray-700 font-medium">
                    I have watched the complete instructional video and understand all guidelines
                  </label>
                </div>
              </div>

              {/* Proceed Button - EXACTLY as shown */}
              <Button 
                onClick={handleProceedToInterview}
                disabled={!videoWatched}
                className={`px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                  videoWatched 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {videoWatched ? 'Proceed to AI Interview Setup' : 'Complete Video First'}
              </Button>
            </div>
          </div>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Ready state - EXACTLY as shown in your second and third images
  if (interviewStatus === "ready") {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs">
            <p><strong>Debug:</strong> Application ID: {applicationId || 'Not found'}</p>
            <p><strong>Interview Session ID:</strong> {interviewSessionId || 'Not created'}</p>
            <p><strong>Candidate:</strong> {candidateName} ({candidateEmail})</p>
            <p><strong>Video Status:</strong> Completed</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-blue-600/20 p-12">
            {/* AI Interview Setup Header - EXACTLY as shown */}
            <div className="text-center mb-12">
              <div className="mx-auto w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 border-2 border-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">AI Interview Setup</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Prepare for your AI-powered interview experience. Ensure you're in an optimal 
                environment for the best results.
              </p>
            </div>

            {/* Access Requirements - EXACTLY as shown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 border border-orange-300">
                  <Camera className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Camera Access</h3>
                <p className="text-gray-600 text-sm">
                  Enable high-quality video recording for visual assessment
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 border border-blue-200">
                  <Mic className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Microphone Access</h3>
                <p className="text-gray-600 text-sm">
                  Enable crystal-clear audio recording for speech analysis
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 border border-red-300">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Secure Environment</h3>
                <p className="text-gray-600 text-sm">
                  Quiet space with stable internet connection
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-600">Interview Guidelines</h3>
              </div>
              
              {/* Highlighted Important Points - EXACTLY as shown */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start space-x-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-amber-800 mb-2">Critical Requirements</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-amber-700 font-medium">Please make sure you are in a quiet place without any disturbance</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-amber-700 font-medium">Listen to the questions carefully and take your time to think before answering</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">The interview will last approximately 10 minutes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">You'll be asked about your teaching experience and methods</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">You may be asked to read or discuss the passage below</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Speak naturally and authentically - be yourself</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Maintain eye contact with the camera</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-orange-600 font-medium">Wait for the interview to complete fully before clicking 'Stop Interview' - only click after the AI analysis is done</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-red-600 font-medium">You cannot re-attempt this interview once completed</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={handleInterviewStart} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg">
                Begin AI Interview
              </Button>
            </div>
          </div>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Interview in progress state - EXACTLY as shown in your fourth image
  if (interviewStatus === "in-progress") {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-blue-600/20 shadow-xl bg-white">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Recording</span>
                <div className="flex items-center text-blue-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeElapsed)}
                </div>
              </div>
              <CardTitle className="text-2xl text-blue-600">Interview in Progress</CardTitle>
              <CardDescription>
                Candidate: {candidateName} ({candidateEmail})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                {/* ToughTongue AI Interface - EXACTLY as shown */}
                <div className="w-full h-[700px] bg-black rounded-lg border border-blue-600/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">bambinos.live Hiring</h2>
                    
                    {/* Your Task Button */}
                    <div className="bg-gray-800 px-6 py-3 rounded-lg flex items-center space-x-2 mb-8">
                      <span className="text-gray-300">Your task</span>
                      <div className="w-4 h-4 border-l-2 border-b-2 border-white transform rotate-45"></div>
                    </div>
                    
                    {/* Control Buttons */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <Mic className="h-5 w-5 text-white" />
                      </div>
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">⋯</span>
                      </div>
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <Square className="h-5 w-5 text-white" />
                      </div>
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-2">
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                      powered by Tough Tongue AI
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Important Instructions - EXACTLY as shown */}
              <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-700 mb-3">Important Instructions</h3>
                <div className="text-orange-600 font-medium space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600">✅</span>
                    <p><strong>Be in a quiet place</strong> with <strong>no background noise</strong> before starting.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">▶️</span>
                    <p><strong>Click "Your Task"</strong> to begin reading <strong>only when instructed by the AI</strong>.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-600">⏳</span>
                    <div>
                      <p><strong>Wait for the message</strong>:</p>
                      <p className="ml-4 font-bold">"Session Completed. Thank you for completing this session!"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-600">🚫</span>
                    <div>
                      <p><strong>Do NOT click "End Interview"</strong> before this message appears.</p>
                      <p className="ml-4">Doing so will <strong>make you ineligible</strong> for the next step.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleEndInterview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  End Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  // Interview completed state
  if (interviewStatus === "completed") {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Bambinos.live</h1>
              <div className="ml-auto">
                <div className="w-8 h-8 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">☀</span>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-blue-600/20 shadow-xl bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 border border-yellow-300">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl text-blue-600">Interview Completed!</CardTitle>
              <CardDescription>
                Processing your responses and generating evaluation...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">This may take a few moments</p>
            </CardContent>
          </Card>
        </div>
        <WhatsAppHelpButton />
      </div>
    );
  }

  return null;
};

export default CandidateInterview;
