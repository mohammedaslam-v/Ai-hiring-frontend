export type SecondRoundMap = Record<string, { attended: 'Yes' | 'No'; scheduledDate: string | null }>;

export async function fetchSecondRoundStatus(emails: string[]): Promise<SecondRoundMap> {
  if (!emails.length) return {};
  const base = import.meta.env?.VITE_API_URL || '';
  const qs = encodeURIComponent(emails.join(','));
  try {
    const res = await fetch(`${base}/api/admin/second-round/status?emails=${qs}`);
    if (!res.ok) return {};
    const json = await res.json();
    return json.map || {};
  } catch {
    return {};
  }
}


