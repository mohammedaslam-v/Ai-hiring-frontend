// Legacy constants file for backward compatibility
// This file exports constants that are currently imported by Index.tsx
// New components should import from src/utils/constants/index.ts instead

import { APP_STATS, APP_FEATURES, APP_HIRING_STEPS } from './constants/app';

// Export the constants that Index.tsx currently imports
export const stats = APP_STATS;
export const features = APP_FEATURES;
export const hiringSteps = APP_HIRING_STEPS;

// Re-export all constants from the new constants folder for easy migration
export * from './constants';
