import { DetailedStats } from '@/types/admin';

/**
 * Calculate detailed statistics from real API data
 * This function now returns empty stats as we use real data from the dashboard API
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateDetailedStats = (pageData: any[]): DetailedStats => {
  // Return empty stats - real data comes from dashboard API
  return {
    totalRegistered: 0,
    totalStartedInterview: 0,
    totalCompletedInterview: 0,
    totalLeftMidway: 0,
    neverStartedInterview: 0,
    totalPassed: 0,
    totalFailed: 0,
    interviewStartRate: 0,
    interviewCompletionRate: 0,
    passRate: 0,
    failRate: 0,
    leftMidwayRate: 0
  };
};

/**
 * Map hook data to match component interfaces
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApplicationsToComponentFormat = (applications: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return applications.map((app: any) => ({
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
