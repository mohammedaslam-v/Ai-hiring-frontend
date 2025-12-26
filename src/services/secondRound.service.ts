export type SecondRoundMap = Record<string, { attended: 'Yes' | 'No'; scheduledDate: string | null }>;

export async function fetchSecondRoundStatus(emails: string[]): Promise<SecondRoundMap> {
  if (!emails.length) return {};
  const base = import.meta.env?.VITE_API_URL || '';
  const qs = encodeURIComponent(emails.join(','));
  try {
    const adminToken = localStorage.getItem('adminToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
    
    const res = await fetch(`${base}/api/admin/second-round/status?emails=${qs}`, {
      headers,
    });
    
    if (!res.ok) return {};
    const json = await res.json();
    return json.map || {};
  } catch {
    return {};
  }
}


