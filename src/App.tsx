
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Index from "./pages/Index";
import CandidateLogin from "./pages/candidate/CandidateLogin";
import CandidateApplication from "./pages/candidate/CandidateApplication";
import CandidateInterview from "./pages/candidate/CandidateInterview";
import CandidateResult from "./pages/candidate/CandidateResult";
import SalaryStructure from "./pages/candidate/SalaryStructure";
import AssessmentSalaryStructure from "./pages/candidate/AssessmentSalaryStructure";
import SimplifiedSalaryStructure from "./pages/candidate/SimplifiedSalaryStructure";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplicationDetail from "./pages/admin/AdminApplicationDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useAnalytics();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/candidate/login" element={<CandidateLogin />} />
      <Route path="/candidate/application" element={<CandidateApplication />} />
      <Route path="/candidate/interview" element={<CandidateInterview />} />
      <Route path="/candidate/result" element={<CandidateResult />} />
      <Route path="/candidate/salary-structure" element={<SalaryStructure />} />
      <Route path="/candidate/assessment-salary-structure" element={<AssessmentSalaryStructure />} />
      <Route path="/candidate/simplified-salary-structure" element={<SimplifiedSalaryStructure />} />

      {/* <Route path="/admin/setup" element={<AuthSetup />} /> */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />



      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
