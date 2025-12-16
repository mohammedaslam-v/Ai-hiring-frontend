import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeacherJourney } from '@/hooks/admin/useTeacherJourney';
import { TeacherJourney as TeacherJourneyType, SubmitDemoFeedbackData, UpdateTeacherJourneyData } from '@/types/teacherJourney';
import TeacherJourneyStats from '@/components/admin/teacher-journey/TeacherJourneyStats';
import TeacherJourneyFilters from '@/components/admin/teacher-journey/TeacherJourneyFilters';
import TeacherJourneyTable from '@/components/admin/teacher-journey/TeacherJourneyTable';
import DemoFeedbackModal from '@/components/admin/teacher-journey/DemoFeedbackModal';
import UpdateJourneyModal from '@/components/admin/teacher-journey/UpdateJourneyModal';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

const TeacherJourneyPage: React.FC = () => {
  const { handleLogout } = useAdminAuth();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  
  const {
    journeys,
    stats,
    total,
    loading,
    statsLoading,
    error,
    filters,
    pagination,
    isFiltered,
    updateFilters,
    updatePage,
    updatePageSize,
    toggleSortOrder,
    resetFilters,
    refreshJourneys,
    refreshStats,
    updateJourney,
    submitDemoFeedback,
    deleteJourney,
    clearError
  } = useTeacherJourney();

  // Modal state
  const [selectedJourney, setSelectedJourney] = useState<TeacherJourneyType | null>(null);
  const [isDemoFeedbackOpen, setIsDemoFeedbackOpen] = useState(false);
  const [isUpdateJourneyOpen, setIsUpdateJourneyOpen] = useState(false);

  // Handlers
  const handleDemoFeedback = (journey: TeacherJourneyType) => {
    setSelectedJourney(journey);
    setIsDemoFeedbackOpen(true);
  };

  const handleEdit = (journey: TeacherJourneyType) => {
    setSelectedJourney(journey);
    setIsUpdateJourneyOpen(true);
  };

  const handleDelete = async (journey: TeacherJourneyType) => {
    const confirmed = await confirm({
      title: "Delete Teacher Journey",
      description: `Are you sure you want to delete the journey for ${journey.firstName} ${journey.lastName}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive"
    });

    if (confirmed) {
      await deleteJourney(journey.id);
    }
  };

  const handleSubmitDemoFeedback = async (data: SubmitDemoFeedbackData): Promise<boolean> => {
    return await submitDemoFeedback(data);
  };

  const handleUpdateJourney = async (id: number, data: UpdateTeacherJourneyData): Promise<boolean> => {
    return await updateJourney(id, data);
  };

  const handleRefresh = () => {
    refreshJourneys();
    refreshStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30">
      <AdminHeader onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teacher Journey Tracking</h1>
            <p className="text-gray-500 mt-1">
              Track candidates from AI interview to go-live
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <TeacherJourneyStats stats={stats} loading={statsLoading} />

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-600">
              All Teacher Journeys
              {total > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({total} total)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <TeacherJourneyFilters
              filters={filters}
              onUpdateFilters={updateFilters}
              onResetFilters={resetFilters}
              onToggleSortOrder={toggleSortOrder}
              isFiltered={isFiltered}
            />

            {/* Table */}
            <TeacherJourneyTable
              journeys={journeys}
              loading={loading}
              onEdit={handleEdit}
              onDemoFeedback={handleDemoFeedback}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {total > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <Select
                      value={filters.limit?.toString() || '10'}
                      onValueChange={(value) => updatePageSize(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-sm text-gray-600">
                    Showing {pagination.startIndex}-{pagination.endIndex} of {total}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePage(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePage(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <DemoFeedbackModal
        isOpen={isDemoFeedbackOpen}
        onClose={() => {
          setIsDemoFeedbackOpen(false);
          setSelectedJourney(null);
        }}
        journey={selectedJourney}
        onSubmit={handleSubmitDemoFeedback}
      />

      <UpdateJourneyModal
        isOpen={isUpdateJourneyOpen}
        onClose={() => {
          setIsUpdateJourneyOpen(false);
          setSelectedJourney(null);
        }}
        journey={selectedJourney}
        onSubmit={handleUpdateJourney}
      />

      <ConfirmDialog />
    </div>
  );
};

export default TeacherJourneyPage;

