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
  
  // Using provided embed with tools enabled
  return `https://bambinos.app.toughtongueai.com/embed/68c2e3b6da9d0bce43d62234?bg=black&hidePoweredBy=true&skipPrecheck=false&tools=true&userName=${encodedName}&userEmail=${encodedEmail}&vars[candidateName]=${encodedName}`;
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

/**
 * The required allow attribute for the interview iframe
 */
export const TOUGHTONGUE_IFRAME_ALLOW = 'microphone; camera; display-capture';

/**
 * Generate a complete iframe HTML string for embedding the interview
 * Includes the required allow attributes for mic, camera, and display capture
 */
export const generateInterviewIframeHtml = (
  candidateName: string,
  candidateEmail: string,
  options?: {
    width?: string;
    height?: string;
    style?: string;
    title?: string;
  }
): string => {
  const src = generateInterviewUrl(candidateName, candidateEmail);
  const width = options?.width ?? '100%';
  const height = options?.height ?? '100%';
  const style = options?.style ?? 'border:0;';
  const title = options?.title ?? 'ToughTongue Interview';
  return `<iframe src="${src}" allow="${TOUGHTONGUE_IFRAME_ALLOW}" width="${width}" height="${height}" style="${style}" title="${title}"></iframe>`;
};
