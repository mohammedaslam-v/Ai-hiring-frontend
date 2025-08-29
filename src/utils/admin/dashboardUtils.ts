import { DetailedStats } from '@/types/admin';

/**
 * Calculate detailed statistics from application data
 */
export const calculateDetailedStats = (pageData: any[]): DetailedStats => {
  const totalRegistered = pageData.length;

  // Interview participation stats (mock data)
  const totalStartedInterview = Math.floor(totalRegistered * 0.7); // 70% start rate
  const neverStartedInterview = totalRegistered - totalStartedInterview;

  // Interview completion stats (mock data)
  const totalCompletedInterview = Math.floor(totalStartedInterview * 0.8); // 80% completion rate

  // Left midway = started but not completed
  const totalLeftMidway = totalStartedInterview - totalCompletedInterview;

  // Pass/Fail from completed interviews (mock data)
  const totalPassed = Math.floor(totalCompletedInterview * 0.6); // 60% pass rate
  const totalFailed = totalCompletedInterview - totalPassed;

  // Calculate percentages
  const interviewStartRate = totalRegistered > 0 ? Math.round((totalStartedInterview / totalRegistered) * 100) : 0;
  const interviewCompletionRate = totalStartedInterview > 0 ? Math.round((totalCompletedInterview / totalStartedInterview) * 100) : 0;
  const passRate = totalCompletedInterview > 0 ? Math.round((totalPassed / totalCompletedInterview) * 100) : 0;
  const failRate = totalCompletedInterview > 0 ? Math.round((totalFailed / totalCompletedInterview) * 100) : 0;
  const leftMidwayRate = totalStartedInterview > 0 ? Math.round((totalLeftMidway / totalStartedInterview) * 100) : 0;

  return {
    totalRegistered,
    totalStartedInterview,
    totalCompletedInterview,
    totalLeftMidway,
    neverStartedInterview,
    totalPassed,
    totalFailed,
    interviewStartRate,
    interviewCompletionRate,
    passRate,
    failRate,
    leftMidwayRate
  };
};

/**
 * Map hook data to match component interfaces
 */
export const mapApplicationsToComponentFormat = (applications: any[]) => {
  return applications.map(app => ({
    id: app.id,
    name: `${app.firstName} ${app.lastName}`,
    firstName: app.firstName,
    lastName: app.lastName,
    email: app.email,
    phone: app.phone,
    position: app.position,
    status: app.status,
    createdAt: app.createdAt,
    applicationId: app.applicationId,
    // Add required properties for component interfaces
    subjects: [],
    additionalLanguages: [],
    availableDays: [],
    timeSlots: [],
    availability: [],
    application_status: app.status,
    application_date: app.createdAt,
    updatedAt: app.createdAt, // Use createdAt as updatedAt for mock data
    // Add optional properties with default values
    interview_status: undefined,
    score: undefined,
    interview_started: undefined,
    interview_completed: undefined,
    interview_scheduled: undefined,
    session_id: undefined,
    evaluation: undefined,
    strengths: undefined,
    areas_for_improvement: undefined,
    feedback: undefined,
    email_status: undefined,
  }));
};
