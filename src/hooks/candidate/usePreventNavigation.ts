import { useEffect } from 'react';

/**
 * Custom hook to prevent users from navigating back using browser back button
 * This is useful for pages where going back could cause issues (like interview results)
 */
export const usePreventNavigation = () => {
  useEffect(() => {
    // Prevent going back by pushing current state
    window.history.pushState(null, "", window.location.href);
    
    // Handle popstate event (when user tries to go back)
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    
    window.onpopstate = handlePopState;

    // Cleanup function
    return () => {
      window.onpopstate = null;
    };
  }, []);
};
