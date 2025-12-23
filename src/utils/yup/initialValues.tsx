// Initial values for all forms
export const candidateApplicationInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  // Position is auto-filled as "Educator" in the backend
  position: 'Educator',
  subjects: [],
  additionalLanguages: [],
  availableDays: [],
  timeSlots: [],
};

export const adminLoginInitialValues = {
  email: '',
  password: '',
};

export const candidateLoginInitialValues = {
  phone: '',
};

export const adminSignupInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const profileUpdateInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

// Consolidated initial values object
export const INITIAL_VALUES = {
  CANDIDATE_APPLICATION: candidateApplicationInitialValues,
  ADMIN_LOGIN: adminLoginInitialValues,
  CANDIDATE_LOGIN: candidateLoginInitialValues,
  ADMIN_SIGNUP: adminSignupInitialValues,
  PROFILE_UPDATE: profileUpdateInitialValues,
};