// Onboarding module - "may this admin see onboarding submissions?"
//
// The allow-list lives in the backend's environment, so rather than copying it
// into the frontend (where it would drift), this asks the server directly with
// the cheapest possible request. A 403 simply means "hide the entry point".

import { useEffect, useState } from 'react';
import { onboardingAdminService } from './onboarding.admin.service';

export function useOnboardingAccess(): boolean {
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // limit: 1 - we only care about the status code, not the rows.
    onboardingAdminService
      .listSubmissions({ page: 1, limit: 1, search: '' })
      .then(response => {
        if (!cancelled) setCanView(response.status === true);
      });

    return () => { cancelled = true; };
  }, []);

  return canView;
}
