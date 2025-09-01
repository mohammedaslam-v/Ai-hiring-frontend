
// Google Analytics tracking functions

// Define proper types for Google Analytics
interface GtagFunction {
  (command: 'config', targetId: string, config?: Record<string, unknown>): void;
  (command: 'event', action: string, parameters?: Record<string, unknown>): void;
  (command: 'set', parameters: Record<string, unknown>): void;
  (command: 'js', date: Date): void;
  (...args: unknown[]): void; // Fallback for other command patterns
}

interface WindowWithGtag extends Window {
  gtag?: GtagFunction;
}

interface WindowWithClarity extends Window {
  clarity?: (command: string, ...args: unknown[]) => void;
}

// Type-safe gtag function
export const gtag = (...args: Parameters<GtagFunction>) => {
  if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
    (window as WindowWithGtag).gtag!(...args);
  }
};

// Type-safe event tracking with proper parameter types
export const trackEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  gtag('event', eventName, parameters);
};

export const trackPageView = (page_path: string, page_title?: string) => {
  // Use the actual GA4 measurement ID instead of placeholder
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 ID
  gtag('config', GA_MEASUREMENT_ID, {
    page_path,
    page_title,
    // Add timezone for consistent tracking
    custom_map: {
      timezone: 'Asia/Kolkata'
    }
  });
};

// Microsoft Clarity tracking functions with proper types
export const clarityIdentify = (userId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
  if (typeof window !== 'undefined' && (window as WindowWithClarity).clarity) {
    (window as WindowWithClarity).clarity!('identify', userId, sessionId, pageId, friendlyName);
  }
};

export const clarityCustomEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && (window as WindowWithClarity).clarity) {
    (window as WindowWithClarity).clarity!('event', eventName, properties);
  }
};

// User type union for better type safety
type UserType = 'candidate' | 'admin';

// Combined tracking functions for common events
export const trackUserLogin = (userType: UserType, userId?: string) => {
  trackEvent('login', {
    event_category: 'engagement',
    event_label: userType,
    user_type: userType
  });
  
  clarityCustomEvent('user_login', {
    user_type: userType,
    user_id: userId
  });
};

export const trackApplicationSubmission = (candidateId?: string) => {
  trackEvent('application_submit', {
    event_category: 'conversion',
    event_label: 'candidate_application'
  });
  
  clarityCustomEvent('application_submitted', {
    candidate_id: candidateId
  });
};

export const trackInterviewCompletion = (candidateId?: string) => {
  trackEvent('interview_complete', {
    event_category: 'conversion',
    event_label: 'candidate_interview'
  });
  
  clarityCustomEvent('interview_completed', {
    candidate_id: candidateId
  });
};

export const trackPageVisit = (pageName: string, userType?: string) => {
  trackEvent('page_view', {
    event_category: 'engagement',
    event_label: pageName,
    user_type: userType
  });
  
  clarityCustomEvent('page_visit', {
    page_name: pageName,
    user_type: userType
  });
};
