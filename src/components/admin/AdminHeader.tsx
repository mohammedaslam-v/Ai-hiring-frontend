
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, Mail } from "lucide-react";
import BulkDeleteApplications from "@/components/admin/BulkDeleteApplications";
import { AdminHeaderProps } from '@/types/admin';

const AdminHeader = ({ onLogout, onOpenBulkEmail, onDeleteComplete }: AdminHeaderProps) => {
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
            <Button 
              onClick={onOpenBulkEmail}
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Bulk Email
            </Button>
            <BulkDeleteApplications onDeleteComplete={onDeleteComplete} />
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
