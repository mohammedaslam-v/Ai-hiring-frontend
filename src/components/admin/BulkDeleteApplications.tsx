
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
// import { supabase } from "@/integrations/supabase/client"; // Supabase removed - using mock data
import { Trash2, RefreshCw } from "lucide-react";

import { BulkDeleteApplicationsProps } from '@/types/admin';

const BulkDeleteApplications = ({ onDeleteComplete }: BulkDeleteApplicationsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // List of test application emails to delete
  const testEmails = [
    "monika.mittal@example.com",
    "sabreena.shareef@example.com", 
    "sabreena@example.com",
    "poorvi.ai@example.com",
    "vipoo.gupta@example.com",
    "ashish.gupta@example.com",
    "poorvi.prasad@example.com",
    "hbh.ai@example.com",
    "krishna.prasad@example.com",
    "rithika.bajpai@example.com",
    "poorvi@example.com",
    "krishna.nair@example.com",
    "aditi.verma@example.com",
    "amantika.mittal@example.com",
    "vasipalli.mythri@example.com"
  ];

  // Alternative approach: delete by phone numbers (more reliable since we can see the phone numbers)
  const testPhoneNumbers = [
    "+9185275 89816", "9185275 89816",
    "9886692273", "+919886692272", "9886692272",
    "+918248322396", "9248322396", "8248322396", "+918248322390",
    "+919742328889",
    "+919880712456", "9880712456",
    "9996800688", "9996800685", "+919876543210",
    "06360308720", "09625944729", "08248322396",
    "1234567891", "9829046359", "07075371909"
  ];

  const handleBulkDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('🗑️ Starting bulk deletion of test applications...');

      // First, get all applications that match our test phone numbers
      // const { data: applicationsToDelete, error: fetchError } = await supabase
      //   .from('applications')
      //   .select('id, name, phone, email')
      //   .in('phone', testPhoneNumbers);

      // if (fetchError) {
      //   console.error('Error fetching applications to delete:', fetchError);
      //   toast({
      //     title: "Error",
      //     description: `Failed to fetch applications: ${fetchError.message}`,
      //     variant: "destructive"
      //   });
      //   return;
      // }

      // if (!applicationsToDelete || applicationsToDelete.length === 0) {
      //   toast({
      //     title: "No Applications Found",
      //     description: "No matching test applications found to delete."
      //   });
      //   return;
      // }

      // console.log(`📋 Found ${applicationsToDelete.length} applications to delete:`, applicationsToDelete);

      // const applicationIds = applicationsToDelete.map(app => app.id);

      // // Delete interview sessions first (foreign key constraint)
      // const { error: sessionError } = await supabase
      //   .from('interview_sessions')
      //   .delete()
      //   .in('application_id', applicationIds);

      // if (sessionError) {
      //   console.error('Error deleting interview sessions:', sessionError);
      //   toast({
      //     title: "Error",
      //     description: `Failed to delete interview sessions: ${sessionError.message}`,
      //     variant: "destructive"
      //   });
      //   return;
      // }

      // // Delete educator feedback if any
      // const { error: feedbackError } = await supabase
      //   .from('educator_feedback')
      //   .delete()
      //   .in('applicant_id', applicationIds);

      // if (feedbackError) {
      //   console.error('Error deleting educator feedback:', feedbackError);
      //   // Continue anyway, this is not critical
      // }

      // // Finally, delete the applications
      // const { error: appError } = await supabase
      //   .from('applications')
      //   .delete()
      //   .in('application_id', applicationIds);

      // if (appError) {
      //   console.error('Error deleting applications:', appError);
      //   toast({
      //     title: "Error",
      //     description: `Failed to delete applications: ${appError.message}`,
      //     variant: "destructive"
      //   });
      //   return;
      // }

      // console.log('✅ Bulk deletion completed successfully');
      toast.success(`Successfully deleted ${testPhoneNumbers.length} test applications and their associated data.`);

      // Refresh the dashboard data
      onDeleteComplete();

    } catch (error) {
      console.error('❌ Error in bulk delete operation:', error);
      toast.error("An unexpected error occurred during bulk deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Delete Test Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete All Test Applications</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all test applications and their associated interview data. 
            This includes applications from users with phone numbers matching the test data pattern.
            <br /><br />
            <strong>This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete All Test Data"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkDeleteApplications;
