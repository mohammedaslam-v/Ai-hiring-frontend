
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList, LogOut, Mail } from "lucide-react";
import BulkDeleteApplications from "@/components/admin/BulkDeleteApplications";
import { AdminHeaderProps } from '@/types/admin';
import { useOnboardingAccess } from "@/onboarding/useOnboardingAccess";

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();
  // Only the admins the backend allows see this entry point.
  const canViewOnboarding = useOnboardingAccess();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-bambinos-blue/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-bambinos-blue rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-bambinos-blue">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Bambinos.live Management Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">

            {canViewOnboarding && (
              <Button
                onClick={() => navigate('/admin/onboarding')}
                className="bg-bambinos-blue text-white hover:bg-bambinos-blue-dark"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Onboarding
              </Button>
            )}

            <Button
              onClick={onLogout}
              variant="outline"
              className="border-bambinos-blue text-bambinos-blue hover:bg-bambinos-blue hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
