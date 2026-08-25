
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toastify.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CandidateLogin from "./pages/candidate/CandidateLogin";
import CandidateApplication from "./pages/candidate/CandidateApplication";
import DirectDemoApplication from "./pages/candidate/DirectDemoApplication";
import DirectDemoConfirmation from "./pages/candidate/DirectDemoConfirmation";
import CandidateInterview from "./pages/candidate/CandidateInterview";
import CandidateResult from "./pages/candidate/CandidateResult";
import ProcessingPage from "./pages/candidate/ProcessingPage";
import ResultsPage from "./pages/candidate/ResultsPage";
import SalaryStructure from "./pages/candidate/SalaryStructure";
import AssessmentSalaryStructure from "./pages/candidate/AssessmentSalaryStructure";
import SimplifiedSalaryStructure from "./pages/candidate/SimplifiedSalaryStructure";
import OnboardingForm from "./onboarding/OnboardingForm";
import AdminOnboarding from "./onboarding/AdminOnboarding";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminApplicationDetail from "./pages/admin/AdminApplicationDetail";
import AdminReports from "./pages/admin/AdminReports";
import TeacherJourney from "./pages/admin/TeacherJourney";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useAnalytics();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/candidate/login" element={<CandidateLogin />} />
      <Route path="/candidate/application" element={<CandidateApplication />} />
      <Route path="/direct-demo" element={<DirectDemoApplication />} />
      <Route path="/directdemo-success" element={<DirectDemoConfirmation />} />
      <Route path="/candidate/interview" element={<CandidateInterview />} />
      <Route path="/candidate/result" element={<CandidateResult />} />
      <Route path="/candidate/processing/:sessionId" element={<ProcessingPage />} />
      <Route path="/candidate/results" element={<ResultsPage />} />
      <Route path="/candidate/salary-structure" element={<SalaryStructure />} />
      <Route path="/candidate/assessment-salary-structure" element={<AssessmentSalaryStructure />} />
      <Route path="/candidate/simplified-salary-structure" element={<SimplifiedSalaryStructure />} />
      {/* Public onboarding form - link shared directly with a selected candidate */}
      <Route path="/complete-the-onboarding-form" element={<OnboardingForm />} />


//triggerre


      {/* <Route path="/admin/setup" element={<AuthSetup />} />   */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/applications" element={
        <ProtectedRoute>
          <AdminApplications />
        </ProtectedRoute>
      } />
      <Route path="/admin/applications/:id" element={
        <ProtectedRoute>
          <AdminApplicationDetail />
        </ProtectedRoute>
      } />
      <Route path="/admin/teacher-journey" element={
        <ProtectedRoute>
          <TeacherJourney />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute>
          <AdminReports />
        </ProtectedRoute>
      } />
      {/* Onboarding submissions - the backend further restricts these to
          allow-listed admin accounts (ONBOARDING_ADMIN_EMAILS). */}
      <Route path="/admin/onboarding" element={
        <ProtectedRoute>
          <AdminOnboarding />
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <ToastContainer
          position="top-center"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
