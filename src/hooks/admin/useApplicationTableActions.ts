import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

import { mapApplicationToCsvFormat, generateCsvFilename } from '@/utils/admin/applicationsTableUtils';
import AdminService from '@/services/admin.service';
import { AdminApplicationDetail } from '@/types/admin';

export const useApplicationTableActions = (onRefreshData?: () => void | Promise<void>) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingData, setExportingData] = useState(false);

  const handleDeleteApplication = async (applicationId: string, applicantName: string) => {
    try {
      setDeletingId(applicationId);
      console.log('🗑️ Deleting application:', applicationId);

      const adminService = new AdminService();
      const result = await adminService.deleteApplication(applicationId);
      if (!result.status) {
        toast({
          title: "Failed",
          description: result.message || "Failed to delete application",
          variant: "destructive"
        });
        return;
      }
      
      // Note: application_details is now a secure function, not a direct table
      // application_details data comes from applications + interview_sessions tables
      // So deleting from applications table handles the cleanup automatically
      console.log('Note: application_details is now a secure function, cleanup handled by applications table deletion');
      
      // Also check and delete from candidate_journey records via secure function if needed
      // Note: candidate_journey is now a secure function, not a direct table
      // The function will only return data for authenticated admins
      // TODO: Replace with Node.js API call when backend is ready
      console.log('Candidate journey check temporarily disabled - migrating to Node.js');

   
      toast({
        title: "Success",
        description: `Application for ${applicantName} has been deleted successfully.`
      });



      // Refresh the data
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (error) {
      console.error('❌ Error deleting application:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the application.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportToExcel = async (applications: AdminApplicationDetail[]) => {
    try {
      setExportingData(true);
      
      // Import CSV utilities
      const { generateCsvData, downloadCsv } = await import('@/utils/csvExport');
      
      // Map ApplicationDetail to CSV format
      const csvData = applications.map(mapApplicationToCsvFormat);
      
      const csvContent = generateCsvData(csvData);
      const filename = generateCsvFilename();
      downloadCsv(csvContent, filename);
      
      toast({
        title: "Export Successful",
        description: `${applications.length} applicant records exported successfully.`
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExportingData(false);
    }
  };

  return {
    deletingId,
    exportingData,
    handleDeleteApplication,
    handleExportToExcel
  };
};
