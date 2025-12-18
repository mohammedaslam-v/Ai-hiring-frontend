import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TeacherJourney,
  getDemoStatusLabel,
  getInductionLabel,
  getTrainingStatusLabel,
  getCertificationLabel,
  getGoLiveLabel,
  getSubjectLabel
} from '@/types/teacherJourney';
import { Edit, MessageSquare, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/admin/usePermissions';

interface TeacherJourneyTableProps {
  journeys: TeacherJourney[];
  loading: boolean;
  onEdit: (journey: TeacherJourney) => void;
  onDemoFeedback: (journey: TeacherJourney) => void;
  onDelete: (journey: TeacherJourney) => void;
}

const TeacherJourneyTable: React.FC<TeacherJourneyTableProps> = ({
  journeys,
  loading,
  onEdit,
  onDemoFeedback,
  onDelete
}) => {
  const { canDelete } = usePermissions();
  
  // Badge color helpers
  const getDemoStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      'PENDING': 'bg-gray-100 text-gray-700 border-gray-300',
      'SCHEDULED': 'bg-blue-100 text-blue-700 border-blue-300',
      'SELECTED': 'bg-green-100 text-green-700 border-green-300',
      'NOT_SELECTED': 'bg-red-100 text-red-700 border-red-300'
    };
    return classes[status] || classes['PENDING'];
  };

  const getInductionBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      'PENDING': 'bg-gray-100 text-gray-700 border-gray-300',
      'YES': 'bg-green-100 text-green-700 border-green-300',
      'NO': 'bg-red-100 text-red-700 border-red-300'
    };
    return classes[status] || classes['PENDING'];
  };

  const getTrainingBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      'NOT_JOINED': 'bg-gray-100 text-gray-700 border-gray-300',
      'JOINED': 'bg-blue-100 text-blue-700 border-blue-300',
      'INCOMPLETE': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'SHIFTED_TO_NEXT_WEEK': 'bg-orange-100 text-orange-700 border-orange-300',
      'DROPPED': 'bg-red-100 text-red-700 border-red-300',
      'COMPLETED': 'bg-green-100 text-green-700 border-green-300'
    };
    return classes[status] || classes['NOT_JOINED'];
  };

  const getCertificationBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      'PENDING': 'bg-gray-100 text-gray-700 border-gray-300',
      'CLEARED': 'bg-green-100 text-green-700 border-green-300',
      'NOT_CLEARED': 'bg-red-100 text-red-700 border-red-300'
    };
    return classes[status] || classes['PENDING'];
  };

  const getGoLiveBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      'PENDING': 'bg-gray-100 text-gray-700 border-gray-300',
      'YES': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'NEEDS_MORE_TRAINING': 'bg-orange-100 text-orange-700 border-orange-300'
    };
    return classes[status] || classes['PENDING'];
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Demo</TableHead>
              <TableHead>Induction</TableHead>
              <TableHead>Training</TableHead>
              <TableHead>Certification</TableHead>
              <TableHead>Go-Live</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (journeys.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No teacher journeys found</p>
        <p className="text-gray-400 text-sm mt-1">
          Teacher journeys will appear here when candidates pass the AI interview
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 min-w-[180px]">Name</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[200px]">Contact</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">Demo</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[90px]">Induction</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[120px]">Training</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">Certification</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[120px]">Go-Live</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">Subject</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journeys.map((journey, index) => (
              <TableRow 
                key={journey.id} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                {/* Name */}
                <TableCell>
                  <div className="font-medium text-gray-900">
                    {journey.firstName} {journey.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {journey.applicationId}
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="text-sm text-gray-900">{journey.email}</div>
                  <div className="text-xs text-gray-500">{journey.phoneNumber}</div>
                </TableCell>

                {/* Demo Status */}
                <TableCell className="text-center">
                  <Badge variant="outline" className={getDemoStatusBadgeClass(journey.demoStatus)}>
                    {getDemoStatusLabel(journey.demoStatus)}
                  </Badge>
                  {journey.demoDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(journey.demoDate)}
                    </div>
                  )}
                </TableCell>

                {/* Induction */}
                <TableCell className="text-center">
                  <Badge variant="outline" className={getInductionBadgeClass(journey.inductionAttendance)}>
                    {getInductionLabel(journey.inductionAttendance)}
                  </Badge>
                </TableCell>

                {/* Training */}
                <TableCell className="text-center">
                  <Badge variant="outline" className={getTrainingBadgeClass(journey.trainingStatus)}>
                    {getTrainingStatusLabel(journey.trainingStatus)}
                  </Badge>
                </TableCell>

                {/* Certification */}
                <TableCell className="text-center">
                  <Badge variant="outline" className={getCertificationBadgeClass(journey.certificationStatus)}>
                    {getCertificationLabel(journey.certificationStatus)}
                  </Badge>
                </TableCell>

                {/* Go-Live */}
                <TableCell className="text-center">
                  <Badge variant="outline" className={getGoLiveBadgeClass(journey.goLiveReadiness)}>
                    {getGoLiveLabel(journey.goLiveReadiness)}
                  </Badge>
                </TableCell>

                {/* Subject */}
                <TableCell className="text-center">
                  {journey.assignedSubject ? (
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                      {getSubjectLabel(journey.assignedSubject)}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDemoFeedback(journey)}
                      className="h-8 w-8 p-0"
                      title="Demo Feedback"
                    >
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(journey)}
                      className="h-8 w-8 p-0"
                      title="Edit Journey"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Button>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(journey)}
                        className="h-8 w-8 p-0"
                        title="Delete Journey"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeacherJourneyTable;

