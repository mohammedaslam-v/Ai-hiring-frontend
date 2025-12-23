/**
 * List of approved interviewers for demo evaluations
 * Maintained as a constant for easy updates
 */
export const INTERVIEWERS = [
  'Sabreena J',
  'Monika Mittal',
  'Jas Johari',
  'Kanishka C',
  'Swagata G',
  'Mirduta G',
  'Navjot',
  'Harshul',
  'Rupa Chaki',
  'Chinoo Sethi',
  'Supriya D',
  'Kirti Mathur',
  'Aiswarya B',
  'Grizel G',
  'Sonia Azevado',
  'Tanya G'
] as const;

/**
 * Type for interviewer name
 */
export type InterviewerName = typeof INTERVIEWERS[number];

/**
 * Helper function to check if a name is a valid interviewer
 */
export function isValidInterviewer(name: string): name is InterviewerName {
  return INTERVIEWERS.includes(name as InterviewerName);
}

/**
 * Get sorted list of interviewers (alphabetically)
 */
export function getSortedInterviewers(): readonly string[] {
  return [...INTERVIEWERS].sort((a, b) => a.localeCompare(b));
}

