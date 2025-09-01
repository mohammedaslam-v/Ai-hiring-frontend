import { DAY_MAP, TIME_SLOT_KEYWORDS, PASS_SCORE_THRESHOLD } from '@/constants/admin/availabilityConstants';

/**
 * Get status badge configuration based on application and interview status
 */
export const getStatusBadgeConfig = (applicationStatus: string, interviewStatus?: string) => {
  if (interviewStatus === 'completed') {
    return { className: "bg-green-100 text-green-800", text: "Completed" };
  } else if (interviewStatus === 'failed') {
    return { className: "bg-red-100 text-red-800", text: "Failed" };
  } else if (interviewStatus === 'in_progress') {
    return { className: "bg-blue-100 text-blue-800", text: "In Progress" };
  } else if (interviewStatus === 'not_started') {
    return { className: "bg-gray-100 text-gray-800", text: "No Interview" };
  } else if (interviewStatus === 'left_midway') {
    return { className: "bg-yellow-100 text-yellow-800", text: "Left Midway" };
  } else if (applicationStatus === 'Submitted') {
    return { className: "bg-blue-100 text-blue-800", text: "Submitted" };
  } else if (applicationStatus === 'Pending') {
    return { className: "bg-gray-100 text-gray-800", text: "Pending" };
  } else if (applicationStatus === 'Under Review') {
    return { className: "bg-blue-100 text-blue-800", text: "Under Review" };
  } else if (applicationStatus === 'Approved') {
    return { className: "bg-green-100 text-green-800", text: "Approved" };
  } else if (applicationStatus === 'Rejected') {
    return { className: "bg-red-100 text-red-800", text: "Rejected" };
  } else if (applicationStatus === 'On Hold') {
    return { className: "bg-yellow-100 text-yellow-800", text: "On Hold" };
  } else {
    return { className: "", text: applicationStatus, variant: "outline" as const };
  }
};

/**
 * Format date string to localized string
 */
export const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

/**
 * Get formatted available days from availability array
 */
export const getAvailableDays = (availability: string[]) => {
  return availability.map(day => DAY_MAP[day.toLowerCase()] || day).join(', ');
};

/**
 * Get time slots from availability array
 */
export const getTimeSlots = (availability: string[]) => {
  const timeSlots = availability.filter(item => 
    TIME_SLOT_KEYWORDS.some(keyword => item.includes(keyword))
  );
  return timeSlots.length > 0 ? timeSlots.join(', ') : 'Not specified';
};

/**
 * Get score color class based on score value
 */
export const getScoreColorClass = (score: number) => {
  return score >= PASS_SCORE_THRESHOLD ? 'text-green-600' : 'text-red-600';
};

/**
 * Format duration from seconds to minutes
 */
export const formatDuration = (duration?: number | string) => {
  if (!duration) return 'N/A';
  const seconds = Number(duration);
  return `${Math.round(seconds / 60)} min`;
};

/**
 * Safely convert unknown value to string
 */
export const safeString = (value: unknown): string => {
  if (value === null || value === undefined) return 'N/A';
  return String(value);
};
