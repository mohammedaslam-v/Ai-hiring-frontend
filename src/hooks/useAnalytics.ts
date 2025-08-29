
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackPageVisit } from '@/utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route changes
    trackPageView(location.pathname, document.title);
    trackPageVisit(location.pathname);
  }, [location]);

  return {
    trackPageView,
    trackPageVisit,
  };
};
