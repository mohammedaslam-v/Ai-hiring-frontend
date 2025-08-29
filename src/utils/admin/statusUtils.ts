export interface StatusConfig {
  className: string;
  text: string;
  variant?: 'outline';
}

/**
 * Get status badge configuration for application status
 */
export const getApplicationStatusConfig = (status: string): StatusConfig => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { className: "bg-gray-100 text-gray-800", text: "Pending" };
    case 'approved':
      return { className: "bg-green-100 text-green-800", text: "Approved" };
    case 'rejected':
      return { className: "bg-red-100 text-red-800", text: "Rejected" };
    case 'in_review':
      return { className: "bg-blue-100 text-blue-800", text: "In Review" };
    default:
      return { className: "", text: status, variant: "outline" };
  }
};

/**
 * Get status badge configuration for interview status
 */
export const getInterviewStatusConfig = (status: string): StatusConfig => {
  switch (status.toLowerCase()) {
    case 'completed':
      return { className: "bg-blue-100 text-blue-800", text: "Interviewed" };
    case 'failed':
      return { className: "bg-red-100 text-red-800", text: "Failed" };
    case 'in_progress':
      return { className: "bg-yellow-100 text-gray-800", text: "In Interview" };
    case 'scheduled':
      return { className: "bg-blue-100 text-blue-800", text: "Scheduled" };
    case 'cancelled':
      return { className: "bg-gray-100 text-gray-800", text: "Cancelled" };
    default:
      return { className: "", text: status, variant: "outline" };
  }
};

/**
 * Get combined status badge configuration for application and interview status
 */
export const getCombinedStatusConfig = (applicationStatus: string, interviewStatus?: string): StatusConfig => {
  // If there's an interview status, prioritize it
  if (interviewStatus) {
    return getInterviewStatusConfig(interviewStatus);
  }
  
  // Otherwise use application status
  return getApplicationStatusConfig(applicationStatus);
};
