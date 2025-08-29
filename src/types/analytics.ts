// Analytics related interfaces and types
export interface TrendsPoint {
  date: string;
  applications: number;
  interviews: number;
  approvals: number;
}

export interface ApplicantLike {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  userId: string;
  userEmail: string;
  targetType: string;
  targetId: string;
  details: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ExportFilters {
  status?: string;
  subject?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
}

export interface FeedbackResult {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  good_to_go: string;
  demo_status: string;
  demo_date: string;
  interviewer_name: string;
  lesson_clarity: string;
  student_engagement: string;
  language_communication: string;
  teaching_aids: string;
  creativity_delivery: string;
  grammar_pronunciation: string;
  feedback: string;
  confirmation_email_sent: string;
  onboarding_call_made: string;
  remarks: string;
  created_at: string;
}

// Audit log interface
export interface AuditLog {
  id: string;
  created_at: string;
  actor: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
}
