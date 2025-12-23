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
import { getStatusBadgeColors } from '@/constants/teacherJourney/colors';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  // Check if user is hire@bambinos.live
  const isHireEmail = user?.email === 'hire@bambinos.live';
  
  // Badge color helpers using new color scheme
  const getDemoStatusBadgeClass = (status: string): string => {
    const colors = getStatusBadgeColors(status);
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  const getInductionBadgeClass = (status: string): string => {
    const colors = getStatusBadgeColors(status);
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  const getTrainingBadgeClass = (status: string): string => {
    const colors = getStatusBadgeColors(status);
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  const getCertificationBadgeClass = (status: string): string => {
    const colors = getStatusBadgeColors(status);
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  const getGoLiveBadgeClass = (status: string): string => {
    const colors = getStatusBadgeColors(status);
    return `${colors.bg} ${colors.text} ${colors.border}`;
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
      <div className="border rounded-xl p-8 text-center">
        <p className="text-[hsl(214,100%,15%,0.6)] text-lg">No teacher journeys found</p>
        <p className="text-[hsl(214,100%,15%,0.4)] text-sm mt-1">
          Teacher journeys will appear here when candidates pass the AI interview
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F4F6FA]">
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] min-w-[180px]">Name</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] min-w-[200px]">Contact</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] text-center min-w-[100px]">Demo</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] text-center min-w-[90px]">Induction</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] text-center min-w-[120px]">Training</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] text-center min-w-[100px]">Certification</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] text-center min-w-[120px]">Go-Live</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] text-center min-w-[100px]">Subject</TableHead>
              <TableHead className="font-semibold text-[hsl(214,100%,15%)] text-center min-w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journeys.map((journey, index) => (
              <TableRow 
                key={journey.id} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F4F6FA]'} hover:bg-[#1E62F2]/5 transition-colors`}
              >
                {/* Name */}
                <TableCell>
                  <div className="font-medium text-[hsl(214,100%,15%)]">
                    {journey.firstName} {journey.lastName}
                  </div>
                  <div className="text-xs text-[hsl(214,100%,15%,0.6)]">
                    ID: {journey.applicationId}
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="text-sm text-[hsl(214,100%,15%)]">{journey.email}</div>
                  <div className="text-xs text-[hsl(214,100%,15%,0.6)]">{journey.phoneNumber}</div>
                </TableCell>

                {/* Demo Status */}
                <TableCell className="text-center">
                <Badge variant="outline" className={`${getDemoStatusBadgeClass(journey.demoStatus)} rounded-xl`}>
                  {getDemoStatusLabel(journey.demoStatus)}
                </Badge>
                  {journey.demoDate && (
                    <div className="text-xs text-[hsl(214,100%,15%,0.6)] mt-1">
                      {formatDate(journey.demoDate)}
                    </div>
                  )}
                </TableCell>

                {/* Induction */}
                <TableCell className="text-center">
                <Badge variant="outline" className={`${getInductionBadgeClass(journey.inductionAttendance)} rounded-xl`}>
                  {getInductionLabel(journey.inductionAttendance)}
                </Badge>
                </TableCell>

                {/* Training */}
                <TableCell className="text-center">
                <Badge variant="outline" className={`${getTrainingBadgeClass(journey.trainingStatus)} rounded-xl`}>
                  {getTrainingStatusLabel(journey.trainingStatus)}
                </Badge>
                </TableCell>

                {/* Certification */}
                <TableCell className="text-center">
                <Badge variant="outline" className={`${getCertificationBadgeClass(journey.certificationStatus)} rounded-xl`}>
                  {getCertificationLabel(journey.certificationStatus)}
                </Badge>
                </TableCell>

                {/* Go-Live */}
                <TableCell className="text-center">
                <Badge variant="outline" className={`${getGoLiveBadgeClass(journey.goLiveReadiness)} rounded-xl`}>
                  {getGoLiveLabel(journey.goLiveReadiness)}
                </Badge>
                </TableCell>

                {/* Subject */}
                <TableCell className="text-center">
                  {journey.assignedSubject ? (
                    <Badge variant="outline" className="bg-[hsl(217,91%,60%,0.1)] text-[hsl(217,91%,60%)] border-[hsl(217,91%,60%)] rounded-xl">
                      {getSubjectLabel(journey.assignedSubject)}
                    </Badge>
                  ) : (
                    <span className="text-[hsl(214,100%,15%,0.4)] text-sm">-</span>
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
                      <MessageSquare className="h-4 w-4 text-[#1E62F2]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(journey)}
                      className="h-8 w-8 p-0"
                      title="Edit Journey"
                    >
                      <Edit className="h-4 w-4 text-[hsl(214,100%,15%,0.6)]" />
                    </Button>
                    {canDelete && !isHireEmail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(journey)}
                        className="h-8 w-8 p-0"
                        title="Delete Journey"
                      >
                        <Trash2 className="h-4 w-4 text-[hsl(0,84%,60%)]" />
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

