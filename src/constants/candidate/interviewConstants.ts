/**
 * Interview status types
 */
export const INTERVIEW_STATUS = {
  LOADING: "loading",
  VIDEO_REQUIRED: "video-required",
  READY: "ready",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed"
} as const;

export type InterviewStatus = typeof INTERVIEW_STATUS[keyof typeof INTERVIEW_STATUS];

/**
 * Video requirements and instructions
 */
export const VIDEO_REQUIREMENTS = {
  TITLE: "Mandatory Instructions Video",
  DESCRIPTION: "IMPORTANT: You MUST watch this complete instructional video before proceeding to the AI interview. This video contains essential guidelines that will help you succeed in your interview.",
  ALERT_TITLE: "Required Before Interview",
  ALERT_ITEMS: [
    "Watch the complete video (no skipping allowed)",
    "Take notes of important instructions",
    "Ensure you understand all guidelines",
    "Only then you can proceed to the AI interview"
  ],
  YOUTUBE_URL: "https://www.youtube.com/embed/Ey0Gey_Y2lI?rel=0&modestbranding=1&showinfo=0",
  CHECKBOX_LABEL: "I have watched the complete instructional video and understand all guidelines"
};

/**
 * Interview setup requirements
 */
export const INTERVIEW_REQUIREMENTS = {
  TITLE: "AI Interview Setup",
  DESCRIPTION: "Prepare for your AI-powered interview experience. Ensure you're in an optimal environment for the best results.",
  ACCESS_REQUIREMENTS: [
    {
      icon: "Camera",
      title: "Camera Access",
      description: "Enable high-quality video recording for visual assessment",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-300",
      iconColor: "text-orange-600"
    },
    {
      icon: "Mic",
      title: "Microphone Access",
      description: "Enable crystal-clear audio recording for speech analysis",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      icon: "MapPin",
      title: "Secure Environment",
      description: "Quiet space with stable internet connection",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      iconColor: "text-red-600"
    }
  ]
};

/**
 * Interview guidelines
 */
export const INTERVIEW_GUIDELINES = {
  TITLE: "Interview Guidelines",
  CRITICAL_REQUIREMENTS: {
    TITLE: "Critical Requirements",
    ITEMS: [
      "Please make sure you are in a quiet place without any disturbance",
      "Listen to the questions carefully and take your time to think before answering"
    ]
  },
  GENERAL_GUIDELINES: [
    "The interview will last approximately 10 minutes",
    "You'll be asked about your teaching experience and methods",
    "You may be asked to read or discuss the passage below",
    "Speak naturally and authentically - be yourself",
    "Maintain eye contact with the camera"
  ],
  IMPORTANT_NOTES: [
    {
      text: "Wait for the interview to complete fully before clicking 'Stop Interview' - only click after the AI analysis is done",
      color: "text-orange-600",
      bgColor: "bg-orange-500"
    },
    {
      text: "You cannot re-attempt this interview once completed",
      color: "text-red-600",
      bgColor: "bg-red-500"
    }
  ]
};

/**
 * Interview progress instructions
 */
export const INTERVIEW_PROGRESS_INSTRUCTIONS = {
  TITLE: "Important Instructions",
  ITEMS: [
    {
      icon: "✅",
      color: "text-green-600",
      text: "Be in a quiet place with no background noise before starting."
    },
    {
      icon: "▶️",
      color: "text-blue-600",
      text: "Click \"Your Task\" to begin reading only when instructed by the AI."
    },
    {
      icon: "⏳",
      color: "text-yellow-600",
      text: "Wait for the message: \"Session Completed. Thank you for completing this session!\""
    },
    {
      icon: "🚫",
      color: "text-red-600",
      text: "Do NOT click \"End Interview\" before this message appears. Doing so will make you ineligible for the next step."
    }
  ]
};

/**
 * UI text and messages
 */
export const UI_MESSAGES = {
  LOADING: {
    TITLE: "Loading Interview...",
    SPINNER_SIZE: "w-16 h-16"
  },
  VIDEO: {
    STARTED: "Video Started",
    COMPLETED: "Video Completed",
    PROCEED_BUTTON: "Proceed to AI Interview Setup",
    COMPLETE_FIRST: "Complete Video First"
  },
  INTERVIEW: {
    BEGIN_BUTTON: "Begin AI Interview",
    IN_PROGRESS_TITLE: "Interview in Progress",
    COMPLETED_TITLE: "Interview Completed!",
    PROCESSING_DESCRIPTION: "Processing your responses and generating evaluation...",
    END_BUTTON: "End Interview"
  },
  TOAST: {
    VIDEO_PLAY: "Please watch the complete video to proceed with the interview.",
    VIDEO_END: "You can now proceed to the AI interview.",
    INTERVIEW_START: "Your AI interview session has begun. Good luck!",
    INTERVIEW_COMPLETE: "Congratulations! Your interview has been completed successfully.",
    INTERVIEW_END: "Your interview session has been completed. Processing results...",
    SKIP_VIDEO: "You can now proceed to the AI interview.",
    PROCEED_READY: "You can now begin your AI interview session.",
    VIDEO_REQUIRED: "Please watch the complete video before proceeding.",
    REDIRECTING_RESULTS: "Redirecting to results page..."
  }
};

/**
 * Default values for admin testing mode
 */
export const ADMIN_TEST_DEFAULTS = {
  APPLICATION_ID: 'admin-test-id',
  CANDIDATE_NAME: 'Admin Test User',
  CANDIDATE_EMAIL: 'admin@test.com'
};

/**
 * Navigation delays
 */
export const NAVIGATION_DELAYS = {
  INTERVIEW_COMPLETE: 2000,
  INTERVIEW_END: 3000
};
