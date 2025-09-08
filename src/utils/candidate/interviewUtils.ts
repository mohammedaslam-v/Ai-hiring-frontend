/**
 * Format seconds into MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generate iframe URL for ToughTongue interview
 * Using the official Tough Tongue AI embed link
 */
export const generateInterviewUrl = (candidateName: string, candidateEmail: string): string => {
  const encodedName = encodeURIComponent(candidateName);
  const encodedEmail = encodeURIComponent(candidateEmail);
  
  // Debug: Log what's being used for ToughTongue
  console.log('🎯 ToughTongue URL - Candidate Info:');
  console.log('🎯 - Name:', candidateName);
  console.log('🎯 - Email:', candidateEmail);
  
  return `https://app.toughtongueai.com/embed/683d85841bbc5980f1b565fd?bg=black&hidePoweredBy=true&skipPrecheck=true&tools=true&userName=${encodedName}&userEmail=${encodedEmail}&vars[candidateName]=${encodedName}`;
};

/**
 * Check if current session is admin testing mode
 */
export const isAdminTestingMode = (): boolean => {
  const currentPath = window.location.pathname;
  const referer = document.referrer;
  return currentPath.includes('/candidate/interview') &&
    (referer.includes('/admin') || referer.includes('admin'));
};



/**
 * Validate interview prerequisites
 */
export const validateInterviewPrerequisites = (
  applicationId: string,
  candidateName: string,
  candidateEmail: string
): { isValid: boolean; error?: string } => {
  if (!applicationId && !isAdminTestingMode()) {
    return { 
      isValid: false, 
      error: "Please complete the application first." 
    };
  }
  
  if (!candidateName || !candidateEmail) {
    return { 
      isValid: false, 
      error: "Candidate information is missing." 
    };
  }
  
  return { isValid: true };
};
