
// Google Analytics tracking functions
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args);
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
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

// Microsoft Clarity tracking functions
export const clarityIdentify = (userId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('identify', userId, sessionId, pageId, friendlyName);
  }
};

export const clarityCustomEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('event', eventName, properties);
  }
};

// Combined tracking functions for common events
export const trackUserLogin = (userType: 'candidate' | 'admin' | 'superadmin', userId?: string) => {
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
