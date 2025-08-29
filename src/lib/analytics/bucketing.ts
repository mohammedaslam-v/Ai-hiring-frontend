
export interface TrendsPoint {
  date: string; // YYYY-MM-DD
  registered: number;
  started: number;
  completed: number;
  passed: number;
  failed: number;
}

interface ApplicantLike {
  application_date_iso?: string;
  session_id?: string | null;
  interview_status?: string | null;
  score?: number | null;
}

export const buildDailyTrends = (applicants: ApplicantLike[]): TrendsPoint[] => {
  const byDate = new Map<string, TrendsPoint>();

  for (const a of applicants) {
    const d = a.application_date_iso || '';
    if (!d) continue;
    if (!byDate.has(d)) {
      byDate.set(d, { date: d, registered: 0, started: 0, completed: 0, passed: 0, failed: 0 });
    }
    const row = byDate.get(d)!;
    row.registered += 1;
    if (a.session_id) row.started += 1;
    if (a.interview_status === 'completed' || a.interview_status === 'failed') row.completed += 1;
    if (a.interview_status === 'completed' && (a.score || 0) >= 60) row.passed += 1;
    if (a.interview_status === 'failed' || (a.interview_status === 'completed' && (a.score || 0) < 60)) row.failed += 1;
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
};
