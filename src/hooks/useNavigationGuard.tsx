import { useEffect, useCallback } from "react";

/**
 * Prevents accidental navigation (refresh/close/tab change or internal route change)
 * while `when` is true. Uses native beforeunload for hard navigations and
 * React Router blocker for SPA navigations.
 */
export function useNavigationGuard(
  when: boolean,
  message = "You have ongoing progress. Are you sure you want to leave?"
) {
  // Browser refresh/close/tab close guard
  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required by Chrome to show confirmation dialog
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when]);

  // Internal navigation guard for SPA navigations (anchor clicks and back/forward)
  const confirmNav = useCallback(() => {
    return window.confirm(message);
  }, [message]);

  useEffect(() => {
    if (!when) return;

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      // ignore anchors with target _blank or download
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      // Same-origin check (simple): block only internal links
      const isExternal = /^(https?:)?\/\//i.test(href) && !href.startsWith(window.location.origin);
      if (isExternal) return;
      if (!confirmNav()) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const popstateHandler = () => {
      if (!confirmNav()) {
        // Revert the navigation
        history.go(1);
      }
    };

    document.addEventListener('click', clickHandler, true);
    window.addEventListener('popstate', popstateHandler);

    return () => {
      document.removeEventListener('click', clickHandler, true);
      window.removeEventListener('popstate', popstateHandler);
    };
  }, [when, confirmNav]);
}


