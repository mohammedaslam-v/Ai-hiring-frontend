import React from 'react';
import ApplicationsManagement from "@/components/admin/ApplicationsManagement";

export default function AdminApplications() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-8">
        <ApplicationsManagement />
      </div>
    </div>
  );
}
